"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { NavBar } from "@/components/nav-bar";
import { CheckoutForm } from "@/components/checkout-form";
import { getCartCount, getCartTotal, useCartStore } from "@/lib/cart-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const authConfigMissing =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const [isCheckingAuth, setIsCheckingAuth] = useState(!authConfigMissing);
  const items = useCartStore((state) => state.items);
  const totalItems = useMemo(() => getCartCount(items), [items]);
  const totalPrice = useMemo(() => getCartTotal(items), [items]);

  useEffect(() => {
    if (authConfigMissing) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth?next=/checkout");
      } else {
        setIsAuthed(true);
      }
      setIsCheckingAuth(false);
    });
  }, [authConfigMissing, router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <NavBar />
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="h-8 w-40 animate-pulse rounded bg-zinc-800" />
        </main>
      </div>
    );
  }

  if (!isAuthed) {
    if (authConfigMissing) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <NavBar />
          <main className="mx-auto max-w-3xl px-6 py-16">
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6 text-amber-100">
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code> to
              protect checkout with authentication.
            </div>
          </main>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-3 text-zinc-400">
          Secure sandbox checkout powered by Stripe test mode.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            {items.length === 0 ? (
              <div className="space-y-4">
                <p className="text-zinc-400">Your cart is empty.</p>
                <Link
                  href="/books"
                  className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40"
                >
                  Browse books
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                  <span className="text-zinc-400">Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </section>

          <section>
            {!stripePromise ? (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-amber-100">
                Add <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to <code>.env.local</code>{" "}
                to enable Stripe checkout.
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 text-zinc-300">
                Add items to your cart before starting payment.
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
