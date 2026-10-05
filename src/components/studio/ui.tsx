"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export const labelClass = "block text-[11px] uppercase tracking-[0.18em] text-muted-foreground";

export const inputClass = cn(
  "block min-h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground",
  "placeholder:text-muted-foreground hover:border-muted-foreground disabled:opacity-50",
  focusRing,
);

const buttonVariants = {
  solid: "border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground",
  line: "border border-border text-foreground hover:border-foreground",
  quiet: "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
};

export function buttonClass(variant: keyof typeof buttonVariants = "line", className?: string) {
  return cn(
    "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap px-4 text-[11px] uppercase tracking-[0.18em]",
    "transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40",
    focusRing,
    buttonVariants[variant],
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
}

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

/** A label wrapped around its control, so the two are associated without an id. */
export function Field({
  label,
  help,
  className,
  children,
}: {
  label: string;
  help?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className={cn(labelClass, "mb-2")}>{label}</span>
      {children}
      {help && <span className="mt-1.5 block text-xs text-muted-foreground">{help}</span>}
    </label>
  );
}

/** A message from the API, shown as it came. Status reads from the label, not from a hue. */
export function Notice({
  kind = "error",
  children,
}: {
  kind?: "error" | "note";
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className="flex gap-3 border border-border px-3 py-2.5 text-left text-sm"
    >
      <span className={cn(labelClass, "shrink-0 pt-0.5 text-foreground")}>
        {kind === "error" ? "Error" : "Note"}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export function PageHeader({
  title,
  detail,
  children,
}: {
  title: string;
  detail?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div className="min-w-0">
        <h1 className="text-xl font-medium tracking-tight">{title}</h1>
        {detail && <div className="mt-1 text-sm text-muted-foreground">{detail}</div>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className={cn(labelClass, "border-b border-border pb-2")}>{children}</h2>;
}

/**
 * A native modal dialog: the browser traps focus, closes on Escape and restores focus.
 * Render it only while it should be open.
 */
export function Modal({
  title,
  onClose,
  wide = false,
  children,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    // Guarded because strict mode runs this twice, and closing in a cleanup would fire onClose.
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-auto max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto border border-border bg-background p-0 text-foreground backdrop:bg-black/80",
        wide ? "max-w-5xl" : "max-w-md",
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border py-1 pl-4 pr-1">
        <h2 id={titleId} className={cn(labelClass, "text-foreground")}>
          {title}
        </h2>
        <Button variant="quiet" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
}

/** Asks for one line of text: a folder name, a new file name. */
export function NameModal({
  title,
  label,
  initial = "",
  action,
  onSubmit,
  onClose,
}: {
  title: string;
  label: string;
  initial?: string;
  action: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial);
  const trimmed = name.trim();
  const isValid = trimmed !== "" && !trimmed.includes("/");
  const submit = () => {
    if (isValid) onSubmit(trimmed);
  };

  // Not a <form>: the file picker opens inside the content forms, and forms cannot nest.
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">
        <Field label={label} help="A name cannot contain a slash.">
          <input
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              submit();
            }}
            autoFocus
          />
        </Field>
        <Button variant="solid" disabled={!isValid} onClick={submit}>
          {action}
        </Button>
      </div>
    </Modal>
  );
}

/** A remote image at whatever address the bucket gave it. */
export function Thumb({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a bucket image at an arbitrary address; next/image here runs a custom loader
    <img src={src} alt={alt} loading="lazy" className={cn("object-contain", className)} />
  );
}

export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
