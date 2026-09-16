"use client";

import Link from "next/link";

import { useSiteContent } from "@/lib/use-site-content";

/**
 * The services, in the left rail above the specialties cloud.
 *
 * They used to be a route in the dock, which put a whole page behind an icon nobody had a
 * reason to press. As a card they are read rather than navigated to, and the page they came
 * from is still there for anyone who wants the longer version.
 */
export default function ServicesCard() {
  const content = useSiteContent();
  const services = content?.services ?? [];

  // The frame renders straight away and the rows fill in, so the rail does not jump when the
  // content arrives. Every other card in these rails behaves the same way.
  const loading = content === null;

  if (!loading && services.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      {loading && (
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      )}

      <ul className="flex flex-col divide-y divide-border">
        {services.map((service) => (
          <li key={service.id} className="py-2 first:pt-0 last:pb-0">
            <p className="text-xs font-medium leading-tight">{service.title}</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              {service.description}
            </p>
          </li>
        ))}
      </ul>

      {!loading && (
        <Link
          href="https://consulting.rahfi.pro/#services"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-[11px] font-medium underline underline-offset-4 transition-colors hover:text-primary"
        >
          Full services at Consulting
        </Link>
      )}
    </div>
  );
}
