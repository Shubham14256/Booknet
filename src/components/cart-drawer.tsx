"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { getCartCount, getCartTotal, useCartStore } from "@/lib/cart-store";

export function CartDrawer() {
  const {
    items,
    isOpen,
    openCart,
    closeCart,
    increment,
    decrement,
    remove,
    clear,
  } = useCartStore();

  const totalItems = getCartCount(items);
  const totalPrice = getCartTotal(items);

  return (
    <>
      <button
        type="button"
        onClick={openCart}
        className="relative inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/40"
      >
        <ShoppingBag className="size-4" />
        Cart
        {totalItems > 0 ? (
          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-zinc-950">
            {totalItems}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full border border-white/20 p-2 hover:border-white/40"
              >
                <X className="size-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-6 text-center text-zinc-400">
                Your cart is empty. Add a few books to begin.
              </div>
            ) : (
              <div className="flex h-[calc(100%-4rem)] flex-col">
                <div className="space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-zinc-900/70 p-3"
                    >
                      <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
                      <p className="text-xs text-zinc-400">{item.author}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/15 p-1">
                          <button
                            type="button"
                            onClick={() => decrement(item.id)}
                            className="rounded-full p-1 hover:bg-zinc-800"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="px-2 text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => increment(item.id)}
                            className="rounded-full p-1 hover:bg-zinc-800"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            className="text-zinc-500 hover:text-red-300"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Items</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={clear}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40"
                    >
                      Clear
                    </button>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="rounded-full bg-cyan-400 px-4 py-2 text-center text-sm font-semibold text-zinc-950 hover:bg-cyan-300"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      ) : null}
    </>
  );
}
