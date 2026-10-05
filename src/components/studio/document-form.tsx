"use client";

import { useEffect, useState } from "react";

import { api, errorMessage, type DocumentData, type StudioDocument } from "./api";
import type { ContentField, ContentType } from "./content-schema";
import { FilePickerModal } from "./file-browser";
import { Button, Field, Notice, Thumb, inputClass, labelClass } from "./ui";

interface InputProps<F = ContentField> {
  field: F;
  value: unknown;
  onChange: (value: unknown) => void;
}

type FieldOf<K extends ContentField["kind"]> = Extract<ContentField, { kind: K }>;

const asText = (value: unknown) => (typeof value === "string" ? value : "");

const asList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

const asObjects = (value: unknown): DocumentData[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === "object" && item !== null) : [];

/** Trims what was typed and drops the blank lines a list textarea keeps while it is edited. */
function clean(fields: ContentField[], data: DocumentData): DocumentData {
  const result: DocumentData = { ...data };
  for (const field of fields) {
    const value = data[field.name];
    if (field.kind === "stringList") {
      result[field.name] = asList(value).map((line) => line.trim()).filter(Boolean);
    } else if (field.kind === "objectList") {
      result[field.name] = asObjects(value).map((item) => clean(field.fields, item));
    } else if (field.kind === "boolean") {
      result[field.name] = value === true;
    } else if (typeof value === "string") {
      result[field.name] = value.trim();
    }
  }
  return result;
}

function AssetInput({ field, value, onChange }: InputProps) {
  const [isPicking, setIsPicking] = useState(false);
  const url = asText(value);
  return (
    <div>
      <Field label={field.label} help={field.help}>
        <input
          type="url"
          className={inputClass}
          value={url}
          required={field.required}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
      <div className="mt-2 flex items-center gap-3">
        <Button onClick={() => setIsPicking(true)}>Choose</Button>
        {url && field.kind === "image" && <Thumb src={url} alt="" className="size-10 border border-border" />}
      </div>
      {isPicking && (
        <FilePickerModal
          accept={field.kind === "image" ? "image" : "pdf"}
          onClose={() => setIsPicking(false)}
          onPick={(picked) => {
            onChange(picked);
            setIsPicking(false);
          }}
        />
      )}
    </div>
  );
}

function StringListInput({ field, value, onChange }: InputProps<FieldOf<"stringList">>) {
  const [isPicking, setIsPicking] = useState(false);
  const lines = asList(value);
  return (
    <div>
      <Field label={field.label} help={field.help ?? "One per line."}>
        <textarea
          rows={Math.max(3, lines.length + 1)}
          className={inputClass}
          value={lines.join("\n")}
          required={field.required}
          onChange={(event) => onChange(event.target.value.split("\n"))}
        />
      </Field>
      {field.pick && (
        <Button className="mt-2" onClick={() => setIsPicking(true)}>
          Add from Files
        </Button>
      )}
      {isPicking && (
        <FilePickerModal
          accept={field.pick}
          onClose={() => setIsPicking(false)}
          onPick={(picked) => {
            onChange([...lines.filter(Boolean), picked]);
            setIsPicking(false);
          }}
        />
      )}
    </div>
  );
}

function ObjectListInput({ field, value, onChange }: InputProps<FieldOf<"objectList">>) {
  const items = asObjects(value);
  const replace = (index: number, item: DocumentData) =>
    onChange(items.map((current, at) => (at === index ? item : current)));

  return (
    <fieldset>
      <legend className={`${labelClass} mb-2`}>{field.label}</legend>
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item, index) => (
          <li key={index} className="grid gap-4 py-4 sm:grid-cols-2">
            {field.fields.map((child) => (
              <FieldInput
                key={child.name}
                field={child}
                value={item[child.name]}
                onChange={(next) => replace(index, { ...item, [child.name]: next })}
              />
            ))}
            <Button
              variant="quiet"
              className="justify-self-start px-0 sm:col-span-2"
              onClick={() => onChange(items.filter((_, at) => at !== index))}
            >
              Remove {field.itemLabel} {index + 1}
            </Button>
          </li>
        ))}
        {items.length === 0 && <li className="py-3 text-sm text-muted-foreground">None yet.</li>}
      </ul>
      <Button className="mt-2" onClick={() => onChange([...items, {}])}>
        Add {field.itemLabel}
      </Button>
    </fieldset>
  );
}

function ReferenceInput({ field, value, onChange }: InputProps<FieldOf<"reference">>) {
  const [targets, setTargets] = useState<StudioDocument[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<StudioDocument[]>(`/documents?type=${field.to}`)
      .then(setTargets)
      .catch((caught) => setError(errorMessage(caught)));
  }, [field.to]);

  const options = targets
    .map((target) => ({ id: target.id, title: asText(target.data[field.titleField]) || target.id }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div>
      <Field label={field.label} help={field.help}>
        <select
          className={inputClass}
          value={asText(value)}
          required={field.required}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Choose</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      </Field>
      <Notice>{error}</Notice>
    </div>
  );
}

function FieldInput({ field, value, onChange }: InputProps) {
  switch (field.kind) {
    case "image":
    case "file":
      return <AssetInput field={field} value={value} onChange={onChange} />;
    case "stringList":
      return <StringListInput field={field} value={value} onChange={onChange} />;
    case "objectList":
      return <ObjectListInput field={field} value={value} onChange={onChange} />;
    case "reference":
      return <ReferenceInput field={field} value={value} onChange={onChange} />;
    case "boolean":
      return (
        <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-white"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
          />
          {field.label}
        </label>
      );
    case "select":
      return (
        <Field label={field.label} help={field.help}>
          <select
            className={inputClass}
            value={asText(value)}
            required={field.required}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">Choose</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      );
    case "textarea":
      return (
        <Field label={field.label} help={field.help}>
          <textarea
            rows={4}
            className={inputClass}
            value={asText(value)}
            required={field.required}
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
      );
    case "number":
      return (
        <Field label={field.label} help={field.help}>
          <input
            type="number"
            className={inputClass}
            value={typeof value === "number" ? value : ""}
            required={field.required}
            onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
          />
        </Field>
      );
    default:
      return (
        <Field label={field.label} help={field.help}>
          <input
            type={field.kind}
            className={inputClass}
            value={asText(value)}
            required={field.required}
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
      );
  }
}

const WIDE_KINDS: ContentField["kind"][] = ["textarea", "stringList", "objectList"];

/** The edit form for one document, drawn from its type's fields. A null document is a new one. */
export function DocumentForm({
  contentType,
  document,
  onSaved,
  onCancel,
}: {
  contentType: ContentType;
  document: StudioDocument | null;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [data, setData] = useState<DocumentData>(document?.data ?? {});
  const [sortOrder, setSortOrder] = useState(document?.sortOrder?.toString() ?? "");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setIsBusy(true);
    setError("");
    const body = {
      data: clean(contentType.fields, data),
      sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
    };
    try {
      if (document) await api(`/documents/${document.id}`, { method: "PUT", body });
      else await api("/documents", { body: { type: contentType.type, ...body } });
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {contentType.fields.map((field) => (
          <div key={field.name} className={WIDE_KINDS.includes(field.kind) ? "md:col-span-2" : undefined}>
            <FieldInput
              field={field}
              value={data[field.name]}
              onChange={(value) => setData((current) => ({ ...current, [field.name]: value }))}
            />
          </div>
        ))}
        {!contentType.singleton && (
          <Field label="Order" help="Low numbers first.">
            <input
              type="number"
              className={inputClass}
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            />
          </Field>
        )}
      </div>
      <Notice>{error}</Notice>
      <div className="flex flex-wrap gap-2 border-t border-border pt-5">
        <Button type="submit" variant="solid" disabled={isBusy}>
          {isBusy ? "Saving" : "Save"}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} disabled={isBusy}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
