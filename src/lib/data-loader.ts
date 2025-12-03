/**
 * Data Loading Utilities
 *
 * Server-side utilities for loading JSON data files.
 * All functions are async and designed for use in Server Components.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Book, BooksManifest, ContentManifest, Heading, HeadingsManifest } from './data-types-v1';

const DATA_DIR = join(process.cwd(), 'public/data');

/**
 * Load the books manifest
 */
export async function loadBooks(): Promise<Book[]> {
    const path = join(DATA_DIR, 'books.json');
    const content = await readFile(path, 'utf-8');
    const manifest: BooksManifest = JSON.parse(content);
    return manifest.books;
}

/**
 * Load headings for a specific book
 */
export async function loadBookHeadings(bookId: number): Promise<Heading[]> {
    const path = join(DATA_DIR, 'books', bookId.toString(), 'headings.json');
    const content = await readFile(path, 'utf-8');
    const manifest: HeadingsManifest = JSON.parse(content);
    return manifest.headings;
}

/**
 * Load a specific content chunk for a book
 */
export async function loadBookContentChunk(bookId: number, chunkId: number): Promise<ContentManifest> {
    const path = join(DATA_DIR, 'books', bookId.toString(), 'content', `${chunkId}.json`);
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
}

/**
 * Get top-level headings (where parent is undefined/null)
 */
export function getTopLevelHeadings(headings: Heading[]): Heading[] {
    return headings.filter((h) => {
        // For HadithHeading, check if parent is undefined
        if ('parent' in h) {
            return !h.parent;
        }
        // QuranHeadings don't have parent field, so all are top-level
        return true;
    });
}

/**
 * Find a specific heading by ID
 */
export function findHeadingById(headings: Heading[], id: string): Heading | undefined {
    return headings.find((h) => h.id === id);
}

/**
 * Load excerpts for a specific heading using its indexRange
 * This loads the necessary chunks and extracts the relevant excerpts
 */
export async function loadHeadingExcerpts(bookId: number, heading: Heading) {
    if (!heading.indexRange) {
        return [];
    }

    const { start, end } = heading.indexRange;
    const chunkSize = 500; // This should match the migration CHUNK_SIZE

    // Determine which chunks we need
    const startChunk = Math.floor(start / chunkSize);
    const endChunk = Math.floor(end / chunkSize);

    // Load all necessary chunks
    const chunks = [];
    for (let i = startChunk; i <= endChunk; i++) {
        const chunk = await loadBookContentChunk(bookId, i);
        chunks.push(chunk);
    }

    // Flatten and extract the relevant slice
    const allContent = chunks.flatMap((c) => c.content);
    const startOffset = start - startChunk * chunkSize;
    const endOffset = startOffset + (end - start) + 1;

    return allContent.slice(startOffset, endOffset);
}
