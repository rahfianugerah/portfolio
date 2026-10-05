"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api, errorMessage, type Credential } from "@/components/studio/api";
import { CredentialField } from "@/components/studio/credential-field";
import { SanityImport } from "@/components/studio/sanity-import";
import { Button, Field, Notice, PageHeader, SectionLabel, inputClass } from "@/components/studio/ui";

const MIN_PASSWORD_LENGTH = 12;

const GROUPS = [
  { label: "Model", names: ["LLM_API_KEY", "LLM_MODEL", "LLM_BASE_URL"] },
  { label: "Mail", names: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "CONTACT_TO"] },
  { label: "Storage", names: ["GCS_BUCKET", "GCS_SERVICE_ACCOUNT"] },
];

function ChangePassword() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function change(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword"));
    if (newPassword !== form.get("repeatPassword")) {
      setError("The two new passwords do not match.");
      return;
    }
    setIsBusy(true);
    setError("");
    try {
      await api("/password/change", { body: { currentPassword: form.get("currentPassword"), newPassword } });
      // Changing the password revokes this session, so the next stop is the sign-in form.
      router.replace("/studio/login");
    } catch (caught) {
      setError(errorMessage(caught));
      setIsBusy(false);
    }
  }

  return (
    <form onSubmit={change} className="grid max-w-xl gap-4">
      <Field label="Current password">
        <input name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <Field label="New password" help={`At least ${MIN_PASSWORD_LENGTH} characters. You will be signed out.`}>
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
      <Button type="submit" variant="solid" disabled={isBusy} className="justify-self-start">
        Change password
      </Button>
    </form>
  );
}

export default function SettingsPage() {
  const [credentials, setCredentials] = useState<Credential[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Credential[]>("/credentials")
      .then(setCredentials)
      .catch((caught) => setError(errorMessage(caught)));
  }, [reloadKey]);

  return (
    <>
      <PageHeader title="Settings" detail="A secret can be replaced or cleared, never read back." />
      <Notice>{error}</Notice>
      {credentials === null && !error && <p className="text-sm text-muted-foreground">Loading</p>}

      {credentials &&
        GROUPS.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <SectionLabel>{group.label}</SectionLabel>
            <ul className="divide-y divide-border">
              {credentials
                .filter((credential) => group.names.includes(credential.name))
                .map((credential) => (
                  <CredentialField
                    // Keyed on the stored state so a saved value is read back into the field.
                    key={`${credential.name}:${credential.updatedAt}`}
                    credential={credential}
                    onChanged={() => setReloadKey((key) => key + 1)}
                  />
                ))}
            </ul>
          </section>
        ))}

      <section aria-label="Change password" className="space-y-4">
        <SectionLabel>Change password</SectionLabel>
        <ChangePassword />
      </section>

      <section aria-label="Import from Sanity" className="space-y-4">
        <SectionLabel>Import from Sanity</SectionLabel>
        <SanityImport />
      </section>
    </>
  );
}
