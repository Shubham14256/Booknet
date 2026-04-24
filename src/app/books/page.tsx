import { BookCard } from "@/components/book-card";
import { NavBar } from "@/components/nav-bar";
import { SearchFilters } from "@/components/search-filters";
import { getBooks } from "@/lib/books";

interface BooksPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { q, category } = await searchParams;
  const books = await getBooks({ query: q, category });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Catalog</p>
          <h1 className="text-4xl font-semibold tracking-tight">Explore DevReads</h1>
          <p className="max-w-2xl text-zinc-400">
            Search and filter premium engineering books built for practitioners.
          </p>
        </div>

        <SearchFilters />

        {books.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-10 text-center text-zinc-400">
            No books found. Try a different query or category.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
