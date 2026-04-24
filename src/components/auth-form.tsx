"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  captcha: z.literal(true, {
    errorMap: () => ({ message: "Please verify CAPTCHA before continuing." }),
  }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("next") ?? "/checkout";

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      captcha: false,
    },
  });

  async function onSubmit(values: AuthFormValues) {
    const supabase = getSupabaseBrowserClient();
    setServerError(null);
    setSuccessMessage(null);

    if (!supabase) {
      setServerError(
        "Supabase environment variables are missing. Add them to .env.local first."
      );
      return;
    }

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setServerError(error.message);
        return;
      }
      setSuccessMessage("Account created. You can now log in.");
      setMode("login");
      form.reset({ email: values.email, password: "", captcha: false });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }

    router.replace(redirectPath);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-xl">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-zinc-800 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "login" ? "bg-zinc-100 text-zinc-900" : "text-zinc-300"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "register" ? "bg-zinc-100 text-zinc-900" : "text-zinc-300"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/60 focus:outline-none"
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-300">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-zinc-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/60 focus:outline-none"
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-red-300">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
          <input type="checkbox" {...form.register("captcha")} className="size-4" />
          I am not a robot (mock CAPTCHA)
        </label>
        {form.formState.errors.captcha ? (
          <p className="text-xs text-red-300">{form.formState.errors.captcha.message}</p>
        ) : null}

        {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}
        {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {form.formState.isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
