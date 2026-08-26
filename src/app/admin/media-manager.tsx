"use client";

import { useCallback, useEffect, useState } from "react";

type MediaItem = {
  id: string;
  storage_path: string;
  visibility: "public" | "private";
  slug: string | null;
  original_filename: string;
  mime_type: string;
  stored_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: string;
  url: string | null;
};

const kb = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/media");
    if (res.ok) {
      const json = await res.json();
      setItems(json.items ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setMessage(null);

    try {
      const res = await fetch("/api/media", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setMessage(json.deduplicated ? "Already stored; reused the existing file." : "Uploaded.");
      (e.target as HTMLFormElement).reset();
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete ${name}? The file is removed from storage as well.`)) return;
    setBusy(true);
    await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
    setBusy(false);
  }

  return (
    <div className="mt-12">
      <form onSubmit={upload} className="border border-border p-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          Upload
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-zinc-400">
              File
            </span>
            <input
              type="file"
              name="file"
              required
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="w-full border border-input bg-black px-4 py-3 text-xs text-white file:mr-4 file:border-0 file:bg-white file:px-3 file:py-1 file:text-[10px] file:font-bold file:uppercase file:tracking-[0.18em] file:text-black"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-zinc-400">
              Visibility
            </span>
            <select
              name="visibility"
              defaultValue="public"
              className="min-h-11 w-full border border-input bg-black px-4 text-sm text-white focus:border-white focus:outline-none"
            >
              <option value="public">Public — images on the site</option>
              <option value="private">Private — documents, signed link</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-zinc-400">
              Slug (optional)
            </span>
            <input
              name="slug"
              placeholder="resume"
              className="min-h-11 w-full border border-input bg-black px-4 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-zinc-400">
              Alt text
            </span>
            <input
              name="alt"
              placeholder="Describe the image"
              className="min-h-11 w-full border border-input bg-black px-4 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex min-h-11 items-center border border-white bg-white px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-zinc-300 disabled:opacity-50"
        >
          {busy ? "Working" : "Upload"}
        </button>

        {message && <p className="mt-4 text-xs text-zinc-300">{message}</p>}
      </form>

      <h2 className="mt-12 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
        Library {items.length > 0 && `— ${items.length}`}
      </h2>

      {loading ? (
        <p className="mt-6 text-sm text-zinc-400">Loading.</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-400">Nothing uploaded yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-4 py-4">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-white">
                  {item.original_filename}
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                  {item.visibility}
                  {item.slug ? ` / ${item.slug}` : ""} / {item.mime_type} /{" "}
                  {kb(item.stored_bytes)}
                  {item.width ? ` / ${item.width}x${item.height}` : ""}
                </span>
              </span>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300 hover:text-white"
                >
                  Open
                </a>
              )}
              <button
                type="button"
                onClick={() => remove(item.id, item.original_filename)}
                disabled={busy}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300 hover:text-white disabled:opacity-40"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
