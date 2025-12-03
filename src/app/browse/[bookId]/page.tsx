import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findHeadingById, getTopLevelHeadings, loadBookHeadings, loadBooks } from '@/lib/data-loader';

type Params = Promise<{ bookId: string }>;

export async function generateStaticParams() {
    const books = await loadBooks();
    return books.map((book) => ({ bookId: book.id.toString() }));
}

export async function generateMetadata({ params }: { params: Params }) {
    const { bookId } = await params;
    const books = await loadBooks();
    const book = books.find((b) => b.id === Number(bookId));

    if (!book) {
        return { title: 'Book Not Found' };
    }

    return { description: `Browse chapters of ${book.title}`, title: `${book.title} - Chapters` };
}

export default async function BookHeadingsPage({ params }: { params: Params }) {
    const { bookId } = await params;
    const books = await loadBooks();
    const book = books.find((b) => b.id === Number(bookId));

    if (!book) {
        notFound();
    }

    const allHeadings = await loadBookHeadings(book.id);
    const topLevelHeadings = getTopLevelHeadings(allHeadings);

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/browse" className="mb-4 inline-block text-blue-600 hover:underline dark:text-blue-400">
                        ← Back to Books
                    </Link>
                    <h1 className="mb-2 font-bold text-4xl">{book.title}</h1>
                    <p className="font-arabic text-2xl text-gray-600 dark:text-gray-400" dir="rtl">
                        {book.unwan}
                    </p>
                </div>

                {/* Headings List */}
                <div className="space-y-3">
                    {topLevelHeadings.map((heading) => (
                        <Link
                            key={heading.id}
                            href={`/browse/${bookId}/${heading.id}`}
                            className="block rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="mb-1 font-medium text-lg">{heading.text}</p>
                                    <p className="font-arabic text-gray-700 text-xl dark:text-gray-300" dir="rtl">
                                        {heading.nass}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 text-gray-500 text-sm dark:text-gray-400">
                                    {'surah' in heading && <span>Surah {heading.surah}</span>}
                                    {heading.pageRange && (
                                        <span className="block">
                                            pp. {heading.pageRange.start}–{heading.pageRange.end}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
