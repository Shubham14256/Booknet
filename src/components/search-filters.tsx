"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { allCategoryOptions } from "@/lib/categories";

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const category = searchParams.get("category") ?? "All";

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  function updateCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search books by title, author, or topic..."
          className="w-full rounded-xl border border-white/10 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/60 focus:outline-none"
        />
      </div>

      <select
        value={category}
        onChange={(event) => updateCategory(event.target.value)}
        className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/60 focus:outline-none"
      >
        {allCategoryOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </section>
  );
}
