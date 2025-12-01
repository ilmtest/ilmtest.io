/**
 * Minimal v1 TypeScript Types
 *
 * Core types for browsing Qur'an and Hadith collections
 * Future features documented in future-roadmap.ts
 */

// ============================================================================
// v1 Core Types
// ============================================================================

export type BookType = 'scripture' | 'hadith';

export type ExcerptType = 'verse' | 'hadith' | 'chapter-title';

// ============================================================================
// Books Metadata
// ============================================================================

export type Book = {
    id: number;
    slug: string;
    type: BookType;
    title: string;
    unwan: string; // Arabic title
    author: string | null;
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
    type?: 'verse' | 'hadith' | 'chapter-title'; // Optional: omit for generic text/prose
    nass: string; // Arabic text
    text: string; // English translation
    translator: number; // Translator ID
    page: number; // Page number in source
    meta: VerseMetadata | HadithMetadata | FatawaMetadata; // Type-specific metadata
};

export type VerseMetadata = { surah: number; verse: number };

export type HadithMetadata = {
    volume: number;
    pp: number; // Part page (for citation like "9/5")
    hadithNum?: number; // Extracted from nass (e.g., 1, 49, 7563)
};

// Fatawa/Fiqh books (future v2+)
export type FatawaMetadata = { volume: number; pp: number };

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
};

export type HeadingsManifest = { headings: Heading[] };

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
