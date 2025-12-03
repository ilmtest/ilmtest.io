import Link from 'next/link';
import { loadBooks } from '@/lib/data-loader';

export const metadata = {
    description: 'Browse Islamic texts including Quran and Hadith collections',
    title: 'Browse Books',
};

export default async function BrowsePage() {
    const books = await loadBooks();

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 font-bold text-4xl">Browse Books</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    {books.map((book) => (
                        <Link
                            key={book.id}
                            href={`/browse/${book.id}`}
                            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                        >
                            <h2 className="mb-2 font-semibold text-2xl">{book.title}</h2>
                            <p className="mb-3 font-arabic text-gray-600 text-xl dark:text-gray-400" dir="rtl">
                                {book.unwan}
                            </p>
                            {book.author && (
                                <p className="text-gray-500 text-sm dark:text-gray-400">by {book.author}</p>
                            )}
                            <span className="mt-4 inline-block font-medium text-blue-600 text-sm dark:text-blue-400">
                                Browse →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
