/**
 * Migration Script (Refactored with Utilities)
 *
 * Uses pure functions from migration-utils.ts
 * Separates I/O from business logic for testability
 *
 * Run with: bun run migrate-v1.ts
 */

import { mkdir, rmdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { CommonCollectionIds, getEntries, init } from '@ilmtest/ilmtest-sdk-js';
import {
    extractHadithHeadings,
    generateGlobalIndex,
    generateHadithNumIndex,
    generatePageIndex,
    generateSurahVerseIndex,
    type OldHadithExcerpt,
    type OldHadithHeading,
    type OldQuranExcerpt,
    type OldQuranHeading,
    transformHadithContent,
    transformQuranContent,
    transformQuranHeadings,
} from './migration-utils';

// ============================================================================
// Core Migration Functions (Pure - Accept Data, Return Data)
// ============================================================================

export function migrateQuranData(oldData: { content: OldQuranExcerpt[]; headings: OldQuranHeading[] }) {
    const newContent = transformQuranContent(oldData.content);
    const newHeadings = transformQuranHeadings(oldData.headings, newContent);

    const surahVerseIndex = generateSurahVerseIndex(
        oldData.content.map((e) => ({ id: e.id, page: e.page, surah: e.surah, verse: e.verse })),
    );

    const pageIndex = generatePageIndex(oldData.content);

    return { content: newContent, headings: newHeadings, indexes: { page: pageIndex, surahVerse: surahVerseIndex } };
}

export function migrateHadithData(oldData: { content: OldHadithExcerpt[]; headings: OldHadithHeading[] }) {
    const newContent = transformHadithContent(oldData.content);
    const newHeadings = extractHadithHeadings(oldData.headings, oldData.content);

    const hadithNumIndex = generateHadithNumIndex(
        oldData.content.map((e) => ({
            id: e.id,
            nass: e.nass,
            page: e.page,
            type: e.type === 2 || e.id.startsWith('C') || e.id.startsWith('B') ? 'chapter-title' : 'hadith',
        })),
    );

    const pageIndex = generatePageIndex(oldData.content);

    return { content: newContent, headings: newHeadings, indexes: { hadithNum: hadithNumIndex, page: pageIndex } };
}

// ============================================================================
// File I/O Functions (Side Effects)
// ============================================================================

async function loadOldHadithData(inputPath: string) {
    const file = Bun.file(inputPath);
    const data = await file.json();

    // Handle the new format with 'excerpts' array
    if (data.excerpts && Array.isArray(data.excerpts)) {
        // Transform the new format to the old format expected by migration
        const content = data.excerpts
            .filter((e: any) => e.type !== undefined) // Only include items with a type field
            .map((e: any) => ({
                id: e.id,
                nass: e.arabic,
                page: e.from,
                text: e.translation,
                translator: e.translator,
                type: e.type,
            }));

        // Extract headings from the data
        const headings = (data.headings || []).map((h: any) => ({
            id: h.id,
            nass: h.nass || h.arabic,
            page: h.from,
            parent: h.parent,
            pp: h.pp,
            text: h.text || h.translation,
            translator: h.translator,
            volume: h.volume,
        }));

        return { content, headings };
    }

    // Fallback to old format
    return data;
}

async function writeContentFile(outputPath: string, content: any[]) {
    await Bun.write(outputPath, JSON.stringify({ content }, null, 2));
}

async function writeHeadingsFile(outputPath: string, headings: any[]) {
    await Bun.write(outputPath, JSON.stringify({ headings }, null, 2));
}

async function writeIndexFile(outputPath: string, index: any) {
    await Bun.write(outputPath, JSON.stringify(index, null, 2));
}

// ============================================================================
// Migration Runners (I/O + Business Logic)
// ============================================================================

export async function migrateQuran(outputDir: string) {
    console.log("📖 Migrating Qur'an...");

    // Initialize SDK
    init('3', process.env.ILMTEST_API_URL!);

    // Fetch data from API
    const entries = await getEntries({ collection: Number(CommonCollectionIds.Quran), limit: -1 });
    console.log(`   ✓ Fetched ${entries.length} entries from API`);

    // Transform to old format for migration
    const oldContent: OldQuranExcerpt[] = entries
        .filter((e) => !e.type)
        .map((e) => ({
            chapter: 0, // Chapter field not used for Qur'an
            id: e.id,
            nass: e.ar_body!,
            page: e.from_page!,
            surah: e.part_number!,
            text: e.body,
            translator: e.translator!,
            verse: e.part_page!,
        }));

    const oldHeadings: OldQuranHeading[] = entries
        .filter((e) => e.type)
        .map((e) => ({
            id: e.id,
            nass: e.ar_body!,
            num: e.index_number!,
            page: e.from_page!,
            text: e.body!,
            translator: e.translator!,
        }));

    const oldData = { content: oldContent, headings: oldHeadings };
    const migrated = migrateQuranData(oldData);

    // 4. Generate Global Index
    const CHUNK_SIZE = 500;
    const globalIndex = generateGlobalIndex(migrated.content, CHUNK_SIZE);

    // 5. Write Data
    // Write Headings
    await writeHeadingsFile(join(outputDir, 'headings.json'), migrated.headings);

    // Write Consolidated Index
    await writeIndexFile(join(outputDir, 'indexes.json'), globalIndex);

    // Write Content Chunks
    const contentDir = join(outputDir, 'content');
    await mkdir(contentDir, { recursive: true });

    // Calculate number of chunks
    const numChunks = Math.ceil(migrated.content.length / CHUNK_SIZE);

    for (let i = 0; i < numChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;
        const chunk = migrated.content.slice(start, end);

        await writeContentFile(join(contentDir, `${i}.json`), chunk);
    }

    // Cleanup: Remove old monolithic files and folders
    await unlink(join(outputDir, 'content.json')).catch(() => {});
    await rmdir(join(outputDir, 'indexes'), { recursive: true }).catch(() => {});

    console.log(`  ✓ ${migrated.content.length} verses`);
    console.log(`  ✓ ${migrated.headings.length} surahs`);
    console.log(`  ✓ ${Object.keys(globalIndex.surahs || {}).length} surah:verse entries`);
    console.log(`  ✓ ${Object.keys(globalIndex.pages).length} pages`);
    console.log(`  ✓ ${numChunks} content chunks generated\n`);
}

import { downloadOldData } from './download-old-data';

// ... (imports)

export async function migrateHadith(inputPath: string, outputDir: string, bookId: number) {
    console.log(`📚 Migrating hadith book ${bookId}...`);

    let dataPath = inputPath;
    const file = Bun.file(inputPath);

    if (!(await file.exists())) {
        console.log(`   File not found locally: ${inputPath}`);
        try {
            dataPath = await downloadOldData(bookId, outputDir);
        } catch {
            console.warn(`   ⚠️ Could not download data for book ${bookId}. Skipping.`);
            return;
        }
    }

    const oldData = await loadOldHadithData(dataPath);
    const migrated = migrateHadithData(oldData);

    // 4. Generate Global Index
    const CHUNK_SIZE = 500;
    const globalIndex = generateGlobalIndex(migrated.content, CHUNK_SIZE);

    // 5. Write Data
    // Write Headings
    await Bun.write(join(outputDir, 'headings.json'), JSON.stringify({ headings: migrated.headings }, null, 2));

    // Write Consolidated Index
    await Bun.write(join(outputDir, 'indexes.json'), JSON.stringify(globalIndex, null, 2));

    // Write Content Chunks
    const contentDir = join(outputDir, 'content');
    await mkdir(contentDir, { recursive: true });

    // Calculate number of chunks
    const numChunks = Math.ceil(migrated.content.length / CHUNK_SIZE);

    for (let i = 0; i < numChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;
        const chunk = migrated.content.slice(start, end);

        await Bun.write(join(contentDir, `${i}.json`), JSON.stringify({ content: chunk }, null, 2));
    }

    // Cleanup: Remove old monolithic files and folders
    await unlink(join(outputDir, 'content.json')).catch(() => {});
    await rmdir(join(outputDir, 'indexes'), { recursive: true }).catch(() => {});

    console.log(`  ✓ ${migrated.content.length} excerpts`);
    console.log(`  ✓ ${migrated.headings.length} headings`);
    console.log(`  ✓ ${Object.keys(globalIndex.hadiths).length} hadith numbers`);
    console.log(`  ✓ ${Object.keys(globalIndex.pages).length} pages`);
    console.log(`  ✓ ${numChunks} content chunks generated\n`);
}

// ============================================================================
// Main Migration Runner
// ============================================================================

async function migrate() {
    console.log('\n🚀 Starting v1 Migration\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const dataDir = './public/data';

    // Qur'an
    await migrateQuran(join(dataDir, 'books/1'));

    // Sahih al-Bukhari
    await migrateHadith(join(dataDir, 'books/2576/content-old.json'), join(dataDir, 'books/2576'), 2576);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration complete!\n');
}

// Run if executed directly
if (import.meta.main) {
    await migrate();
    //await downloadQuran();
}
