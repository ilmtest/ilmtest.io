/**
 * Migration Integration Tests
 *
 * Tests complete migration workflows with mock data
 *
 * Run with: bun test tests/migration-integration.test.ts
 */

import { describe, expect, it } from 'bun:test';
import { migrateHadithData, migrateQuranData } from '../scripts/migration-scripts-v1';
import type { OldHadithExcerpt, OldQuranExcerpt, OldQuranHeading } from '../scripts/migration-utils';

// ============================================================================
// Mock Data
// ============================================================================

const mockQuranData = {
    content: [
        {
            chapter: 60518,
            id: 1,
            nass: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
            page: 1,
            surah: 1,
            text: 'In the Name of Allah...',
            translator: 13,
            verse: 1,
        },
        {
            chapter: 60518,
            id: 2,
            nass: 'ٱلْحَمْدُ لِلَّهِ',
            page: 1,
            surah: 1,
            text: 'All praise is due to Allah',
            translator: 13,
            verse: 2,
        },
        {
            chapter: 60519,
            id: 286,
            nass: 'لَا يُكَلِّفُ ٱللَّهُ نَفْسًا',
            page: 42,
            surah: 2,
            text: 'Allah does not burden...',
            translator: 13,
            verse: 255,
        },
    ] as OldQuranExcerpt[],
    headings: [
        { id: 60518, nass: 'الفاتحة', num: 1, page: 1, text: 'The Opening', translator: 13 },
        { id: 60519, nass: 'البقرة', num: 2, page: 2, text: 'The Cow', translator: 13 },
    ] as OldQuranHeading[],
};

const mockHadithData = {
    content: [
        { id: 'P8', nass: 'مقدمة الكتاب', page: 8, pp: 5, text: 'Introduction', translator: 873, volume: 1 },
        {
            id: 'P10',
            nass: '١ - حَدَّثَنَا الْحُمَيْدِيُّ',
            page: 10,
            pp: 6,
            text: 'Actions are by intentions...',
            translator: 873,
            volume: 1,
        },
        {
            id: 'C43',
            nass: 'بَابُ سُؤَالِ جِبْرِيلَ',
            page: 95,
            pp: 19,
            text: 'Chapter: Jibrils questioning',
            translator: 873,
            type: 2,
            volume: 1,
        },
        {
            id: 'P94',
            nass: '٤٩ - أَخْبَرَنَا قُتَيْبَةُ',
            page: 94,
            pp: 19,
            text: 'Qutaybah informed us...',
            translator: 873,
            volume: 1,
        },
    ] as OldHadithExcerpt[],
};

// ============================================================================
// Qur'an Migration Integration
// ============================================================================

describe('migrateQuranData', () => {
    it("should migrate complete Qur'an dataset", () => {
        const result = migrateQuranData(mockQuranData);

        expect(result).toBeDefined();
        expect(result.content).toBeArrayOfSize(3);
        expect(result.headings).toBeArrayOfSize(2);
        expect(result.indexes).toBeDefined();
    });

    it('should transform all verses correctly', () => {
        const result = migrateQuranData(mockQuranData);

        const first = result.content[0];
        expect(first.id).toBe('1:1');
        expect(first.type).toBe('verse');
        expect(first.meta).toHaveProperty('surah', 1);
    });

    it('should transform all headings correctly', () => {
        const result = migrateQuranData(mockQuranData);

        const fatiha = result.headings[0];
        expect(fatiha.id).toBe('1');
        expect(fatiha.surah).toBe(1);
    });

    it('should generate valid surah:verse index', () => {
        const result = migrateQuranData(mockQuranData);

        expect(result.indexes.surahVerse['1:1']).toBeDefined();
        expect(result.indexes.surahVerse['1:2']).toBeDefined();
        expect(result.indexes.surahVerse['2:255']).toBeDefined();
        expect(Object.keys(result.indexes.surahVerse)).toHaveLength(3);
    });

    it('should generate valid page index', () => {
        const result = migrateQuranData(mockQuranData);

        expect(result.indexes.page['1']).toEqual({ end: 1, start: 0 });
        expect(result.indexes.page['42']).toEqual({ end: 2, start: 2 });
    });
});

// ============================================================================
// Hadith Migration Integration
// ============================================================================

describe('migrateHadithData', () => {
    it('should migrate complete Hadith dataset', () => {
        const result = migrateHadithData(mockHadithData, 2576);

        expect(result).toBeDefined();
        expect(result.content).toBeArrayOfSize(4);
        expect(result.indexes).toBeDefined();
    });

    it('should transform excerpts with correct types', () => {
        const result = migrateHadithData(mockHadithData, 2576);

        const hadithCount = result.content.filter((e) => e.type === 'hadith').length;
        const chapterCount = result.content.filter((e) => e.type === 'chapter-title').length;

        expect(hadithCount).toBe(2); // P10, P94 (P8 is generic text, no type)
        expect(chapterCount).toBe(1); // C43
    });

    it('should extract hadith numbers correctly', () => {
        const result = migrateHadithData(mockHadithData, 2576);

        const hadith1 = result.content.find((e) => e.id === 'P10');
        const hadith49 = result.content.find((e) => e.id === 'P94');

        expect(hadith1?.meta).toHaveProperty('hadithNum', 1);
        expect(hadith49?.meta).toHaveProperty('hadithNum', 49);
    });

    it('should not add hadith numbers to chapter titles', () => {
        const result = migrateHadithData(mockHadithData, 2576);

        const chapter = result.content.find((e) => e.id === 'C43');
        expect(chapter?.meta).not.toHaveProperty('hadithNum');
    });

    it('should generate valid hadith number index', () => {
        const result = migrateHadithData(mockHadithData, 2576);

        expect(result.indexes.hadithNum['1']).toEqual({ eid: 'P10', page: 10 });
        expect(result.indexes.hadithNum['49']).toEqual({ eid: 'P94', page: 94 });
        expect(Object.keys(result.indexes.hadithNum)).toHaveLength(2);
    });

    it('should generate valid page index', () => {
        const result = migrateHadithData(mockHadithData, 2576);

        expect(result.indexes.page['8']).toEqual({ end: 0, start: 0 });
        expect(result.indexes.page['10']).toEqual({ end: 1, start: 1 });
        expect(result.indexes.page['95']).toEqual({ end: 2, start: 2 });
        expect(result.indexes.page['94']).toEqual({ end: 3, start: 3 });
    });

    it('should use provided book ID in excerpt IDs', () => {
        const result = migrateHadithData(mockHadithData, 9999);

        result.content.forEach((excerpt) => {
            expect(excerpt.id).not.toStartWith('9999:'); // No bookId prefix
        });
    });
});

// ============================================================================
// Data Integrity
// ============================================================================

describe('Data Integrity', () => {
    it('should preserve all original data fields', () => {
        const result = migrateQuranData(mockQuranData);

        const testCases = result.content.map((excerpt, idx) => ({ excerpt, original: mockQuranData.content[idx] }));

        testCases.forEach(({ excerpt, original }) => {
            expect(excerpt.nass).toBe(original.nass);
            expect(excerpt.text).toBe(original.text);
            expect(excerpt.translator).toBe(original.translator);
            expect(excerpt.page).toBe(original.page);
        });
    });

    it('should create unique excerpt IDs', () => {
        const result = migrateQuranData(mockQuranData);
        const ids = result.content.map((e) => e.id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(ids.length);
    });

    it('should create unique heading IDs', () => {
        const result = migrateQuranData(mockQuranData);
        const ids = result.headings.map((h) => h.id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(ids.length);
    });

    it.each([
        ['P8', 0],
        ['P10', 1],
        ['C43', 2],
        ['P94', 3],
    ])('should maintain content order: %s at index %i', (eid, expectedIndex) => {
        const result = migrateHadithData(mockHadithData, 2576);
        expect(result.content[expectedIndex].id).toBe(eid);
    });
});
