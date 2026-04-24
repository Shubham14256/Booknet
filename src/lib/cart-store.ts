"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Book } from "@/lib/types";

export interface CartItem extends Book {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (book: Book) => void;
  increment: (bookId: string) => void;
  decrement: (bookId: string) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addToCart: (book) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === book.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isOpen: true,
            };
          }

          return { items: [...state.items, { ...book, quantity: 1 }], isOpen: true };
        }),
      increment: (bookId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decrement: (bookId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),
      remove: (bookId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== bookId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "devreads-cart",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export const getCartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);
