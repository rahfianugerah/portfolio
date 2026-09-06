"use client";

import { useState } from "react";

type Result = { ok: true; message: string } | { ok: false; message: string };

/**
 * Runs the one-time copy of the projects and certificates out of the resume data and into
 * Sanity. It is safe to press twice: the route writes with createIfNotExists, so a second
 * run adds nothing and cannot overwrite an edit made in the studio.
 */
export function SeedContentButton() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function run() {
    setBusy(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/seed-content", { method: "POST" });
      const body = await response.json();

      if (!response.ok) {
        setResult({ ok: false, message: body.error ?? "Migration failed." });
      } else {
        setResult({
          ok: true,
          message:
            `Sent ${body.projects} projects, ${body.certificates} certificates, ` +
            `${body.roles} roles, ${body.education} education entries and ` +
            `${body.achievements} achievements. Text only: upload the images in the studio. ` +
            `Anything already in Sanity was left alone.`,
        });
      }
    } catch {
      setResult({ ok: false, message: "Could not reach the migration route." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 rounded-lg border border-zinc-800 p-5">
      <h2 className="font-bebas text-xl text-white">Move the resume content to Sanity</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
        Copies the projects, certificates, roles, education and achievements out of the
        repository and into the studio, once, so they can be edited without a deploy. Text
        only: no image comes across, because the images are uploaded in the studio. Needs{" "}
        <code className="text-white">SANITY_API_WRITE_TOKEN</code>. Running it again is
        harmless and will not overwrite anything you have edited.
      </p>

      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="mt-4 inline-flex h-9 items-center rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
      >
        {busy ? "Copying..." : "Copy to Sanity"}
      </button>

      {result && (
        <p
          className={`mt-3 text-sm ${result.ok ? "text-emerald-400" : "text-red-400"}`}
          role="status"
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
