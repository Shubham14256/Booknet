"use client";

interface ErrorProps {
  reset: () => void;
}

export default function BooksError({ reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <h2 className="text-2xl font-semibold">Unable to load books</h2>
        <p className="mt-3 text-zinc-300">
          Something went wrong while fetching the catalog.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full border border-red-300/40 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
