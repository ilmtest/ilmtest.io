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
 * Excerpt: A single unit of text (verse, hadith, chapter title, or prose)
 */
export type Excerpt = {
    id: string; // Unique within book (e.g., "1:1", "P42", "C17")
    type?: 'verse' | 'hadith' | 'chapter-title'; // Optional: omit for generic text/prose, foreword
    nass: string; // Arabic text
    text: string; // English translation
    translator: number; // Translator ID
    page: number; // Page number in source
    meta: VerseMetadata | HadithMetadata; // Type-specific metadata
};

type CitationMetadata = {
    volume: number;
    pp: number; // Part page (for citation like "9/5")
};

export type VerseMetadata = { surah: number; verse: number };

export type HadithMetadata = CitationMetadata & {
    hadithNum?: number; // Extracted from nass (e.g., 1, 49, 7563)
};

export type ContentManifest = { content: Excerpt[] };

// ============================================================================
// Headings (Table of Contents)
// ============================================================================

export type Heading = {
    id: string; // e.g., "1", "B5", "C17"
    nass: string;
    text: string;
    translator: number;
    // Quran-specific
    surah?: number;
    // Hadith/other-specific
    volume?: number;
    pp?: number;
    page?: number;
    parent?: string; // ID of parent heading (e.g., "T5")
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

export type HeadingsManifest = { headings: Heading[] };

export type GlobalIndex = {
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
