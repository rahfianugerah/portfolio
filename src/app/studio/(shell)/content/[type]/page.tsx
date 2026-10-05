"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { api, errorMessage, type StudioDocument } from "@/components/studio/api";
import { findContentType, type ContentType } from "@/components/studio/content-schema";
import { DocumentForm } from "@/components/studio/document-form";
import { Button, Notice, PageHeader, inputClass } from "@/components/studio/ui";

const UNORDERED = Number.MAX_SAFE_INTEGER;

function DocumentRows({
  contentType,
  documents,
  onEdit,
  onChanged,
  onError,
}: {
  contentType: ContentType;
  documents: StudioDocument[];
  onEdit: (document: StudioDocument) => void;
  onChanged: () => void;
  onError: (message: string) => void;
}) {
  async function change(work: Promise<void>) {
    onError("");
    try {
      await work;
    } catch (caught) {
      onError(errorMessage(caught));
    }
    onChanged();
  }

  function reorder(document: StudioDocument, typed: string) {
    const sortOrder = Number(typed);
    if (typed === "" || sortOrder === document.sortOrder) return;
    change(api(`/documents/${document.id}`, { method: "PUT", body: { data: document.data, sortOrder } }));
  }

  function remove(document: StudioDocument, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    change(api(`/documents/${document.id}`, { method: "DELETE" }));
  }

  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing here yet.</p>;
  }

  return (
    <ul className="divide-y divide-border border-b border-border">
      {documents.map((document) => {
        const title = contentType.title(document.data) || "Untitled";
        return (
          <li key={document.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
            <input
              // Keyed on the stored value so a reload resets what was typed.
              key={document.sortOrder}
              type="number"
              aria-label={`Order of ${title}`}
              defaultValue={document.sortOrder ?? ""}
              onBlur={(event) => reorder(document, event.target.value)}
              className={`${inputClass} w-20 font-mono`}
            />
            <span className="min-w-0 flex-1 basis-40 truncate text-sm">{title}</span>
            <Button onClick={() => onEdit(document)}>Edit</Button>
            <Button variant="quiet" onClick={() => remove(document, title)}>
              Delete
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function Documents({ contentType }: { contentType: ContentType }) {
  const [documents, setDocuments] = useState<StudioDocument[] | null>(null);
  const [editing, setEditing] = useState<StudioDocument | "new" | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    api<StudioDocument[]>(`/documents?type=${contentType.type}`)
      .then((loaded) =>
        setDocuments(loaded.sort((a, b) => (a.sortOrder ?? UNORDERED) - (b.sortOrder ?? UNORDERED))),
      )
      .catch((caught) => setError(errorMessage(caught)));
  }, [contentType.type, reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);
  const isSingleton = contentType.singleton === true;
  const isEditing = editing !== null || isSingleton;

  function afterSave() {
    setEditing(null);
    setNote("Saved.");
    reload();
  }

  return (
    <>
      <PageHeader
        title={contentType.label}
        detail={
          <Link href="/studio/content" className="underline-offset-4 hover:underline">
            All content
          </Link>
        }
      >
        {!isEditing && (
          <Button variant="solid" onClick={() => setEditing("new")}>
            New
          </Button>
        )}
      </PageHeader>
      <Notice>{error}</Notice>
      <Notice kind="note">{note}</Notice>
      {documents === null ? (
        !error && <p className="text-sm text-muted-foreground">Loading</p>
      ) : isSingleton ? (
        // Keyed on the row's id so the form picks the row up once it has been created.
        <DocumentForm
          key={documents[0]?.id ?? "new"}
          contentType={contentType}
          document={documents[0] ?? null}
          onSaved={afterSave}
        />
      ) : editing ? (
        <DocumentForm
          contentType={contentType}
          document={editing === "new" ? null : editing}
          onSaved={afterSave}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <DocumentRows
          contentType={contentType}
          documents={documents}
          onEdit={(document) => {
            setNote("");
            setEditing(document);
          }}
          onChanged={reload}
          onError={setError}
        />
      )}
    </>
  );
}

export default function ContentTypePage() {
  const { type } = useParams<{ type: string }>();
  const contentType = findContentType(type);

  if (!contentType) {
    return (
      <>
        <PageHeader title="Unknown content type" />
        <Link href="/studio/content" className="text-sm underline underline-offset-4">
          Back to all content
        </Link>
      </>
    );
  }
  return <Documents key={type} contentType={contentType} />;
}
