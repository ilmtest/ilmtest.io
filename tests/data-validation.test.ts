/**
 * Data Validation Tests
 *
 * These tests validate actual migrated data files
 * Run with: bun test tests/data-validation.test.ts
 */

import { describe, expect, it } from 'bun:test';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Book, Excerpt, HadithMetadata, Heading, VerseMetadata } from '../src/lib/data-types-v1';

const DATA_DIR = './public/data';

// ============================================================================
// Helper: Load JSON File
// ============================================================================

async function loadJSON<T>(path: string): Promise<T> {
    const file = Bun.file(path);
    return await file.json();
}

async function loadContent(bookId: string): Promise<{ content: Excerpt[] }> {
    const contentDir = join(DATA_DIR, `books/${bookId}/content`);
    const files = await readdir(contentDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    // Sort files numerically (0.json, 1.json, 2.json...)
    jsonFiles.sort((a, b) => {
        const numA = parseInt(a.split('.')[0]);
        const numB = parseInt(b.split('.')[0]);
        return numA - numB;
    });

    let allContent: Excerpt[] = [];

    for (const file of jsonFiles) {
        const data = await loadJSON<{ content: Excerpt[] }>(join(contentDir, file));
        allContent = allContent.concat(data.content);
    }

    return { content: allContent };
}

// ============================================================================
// Type Guards
// ============================================================================

function isVerseMeta(meta: any): meta is VerseMetadata {
    return 'surah' in meta && 'verse' in meta;
}

function isHadithMetadata(meta: any): meta is HadithMetadata {
    return 'volume' in meta && 'pp' in meta;
}

// ============================================================================
// Books Metadata Validation
// ============================================================================

describe('Books Metadata Validation', () => {
    it('should load and validate books.json', async () => {
        const data = await loadJSON<{ books: Book[] }>(join(DATA_DIR, 'books.json'));

        expect(data.books).toBeArray();
        expect(data.books.length).toBeGreaterThan(0);
    });

    it("should have valid Qur'an entry", async () => {
        const data = await loadJSON<{ books: Book[] }>(join(DATA_DIR, 'books.json'));

        const quran = data.books.find((b) => b.id === 1);

        expect(quran).toBeDefined();
        expect(quran?.slug).toBe('quran');
        expect(quran?.type).toBe('scripture');
        expect(quran?.title).toBeString();
        expect(quran?.unwan).toBeString();
        expect(quran?.refTemplate).toInclude('{{');
    });

    it('should have valid Hadith entry', async () => {
        const data = await loadJSON<{ books: Book[] }>(join(DATA_DIR, 'books.json'));

        const bukhari = data.books.find((b) => b.id === 2576);

        expect(bukhari).toBeDefined();
        expect(bukhari?.slug).toBe('sahih-bukhari');
        expect(bukhari?.type).toBe('hadith');
        expect(bukhari?.author).toBeString();
    });
});

// ============================================================================
// Qur'an Content Validation
// ============================================================================

describe("Qur'an Content Validation", () => {
    it("should load Qur'an content", async () => {
        const data = await loadContent('1');

        expect(data.content).toBeArray();
        expect(data.content.length).toBeGreaterThan(6000);
    });

    it('should have valid verse structure', async () => {
        const data = await loadContent('1');

        const verse = data.content[0];

        expect(verse.id).toMatch(/^\d+-\d+$/);
        expect(verse.type).toBe('verse');
        expect(verse.nass).toBeString();
        expect(verse.text).toBeString();
        expect(verse.translator).toBeNumber();
        expect(verse.page).toBeNumber();
        expect(isVerseMeta(verse.meta)).toBeTrue();
    });

    it('should have Al-Fatiha 1:1 as first verse', async () => {
        const data = await loadContent('1');

        const first = data.content[0];
        const meta = first.meta as VerseMetadata;

        expect(meta.surah).toBe(1);
        expect(meta.verse).toBe(1);
        expect(first.nass).toInclude('بِسْمِ');
    });
});

// ============================================================================
// Qur'an Headings Validation
// ============================================================================

describe("Qur'an Headings Validation", () => {
    it('should have 114 surahs', async () => {
        const data = await loadJSON<{ headings: Heading[] }>(join(DATA_DIR, 'books/1/headings.json'));

        expect(data.headings).toHaveLength(114);
    });

    it('should have valid heading structure', async () => {
        const data = await loadJSON<{ headings: Heading[] }>(join(DATA_DIR, 'books/1/headings.json'));

        const fatiha = data.headings[0];

        expect(fatiha.id).toBe('1');
        expect(fatiha.surah).toBe(1);
        expect(fatiha.nass).toBeString();
        expect(fatiha.text).toBeString();
        expect(fatiha.page).toBeNumber();
    });

    it('should have sequential surah numbers', async () => {
        const data = await loadJSON<{ headings: Heading[] }>(join(DATA_DIR, 'books/1/headings.json'));

        const headingsWithNumbers = data.headings.map((h, idx) => ({ expected: idx + 1, heading: h }));

        headingsWithNumbers.forEach(({ heading, expected }) => {
            expect(heading.surah).toBe(expected);
        });
    });
});

// ============================================================================
// Qur'an Index Validation
// ============================================================================

describe("Qur'an Index Validation", () => {
    it('should have valid surah:verse index', async () => {
        const indexes = await loadJSON<any>(join(DATA_DIR, 'books/1/indexes.json'));
        const index = indexes.surahs;

        expect(Object.keys(index).length).toBeGreaterThan(6000);
        expect(index['1:1']).toBeDefined();
        expect(index['2:255']).toBeDefined();
        expect(index['114:6']).toBeDefined();
    });

    it('should have valid page index', async () => {
        const indexes = await loadJSON<any>(join(DATA_DIR, 'books/1/indexes.json'));
        const index = indexes.pages;

        expect(Object.keys(index).length).toBe(604);
        expect(index['1']).toBeDefined();
        expect(index['604']).toBeDefined();
    });
});

// ============================================================================
// Hadith Content Validation
// ============================================================================

describe('Hadith Content Validation', () => {
    it('should load Hadith content', async () => {
        const data = await loadContent('2576');

        expect(data.content).toBeArray();
        expect(data.content.length).toBeGreaterThan(7000);
    });

    it('should have valid hadith structure', async () => {
        const data = await loadContent('2576');

        const hadith = data.content.find((e) => e.type === 'hadith');

        expect(hadith).toBeDefined();
        expect(hadith?.id).toMatch(/^P\d+$/); // Plain ID without bookId prefix
        expect(hadith?.nass).toBeString();
        expect(hadith?.text).toBeString();
        expect(isHadithMetadata(hadith!.meta)).toBeTrue();
    });

    it('should have chapter titles', async () => {
        const data = await loadContent('2576');

        const chapter = data.content.find((e) => e.type === 'chapter-title');
        expect(chapter).toBeDefined();
    });
});

// ============================================================================
// Hadith Index Validation
// ============================================================================

describe('Hadith Index Validation', () => {
    it('should have valid hadith number index', async () => {
        const indexes = await loadJSON<any>(join(DATA_DIR, 'books/2576/indexes.json'));
        const index = indexes.hadiths;

        expect(Object.keys(index).length).toBeGreaterThan(7000);
        expect(index['1']).toBeDefined();
        expect(index['49']).toBeDefined();
    });
});

// ============================================================================
// Data Integrity
// ============================================================================

describe('Data Integrity', () => {
    it("should have unique excerpt IDs in Qur'an", async () => {
        const data = await loadContent('1');

        const ids = new Set(data.content.map((e) => e.id));
        expect(ids.size).toBe(data.content.length);
    });

    it('should have unique excerpt IDs in Hadith', async () => {
        const data = await loadContent('2576');

        const ids = new Set(data.content.map((e) => e.id));
        expect(ids.size).toBe(data.content.length);
    });

    it('should have valid page numbers', async () => {
        const data = await loadContent('1');

        const sample = data.content.slice(0, 100);

        sample.forEach((excerpt) => {
            expect(excerpt.page).toBeGreaterThan(0);
            expect(excerpt.page).toBeLessThanOrEqual(604);
        });
    });
});
