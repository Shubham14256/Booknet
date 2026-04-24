"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { useCartStore } from "@/lib/cart-store";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("pi");
  const clearCart = useCartStore((state) => state.clear);
  const closeCart = useCartStore((state) => state.closeCart);

  useEffect(() => {
    clearCart();
    closeCart();
  }, [clearCart, closeCart]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-emerald-300" />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Payment successful</h1>
          <p className="mt-3 text-zinc-200">
            Thank you for your purchase. Your DevReads order is confirmed.
          </p>
          {paymentIntentId ? (
            <p className="mt-3 text-xs text-zinc-300">Payment Intent: {paymentIntentId}</p>
          ) : null}
          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/books"
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300"
            >
              Continue shopping
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm hover:border-white/40"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
