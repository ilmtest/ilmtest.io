/**
 * Index Generation Tests
 *
 * Run with: bun test tests/index-generation.test.ts
 */

import { describe, expect, it } from 'bun:test';
import { generateHadithNumIndex, generatePageIndex, generateSurahVerseIndex } from '../scripts/migration-utils';

// ============================================================================
// Surah:Verse Index Generation
// ============================================================================

describe('generateSurahVerseIndex', () => {
    it('should create index from verses', () => {
        const verses = [
            { id: 1, page: 1, surah: 1, verse: 1 },
            { id: 2, page: 1, surah: 1, verse: 2 },
            { id: 3, page: 1, surah: 1, verse: 3 },
        ];

        const index = generateSurahVerseIndex(verses);

        expect(index['1:1']).toEqual({ eid: 1, page: 1 });
        expect(index['1:2']).toEqual({ eid: 2, page: 1 });
        expect(index['1:3']).toEqual({ eid: 3, page: 1 });
    });

    it('should handle different surahs', () => {
        const verses = [
            { id: 1, page: 1, surah: 1, verse: 1 },
            { id: 10, page: 2, surah: 2, verse: 1 },
            { id: 100, page: 20, surah: 5, verse: 50 },
        ];

        const index = generateSurahVerseIndex(verses);

        expect(index['1:1']).toBeDefined();
        expect(index['2:1']).toBeDefined();
        expect(index['5:50']).toBeDefined();
    });

    it('should handle empty array', () => {
        const index = generateSurahVerseIndex([]);
        expect(Object.keys(index).length).toBe(0);
    });

    it('should create unique keys', () => {
        const verses = [{ id: 286, page: 42, surah: 2, verse: 255 }];

        const index = generateSurahVerseIndex(verses);

        expect(index['2:255']).toEqual({ eid: 286, page: 42 });
    });
});

// ============================================================================
// Hadith Number Index Generation
// ============================================================================

describe('generateHadithNumIndex', () => {
    it('should extract and index hadith numbers', () => {
        const excerpts = [
            { id: 'P10', nass: '١ - حَدَّثَنَا...', page: 10, type: 'hadith' },
            { id: 'P94', nass: '٤٩ - أَخْبَرَنَا...', page: 94, type: 'hadith' },
        ];

        const index = generateHadithNumIndex(excerpts);

        expect(index['1']).toEqual({ eid: 'P10', page: 10 });
        expect(index['49']).toEqual({ eid: 'P94', page: 94 });
    });

    it('should skip chapter titles', () => {
        const excerpts = [
            { id: 'C1', nass: 'بَابُ...', page: 5, type: 'chapter-title' },
            { id: 'P10', nass: '١ - حَدَّثَنَا...', page: 10, type: 'hadith' },
        ];

        const index = generateHadithNumIndex(excerpts);

        expect(index['1']).toBeDefined();
        expect(Object.keys(index).length).toBe(1);
    });

    it('should skip excerpts without hadith numbers', () => {
        const excerpts = [
            { id: 'P8', nass: 'مقدمة...', page: 8, type: 'hadith' },
            { id: 'P10', nass: '١ - حَدَّثَنَا...', page: 10, type: 'hadith' },
        ];

        const index = generateHadithNumIndex(excerpts);

        expect(index['1']).toBeDefined();
        expect(Object.keys(index).length).toBe(1);
    });

    it('should handle empty array', () => {
        const index = generateHadithNumIndex([]);
        expect(Object.keys(index).length).toBe(0);
    });
});

// ============================================================================
// Page Index Generation
// ============================================================================

describe('generatePageIndex', () => {
    it('should group excerpts by page', () => {
        const excerpts = [{ page: 1 }, { page: 1 }, { page: 1 }, { page: 2 }, { page: 2 }];

        const index = generatePageIndex(excerpts);

        expect(index['1']).toEqual({ end: 2, start: 0 });
        expect(index['2']).toEqual({ end: 4, start: 3 });
    });

    it('should handle single page', () => {
        const excerpts = [{ page: 1 }, { page: 1 }];

        const index = generatePageIndex(excerpts);

        expect(index['1']).toEqual({ end: 1, start: 0 });
        expect(Object.keys(index).length).toBe(1);
    });

    it('should handle one excerpt per page', () => {
        const excerpts = [{ page: 1 }, { page: 2 }, { page: 3 }];

        const index = generatePageIndex(excerpts);

        expect(index['1']).toEqual({ end: 0, start: 0 });
        expect(index['2']).toEqual({ end: 1, start: 1 });
        expect(index['3']).toEqual({ end: 2, start: 2 });
    });

    it('should handle non-sequential pages', () => {
        const excerpts = [{ page: 1 }, { page: 1 }, { page: 42 }, { page: 42 }, { page: 604 }];

        const index = generatePageIndex(excerpts);

        expect(index['1']).toEqual({ end: 1, start: 0 });
        expect(index['42']).toEqual({ end: 3, start: 2 });
        expect(index['604']).toEqual({ end: 4, start: 4 });
    });

    it('should handle empty array', () => {
        const index = generatePageIndex([]);
        expect(Object.keys(index).length).toBe(0);
    });
});
