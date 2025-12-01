/**
 * Migration Script (Refactored with Utilities)
 *
 * Uses pure functions from migration-utils.ts
 * Separates I/O from business logic for testability
 *
 * Run with: bun run migrate-v1.ts
 */

import { join } from 'node:path';
import {
    extractHadithHeadings,
    generateHadithNumIndex,
    generatePageIndex,
    generateSurahVerseIndex,
    type OldHadithExcerpt,
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
    const newHeadings = transformQuranHeadings(oldData.headings);

    const surahVerseIndex = generateSurahVerseIndex(
        oldData.content.map((e) => ({ id: e.id, page: e.page, surah: e.surah, verse: e.verse })),
    );

    const pageIndex = generatePageIndex(oldData.content);

    return { content: newContent, headings: newHeadings, indexes: { page: pageIndex, surahVerse: surahVerseIndex } };
}

export function migrateHadithData(oldData: { content: OldHadithExcerpt[] }, bookId: number) {
    const newContent = transformHadithContent(oldData.content, bookId);
    const newHeadings = extractHadithHeadings(oldData.content);

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

async function loadOldQuranData(inputPath: string) {
    const file = Bun.file(inputPath);
    return await file.json();
}

async function loadOldHadithData(inputPath: string) {
    const file = Bun.file(inputPath);
    return await file.json();
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

export async function migrateQuran(inputPath: string, outputDir: string) {
    console.log("📖 Migrating Qur'an...");

    const oldData = await loadOldQuranData(inputPath);
    const migrated = migrateQuranData(oldData);

    // Write content
    await writeContentFile(join(outputDir, 'content.json'), migrated.content);

    // Write headings
    await writeHeadingsFile(join(outputDir, 'headings.json'), migrated.headings);

    // Write indexes
    await writeIndexFile(join(outputDir, 'indexes', 'surah-verse.json'), migrated.indexes.surahVerse);

    await writeIndexFile(join(outputDir, 'indexes', 'page.json'), migrated.indexes.page);

    console.log(`  ✓ ${migrated.content.length} verses`);
    console.log(`  ✓ ${Object.keys(migrated.indexes.surahVerse).length} surah:verse entries`);
    console.log(`  ✓ ${Object.keys(migrated.indexes.page).length} pages\n`);
}

export async function migrateHadith(inputPath: string, outputDir: string, bookId: number) {
    console.log(`📚 Migrating hadith book ${bookId}...`);

    const oldData = await loadOldHadithData(inputPath);
    const migrated = migrateHadithData(oldData, bookId);

    // Write content
    await writeContentFile(join(outputDir, 'content.json'), migrated.content);

    // Write headings
    await writeHeadingsFile(join(outputDir, 'headings.json'), migrated.headings);

    // Write indexes
    await writeIndexFile(join(outputDir, 'indexes', 'hadith-num.json'), migrated.indexes.hadithNum);

    await writeIndexFile(join(outputDir, 'indexes', 'page.json'), migrated.indexes.page);

    console.log(`  ✓ ${migrated.content.length} excerpts`);
    console.log(`  ✓ ${migrated.headings.length} headings`);
    console.log(`  ✓ ${Object.keys(migrated.indexes.hadithNum).length} hadith numbers`);
    console.log(`  ✓ ${Object.keys(migrated.indexes.page).length} pages\n`);
}

// ============================================================================
// Main Migration Runner
// ============================================================================

async function migrate() {
    console.log('\n🚀 Starting v1 Migration\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const dataDir = './public/data';

    // Qur'an
    await migrateQuran(join(dataDir, 'books/1/content-old.json'), join(dataDir, 'books/1'));

    // Sahih al-Bukhari
    await migrateHadith(join(dataDir, 'books/2576/content-old.json'), join(dataDir, 'books/2576'), 2576);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration complete!\n');
}

// Run if executed directly
if (import.meta.main) {
    await migrate();
}
