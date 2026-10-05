"use client";

import Link from "next/link";

import { SECTIONS } from "@/components/studio/shell";
import { PageHeader, labelClass } from "@/components/studio/ui";

export default function StudioHome() {
  return (
    <>
      <PageHeader title="Studio" detail="Everything the two sites show is edited here." />
      <ul className="divide-y divide-border border-b border-border">
        {SECTIONS.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="grid gap-1 py-4 hover:bg-muted focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground sm:grid-cols-[10rem_1fr] sm:px-2"
            >
              <span className={`${labelClass} text-foreground`}>{section.label}</span>
              <span className="text-sm text-muted-foreground">{section.detail}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
