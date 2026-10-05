"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { api, errorMessage, type ParsedPost, type Post } from "./api";
import { FilePickerModal } from "./file-browser";
import { Markdown } from "./markdown";
import { Button, Field, Notice, PageHeader, Thumb, inputClass, labelClass } from "./ui";

interface Draft {
  title: string;
  slug: string;
  summary: string;
  tags: string;
  coverUrl: string;
  bodyMd: string;
}

const EMPTY_DRAFT: Draft = { title: "", slug: "", summary: "", tags: "", coverUrl: "", bodyMd: "" };

function toDraft(post: Post): Draft {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary ?? "",
    tags: post.tags.join(", "),
    coverUrl: post.coverUrl ?? "",
    bodyMd: post.bodyMd ?? "",
  };
}

function toBody(draft: Draft, published: boolean) {
  return {
    title: draft.title.trim(),
    // Left out, the backend derives the slug from the title.
    slug: draft.slug.trim() || undefined,
    summary: draft.summary.trim(),
    coverUrl: draft.coverUrl.trim() || null,
    tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    bodyMd: draft.bodyMd,
    published,
  };
}

function useUnsavedWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    const warnOnUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    // The App Router cannot veto a navigation, so a link click is stopped before Next sees it.
    // ponytail: the browser's Back button inside the app is not caught; add a history guard if it bites.
    const confirmLink = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link || link.getAttribute("target") === "_blank") return;
      if (window.confirm("Leave without saving? The changes will be lost.")) return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("beforeunload", warnOnUnload);
    document.addEventListener("click", confirmLink, true);
    return () => {
      window.removeEventListener("beforeunload", warnOnUnload);
      document.removeEventListener("click", confirmLink, true);
    };
  }, [isDirty]);
}

/** The editor for one post. A null id is a post that does not exist yet. */
export function PostEditor({ id }: { id: string | null }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(id ? null : EMPTY_DRAFT);
  const [saved, setSaved] = useState<Draft>(EMPTY_DRAFT);
  const [isPublished, setIsPublished] = useState(false);
  const [picking, setPicking] = useState<"cover" | "body" | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const body = useRef<HTMLTextAreaElement>(null);
  const markdownInput = useRef<HTMLInputElement>(null);

  const isDirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedWarning(isDirty);

  useEffect(() => {
    if (!id) return;
    api<Post>(`/posts/${id}`)
      .then((post) => {
        setDraft(toDraft(post));
        setSaved(toDraft(post));
        setIsPublished(post.published);
      })
      .catch((caught) => setError(errorMessage(caught)));
  }, [id]);

  if (draft === null) {
    return error ? <Notice>{error}</Notice> : <p className="text-sm text-muted-foreground">Loading</p>;
  }

  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });

  async function run(work: () => Promise<void>) {
    setIsBusy(true);
    setError("");
    setNote("");
    try {
      await work();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsBusy(false);
    }
  }

  function save(current: Draft, published: boolean) {
    if (!current.title.trim()) {
      setError("A post needs a title.");
      return;
    }
    return run(async () => {
      const request = toBody(current, published);
      const post = id
        ? await api<Post | undefined>(`/posts/${id}`, { method: "PUT", body: request })
        : await api<Post>("/posts", { body: request });
      const next = post ? toDraft(post) : current;
      setDraft(next);
      setSaved(next);
      setIsPublished(post?.published ?? published);
      setNote(published ? "Saved and published." : "Saved as a draft.");
      if (!id && post) router.replace(`/studio/posts/${post.id}`);
    });
  }

  function remove() {
    if (!id || !window.confirm("Delete this post? This cannot be undone.")) return;
    return run(async () => {
      await api(`/posts/${id}`, { method: "DELETE" });
      router.push("/studio/posts");
    });
  }

  function importMarkdown(current: Draft, file: File | undefined) {
    if (!file) return;
    if (!/\.(md|markdown)$/i.test(file.name)) {
      setError("Only a .md file can fill the form.");
      return;
    }
    return run(async () => {
      const parsed = await api<ParsedPost>("/posts/parse", { body: { markdown: await file.text() } });
      setDraft({
        ...current,
        title: parsed.title || current.title,
        slug: parsed.slug || current.slug,
        summary: parsed.summary || current.summary,
        tags: parsed.tags?.length ? parsed.tags.join(", ") : current.tags,
        bodyMd: parsed.bodyMd,
      });
      setNote(`Filled from ${file.name}. Nothing is saved yet.`);
    });
  }

  function pick(current: Draft, url: string) {
    if (picking === "cover") {
      set({ coverUrl: url });
    } else {
      const at = body.current?.selectionStart ?? current.bodyMd.length;
      const alt = decodeURIComponent(url.split("/").pop() ?? "").replace(/\.[^.]+$/, "");
      set({ bodyMd: `${current.bodyMd.slice(0, at)}![${alt}](${url})${current.bodyMd.slice(at)}` });
    }
    setPicking(null);
  }

  return (
    <div
      className="space-y-6"
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("Files")) event.preventDefault();
      }}
      onDrop={(event) => {
        // Text dragged within the textarea is the browser's to handle.
        if (!event.dataTransfer.types.includes("Files")) return;
        event.preventDefault();
        importMarkdown(draft, event.dataTransfer.files[0]);
      }}
    >
      <PageHeader
        title={id ? "Edit post" : "New post"}
        detail={
          <span className={labelClass}>
            {isPublished ? "Published" : "Draft"}
            {isDirty && " · Unsaved changes"}
          </span>
        }
      >
        {id && (
          <Button variant="quiet" disabled={isBusy} onClick={remove}>
            Delete
          </Button>
        )}
        <Button disabled={isBusy} onClick={() => save(draft, isPublished)}>
          {isPublished ? "Save" : "Save draft"}
        </Button>
        <Button variant="solid" disabled={isBusy} onClick={() => save(draft, !isPublished)}>
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
      </PageHeader>

      <Notice>{error}</Notice>
      <Notice kind="note">{note}</Notice>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title">
          <input className={inputClass} value={draft.title} onChange={(event) => set({ title: event.target.value })} />
        </Field>
        <Field label="Slug" help="Left empty, it is made from the title.">
          <input
            className={`${inputClass} font-mono`}
            value={draft.slug}
            onChange={(event) => set({ slug: event.target.value })}
          />
        </Field>
        <Field label="Summary" className="md:col-span-2">
          <textarea
            rows={2}
            className={inputClass}
            value={draft.summary}
            onChange={(event) => set({ summary: event.target.value })}
          />
        </Field>
        <Field label="Tags" help="Separated by commas.">
          <input className={inputClass} value={draft.tags} onChange={(event) => set({ tags: event.target.value })} />
        </Field>
        <div>
          <Field label="Cover image" help="Choose from Files, or paste an address.">
            <input
              type="url"
              className={inputClass}
              value={draft.coverUrl}
              onChange={(event) => set({ coverUrl: event.target.value })}
            />
          </Field>
          <div className="mt-2 flex items-center gap-3">
            <Button onClick={() => setPicking("cover")}>Choose</Button>
            {draft.coverUrl && <Thumb src={draft.coverUrl} alt="Cover preview" className="h-10 w-16 border border-border" />}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
        <Button onClick={() => setPicking("body")}>Insert image</Button>
        <Button disabled={isBusy} onClick={() => markdownInput.current?.click()}>
          Import .md
        </Button>
        <input
          ref={markdownInput}
          type="file"
          hidden
          accept=".md,.markdown,text/markdown"
          aria-label="Markdown file to import"
          onChange={(event) => {
            importMarkdown(draft, event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <span className="text-xs text-muted-foreground">Or drop a .md file anywhere on this page.</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Markdown">
          <textarea
            ref={body}
            spellCheck
            className={`${inputClass} min-h-[70dvh] resize-y font-mono leading-relaxed`}
            value={draft.bodyMd}
            onChange={(event) => set({ bodyMd: event.target.value })}
          />
        </Field>
        <section aria-label="Preview" className="min-w-0">
          <h2 className={`${labelClass} mb-2`}>Preview</h2>
          <div className="min-h-40 border border-border p-4 lg:min-h-[70dvh]">
            <Markdown>{draft.bodyMd}</Markdown>
          </div>
        </section>
      </div>

      {picking && (
        <FilePickerModal accept="image" onClose={() => setPicking(null)} onPick={(url) => pick(draft, url)} />
      )}
    </div>
  );
}
