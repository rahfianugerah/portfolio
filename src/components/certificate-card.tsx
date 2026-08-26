'use client';

import React, { useMemo, useEffect, useState } from "react";
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
  const Wrapper: React.ElementType = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  // A cell in a shared-border grid, not a card: it draws its right and bottom edge and
  // the grid draws the left and top, so every division is one hairline between two cells.
  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        "flex h-full flex-col border-b border-r border-border p-6 transition-colors hover:bg-white/[0.02]",
        className
      )}
    >
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      {issued && (
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
          {issued}
        </p>
      )}

      {description && (
        <p className="mt-3 text-xs leading-6 text-zinc-400">{description}</p>
      )}

      {category.length > 0 && (
        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          {category.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </p>
      )}

      {links.length > 0 && (
        <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
          {links.map((link, idx) => (
            <span
              key={`${link.title}-${link.href}-${idx}`}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400"
            >
              {link.icon}
              {link.title}
            </span>
          ))}
        </span>
      )}
    </Wrapper>
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
            "px-2 py-1 text-sm text-foreground/80 hover:text-foreground transition",
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
            "px-2 py-1 text-sm text-foreground/80 hover:text-foreground transition",
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
            <div
              key={`certs-${pageCerts}-${certifications.length}`}
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
            </div>
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
            <div
              key={`learn-${pageLearn}-${learningCertificates.length}`}
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
            </div>
            <Pagination page={pageLearn} setPage={setPageLearn} total={totalPagesLearn} />
          </>
        ) : (
          <p className="text-center text-muted-foreground">No Certificates</p>
        )}
      </div>
    </>
  );
}
