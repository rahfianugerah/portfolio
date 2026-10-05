"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api, errorMessage, type StudioDocument } from "@/components/studio/api";
import { CONTENT_TYPES } from "@/components/studio/content-schema";
import { Notice, PageHeader, labelClass } from "@/components/studio/ui";

export default function ContentPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<StudioDocument[]>("/documents")
      .then((documents) => {
        const tally: Record<string, number> = {};
        for (const { type } of documents) tally[type] = (tally[type] ?? 0) + 1;
        setCounts(tally);
      })
      .catch((caught) => setError(errorMessage(caught)));
  }, []);

  return (
    <>
      <PageHeader title="Content" detail="Everything on both sites that is not a post." />
      <Notice>{error}</Notice>
      <ul className="divide-y divide-border border-b border-border">
        {CONTENT_TYPES.map(({ type, label }) => (
          <li key={type}>
            <Link
              href={`/studio/content/${type}`}
              className="flex min-h-12 items-center justify-between gap-4 text-sm hover:bg-muted focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground sm:px-2"
            >
              <span>{label}</span>
              <span className={labelClass}>{counts ? (counts[type] ?? 0) : ""}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
