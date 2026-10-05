"use client";

import { useState } from "react";

import { api, errorMessage, type SanityPlanItem } from "./api";
import { Button, Field, Notice, inputClass, labelClass } from "./ui";

interface Failure {
  title: string;
  reason: string;
}

function countByType(plan: SanityPlanItem[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const item of plan) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/** The one-time import. Each document is its own request, so one failure does not stop the rest. */
export function SanityImport() {
  const [projectId, setProjectId] = useState("");
  const [dataset, setDataset] = useState("production");
  const [plan, setPlan] = useState<SanityPlanItem[] | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [failures, setFailures] = useState<Failure[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadPlan(event: React.FormEvent) {
    event.preventDefault();
    setIsBusy(true);
    setError("");
    setDone(null);
    setFailures([]);
    try {
      const query = new URLSearchParams({ projectId, dataset });
      setPlan(await api<SanityPlanItem[]>(`/import/sanity/plan?${query}`));
    } catch (caught) {
      setPlan(null);
      setError(errorMessage(caught));
    } finally {
      setIsBusy(false);
    }
  }

  async function runImport(items: SanityPlanItem[]) {
    setIsBusy(true);
    setFailures([]);
    const failed: Failure[] = [];
    for (const [index, item] of items.entries()) {
      try {
        await api("/import/sanity/document", { body: { projectId, dataset, id: item.id } });
      } catch (caught) {
        failed.push({ title: `${item.type}: ${item.title || item.id}`, reason: errorMessage(caught) });
      }
      setDone(index + 1);
    }
    setFailures(failed);
    setIsBusy(false);
  }

  const isFinished = plan !== null && done === plan.length && !isBusy;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Copies every document and post from a public Sanity dataset. Running it again changes
        nothing that was already imported.
      </p>
      <form onSubmit={loadPlan} className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <Field label="Project ID">
          <input
            className={`${inputClass} font-mono`}
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            required
          />
        </Field>
        <Field label="Dataset">
          <input
            className={`${inputClass} font-mono`}
            value={dataset}
            onChange={(event) => setDataset(event.target.value)}
            required
          />
        </Field>
        <Button type="submit" disabled={isBusy}>
          Plan
        </Button>
      </form>
      <Notice>{error}</Notice>

      {plan && (
        <div className="space-y-4">
          <ul className="divide-y divide-border border-y border-border text-sm">
            {countByType(plan).map(([type, count]) => (
              <li key={type} className="flex justify-between gap-4 py-2">
                <span className="font-mono">{type}</span>
                <span className={labelClass}>{count}</span>
              </li>
            ))}
            {plan.length === 0 && <li className="py-2 text-muted-foreground">Nothing to import.</li>}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="solid" disabled={isBusy || plan.length === 0} onClick={() => runImport(plan)}>
              Import {plan.length} documents
            </Button>
            {done !== null && (
              <span role="status" className={`${labelClass} text-foreground`}>
                {done} of {plan.length}
                {isFinished && `, finished with ${failures.length} failed`}
              </span>
            )}
          </div>
          {failures.length > 0 && (
            <ul aria-label="Failed documents" className="divide-y divide-border border-y border-border text-sm">
              {failures.map((failure) => (
                <li key={failure.title} className="py-2">
                  <span className="font-mono">{failure.title}</span>
                  <span className="block text-muted-foreground">{failure.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
