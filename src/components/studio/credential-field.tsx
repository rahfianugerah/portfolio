"use client";

import { useState } from "react";

import { api, errorMessage, type Credential } from "./api";
import { Button, Field, Notice, formatWhen, inputClass, labelClass } from "./ui";

/** The one credential that is a whole file, not something to type. */
const JSON_FILE_CREDENTIAL = "GCS_SERVICE_ACCOUNT";

/** Reads a chosen or dropped .json key. Its contents are held for the request and never drawn. */
function JsonFileInput({
  name,
  fileName,
  onRead,
}: {
  name: string;
  fileName: string;
  onRead: (fileName: string, text: string) => void;
}) {
  async function read(file: File | undefined) {
    if (file) onRead(file.name, await file.text());
  }

  return (
    <label
      className="flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground hover:border-foreground focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-foreground"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        read(event.dataTransfer.files[0]);
      }}
    >
      <span className={labelClass}>{name}</span>
      <span>{fileName ? `${fileName} is ready to save.` : "Choose the .json key file, or drop it here."}</span>
      <input
        type="file"
        accept=".json,application/json"
        className="sr-only"
        onChange={(event) => {
          read(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </label>
  );
}

/** One credential, saved and cleared on its own. A secret is write-only. */
export function CredentialField({
  credential,
  onChanged,
}: {
  credential: Credential;
  onChanged: () => void;
}) {
  const [value, setValue] = useState(credential.value ?? "");
  const [fileName, setFileName] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const path = `/credentials/${credential.name}`;

  async function change(work: Promise<void>) {
    setIsBusy(true);
    setError("");
    try {
      await work;
      if (credential.secret) setValue("");
      setFileName("");
      onChanged();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsBusy(false);
    }
  }

  const status = credential.set
    ? `Set${credential.updatedAt ? `, updated ${formatWhen(credential.updatedAt)}` : ""}`
    : "Not set";

  return (
    <li className="space-y-2 py-4">
      <div className="grid items-end gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        {credential.name === JSON_FILE_CREDENTIAL ? (
          <JsonFileInput
            name={credential.name}
            fileName={fileName}
            onRead={(readName, text) => {
              setFileName(readName);
              setValue(text);
            }}
          />
        ) : (
          <Field label={credential.name}>
            <input
              type={credential.secret ? "password" : "text"}
              autoComplete={credential.secret ? "new-password" : "off"}
              spellCheck={false}
              className={`${inputClass} font-mono`}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
        )}
        <div className="flex gap-2">
          <Button
            variant="solid"
            disabled={isBusy || value === ""}
            onClick={() => change(api(path, { method: "PUT", body: { value } }))}
          >
            Save
          </Button>
          <Button
            disabled={isBusy || !credential.set}
            onClick={() => {
              if (window.confirm(`Clear ${credential.name}?`)) change(api(path, { method: "DELETE" }));
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      <p className={labelClass}>{status}</p>
      <Notice>{error}</Notice>
    </li>
  );
}
