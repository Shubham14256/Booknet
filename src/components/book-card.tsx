"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/40">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={book.image_url}
          alt={`${book.title} book cover`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            {book.category}
          </p>
          <h3 className="line-clamp-2 text-lg font-semibold text-zinc-100">
            {book.title}
          </h3>
          <p className="text-sm text-zinc-400">{book.author}</p>
          <p className="line-clamp-2 text-sm text-zinc-300">{book.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">${book.price.toFixed(2)}</span>
          <button
            type="button"
            onClick={() => addToCart(book)}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/10"
          >
            <ShoppingCart className="size-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
