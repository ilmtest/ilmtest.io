/**
 * Migration Utilities Tests
 *
 * Run with: bun test tests/migration-utils.test.ts
 */

import { describe, expect, it } from 'bun:test';
import {
    arabicToWestern,
    extractHadithHeadings,
    extractHadithNumber,
    type OldHadithExcerpt,
    type OldHadithHeading,
    type OldQuranExcerpt,
    type OldQuranHeading,
    transformHadithExcerpt,
    transformQuranExcerpt,
    transformQuranHeading,
} from '../scripts/migration-utils';

// ============================================================================
// Arabic Number Conversion
// ============================================================================

describe('arabicToWestern', () => {
    it.each([
        ['١', 1],
        ['٥', 5],
        ['٩', 9],
    ])('should convert single digit %s to %i', (arabic, expected) => {
        expect(arabicToWestern(arabic)).toBe(expected);
    });

    it.each([
        ['٤٩', 49],
        ['١٢', 12],
    ])('should convert double digits %s to %i', (arabic, expected) => {
        expect(arabicToWestern(arabic)).toBe(expected);
    });

    it.each([
        ['٧٥٦٣', 7563],
        ['١٢٣٤', 1234],
    ])('should convert large numbers %s to %i', (arabic, expected) => {
        expect(arabicToWestern(arabic)).toBe(expected);
    });

    it.each([
        ['٠', 0],
        ['١٠', 10],
    ])('should handle zero in %s → %i', (arabic, expected) => {
        expect(arabicToWestern(arabic)).toBe(expected);
    });
});

// ============================================================================
// Hadith Number Extraction
// ============================================================================

describe('extractHadithNumber', () => {
    it('should extract simple hadith number', () => {
        const nass = '١ - حَدَّثَنَا الْحُمَيْدِيُّ...';
        expect(extractHadithNumber(nass)).toBe(1);
    });

    it('should extract double-digit hadith number', () => {
        const nass = '٤٩ - أَخْبَرَنَا قُتَيْبَةُ...';
        expect(extractHadithNumber(nass)).toBe(49);
    });

    it('should extract large hadith number', () => {
        const nass = '٧٥٦٣ - حَدَّثَنَا...';
        expect(extractHadithNumber(nass)).toBe(7563);
    });

    it('should return null for non-hadith text', () => {
        const nass = 'بَابُ سُؤَالِ جِبْرِيلَ...';
        expect(extractHadithNumber(nass)).toBeNull();
    });

    it('should return null for chapter titles', () => {
        const nass = 'كتاب بدء الوحي';
        expect(extractHadithNumber(nass)).toBeNull();
    });

    it('should handle text without dash separator', () => {
        const nass = 'قَالَ الشَّيْخُ...';
        expect(extractHadithNumber(nass)).toBeNull();
    });
});

// ============================================================================
// Qur'an Excerpt Transformation
// ============================================================================

describe('transformQuranExcerpt', () => {
    it('should transform basic excerpt', () => {
        const old: OldQuranExcerpt = {
            chapter: 60518,
            id: 1,
            nass: 'بِسْمِ ٱللَّهِ',
            page: 1,
            surah: 1,
            text: 'In the Name of Allah',
            translator: 13,
            verse: 1,
        };

        const transformed = transformQuranExcerpt(old);

        expect(transformed.id).toBe('1:1');
        expect(transformed.type).toBe('verse');
        expect(transformed.nass).toBe(old.nass);
        expect(transformed.text).toBe(old.text);
        expect(transformed.meta).toHaveProperty('surah', 1);
        expect(transformed.meta).toHaveProperty('verse', 1);
    });

    it('should preserve translator ID', () => {
        const old: OldQuranExcerpt = {
            chapter: 60518,
            id: 100,
            nass: 'test',
            page: 10,
            surah: 2,
            text: 'test',
            translator: 42,
            verse: 50,
        };

        const transformed = transformQuranExcerpt(old);
        expect(transformed.translator).toBe(42);
    });

    it('should format ID correctly', () => {
        const old: OldQuranExcerpt = {
            chapter: 60631,
            id: 6236,
            nass: 'test',
            page: 604,
            surah: 114,
            text: 'test',
            translator: 13,
            verse: 6,
        };

        const transformed = transformQuranExcerpt(old);
        expect(transformed.id).toBe('114:6');
    });
});

// ============================================================================
// Hadith Excerpt Transformation
// ============================================================================

describe('transformHadithExcerpt', () => {
    it('should transform hadith with number', () => {
        const old: OldHadithExcerpt = {
            id: 'P10',
            nass: '١ - حَدَّثَنَا الْحُمَيْدِيُّ...',
            page: 10,
            pp: 6,
            text: 'Narrated...',
            translator: 873,
            volume: 1,
        };

        const transformed = transformHadithExcerpt(old);

        expect(transformed.id).toBe('P10');
        expect(transformed.type).toBe('hadith');
        expect(transformed.meta).toHaveProperty('hadithNum', 1);
        expect(transformed.meta).toHaveProperty('volume', 1);
        expect(transformed.meta).toHaveProperty('pp', 6);
    });

    it('should transform chapter title without hadith number', () => {
        const old: OldHadithExcerpt = {
            id: 'C43',
            nass: 'بَابُ سُؤَالِ...',
            page: 95,
            pp: 19,
            text: 'Chapter...',
            translator: 873,
            type: 2,
            volume: 1,
        };

        const transformed = transformHadithExcerpt(old);

        expect(transformed.type).toBe('chapter-title');
        expect(transformed.meta).not.toHaveProperty('hadithNum');
    });

    it('should use default volume and pp if missing', () => {
        const old: OldHadithExcerpt = { id: 'P1', nass: 'test', page: 1, text: 'test', translator: 873 };

        const transformed = transformHadithExcerpt(old);

        expect(transformed.meta).toHaveProperty('volume', 1);
        expect(transformed.meta).toHaveProperty('pp', 0);
    });
});

// ============================================================================
// Heading Transformation
// ============================================================================

describe('transformQuranHeading', () => {
    it('should transform surah heading', () => {
        const old: OldQuranHeading = {
            id: 60518,
            nass: 'الفاتحة',
            num: 1,
            page: 1,
            text: 'The Opening',
            translator: 13,
        };

        const transformed = transformQuranHeading(old);

        expect(transformed.id).toBe('1');
        expect(transformed.nass).toBe('الفاتحة');
        expect(transformed.text).toBe('The Opening');
        expect(transformed.surah).toBe(1);
    });

    it('should preserve all fields', () => {
        const old: OldQuranHeading = { id: 60631, nass: 'الناس', num: 114, page: 604, text: 'Mankind', translator: 13 };

        const transformed = transformQuranHeading(old);

        expect(transformed.translator).toBe(13);
        expect(transformed.page).toBe(604);
    });
});

describe('extractHadithHeadings', () => {
    it('should fallback to page-based matching if text does not match', () => {
        const headings: OldHadithHeading[] = [
            { from: 5, id: 'T1', nass: 'عنوان مفقود', text: 'Missing', translator: 1 },
        ];

        const content: OldHadithExcerpt[] = [
            { id: 'H1', nass: 'حديث', page: 5, text: 'H1', translator: 1 },
            { id: 'H2', nass: 'حديث آخر', page: 5, text: 'H2', translator: 1 },
        ];
        const result = extractHadithHeadings(headings, content);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('T1');
        expect(result[0].range?.start).toBe('H1');
        expect(result[0].range?.end).toBe('H2');
    });

    it('should extract hadith headings with parent mapping and ranges', () => {
        const headings: OldHadithHeading[] = [
            { from: 1, id: 'T5', nass: 'كتاب', text: 'Book', translator: 1 },
            { from: 1, id: 'T6', nass: 'باب', parent: 5, text: 'Chapter', translator: 1 },
        ];

        const content: OldHadithExcerpt[] = [
            { id: 'B1', nass: 'كتاب', page: 1, text: 'Book', translator: 1, type: 1 }, // Index 0
            { id: 'H1', nass: 'حديث', page: 1, text: 'H1', translator: 1 }, // Index 1
            { id: 'C1', nass: 'باب', page: 1, text: 'Chapter', translator: 1, type: 2 }, // Index 2
            { id: 'H2', nass: 'حديث', page: 1, text: 'H2', translator: 1 }, // Index 3
            { id: 'H3', nass: 'حديث', page: 1, text: 'H3', translator: 1 }, // Index 4
        ];

        const result = extractHadithHeadings(headings, content);

        expect(result).toHaveLength(2);

        // Book T5 (matches B1)
        expect(result[0].id).toBe('T5');
        expect(result[0].parent).toBeUndefined();
        expect(result[0].range).toBeDefined();
        expect(result[0].range?.start).toBe('B1');
        expect(result[0].range?.end).toBe('H3'); // Should cover everything until end or next Book

        // Chapter T6 (matches C1)
        // Note: With simple page-based logic, if T6 is on Page 1, it will start at the first item of Page 1 (B1)
        // unless we have more granular logic. The user requested simple page-based logic.
        expect(result[1].id).toBe('T6');
        expect(result[1].parent).toBe('T5');
        expect(result[1].range).toBeDefined();
        expect(result[1].range?.start).toBe('B1'); // Starts at beginning of page
        expect(result[1].range?.end).toBe('H3'); // Should cover until end
    });
});
