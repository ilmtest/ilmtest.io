import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/Badge';
import {
    findHeadingById,
    getTopLevelHeadings,
    loadBookHeadings,
    loadBookIndex,
    loadBooks,
    loadExcerptById,
    loadHeadingExcerpts,
} from '@/lib/data-loader';

type Params = Promise<{ bookId: string; headingId: string; excerptId: string }>;

export async function generateStaticParams() {
    // In development, we don't need to pre-generate params.
    if (process.env.NODE_ENV === 'development') {
        return [];
    }

    const books = await loadBooks();
    const allParams = [];

    // OPTIMIZATION: Use FAST_BUILD=true to only generate the first book for faster local builds.
    // Default to building all books to ensure all links work.
    const shouldLimitBuild = process.env.FAST_BUILD === 'true';
    const booksToProcess = shouldLimitBuild ? books.slice(0, 1) : books;

    for (const book of booksToProcess) {
        const headings = await loadBookHeadings(book.id);
        // We only generate pages for top-level headings to match the parent page structure
        // If we want to support nested headings in the URL, we'd need to adjust this logic
        const topLevelHeadings = getTopLevelHeadings(headings);

        for (const heading of topLevelHeadings) {
            const excerpts = await loadHeadingExcerpts(book.id, heading);
            for (const excerpt of excerpts) {
                allParams.push({ bookId: book.id.toString(), excerptId: excerpt.id, headingId: heading.id });
            }
        }
    }

    return allParams;
}

export async function generateMetadata({ params }: { params: Params }) {
    const { bookId, excerptId } = await params;
    const books = await loadBooks();
    const book = books.find((b) => b.id === Number(bookId));

    if (!book) {
        return { title: 'Not Found' };
    }

    return { title: `Excerpt ${excerptId} - ${book.title}` };
}

export default async function ExcerptPage({ params }: { params: Params }) {
    const { bookId, headingId, excerptId } = await params;
    const books = await loadBooks();
    const book = books.find((b) => b.id === Number(bookId));

    if (!book) {
        notFound();
    }

    const headings = await loadBookHeadings(book.id);
    const heading = findHeadingById(headings, headingId);

    if (!heading) {
        notFound();
    }

    const excerpt = await loadExcerptById(book.id, excerptId);

    if (!excerpt) {
        notFound();
    }

    // Load translator info
    const index = await loadBookIndex(book.id);
    const translator = excerpt.translator ? index.translators[excerpt.translator.toString()] : null;

    return (
        <main className="min-h-screen p-8">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb Navigation */}
                <div className="mb-6 text-sm">
                    <Link href="/browse" className="text-blue-600 hover:underline dark:text-blue-400">
                        Books
                    </Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <Link href={`/browse/${bookId}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        {book.title}
                    </Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <Link
                        href={`/browse/${bookId}/${headingId}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        {heading.text}
                    </Link>
                    <span className="mx-2 text-gray-500">/</span>
                    <span className="text-gray-700 dark:text-gray-300">Excerpt {excerptId}</span>
                </div>

                {/* Excerpt Content */}
                <article className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    {/* Arabic Text */}
                    <p className="mb-8 font-arabic text-3xl text-gray-900 leading-loose dark:text-gray-100" dir="rtl">
                        {excerpt.nass}
                    </p>

                    {/* English Translation */}
                    <p className="mb-6 text-gray-700 text-xl leading-relaxed dark:text-gray-300">{excerpt.text}</p>

                    {/* Metadata & Translator */}
                    <div className="flex flex-wrap items-center gap-4 border-gray-200 border-t pt-6 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        {translator && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">Translated by:</span>
                                <Badge variant="secondary" className="text-sm">
                                    {translator.name}
                                </Badge>
                            </div>
                        )}

                        <div className="ml-auto flex items-center gap-4 text-sm">
                            <span>Page {excerpt.page}</span>
                            {'type' in excerpt &&
                                excerpt.type === 'verse' &&
                                'meta' in excerpt &&
                                'surah' in excerpt.meta && (
                                    <span>
                                        Verse {excerpt.meta.surah}:{excerpt.meta.verse}
                                    </span>
                                )}
                            {'type' in excerpt &&
                                excerpt.type === 'hadith' &&
                                'meta' in excerpt &&
                                'hadithNum' in excerpt.meta &&
                                excerpt.meta.hadithNum && <span>Hadith #{excerpt.meta.hadithNum}</span>}
                        </div>
                    </div>
                </article>

                {/* Navigation Footer */}
                <div className="mt-12 border-gray-200 border-t pt-6 dark:border-gray-700">
                    <Link
                        href={`/browse/${bookId}/${headingId}`}
                        className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                    >
                        ← Back to {heading.text}
                    </Link>
                </div>
            </div>
        </main>
    );
}
