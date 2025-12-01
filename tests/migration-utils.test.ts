/**
 * Migration Utilities Tests
 *
 * Run with: bun test tests/migration-utils.test.ts
 */

import { describe, expect, it } from 'bun:test';
import {
    arabicToWestern,
    extractHadithNumber,
    type OldHadithExcerpt,
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

        const transformed = transformHadithExcerpt(old, 2576);

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

        const transformed = transformHadithExcerpt(old, 2576);

        expect(transformed.type).toBe('chapter-title');
        expect(transformed.meta).not.toHaveProperty('hadithNum');
    });

    it('should use default volume and pp if missing', () => {
        const old: OldHadithExcerpt = { id: 'P1', nass: 'test', page: 1, text: 'test', translator: 873 };

        const transformed = transformHadithExcerpt(old, 2576);

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
