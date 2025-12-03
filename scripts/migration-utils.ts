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
export function transformHadithExcerpt(excerpt: OldHadithExcerpt): Excerpt {
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
        type: 'quran',
    };
}

export type OldHadithHeading = {
    id: string;
    nass: string;
    text: string;
    translator: number;
    from: number; // This is the actual page where content starts
    page?: number; // This field may not be reliable
    parent?: number;
    volume?: number;
    pp?: number;
};

/**
 * Normalize Arabic text for matching:
 * - Remove Tashkeel (diacritics)
 * - Remove special symbols (like ﷺ) and punctuation
 * - Normalize spaces
 */
export function normalizeArabic(text: string): string {
    return text
        .replace(/[\u064B-\u065F\u0670]/g, '') // Remove Tashkeel
        .replace(/[^\u0600-\u06FF\s]/g, '') // Remove non-Arabic chars (like punctuation, numbers if any)
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
}

/**
 * Extract hadith headings from the dedicated headings array
 * and calculate content ranges using page numbers.
 *
 * Strategy:
 * 1. Map each page to the index of the first content item on that page.
 * 2. Heading Start = First content item on heading.page.
 * 3. Heading End = Item before the next heading starts.
 */
export function extractHadithHeadings(headings: OldHadithHeading[], content: OldHadithExcerpt[]): Heading[] {
    // 1. Map page numbers to the first content index on that page
    // Since content is ordered, the first time we see a page is its start index.
    const pageMap = new Map<number, number>();
    content.forEach((item, index) => {
        if (!pageMap.has(item.page)) {
            pageMap.set(item.page, index);
        }
    });

    // 2. Determine start index for each heading
    const headingsWithIndex = headings
        .map((h) => {
            // Use 'from' field which indicates where the content actually starts
            let startIndex = pageMap.get(h.from);

            // Fallback: If exact page has no content (rare), try next few pages
            // This handles cases where a heading is on page X but content starts on X+1
            if (startIndex === undefined) {
                for (let p = h.from + 1; p <= h.from + 10; p++) {
                    if (pageMap.has(p)) {
                        startIndex = pageMap.get(p);
                        break;
                    }
                }
            }

            if (startIndex === undefined) {
                // If still not found, it might be a heading at the very end with no content?
                // Or data issue. Default to -1 to filter out.
                return { ...h, startIndex: -1 };
            }

            return { ...h, startIndex };
        })
        .filter((h) => h.startIndex !== -1);

    // 3. Sort by index to ensure linear processing order
    headingsWithIndex.sort((a, b) => a.startIndex - b.startIndex);

    // 4. Calculate ranges based on sorted order
    return headingsWithIndex.map((h, i, arr) => {
        const startIndex = h.startIndex;
        let endIndex = content.length - 1;

        // The range ends just before the next heading starts
        // We look for the next heading that has a *different* (higher) start index
        // or just the immediate next one in the sorted list?
        // Logic: Chapter 1 covers everything until Chapter 2 starts.
        // Sub-chapters (nested) are also in this list.
        // If T5 (Book) starts at 100, and T6 (Chapter) starts at 100,
        // T5's range effectively encloses T6.
        // But for a flat "range" property, we usually want the full span.
        // So T5 should end where T7 (next Book) starts?
        // OR does T5 end where T6 starts?
        // User said: "The 'end' of that chapter would simply be the next heading... (exclusive)"
        // This implies a flat partitioning.
        // However, for nested structures (Book -> Chapter), the Book should logically contain the Chapter.
        // But the user's request for "flat list" and "next heading" implies sequential blocks.
        // Let's stick to the user's specific instruction: "next heading in that array".

        // Wait, if T5 is parent of T6, and they start on same page:
        // T5 start = 100
        // T6 start = 100
        // If we say T5 ends at T6 start (100), T5 has empty range. That's wrong.
        // A parent heading should cover all its children.

        // Revised Logic for Hierarchy:
        // - If it's a Book (no parent), it ends at the next Book.
        // - If it's a Chapter (has parent), it ends at the next Chapter OR next Book.

        const isBook = !h.parent;

        for (let j = i + 1; j < arr.length; j++) {
            const next = arr[j];
            const nextIsBook = !next.parent;

            if (isBook) {
                // A Book ends when the next Book starts
                if (nextIsBook) {
                    endIndex = next.startIndex - 1;
                    break;
                }
            } else {
                // A Chapter ends when the next Chapter OR next Book starts
                // i.e. ANY next heading implies end of this specific segment?
                // No, if T6 is followed by T7 (another chapter in same book), T6 ends at T7.
                // If T6 is last chapter, followed by T8 (Next Book), T6 ends at T8.
                // So for chapters, we stop at *any* next heading that is NOT a child of this one?
                // Actually, simpler: Stop at next sibling or parent's sibling.
                // Effectively: Stop at next heading in the list that has >= start index?
                // Let's use the same logic as before which seemed to work for hierarchy:
                // Stop at next Book (if Book) or next Heading (if Chapter).

                // User's prompt: "The 'end' of that chapter would simply be the next heading... except the very last chapter"
                // This implies strict sequential ranges.
                // But for T5 (Book) vs T6 (Chapter inside T5), if they start at same index, T5 range must be larger.

                // Let's keep the hierarchy-aware logic:
                if (nextIsBook) {
                    endIndex = next.startIndex - 1;
                    break;
                }
                // If next is another chapter, our chapter ends there
                if (next.startIndex > startIndex) {
                    // Only if it actually starts later.
                    // If multiple headings start at same index (e.g. Book + first Chapter),
                    // the Book shouldn't end there.
                    endIndex = next.startIndex - 1;
                    break;
                }
            }
        }

        // Ensure valid range
        if (endIndex < startIndex) {
            endIndex = startIndex;
        }

        const startId = content[startIndex].id;
        const endId = content[endIndex].id;

        const startPage = content[startIndex].page;
        const endPage = content[endIndex].page;

        return {
            id: h.id,
            nass: h.nass,
            page: h.from, // Use 'from' as the canonical page for this heading
            pp: h.pp ?? 0,
            text: h.text,
            translator: h.translator,
            type: 'hadith',
            volume: h.volume ?? 1,
            ...(h.parent ? { parent: `T${h.parent}` } : {}),
            indexRange: { end: endIndex, start: startIndex },
            pageRange: { end: endPage, start: startPage },
            range: { end: endId, start: startId },
        };
    });
}

export function generateGlobalIndex(
    content: any[],
    headings: any[],
    allTranslators: import('../src/lib/data-types-v1').Translator[],
    chunkSize: number,
): import('../src/lib/data-types-v1').GlobalIndex {
    const hadiths: Record<string, number> = {};
    const pages: Record<string, { start: number; end: number }> = {};
    const ids: Record<string, number> = {};
    const surahs: Record<string, number> = {};
    const translatorIds = new Set<number>();

    content.forEach((item, index) => {
        // Map ID to Index
        ids[item.id] = index;

        // Collect translator ID
        if (item.translator) {
            translatorIds.add(item.translator);
        }

        // Map Hadith Number to Index
        if (item.meta?.hadithNum) {
            hadiths[item.meta.hadithNum.toString()] = index;
        }

        // Map Surah:Verse to Index
        if (item.meta && 'surah' in item.meta && 'verse' in item.meta) {
            surahs[`${item.meta.surah}:${item.meta.verse}`] = index;
        }

        // Map Page to Index Range
        if (item.page) {
            const pageKey = item.page.toString();
            if (!pages[pageKey]) {
                pages[pageKey] = { end: index, start: index };
            } else {
                pages[pageKey].end = index;
            }
        }
    });

    // Collect translator IDs from headings
    headings.forEach((heading) => {
        if (heading.translator) {
            translatorIds.add(heading.translator);
        }
    });

    // Build translator index - only include translators actually used
    const translators: Record<string, import('../src/lib/data-types-v1').Translator> = {};
    allTranslators.forEach((translator) => {
        if (translatorIds.has(translator.id)) {
            translators[translator.id.toString()] = translator;
        }
    });

    return { chunkSize, hadiths, ids, pages, surahs, totalItems: content.length, translators, version: '1.0.0' };
}

// ============================================================================
// Batch Transformations
// ============================================================================

export function transformQuranContent(oldContent: OldQuranExcerpt[]): Excerpt[] {
    return oldContent.map(transformQuranExcerpt);
}

export function transformQuranHeadings(oldHeadings: OldQuranHeading[], content: Excerpt[]): Heading[] {
    // Create a map of Surah Number -> Start/End Indices
    const surahRanges = new Map<number, { start: number; end: number }>();

    content.forEach((item, index) => {
        if ('type' in item && item.type === 'verse' && item.meta && 'surah' in item.meta) {
            const surah = item.meta.surah;
            if (!surahRanges.has(surah)) {
                surahRanges.set(surah, { end: index, start: index });
            } else {
                const range = surahRanges.get(surah)!;
                range.end = index;
            }
        }
    });

    return oldHeadings.map((h) => {
        const range = surahRanges.get(h.num);
        if (!range) {
            return transformQuranHeading(h);
        }

        const startId = content[range.start].id;
        const endId = content[range.end].id;
        const startPage = content[range.start].page;
        const endPage = content[range.end].page;

        return {
            ...transformQuranHeading(h),
            indexRange: { end: range.end, start: range.start },
            pageRange: { end: endPage, start: startPage },
            range: { end: endId, start: startId },
        };
    });
}

export function transformHadithContent(oldContent: OldHadithExcerpt[]): Excerpt[] {
    return oldContent.map((old) => transformHadithExcerpt(old));
}
