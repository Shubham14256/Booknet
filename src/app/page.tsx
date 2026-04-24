import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { HeroCarousel } from "@/components/hero-carousel";
import { NavBar } from "@/components/nav-bar";
import { mockBooks } from "@/lib/mock-books";

export default function Home() {
  const featuredBooks = mockBooks.slice(0, 12);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-12">
        <HeroCarousel books={mockBooks} />

        <section className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Featured Picks</h2>
            <Link href="/books" className="text-sm text-cyan-300 hover:text-cyan-200">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto pb-3">
            <div className="flex min-w-max gap-5">
              {featuredBooks.map((book) => (
                <div key={book.id} className="w-[290px] shrink-0">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            Scroll right to explore more books directly on home page.
          </p>
        </section>
      </main>
    </div>
  );
}
