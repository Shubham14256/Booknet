"use client";

import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import { AuthControls } from "@/components/auth-controls";
import { bookCategories } from "@/lib/categories";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-zinc-100">
          <BookOpenText className="size-4.5 text-cyan-400" />
          <span className="text-base font-semibold tracking-tight">Booknet</span>
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-5 lg:flex">
          {bookCategories.map((category) => (
            <li key={category}>
              <Link
                href={`/books?category=${encodeURIComponent(category)}`}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <AuthControls />
          <Link
            href="/books"
            className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm font-medium text-cyan-300 transition-all hover:border-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-100"
          >
            Explore Catalog
          </Link>
          <CartDrawer />
        </div>
      </nav>
    </header>
  );
}
