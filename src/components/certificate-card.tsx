'use client';

import React, { useMemo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ========= Types ========= */
export interface Certificate {
  title: string;
  issued?: string;
  category: readonly string[];
  href?: string;
  description?: string;
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
  id?: string | number;
}

interface CertificateCardProps {
  title: string;
  issued?: string;
  href?: string;
  description?: string;
  category?: readonly string[]; // <— add categories to render as badges
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
  className?: string;
}

/* ========= Single Card ========= */
export function CertificateCard({
  title,
  issued,
  href,
  description,
  category = [],
  links = [],
  className,
}: CertificateCardProps) {
  // The card is a plain div and each link is a real anchor.
  //
  // It used to be an <a> when `href` was set, which forced the links inside it to become
  // <span> elements to avoid nesting one anchor in another. But a certificate carries its
  // URL in links[0].href and usually has no top-level `href` at all, so the wrapper was a
  // div and the links were spans: nothing on the card was clickable.
  const cardLinks = links.length > 0
    ? links
    : href
      ? [{ title: "View Certificate", href, icon: null as React.ReactNode }]
      : [];

  return (
    <article
      className={cn(
        "flex h-full flex-col border-b border-r border-border p-6 transition-colors hover:bg-white/[0.02]",
        className
      )}
    >
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      {issued && (
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
          {issued}
        </p>
      )}

      {description && (
        <p className="mt-3 text-xs leading-6 text-zinc-200">{description}</p>
      )}

      {category.length > 0 && (
        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
          {category.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </p>
      )}

      {cardLinks.length > 0 && (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
          {cardLinks.map((link, idx) =>
            link.href ? (
              <a
                key={`${link.title}-${link.href}-${idx}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {link.icon}
                {link.title}
              </a>
            ) : (
              // A few entries genuinely have no certificate URL; they say so rather than
              // rendering a link that goes nowhere.
              <span
                key={`${link.title}-${idx}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400"
                title="No certificate link available"
              >
                {link.icon}
                {link.title}
              </span>
            )
          )}
        </div>
      )}
    </article>
  );
}

/* ========= Helpers ========= */
// Strong composite key (uses id if provided)
const certKey = (c: Certificate, fallbackIndex?: number) =>
  `${c.id ?? ""}::${c.title}::${c.issued ?? ""}::${c.href ?? ""}::${c.category.join("|")}::${fallbackIndex ?? ""}`;

/* ========= Section + Pagination ========= */
interface CertificateSectionProps {
  certifications: readonly Certificate[];
  learningCertificates: readonly Certificate[];
}

export function CertificateSection({
  certifications,
  learningCertificates,
}: CertificateSectionProps) {
  const PAGE_SIZE = 8;

  const [pageCerts, setPageCerts] = useState(1);
  const [pageLearn, setPageLearn] = useState(1);

  // Totals
  const totalPagesCerts = Math.max(1, Math.ceil(certifications.length / PAGE_SIZE));
  const totalPagesLearn = Math.max(1, Math.ceil(learningCertificates.length / PAGE_SIZE));

  // Clamp pages when totals change
  useEffect(() => {
    if (pageCerts > totalPagesCerts) setPageCerts(totalPagesCerts);
  }, [pageCerts, totalPagesCerts]);
  useEffect(() => {
    if (pageLearn > totalPagesLearn) setPageLearn(totalPagesLearn);
  }, [pageLearn, totalPagesLearn]);

  // Exact PAGE_SIZE slices
  const pagedCerts = useMemo(
    () =>
      certifications.slice(
        (pageCerts - 1) * PAGE_SIZE,
        (pageCerts - 1) * PAGE_SIZE + PAGE_SIZE
      ),
    [certifications, pageCerts]
  );
  const pagedLearn = useMemo(
    () =>
      learningCertificates.slice(
        (pageLearn - 1) * PAGE_SIZE,
        (pageLearn - 1) * PAGE_SIZE + PAGE_SIZE
      ),
    [learningCertificates, pageLearn]
  );

  // Pagination UI (borderless, red underline on active)
  const Pagination = ({
    page,
    setPage,
    total,
  }: {
    page: number;
    setPage: (n: number) => void;
    total: number;
  }) => {
    if (total <= 1) return null;
    return (
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className={cn(
            "inline-flex min-h-11 items-center px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Prev
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const n = i + 1;
            const active = n === page;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "group relative pb-1 min-w-8 px-2 py-1 text-sm transition-colors duration-300",
                  active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {n}
                <span
                  className={cn(
                    "pointer-events-none absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300 ease-out",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPage(Math.min(total, page + 1))}
          disabled={page === total}
          className={cn(
            "inline-flex min-h-11 items-center px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Certifications */}
      <div className="mb-8">
        <h3 className="heading-display mb-6 text-lg text-white">Certifications</h3>
        {pagedCerts.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
            <motion.div
              key={`certs-${pageCerts}-${certifications.length}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid border-l border-t border-border sm:grid-cols-2"
            >
              {pagedCerts.map((cert, idx) => (
                <CertificateCard
                  key={certKey(cert, idx)}
                  title={cert.title}
                  issued={cert.issued}
                  href={cert.href}
                  description={cert.description}
                  links={cert.links}
                  category={cert.category}
                />
              ))}
            </motion.div>
            </AnimatePresence>
            <Pagination page={pageCerts} setPage={setPageCerts} total={totalPagesCerts} />
          </>
        ) : (
          <p className="text-center text-muted-foreground">No Certificates</p>
        )}
      </div>

      {/* Learning Certificates */}
      <div className="mb-8">
        <h3 className="heading-display mb-6 text-lg text-white">Learning Certificates</h3>
        {pagedLearn.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
            <motion.div
              key={`learn-${pageLearn}-${learningCertificates.length}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid border-l border-t border-border sm:grid-cols-2"
            >
              {pagedLearn.map((cert, idx) => (
                <CertificateCard
                  key={certKey(cert, idx)}
                  title={cert.title}
                  issued={cert.issued}
                  href={cert.href}
                  description={cert.description}
                  links={cert.links}
                  category={cert.category}
                />
              ))}
            </motion.div>
            </AnimatePresence>
            <Pagination page={pageLearn} setPage={setPageLearn} total={totalPagesLearn} />
          </>
        ) : (
          <p className="text-center text-muted-foreground">No Certificates</p>
        )}
      </div>
    </>
  );
}
