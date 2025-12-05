/**
 * Migration Script (Refactored with Utilities)
 *
 * Uses pure functions from migration-utils.ts
 * Separates I/O from business logic for testability
 *
 * Run with: bun run migrate-v1.ts
 */

import { access, mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import {
    CommonCollectionIds,
    doApiGet,
    getEntries,
    init,
    type Translator as LegacyTranslator,
} from '@ilmtest/ilmtest-sdk-js';
import type { Excerpt, Heading, Translator } from '../src/lib/data-types-v1';
import {
    extractHadithNumber,
    generateGlobalIndex,
    generateSurahVerseIndex,
    type OldQuranExcerpt,
    type OldQuranHeading,
    transformQuranContent,
    transformQuranHeadings,
} from './migration-utils';

// ============================================================================
// HuggingFace Excerpts Format Types (Input)
// ============================================================================

/**
 * Set if this is a title/heading of a book or chapter
 */
type HFExcerptType = 'book' | 'chapter';

enum AITranslator {
    ClaudeSonnet45 = 891,
    Gemini3 = 890,
    OpenAIGpt51Thinking = 889,
    OpenAIGpt5 = 879,
    Grok41ThinkingBeta = 892,
}

type HFExcerpt = {
    /** Unique ID of this excerpt */
    id: string;
    /** The Arabic text of the excerpt */
    nass: string;
    /** The page number in the book that this text was extracted from. */
    from: number;
    /** Set if this is a title/heading of a book or chapter */
    type?: HFExcerptType;
    /** The page number in the book that this text spans until (if different from the starting page) */
    to?: number;
    /** Volume number for this page */
    vol: number;
    /** The page in the volume (ie: this value would be 55 if the excerpt is from page 55 in the 7th volume). This is useful for citations. */
    vp: number;
    /** The translated nass. */
    text: string;
    /** The AI model that translated it. */
    translator: AITranslator;
    /** The last time this translation was updated. */
    lastUpdatedAt: number;
};

type HFHeading = {
    /** Unique identifier */
    id: string;
    /** The Arabic text */
    nass: string;
    /** The page where content starts */
    from: number;
    /** Parent heading ID */
    parent?: string;
    /** The translated text */
    text: string;
    /** The AI model that translated it */
    translator: AITranslator;
    /** The last time this translation was updated */
    lastUpdatedAt: number;
};

type HFExcerpts = { excerpts: HFExcerpt[]; headings: HFHeading[]; footnotes?: HFExcerpt[] };

// ============================================================================
// Core Migration Functions (Pure - Accept Data, Return Data)
// ============================================================================

export function migrateQuranData(oldData: { content: OldQuranExcerpt[]; headings: OldQuranHeading[] }) {
    const newContent = transformQuranContent(oldData.content);
    const newHeadings = transformQuranHeadings(oldData.headings, newContent);

    const surahVerseIndex = generateSurahVerseIndex(
        oldData.content.map((e) => ({ id: e.id, page: e.page, surah: e.surah, verse: e.verse })),
    );

    // Generate page index
    const pages: Record<string, { start: number; end: number }> = {};
    newContent.forEach((item, index) => {
        const pageKey = item.page.toString();
        if (!pages[pageKey]) {
            pages[pageKey] = { end: index, start: index };
        } else {
            pages[pageKey].end = index;
        }
    });

    return { content: newContent, headings: newHeadings, indexes: { page: pages, surahVerse: surahVerseIndex } };
}

/**
 * Transform HuggingFace excerpt to internal Excerpt format
 */
function transformHFExcerpt(hf: HFExcerpt): Excerpt {
    const hadithNum = extractHadithNumber(hf.nass);
    const isChapterTitle = hf.type === 'book' || hf.type === 'chapter';

    if (isChapterTitle) {
        return {
            id: hf.id,
            meta: { pp: hf.vp, volume: hf.vol },
            nass: hf.nass,
            page: hf.from,
            text: hf.text,
            translator: hf.translator,
            type: 'chapter-title',
        };
    }

    if (hadithNum) {
        return {
            id: hf.id,
            meta: { hadithNum, pp: hf.vp, volume: hf.vol },
            nass: hf.nass,
            page: hf.from,
            text: hf.text,
            translator: hf.translator,
            type: 'hadith',
        };
    }

    // Generic text/prose (no type field)
    return {
        id: hf.id,
        meta: { pp: hf.vp, volume: hf.vol },
        nass: hf.nass,
        page: hf.from,
        text: hf.text,
        translator: hf.translator,
    };
}

/**
 * Find the start index for a heading by page number
 */
function findHeadingStartIndex(from: number, pageMap: Map<number, number>): number | undefined {
    let startIndex = pageMap.get(from);

    // Fallback: If exact page has no content, try next few pages
    if (startIndex === undefined) {
        for (let p = from + 1; p <= from + 10; p++) {
            if (pageMap.has(p)) {
                startIndex = pageMap.get(p);
                break;
            }
        }
    }

    return startIndex;
}

/**
 * Calculate end index for a heading based on next headings in the list
 */
function calculateHeadingEndIndex(
    headingIndex: number,
    headings: Array<{ parent?: string; startIndex: number }>,
    contentLength: number,
): number {
    const current = headings[headingIndex];
    const isBook = !current.parent;
    let endIndex = contentLength - 1;

    for (let j = headingIndex + 1; j < headings.length; j++) {
        const next = headings[j];
        const nextIsBook = !next.parent;

        if (isBook && nextIsBook) {
            // A Book ends when the next Book starts
            endIndex = next.startIndex - 1;
            break;
        } else if (!isBook) {
            // A Chapter ends when the next Chapter OR next Book starts
            if (nextIsBook || next.startIndex > current.startIndex) {
                endIndex = next.startIndex - 1;
                break;
            }
        }
    }

    // Ensure valid range
    return Math.max(endIndex, current.startIndex);
}

/**
 * Transform HuggingFace headings to internal Heading format
 */
function transformHFHeadings(hfHeadings: HFHeading[], content: Excerpt[]): Heading[] {
    // Map page numbers to the first content index on that page
    const pageMap = new Map<number, number>();
    content.forEach((item, index) => {
        if (!pageMap.has(item.page)) {
            pageMap.set(item.page, index);
        }
    });

    // Determine start index for each heading
    const headingsWithIndex = hfHeadings
        .map((h) => {
            const startIndex = findHeadingStartIndex(h.from, pageMap);
            return startIndex !== undefined ? { ...h, startIndex } : { ...h, startIndex: -1 };
        })
        .filter((h) => h.startIndex !== -1);

    // Sort by index to ensure linear processing order
    headingsWithIndex.sort((a, b) => a.startIndex - b.startIndex);

    // Calculate ranges and transform to Heading format
    return headingsWithIndex.map((h, i, arr) => {
        const startIndex = h.startIndex;
        const endIndex = calculateHeadingEndIndex(i, arr, content.length);

        const startId = content[startIndex].id;
        const endId = content[endIndex].id;
        const startPage = content[startIndex].page;
        const endPage = content[endIndex].page;

        // Extract volume and pp from first content item in range
        const firstContent = content[startIndex];
        const meta = 'meta' in firstContent ? (firstContent as any).meta : {};

        return {
            id: h.id,
            indexRange: { end: endIndex, start: startIndex },
            nass: h.nass,
            page: h.from,
            pageRange: { end: endPage, start: startPage },
            pp: meta.pp ?? 0,
            range: { end: endId, start: startId },
            text: h.text,
            translator: h.translator,
            type: 'hadith' as const,
            volume: meta.volume ?? 1,
            ...(h.parent ? { parent: h.parent } : {}),
        };
    });
}

/**
 * Migrate HuggingFace Excerpts format directly to internal format
 */
export function migrateHFExcerptsData(hfData: HFExcerpts) {
    const content = hfData.excerpts.map(transformHFExcerpt);
    const headings = transformHFHeadings(hfData.headings, content);

    // Generate hadith number index
    const hadiths: Record<string, number> = {};
    content.forEach((item, index) => {
        if ('type' in item && item.type === 'hadith' && 'meta' in item && item.meta.hadithNum) {
            hadiths[item.meta.hadithNum.toString()] = index;
        }
    });

    // Generate page index
    const pages: Record<string, { start: number; end: number }> = {};
    content.forEach((item, index) => {
        const pageKey = item.page.toString();
        if (!pages[pageKey]) {
            pages[pageKey] = { end: index, start: index };
        } else {
            pages[pageKey].end = index;
        }
    });

    return { content, headings, indexes: { hadithNum: hadiths, page: pages } };
}

// ============================================================================
// File I/O Functions (Side Effects)
// ============================================================================

async function loadHFExcerpts(inputPath: string): Promise<HFExcerpts> {
    const file = Bun.file(inputPath);
    const data = await file.json();

    // Validate required fields
    if (!data.excerpts || !Array.isArray(data.excerpts)) {
        throw new Error('Invalid HuggingFace excerpts format: missing excerpts array');
    }

    return { excerpts: data.excerpts, footnotes: data.footnotes, headings: data.headings || [] };
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

/**
 * Fetch all translators from the API
 * Note: SDK needs to be initialized before calling this function
 */
async function fetchTranslators(): Promise<Translator[]> {
    const legacyTranslators = await doApiGet<LegacyTranslator[]>('translators', { limit: -1 });
    return legacyTranslators.map((t) => ({ id: t.id, name: t.name, ...(t.instagram && { img: t.instagram }) }));
}

// ============================================================================
// Migration Runners (I/O + Business Logic)
// ============================================================================

export async function migrateQuran(outputDir: string) {
    console.log("📖 Migrating Qur'an...");

    // Check if migration already exists
    try {
        await access(join(outputDir, 'headings.json'));
        await access(join(outputDir, 'indexes.json'));
        console.log(`  ⏭️  Skipping - Book already migrated at ${outputDir}\n`);
        return;
    } catch {
        // Files don't exist, proceed with migration
    }

    // Initialize SDK
    init('3', process.env.ILMTEST_API_URL!);

    // Fetch all translators
    console.log('   Fetching translators...');
    const allTranslators = await fetchTranslators();
    console.log(`   ✓ Fetched ${allTranslators.length} translators from API`);

    // Fetch data from API
    const entries = await getEntries({ collection: Number(CommonCollectionIds.Quran), full: 1, limit: -1 } as any);
    console.log(`   ✓ Fetched ${entries.length} entries from API`);
    if (entries.length > 0) {
        console.log('Sample Entry:', JSON.stringify(entries[0], null, 2));
    }

    // Transform to old format for migration
    const oldContent: OldQuranExcerpt[] = entries
        .filter((e) => !e.type)
        .map((e) => ({
            chapter: 0, // Chapter field not used for Qur'an
            id: e.id,
            nass: e.ar_body!,
            page: Number(e.from_page!),
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
            page: Number(e.from_page!),
            text: e.body!,
            translator: e.translator!,
        }));

    const oldData = { content: oldContent, headings: oldHeadings };
    const migrated = migrateQuranData(oldData);

    // 4. Generate Global Index with translators
    const CHUNK_SIZE = 500;
    const globalIndex = generateGlobalIndex(migrated.content, migrated.headings, allTranslators, CHUNK_SIZE);

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

    console.log(`  ✓ ${migrated.content.length} verses`);
    console.log(`  ✓ ${migrated.headings.length} surahs`);
    console.log(`  ✓ ${Object.keys(globalIndex.surahs || {}).length} surah:verse entries`);
    console.log(`  ✓ ${Object.keys(globalIndex.pages).length} pages`);
    console.log(`  ✓ ${Object.keys(globalIndex.translators).length} translators indexed`);
    console.log(`  ✓ ${numChunks} content chunks generated\n`);
}

import { downloadOldData } from './download-old-data';

// ... (imports)

export async function migrateHadith(inputPath: string, outputDir: string, bookId: number) {
    console.log(`📚 Migrating hadith book ${bookId}...`);

    // Check if migration already exists
    try {
        await access(join(outputDir, 'headings.json'));
        await access(join(outputDir, 'indexes.json'));
        console.log(`  ⏭️  Skipping - Book already migrated at ${outputDir}\n`);
        return;
    } catch {
        // Files don't exist, proceed with migration
    }

    // Initialize SDK for translator fetch
    init('3', process.env.ILMTEST_API_URL!);

    // Fetch all translators
    console.log('   Fetching translators...');
    const allTranslators = await fetchTranslators();
    console.log(`   ✓ Fetched ${allTranslators.length} translators from API`);

    let dataPath = inputPath;
    let downloadedFilePath: string | null = null; // Track downloaded file for cleanup
    const file = Bun.file(inputPath);

    if (!(await file.exists())) {
        console.log(`   File not found locally: ${inputPath}`);
        try {
            dataPath = await downloadOldData(bookId, outputDir);
            downloadedFilePath = dataPath; // Save path for cleanup
        } catch {
            console.warn(`   ⚠️ Could not download data for book ${bookId}. Skipping.`);
            return;
        }
    }

    const hfData = await loadHFExcerpts(dataPath);
    const migrated = migrateHFExcerptsData(hfData);

    // 4. Generate Global Index with translators
    const CHUNK_SIZE = 500;
    const globalIndex = generateGlobalIndex(migrated.content, migrated.headings, allTranslators, CHUNK_SIZE);

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

    // Cleanup: Remove temporary downloaded file (no longer needed after migration)
    if (downloadedFilePath) {
        await unlink(downloadedFilePath).catch(() => {});
        console.log(`  🗑️  Cleaned up temporary file: ${downloadedFilePath}`);
    }

    console.log(`  ✓ ${migrated.content.length} excerpts`);
    console.log(`  ✓ ${migrated.headings.length} headings`);
    console.log(`  ✓ ${Object.keys(globalIndex.hadiths).length} hadith numbers`);
    console.log(`  ✓ ${Object.keys(globalIndex.pages).length} pages`);
    console.log(`  ✓ ${Object.keys(globalIndex.translators).length} translators indexed`);
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
    // Note: The inputPath doesn't need to exist - if missing, the function will auto-download from HuggingFace.
    // The actual downloaded filename is tracked and cleaned up automatically after migration.
    await migrateHadith(join(dataDir, 'books/2576/data.json'), join(dataDir, 'books/2576'), 2576);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration complete!\n');
}

// Run if executed directly
if (import.meta.main) {
    await migrate();
    //await downloadQuran();
}
