"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { api, errorMessage, type StoredFile } from "./api";
import {
  CopyUrlButton,
  MoveModal,
  PathCrumbs,
  PreviewModal,
  baseName,
  isFolder,
  isImage,
  parentOf,
  typeLabel,
  useListing,
} from "./file-parts";
import { Button, Modal, NameModal, Notice, Thumb, formatSize, formatWhen, labelClass } from "./ui";
import { UPLOAD_ACCEPT, uploadFile } from "./upload";

/** Marks a drag that started on an item here, as opposed to files arriving from the desktop. */
const DRAG_TYPE = "application/x-studio-paths";

interface Entry {
  path: string;
  name: string;
  file?: StoredFile;
}

interface Upload {
  name: string;
  fraction: number;
  error: string;
}

type Dialog =
  | { kind: "folder" }
  | { kind: "rename"; path: string }
  | { kind: "move"; paths: string[] }
  | { kind: "preview"; file: StoredFile }
  | null;

export type FileKind = "image" | "pdf";

interface FileBrowserProps {
  /** "pick" hands the chosen file's public URL to onPick instead of previewing it. */
  mode?: "manage" | "pick";
  /** In pick mode, the only kind of file worth showing. */
  accept?: FileKind;
  onPick?: (url: string) => void;
}

interface ViewProps {
  entries: Entry[];
  selected: string[];
  canManage: boolean;
  onToggle: (path: string) => void;
  onOpen: (entry: Entry) => void;
  dragProps: (entry: Entry) => React.HTMLAttributes<HTMLElement>;
}

const openClass =
  "text-left hover:bg-muted focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-foreground";

function matchesKind(file: StoredFile, accept?: FileKind): boolean {
  if (accept === "image") return isImage(file);
  if (accept === "pdf") return file.contentType === "application/pdf";
  return true;
}

function SelectBox({ entry, selected, onToggle }: { entry: Entry } & Pick<ViewProps, "selected" | "onToggle">) {
  return (
    <label className="flex size-10 shrink-0 cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        aria-label={`Select ${entry.name}`}
        checked={selected.includes(entry.path)}
        onChange={() => onToggle(entry.path)}
        className="size-4 accent-white"
      />
    </label>
  );
}

function GridView({ entries, selected, canManage, onToggle, onOpen, dragProps }: ViewProps) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {entries.map((entry) => (
        <li
          key={entry.path}
          {...dragProps(entry)}
          className={cn("relative border-b border-r border-border", selected.includes(entry.path) && "bg-muted")}
        >
          {canManage && (
            <div className="absolute left-0 top-0 z-[1] bg-background">
              <SelectBox entry={entry} selected={selected} onToggle={onToggle} />
            </div>
          )}
          <button type="button" onClick={() => onOpen(entry)} className={cn(openClass, "block w-full")}>
            <span className="flex aspect-square items-center justify-center overflow-hidden p-3">
              {entry.file && isImage(entry.file) ? (
                <Thumb src={entry.file.url} alt="" className="size-full" />
              ) : (
                <span className={labelClass}>{entry.file ? typeLabel(entry.file) : "Folder"}</span>
              )}
            </span>
            <span className="block truncate border-t border-border px-3 py-2 text-sm">{entry.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ListView({ entries, selected, canManage, onToggle, onOpen, dragProps }: ViewProps) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {entries.map((entry) => (
        <li
          key={entry.path}
          {...dragProps(entry)}
          className={cn("flex items-center", selected.includes(entry.path) && "bg-muted")}
        >
          {canManage && <SelectBox entry={entry} selected={selected} onToggle={onToggle} />}
          <button
            type="button"
            onClick={() => onOpen(entry)}
            className={cn(openClass, "grid min-h-10 min-w-0 flex-1 grid-cols-[1fr_auto] items-center gap-x-4 px-2 py-2 text-sm sm:grid-cols-[1fr_6rem_5rem_7rem]")}
          >
            <span className="truncate">{entry.name}</span>
            <span className={labelClass}>{entry.file ? typeLabel(entry.file) : "Folder"}</span>
            <span className="hidden text-muted-foreground sm:block">
              {entry.file ? formatSize(entry.file.size) : ""}
            </span>
            <span className="hidden text-muted-foreground sm:block">{formatWhen(entry.file?.updatedAt)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function UploadList({ uploads, onDismiss }: { uploads: Upload[]; onDismiss?: () => void }) {
  return (
    <section aria-label="Uploads" className="border border-border">
      <ul className="divide-y divide-border">
        {uploads.map((upload, index) => (
          <li key={index} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 px-3 py-2 text-sm">
            <span className="truncate">{upload.name}</span>
            <span className={labelClass}>
              {upload.error ? "Failed" : upload.fraction === 1 ? "Done" : `${Math.round(upload.fraction * 100)}%`}
            </span>
            <div
              role="progressbar"
              aria-label={`Uploading ${upload.name}`}
              aria-valuenow={Math.round(upload.fraction * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="col-span-2 h-px bg-border"
            >
              <div className="h-px bg-foreground" style={{ width: `${upload.fraction * 100}%` }} />
            </div>
            {upload.error && <span className="col-span-2 text-xs text-muted-foreground">{upload.error}</span>}
          </li>
        ))}
      </ul>
      {onDismiss && (
        <Button variant="quiet" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </section>
  );
}

export function FileBrowser({ mode = "manage", accept, onPick }: FileBrowserProps) {
  const canManage = mode === "manage";
  const [prefix, setPrefix] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isGrid, setIsGrid] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const { listing, isLoading, error: listingError, isUnconfigured } = useListing(prefix, reloadKey);

  const entries: Entry[] = [
    ...(listing?.folders ?? []).map((path) => ({ path, name: baseName(path) })),
    ...(listing?.files ?? [])
      .filter((file) => matchesKind(file, accept))
      .map((file) => ({ path: file.path, name: file.name, file })),
  ];
  const onlySelected = selected.length === 1 ? entries.find((entry) => entry.path === selected[0]) : undefined;

  function navigate(next: string) {
    setPrefix(next);
    setSelected([]);
    setError("");
  }

  /** Runs a change, shows what the API said if it failed, and reads the folder again either way. */
  async function act(work: () => Promise<void>) {
    setError("");
    setDialog(null);
    try {
      await work();
    } catch (caught) {
      setError(errorMessage(caught));
    }
    setSelected([]);
    setReloadKey((key) => key + 1);
  }

  function move(paths: string[], destination: string) {
    return act(async () => {
      for (const from of paths) {
        const to = destination + baseName(from) + (isFolder(from) ? "/" : "");
        const isIntoItself = isFolder(from) && destination.startsWith(from);
        if (to !== from && !isIntoItself) await api("/files/move", { body: { from, to } });
      }
    });
  }

  function rename(path: string, name: string) {
    const to = parentOf(path) + name + (isFolder(path) ? "/" : "");
    return act(() => api("/files/move", { body: { from: path, to } }));
  }

  function remove(paths: string[]) {
    const what = paths.length === 1 ? baseName(paths[0]) : `${paths.length} items`;
    if (!window.confirm(`Delete ${what}? A folder goes with everything under it.`)) return;
    return act(async () => {
      for (const path of paths) {
        await api(`/files?path=${encodeURIComponent(path)}`, { method: "DELETE" });
      }
    });
  }

  async function upload(files: File[]) {
    if (isUploading || files.length === 0) return;
    setIsUploading(true);
    setUploads(files.map((file) => ({ name: file.name, fraction: 0, error: "" })));
    for (const [index, file] of files.entries()) {
      const update = (patch: Partial<Upload>) =>
        setUploads((current) => current.map((item, at) => (at === index ? { ...item, ...patch } : item)));
      try {
        await uploadFile(file, prefix + file.name, (fraction) => update({ fraction }));
        update({ fraction: 1 });
      } catch (caught) {
        update({ error: errorMessage(caught) });
      }
    }
    setIsUploading(false);
    setReloadKey((key) => key + 1);
  }

  function open(entry: Entry) {
    if (!entry.file) navigate(entry.path);
    else if (canManage) setDialog({ kind: "preview", file: entry.file });
    else onPick?.(entry.file.url);
  }

  function toggle(path: string) {
    setSelected((current) =>
      current.includes(path) ? current.filter((item) => item !== path) : [...current, path],
    );
  }

  function dragProps(entry: Entry): React.HTMLAttributes<HTMLElement> {
    if (!canManage) return {};
    const dropTarget: React.HTMLAttributes<HTMLElement> = {
      onDragOver: (event) => {
        if (event.dataTransfer.types.includes(DRAG_TYPE)) event.preventDefault();
      },
      onDrop: (event) => {
        const dragged = event.dataTransfer.getData(DRAG_TYPE);
        if (!dragged) return;
        event.preventDefault();
        move(JSON.parse(dragged), entry.path);
      },
    };
    return {
      draggable: true,
      onDragStart: (event) => {
        const paths = selected.includes(entry.path) ? selected : [entry.path];
        event.dataTransfer.setData(DRAG_TYPE, JSON.stringify(paths));
      },
      ...(entry.file ? {} : dropTarget),
    };
  }

  const carriesFiles = (event: React.DragEvent) => event.dataTransfer.types.includes("Files");
  const viewProps: ViewProps = { entries, selected, canManage, onToggle: toggle, onOpen: open, dragProps };

  return (
    <div
      className="relative min-h-[50dvh] space-y-4"
      onDragEnter={(event) => {
        if (!carriesFiles(event)) return;
        dragDepth.current += 1;
        setIsDraggingFiles(true);
      }}
      onDragOver={(event) => {
        if (carriesFiles(event)) event.preventDefault();
      }}
      onDragLeave={(event) => {
        if (!carriesFiles(event)) return;
        dragDepth.current -= 1;
        if (dragDepth.current === 0) setIsDraggingFiles(false);
      }}
      onDrop={(event) => {
        if (!carriesFiles(event)) return;
        event.preventDefault();
        // A page around this browser may take dropped files for itself, as the post editor does.
        event.stopPropagation();
        dragDepth.current = 0;
        setIsDraggingFiles(false);
        upload(Array.from(event.dataTransfer.files));
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PathCrumbs prefix={prefix} onNavigate={navigate} />
        <div className="flex flex-wrap gap-2">
          <Button aria-pressed={!isGrid} onClick={() => setIsGrid(!isGrid)}>
            {isGrid ? "List view" : "Grid view"}
          </Button>
          <Button disabled={isUnconfigured} onClick={() => setDialog({ kind: "folder" })}>
            New folder
          </Button>
          <Button variant="solid" disabled={isUnconfigured || isUploading} onClick={() => fileInput.current?.click()}>
            Upload
          </Button>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            accept={UPLOAD_ACCEPT}
            aria-label="Files to upload"
            onChange={(event) => {
              upload(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-y border-border py-2">
          <span className={cn(labelClass, "mr-2 text-foreground")}>{selected.length} selected</span>
          {onlySelected?.file && <CopyUrlButton key={onlySelected.path} url={onlySelected.file.url} />}
          {onlySelected && (
            <Button onClick={() => setDialog({ kind: "rename", path: onlySelected.path })}>Rename</Button>
          )}
          <Button onClick={() => setDialog({ kind: "move", paths: selected })}>Move</Button>
          <Button onClick={() => remove(selected)}>Delete</Button>
          <Button variant="quiet" onClick={() => setSelected([])}>
            Clear
          </Button>
        </div>
      )}

      <Notice>{error || (isUnconfigured ? "" : listingError)}</Notice>
      {uploads.length > 0 && (
        <UploadList uploads={uploads} onDismiss={isUploading ? undefined : () => setUploads([])} />
      )}

      {isUnconfigured ? (
        <p className="border border-border px-4 py-10 text-center! text-sm">
          Storage is not configured.{" "}
          <Link href="/studio/settings" className="underline underline-offset-4">
            Open Settings
          </Link>
        </p>
      ) : isLoading ? (
        <p className="py-10 text-center! text-sm text-muted-foreground">Loading</p>
      ) : entries.length === 0 && !listingError ? (
        <p className="border border-border px-4 py-10 text-center! text-sm text-muted-foreground">
          This folder is empty. Drop files here, or use Upload.
        </p>
      ) : isGrid ? (
        <GridView {...viewProps} />
      ) : (
        <ListView {...viewProps} />
      )}

      {isDraggingFiles && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center border border-foreground bg-background/90">
          <span className={cn(labelClass, "text-foreground")}>Drop to upload to /{prefix}</span>
        </div>
      )}

      {dialog?.kind === "preview" && <PreviewModal file={dialog.file} onClose={() => setDialog(null)} />}
      {dialog?.kind === "folder" && (
        <NameModal
          title="New folder"
          label="Folder name"
          action="Create"
          onClose={() => setDialog(null)}
          onSubmit={(name) => act(() => api("/files/folder", { body: { path: `${prefix}${name}/` } }))}
        />
      )}
      {dialog?.kind === "rename" && (
        <NameModal
          title="Rename"
          label="New name"
          action="Rename"
          initial={baseName(dialog.path)}
          onClose={() => setDialog(null)}
          onSubmit={(name) => rename(dialog.path, name)}
        />
      )}
      {dialog?.kind === "move" && (
        <MoveModal
          moving={dialog.paths}
          onClose={() => setDialog(null)}
          onMove={(destination) => move(dialog.paths, destination)}
        />
      )}
    </div>
  );
}

/** The browser in a modal, as the image and file chooser of the editor and the content forms. */
export function FilePickerModal({
  accept,
  onPick,
  onClose,
}: {
  accept?: FileKind;
  onPick: (url: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal title={accept === "pdf" ? "Choose a PDF" : accept === "image" ? "Choose an image" : "Choose a file"} onClose={onClose} wide>
      <FileBrowser mode="pick" accept={accept} onPick={onPick} />
    </Modal>
  );
}
