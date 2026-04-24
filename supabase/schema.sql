create extension if not exists "pgcrypto";

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  author text not null,
  price numeric(10,2) not null check (price >= 0),
  category text not null check (
    category in (
      'Engineering',
      'AI',
      'System Design',
      'DSA',
      'Web Development',
      'Cloud & DevOps',
      'Productivity',
      'Career Growth'
    )
  ),
  image_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists books_title_idx on public.books using gin (to_tsvector('english', title));
create index if not exists books_description_idx on public.books using gin (to_tsvector('english', description));
create index if not exists books_category_idx on public.books (category);
