"use client";

import { useEffect, useState } from "react";

import { ApiError, api, errorMessage, type FileListing, type StoredFile } from "./api";
import { Markdown } from "./markdown";
import { Button, Modal, Notice, Thumb, buttonClass, formatSize, formatWhen } from "./ui";

export const isFolder = (path: string) => path.endsWith("/");

export const baseName = (path: string) => path.replace(/\/$/, "").split("/").pop() ?? "";

export const parentOf = (path: string) =>
  path.slice(0, path.length - baseName(path).length - (isFolder(path) ? 1 : 0));

export const isImage = (file: StoredFile) => file.contentType.startsWith("image/");

export function typeLabel(file: StoredFile): string {
  if (file.contentType === "application/pdf") return "PDF";
  if (file.contentType === "text/markdown") return "Markdown";
  return file.name.includes(".") ? file.name.split(".").pop()!.toUpperCase() : "File";
}

interface ListingState {
  prefix: string;
  listing?: FileListing;
  error?: string;
  isUnconfigured?: boolean;
}

/** One folder's listing. Bump reloadKey to read it again; the old one stays until the new arrives. */
export function useListing(prefix: string, reloadKey = 0) {
  const [state, setState] = useState<ListingState | null>(null);

  useEffect(() => {
    let isCurrent = true;
    api<FileListing>(`/files?prefix=${encodeURIComponent(prefix)}`)
      .then((listing) => {
        if (isCurrent) setState({ prefix, listing });
      })
      .catch((caught) => {
        if (!isCurrent) return;
        const isUnconfigured = caught instanceof ApiError && caught.status === 503;
        setState({ prefix, error: errorMessage(caught), isUnconfigured });
      });
    return () => {
      isCurrent = false;
    };
  }, [prefix, reloadKey]);

  const current = state?.prefix === prefix ? state : null;
  return {
    isLoading: current === null,
    listing: current?.listing,
    error: current?.error ?? "",
    isUnconfigured: current?.isUnconfigured ?? false,
  };
}

/** The path as a row of folders, each one a way back up. */
export function PathCrumbs({
  prefix,
  onNavigate,
}: {
  prefix: string;
  onNavigate: (prefix: string) => void;
}) {
  const names = prefix.split("/").filter(Boolean);
  return (
    <nav aria-label="Folder path" className="flex min-w-0 flex-wrap items-center">
      <Button variant="quiet" className="px-1" onClick={() => onNavigate("")}>
        Files
      </Button>
      {names.map((name, index) => (
        <span key={index} className="flex items-center">
          <span aria-hidden className="text-muted-foreground">
            /
          </span>
          <Button
            variant="quiet"
            className="px-1 normal-case tracking-normal"
            aria-current={index === names.length - 1 ? "location" : undefined}
            onClick={() => onNavigate(names.slice(0, index + 1).join("/") + "/")}
          >
            {name}
          </Button>
        </span>
      ))}
    </nav>
  );
}

export function CopyUrlButton({ url }: { url: string }) {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
      }}
    >
      <span aria-live="polite">{isCopied ? "Copied" : "Copy URL"}</span>
    </Button>
  );
}

function MarkdownFile({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`The file could not be read (${response.status}).`);
        return response.text();
      })
      .then((body) => {
        if (isCurrent) setText(body);
      })
      .catch((caught) => {
        if (isCurrent) setError(errorMessage(caught));
      });
    return () => {
      isCurrent = false;
    };
  }, [url]);

  if (error) return <Notice>{error}</Notice>;
  if (text === null) return <p className="text-sm text-muted-foreground">Loading</p>;
  return <Markdown>{text}</Markdown>;
}

export function PreviewModal({ file, onClose }: { file: StoredFile; onClose: () => void }) {
  return (
    <Modal title={file.name} onClose={onClose} wide>
      <div className="space-y-4">
        {isImage(file) && <Thumb src={file.url} alt={file.name} className="mx-auto max-h-[60dvh]" />}
        {file.contentType === "text/markdown" && <MarkdownFile url={file.url} />}
        {file.contentType === "application/pdf" && (
          <p className="text-sm text-muted-foreground">A PDF opens in its own tab.</p>
        )}
        <p className="break-all border-t border-border pt-4 font-mono text-xs text-muted-foreground">
          {file.path} · {typeLabel(file)} · {formatSize(file.size)} · {formatWhen(file.updatedAt)}
        </p>
        <div className="flex flex-wrap gap-2">
          <CopyUrlButton url={file.url} />
          <a href={file.url} target="_blank" rel="noopener noreferrer" className={buttonClass()}>
            Open in a new tab
          </a>
        </div>
      </div>
    </Modal>
  );
}

/** Chooses a destination folder by walking the drive. */
export function MoveModal({
  moving,
  onMove,
  onClose,
}: {
  moving: string[];
  onMove: (destination: string) => void;
  onClose: () => void;
}) {
  const [prefix, setPrefix] = useState("");
  const { listing, isLoading, error } = useListing(prefix);
  // A folder cannot be moved into itself, so it is not offered as a place to go.
  const folders = (listing?.folders ?? []).filter((folder) => !moving.includes(folder));

  return (
    <Modal title={`Move ${moving.length === 1 ? baseName(moving[0]) : `${moving.length} items`}`} onClose={onClose}>
      <div className="space-y-4">
        <PathCrumbs prefix={prefix} onNavigate={setPrefix} />
        <Notice>{error}</Notice>
        <ul className="max-h-[40dvh] divide-y divide-border overflow-y-auto border-y border-border">
          {folders.map((folder) => (
            <li key={folder}>
              <button
                type="button"
                onClick={() => setPrefix(folder)}
                className="flex min-h-10 w-full items-center px-2 text-left text-sm hover:bg-muted focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-foreground"
              >
                {baseName(folder)}
              </button>
            </li>
          ))}
          {folders.length === 0 && (
            <li className="px-2 py-3 text-sm text-muted-foreground">
              {isLoading ? "Loading" : "No folders here."}
            </li>
          )}
        </ul>
        <Button variant="solid" onClick={() => onMove(prefix)}>
          Move here
        </Button>
      </div>
    </Modal>
  );
}
