import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    findHeadingById,
    getTopLevelHeadings,
    loadBookHeadings,
    loadBooks,
    loadHeadingExcerpts,
} from '@/lib/data-loader';

type Params = Promise<{ bookId: string; headingId: string }>;

export async function generateStaticParams() {
    // In development, we don't need to pre-generate params.
    if (process.env.NODE_ENV === 'development') {
        return [];
    }

    const books = await loadBooks();
    const allParams = [];

    for (const book of books) {
        const headings = await loadBookHeadings(book.id);
        const topLevelHeadings = getTopLevelHeadings(headings);

        for (const heading of topLevelHeadings) {
            allParams.push({ bookId: book.id.toString(), headingId: heading.id });
        }
    }

    return allParams;
}

export async function generateMetadata({ params }: { params: Params }) {
    const { bookId, headingId } = await params;
    const books = await loadBooks();
    const book = books.find((b) => b.id === Number(bookId));

    if (!book) {
        return { title: 'Not Found' };
    }

    const headings = await loadBookHeadings(book.id);
    const heading = findHeadingById(headings, headingId);

    if (!heading) {
        return { title: 'Not Found' };
    }

    return { description: `Read ${heading.text} from ${book.title}`, title: `${heading.text} - ${book.title}` };
}

export default async function HeadingExcerptsPage({ params }: { params: Params }) {
    const { bookId, headingId } = await params;
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

    const excerpts = await loadHeadingExcerpts(book.id, heading);

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
                    <span className="text-gray-700 dark:text-gray-300">{heading.text}</span>
                </div>

                {/* Heading Header */}
                <div className="mb-8 border-gray-200 border-b pb-6 dark:border-gray-700">
                    <h1 className="mb-3 font-bold text-3xl">{heading.text}</h1>
                    <p className="mb-4 font-arabic text-2xl text-gray-700 dark:text-gray-300" dir="rtl">
                        {heading.nass}
                    </p>
                    <div className="flex gap-4 text-gray-600 text-sm dark:text-gray-400">
                        {heading.pageRange && (
                            <span>
                                Pages {heading.pageRange.start}–{heading.pageRange.end}
                            </span>
                        )}
                        {'surah' in heading && <span>Surah {heading.surah}</span>}
                        <span>{excerpts.length} excerpts</span>
                    </div>
                </div>

                {/* Excerpts List */}
                <div className="space-y-6">
                    {excerpts.map((excerpt) => {
                        const isChapterTitle = 'type' in excerpt && excerpt.type === 'chapter-title';
                        const excerptUrl = `/browse/${bookId}/${headingId}/${excerpt.id}`;

                        if (isChapterTitle) {
                            return (
                                <div
                                    key={excerpt.id}
                                    className="group relative border-gray-300 border-t-2 pt-6 pb-2 dark:border-gray-600"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h2 className="mb-1 font-semibold text-xl">{excerpt.text}</h2>
                                            <p
                                                className="font-arabic text-gray-700 text-lg dark:text-gray-300"
                                                dir="rtl"
                                            >
                                                {excerpt.nass}
                                            </p>
                                        </div>
                                        <Link
                                            href={excerptUrl as any}
                                            className="p-2 text-gray-400 opacity-0 transition-opacity hover:text-blue-600 group-hover:opacity-100"
                                            title="Share / View Details"
                                        >
                                            <LinkIcon size={20} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <article
                                key={excerpt.id}
                                className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                {/* Arabic Text */}
                                <p
                                    className="mb-6 font-arabic text-2xl text-gray-900 leading-loose dark:text-gray-100"
                                    dir="rtl"
                                >
                                    {excerpt.nass}
                                </p>

                                {/* English Translation */}
                                <p className="mb-4 text-gray-700 text-lg leading-relaxed dark:text-gray-300">
                                    {excerpt.text}
                                </p>

                                {/* Metadata */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-gray-200 border-t pt-4 text-gray-500 text-sm dark:border-gray-700 dark:text-gray-400">
                                    <div className="flex gap-4">
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

                                    <Link
                                        href={excerptUrl as any}
                                        className="text-gray-400 hover:text-blue-600"
                                        title="Share / View Details"
                                    >
                                        <LinkIcon size={18} />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Navigation Footer */}
                <div className="mt-12 border-gray-200 border-t pt-6 dark:border-gray-700">
                    <Link
                        href={`/browse/${bookId}`}
                        className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                    >
                        ← Back to {book.title}
                    </Link>
                </div>
            </div>
        </main>
    );
}
