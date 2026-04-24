"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthControls() {
  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(Boolean(data.session));
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, [hasSupabaseConfig]);

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setIsAuthed(false);
  }

  if (isLoading) {
    return <div className="h-9 w-20 animate-pulse rounded-full bg-zinc-800" />;
  }

  if (!isAuthed) {
    return (
      <Link
        href="/auth"
        className="rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/40"
      >
        Login
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/40"
    >
      <LogOut className="size-4" />
      Logout
    </button>
  );
}
