import { mockBooks } from "@/lib/mock-books";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Book, BookCategory } from "@/lib/types";

interface BooksFilters {
  query?: string;
  category?: string;
}

function applyFallbackFilters(books: Book[], { query, category }: BooksFilters) {
  const normalizedQuery = query?.trim().toLowerCase();

  return books.filter((book) => {
    const matchesQuery =
      !normalizedQuery ||
      book.title.toLowerCase().includes(normalizedQuery) ||
      book.description.toLowerCase().includes(normalizedQuery) ||
      book.author.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      !category || category === "All" || book.category === category;

    return matchesQuery && matchesCategory;
  });
}

export async function getBooks(filters: BooksFilters = {}): Promise<Book[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return applyFallbackFilters(mockBooks, filters);
  }

  let query = supabase
    .from("books")
    .select("id, title, description, author, price, category, image_url")
    .order("title", { ascending: true });

  if (filters.query?.trim()) {
    const q = filters.query.trim();
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,author.ilike.%${q}%`);
  }

  if (filters.category && filters.category !== "All") {
    query = query.eq("category", filters.category as BookCategory);
  }

  const { data, error } = await query;

  if (error || !data) {
    return applyFallbackFilters(mockBooks, filters);
  }

  return data as Book[];
}
