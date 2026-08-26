"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Magic-link sign-in.
 *
 * No password field, because there is no password: nothing to store, leak, phish, or
 * rotate. Supabase mails a one-time link and `@supabase/ssr` puts the resulting session in
 * an HttpOnly cookie, so no token is ever readable from JavaScript.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "sending") return;
    setState("sending");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });

    // Always reports the same thing, whether or not that address is the owner. Saying
    // "unknown address" would turn this form into an oracle for which address is the one
    // that works, which is exactly what a stranger would want to learn from it.
    setState("sent");
  }

  if (state === "sent") {
    return (
      <p className="mt-8 border border-border p-5 text-sm leading-6 text-zinc-300">
        If that address can sign in, a link is on its way. It expires shortly, and it works
        once.
      </p>
    );
  }

  return (
    <form onSubmit={send} className="mt-8">
      <label
        htmlFor="email"
        className="block text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-3 min-h-11 w-full border border-input bg-black px-4 text-sm text-white transition-colors placeholder:text-zinc-500 focus:border-white focus:outline-none"
        placeholder="you@example.com"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center border border-white bg-white px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:border-zinc-300 hover:bg-zinc-300 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {state === "sending" ? "Sending" : "Send Link"}
      </button>
    </form>
  );
}
