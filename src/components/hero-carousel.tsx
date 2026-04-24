"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Book } from "@/lib/types";

interface HeroCarouselProps {
  books: Book[];
}

export function HeroCarousel({ books }: HeroCarouselProps) {
  const slides = useMemo(() => books.slice(0, 5), [books]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const activeBook = slides[activeIndex];

  const goPrev = () =>
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((current) => (current + 1) % slides.length);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
      <div className="absolute inset-0">
        {slides.map((book, idx) => (
          <div
            key={book.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={book.image_url}
              alt={`${book.title} cover`}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/15 to-transparent" />
          </div>
        ))}
      </div>

      <div className="relative z-10 grid min-h-[430px] gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            <Sparkles className="size-3.5" />
            Premium reads, auto curated
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            Build smarter products with books that compound your edge.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-300">
            {activeBook.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/books?category=${encodeURIComponent(activeBook.category)}`}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
            >
              Explore {activeBook.category}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/books"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/40"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        <div className="flex items-end justify-end">
          <article className="w-full max-w-sm rounded-2xl border border-white/15 bg-zinc-950/65 p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{activeBook.category}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{activeBook.title}</h2>
            <p className="mt-1 text-sm text-zinc-300">{activeBook.author}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xl font-semibold text-white">
                ${activeBook.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="rounded-full border border-white/20 p-2 text-zinc-200 transition hover:border-white/40"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full border border-white/20 p-2 text-zinc-200 transition hover:border-white/40"
                  aria-label="Next slide"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex gap-1.5">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIndex ? "w-7 bg-cyan-300" : "w-3 bg-zinc-600"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
