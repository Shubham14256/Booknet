"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getCartTotal, useCartStore } from "@/lib/cart-store";

const cardElementStyles = {
  style: {
    base: {
      color: "#f4f4f5",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "16px",
      "::placeholder": { color: "#71717a" },
    },
    invalid: { color: "#fca5a5" },
  },
};

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items } = useCartStore();
  const total = useMemo(() => getCartTotal(items), [items]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet. Please try again in a moment.");
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      const data: { clientSecret?: string; error?: string } = await response.json();
      if (!response.ok || !data.clientSecret) {
        throw new Error(data.error ?? "Unable to create payment intent.");
      }

      const card = elements.getElement(CardElement);
      if (!card) {
        throw new Error("Card input is unavailable.");
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        throw new Error(result.error.message ?? "Payment failed.");
      }

      if (result.paymentIntent?.status === "succeeded") {
        router.push(`/checkout/success?pi=${result.paymentIntent.id}`);
        return;
      }

      throw new Error("Payment was not completed. Please try again.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-5"
    >
      <h2 className="text-lg font-semibold">Stripe Test Card</h2>
      <p className="text-sm text-zinc-400">
        Use test card <span className="font-medium text-zinc-200">4242 4242 4242 4242</span>,
        any future date, any CVC.
      </p>
      <div className="rounded-xl border border-white/10 bg-zinc-950 p-3">
        <CardElement options={cardElementStyles} />
      </div>
      {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={!stripe || isSubmitting || items.length === 0}
        className="w-full rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}
