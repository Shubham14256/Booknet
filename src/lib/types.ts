import { bookCategories } from "@/lib/categories";

export type BookCategory = (typeof bookCategories)[number];

export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  category: BookCategory;
  image_url: string;
}
