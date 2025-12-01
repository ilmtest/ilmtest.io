/**
 * Migration Utilities
 *
 * Pure functions for data transformation and index generation.
 * All functions accept data as parameters for easy testing.
 */

import type { Excerpt, Heading } from '../src/lib/data-types-v1';

// ============================================================================
// Arabic Number Conversion
// ============================================================================

const ARABIC_TO_WESTERN: Record<string, string> = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
};

export function arabicToWestern(arabicNum: string): number {
    const western = arabicNum.replace(/[٠-٩]/g, (d) => ARABIC_TO_WESTERN[d]);
    return parseInt(western, 10);
}

export function extractHadithNumber(nass: string): number | null {
    const match = nass.match(/^([٠-٩]+)\s*-/);
    return match ? arabicToWestern(match[1]) : null;
}

// ============================================================================
// Index Generation
// ============================================================================

export type IndexEntry<T = number | string> = { eid: T; page: number };

export function generateSurahVerseIndex(
    excerpts: Array<{ id: number; page: number; surah: number; verse: number }>,
): Record<string, IndexEntry<number>> {
    const index: Record<string, IndexEntry<number>> = {};

    for (const excerpt of excerpts) {
        const key = `${excerpt.surah}:${excerpt.verse}`;
        index[key] = { eid: excerpt.id, page: excerpt.page };
    }

    return index;
}

export function generateHadithNumIndex(
    excerpts: Array<{ id: string; page: number; nass: string; type?: string }>,
): Record<string, IndexEntry<string>> {
    const index: Record<string, IndexEntry<string>> = {};

    for (const excerpt of excerpts) {
        const isHadith = !excerpt.type || excerpt.type === 'hadith';
        if (!isHadith) {
            continue;
        }

        const hadithNum = extractHadithNumber(excerpt.nass);
        if (hadithNum) {
            index[hadithNum.toString()] = { eid: excerpt.id, page: excerpt.page };
        }
    }

    return index;
}

export type PageRange = { start: number; end: number };

export function generatePageIndex(excerpts: Array<{ page: number }>): Record<string, PageRange> {
    const index: Record<string, PageRange> = {};

    let currentPage = excerpts[0]?.page ?? 1;
    let pageStartIdx = 0;

    for (let idx = 0; idx < excerpts.length; idx++) {
        const excerpt = excerpts[idx];

        if (excerpt.page !== currentPage) {
            index[currentPage.toString()] = { end: idx - 1, start: pageStartIdx };
            currentPage = excerpt.page;
            pageStartIdx = idx;
        }
    }

    // Final page
    if (excerpts.length > 0) {
        index[currentPage.toString()] = { end: excerpts.length - 1, start: pageStartIdx };
    }

    return index;
}

// ============================================================================
// Excerpt Transformation
// ============================================================================

export type OldQuranExcerpt = {
    id: number;
    nass: string;
    text: string;
    translator: number;
    page: number;
    surah: number;
    verse: number;
    chapter: number;
};

/**
 * Transform old Qur'an excerpt to new unified format
 */
export function transformQuranExcerpt(excerpt: OldQuranExcerpt): Excerpt {
    const { surah, verse } = excerpt;
    return {
        id: `${surah}:${verse}`,
        meta: { surah, verse },
        nass: excerpt.nass,
        page: excerpt.page,
        text: excerpt.text,
        translator: excerpt.translator,
        type: 'verse',
    };
}

export type OldHadithExcerpt = {
    id: string;
    nass: string;
    text: string;
    translator: number;
    page: number;
    pp?: number;
    volume?: number;
    type?: number;
};

/**
 * Transform old hadith excerpt to new unified format
 */
export function transformHadithExcerpt(excerpt: OldHadithExcerpt, bookId: number): Excerpt {
    const hadithNum = extractHadithNumber(excerpt.nass);
    const isChapterTitle =
        excerpt.type === 2 || excerpt.type === 1 || excerpt.id.startsWith('C') || excerpt.id.startsWith('B');

    return {
        id: excerpt.id,
        // Only set type for structured content (hadith/chapter-title)
        // Generic text/prose has no type field
        ...(isChapterTitle ? { type: 'chapter-title' as const } : hadithNum ? { type: 'hadith' as const } : {}),
        meta: { pp: excerpt.pp ?? 0, volume: excerpt.volume ?? 1, ...(hadithNum && { hadithNum }) },
        nass: excerpt.nass,
        page: excerpt.page,
        text: excerpt.text,
        translator: excerpt.translator,
    };
}

// ============================================================================
// Heading Transformation
// ============================================================================

export type OldQuranHeading = { id: number; nass: string; text: string; translator: number; num: number; page: number };

export function transformQuranHeading(old: OldQuranHeading): Heading {
    return {
        id: old.num.toString(),
        nass: old.nass,
        page: old.page,
        surah: old.num,
        text: old.text,
        translator: old.translator,
    };
}

/**
 * Extract hadith headings (chapter/book titles) from content
 */
export function extractHadithHeadings(excerpts: OldHadithExcerpt[]): Heading[] {
    return excerpts
        .filter((e) => e.type === 2 || e.type === 1 || e.id.startsWith('C') || e.id.startsWith('B'))
        .map((e) => ({
            id: e.id,
            nass: e.nass,
            page: e.page,
            pp: e.pp ?? 0,
            text: e.text,
            translator: e.translator,
            volume: e.volume ?? 1,
        }));
}

// ============================================================================
// Batch Transformations
// ============================================================================

export function transformQuranContent(oldContent: OldQuranExcerpt[]): Excerpt[] {
    return oldContent.map(transformQuranExcerpt);
}

export function transformQuranHeadings(oldHeadings: OldQuranHeading[]): Heading[] {
    return oldHeadings.map(transformQuranHeading);
}

export function transformHadithContent(oldContent: OldHadithExcerpt[], bookId: number): Excerpt[] {
    return oldContent.map((old) => transformHadithExcerpt(old, bookId));
}
