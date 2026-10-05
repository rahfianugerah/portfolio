"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api, errorMessage } from "@/components/studio/api";
import { Button, Field, Notice, inputClass, labelClass } from "@/components/studio/ui";

const MIN_PASSWORD_LENGTH = 12;

function SignInForm({ note }: { note: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsBusy(true);
    setError("");
    try {
      await api("/login", { body: { email: form.get("email"), password: form.get("password") } });
      router.replace("/studio");
    } catch (caught) {
      setError(errorMessage(caught));
      setIsBusy(false);
    }
  }

  return (
    <form onSubmit={signIn} className="space-y-5">
      <Notice kind="note">{note}</Notice>
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Password">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <Notice>{error}</Notice>
      <Button type="submit" variant="solid" disabled={isBusy} className="w-full">
        {isBusy ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}

function ResetForm({ onDone }: { onDone: () => void }) {
  const [sentMessage, setSentMessage] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function sendCode() {
    setIsBusy(true);
    setError("");
    try {
      const reply = await api<{ message: string }>("/password/otp", { method: "POST" });
      setSentMessage(reply.message);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsBusy(false);
    }
  }

  async function reset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword"));
    if (newPassword !== form.get("repeatPassword")) {
      setError("The two passwords do not match.");
      return;
    }
    setIsBusy(true);
    setError("");
    try {
      await api("/password/reset", { body: { code: form.get("code"), newPassword } });
      onDone();
    } catch (caught) {
      setError(errorMessage(caught));
      setIsBusy(false);
    }
  }

  return (
    <form onSubmit={reset} className="space-y-5">
      <p className="text-sm text-muted-foreground">
        A six-digit code is sent to the owner&apos;s address. Enter it with a new password. This is
        also how the password is set the first time.
      </p>
      <Button onClick={sendCode} disabled={isBusy} className="w-full">
        Send code
      </Button>
      <Notice kind="note">{sentMessage}</Notice>
      <Field label="Code">
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          className={`${inputClass} font-mono tracking-[0.4em]`}
        />
      </Field>
      <Field label="New password" help={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <Field label="New password, again">
        <input
          name="repeatPassword"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </Field>
      <Notice>{error}</Notice>
      <Button type="submit" variant="solid" disabled={isBusy} className="w-full">
        Set password
      </Button>
    </form>
  );
}

export default function LoginPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [note, setNote] = useState("");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-8 px-4 py-12">
      <header className="border-b border-border pb-5">
        <p className={labelClass}>Studio</p>
        <h1 className="mt-2 text-xl font-medium tracking-tight">
          {isResetting ? "Set a password" : "Sign in"}
        </h1>
      </header>

      {isResetting ? (
        <ResetForm
          onDone={() => {
            setNote("The password is set. Sign in with it.");
            setIsResetting(false);
          }}
        />
      ) : (
        <SignInForm note={note} />
      )}

      <Button variant="quiet" onClick={() => setIsResetting(!isResetting)} className="self-start px-0">
        {isResetting ? "Back to sign in" : "Forgot password"}
      </Button>
    </main>
  );
}
