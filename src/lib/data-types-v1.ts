/**
 * Minimal v1 TypeScript Types
 *
 * Core types for browsing Qur'an and Hadith collections
 * Future features documented in future-roadmap.ts
 */

// ============================================================================
// v1 Core Types
// ============================================================================

// ============================================================================
// Books Metadata
// ============================================================================

export type Book = {
    id: number;
    slug: string;
    type: 'scripture' | 'hadith';
    title: string;
    unwan: string; // Arabic title
    author?: string; // books like the Qur'an have no authors
    refTemplate: string; // URL template for external source (asl)
};

export type BooksManifest = { books: Book[] };

// ============================================================================
// Translators
// ============================================================================

export type Translator = { id: number; name: string; img?: string };

export type TranslatorsManifest = { translators: Translator[] };

// ============================================================================
// Excerpts (Core Content)
// ============================================================================

/**
 * Metadata for Quranic verses
 */
export type VerseMetadata = { surah: number; verse: number };

/**
 * Metadata for hadith and other citation-based texts
 */
export type HadithMetadata = {
    volume: number;
    pp: number; // Part page (for citation like "9/5")
    hadithNum?: number; // Extracted from nass (e.g., 1, 49, 7563)
};

/**
 * A Quranic verse excerpt
 */
export type VerseExcerpt = {
    type: 'verse';
    id: string;
    nass: string;
    text: string;
    translator: number;
    page: number;
    meta: VerseMetadata;
};

/**
 * A hadith excerpt
 */
export type HadithExcerpt = {
    type: 'hadith';
    id: string;
    nass: string;
    text: string;
    translator: number;
    page: number;
    meta: HadithMetadata;
};

/**
 * A chapter title excerpt
 */
export type ChapterTitleExcerpt = {
    type: 'chapter-title';
    id: string;
    nass: string;
    text: string;
    translator: number;
    page: number;
    meta: HadithMetadata; // Hadith books use volume/pp for chapter titles
};

/**
 * Generic text/prose excerpt (introductions, forewords, etc.)
 * Note: No type field - its absence indicates generic text
 */
export type TextExcerpt = {
    id: string;
    nass: string;
    text: string;
    translator: number;
    page: number;
    meta: HadithMetadata; // Still needs volume/pp for citation
};

/**
 * Unified excerpt type - discriminated union
 */
export type Excerpt = VerseExcerpt | HadithExcerpt | ChapterTitleExcerpt | TextExcerpt;

export type ContentManifest = { content: Excerpt[] };

// ============================================================================
// Headings (Table of Contents)
// ============================================================================

/**
 * Common fields for all heading types
 */
type BaseHeading = {
    id: string;
    nass: string;
    text: string;
    translator: number;
    page: number;
    /**
     * The range of content IDs covered by this heading (inclusive).
     * Used for logical grouping and reverse lookup.
     */
    range?: { start: string; end: string };
    /**
     * The range of array indices in the content array (inclusive).
     * OPTIMIZATION: Allows O(1) slicing of content without ID lookup.
     */
    indexRange?: { start: number; end: number };
    /**
     * The range of pages covered by this heading (inclusive).
     * Useful for displaying page spans in the UI without loading content.
     */
    pageRange?: { start: number; end: number };
};

/**
 * Quran heading (Surah)
 */
export type QuranHeading = BaseHeading & { type: 'quran'; surah: number };

/**
 * Hadith heading (Book/Chapter title)
 */
export type HadithHeading = BaseHeading & {
    type: 'hadith';
    volume: number;
    pp: number;
    parent?: string; // ID of parent heading (e.g., "T5" for nested chapters)
};

/**
 * Unified heading type - discriminated union
 */
export type Heading = QuranHeading | HadithHeading;

export type HeadingsManifest = { headings: Heading[] };

export type GlobalIndex = {
    /**
     * Version of the index structure for cache busting
     * Format: "major.minor.patch" following semver
     */
    version: string;
    /**
     * Map of Hadith Number to Global Index
     * Example: "1" -> 105
     */
    hadiths: Record<string, number>;
    /**
     * Map of Page Number to Global Index Range
     * Example: "10" -> { start: 105, end: 110 }
     */
    pages: Record<string, { start: number; end: number }>;
    /**
     * Map of Surah:Verse to Global Index (for Qur'an)
     * Example: "2:255" -> 300
     */
    surahs?: Record<string, number>;
    /**
     * Map of Content ID to Global Index
     * Example: "P1334" -> 500
     */
    ids: Record<string, number>;
    /**
     * Translators used in this book (subset of all translators)
     * Keyed by translator ID for O(1) lookup
     */
    translators: Record<string, Translator>;
    /**
     * The number of items per chunk
     */
    chunkSize: number;
    /**
     * Total number of items in the content array
     */
    totalItems: number;
};

// ============================================================================
// Indexes for Fast Lookups
// ============================================================================

// Surah:Verse → Excerpt location
export type SurahVerseIndex = Record<string, PageIndexEntry>;

// Hadith Number → Excerpt location
export type HadithNumIndex = Record<string, PageIndexEntry>;

// Page → Excerpt range
export type PageIndexEntry = {
    start: number; // Start excerpt index in content array
    end: number; // End excerpt index
};

export type PageIndex = Record<string, PageIndexEntry>;
