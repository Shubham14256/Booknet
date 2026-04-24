export default function LoadingBooksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-10 w-72 animate-pulse rounded bg-zinc-800" />
        <div className="mb-8 h-16 animate-pulse rounded-2xl bg-zinc-900" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl border border-white/10 bg-zinc-900"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
