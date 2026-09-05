'use client';

import React, { useMemo, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
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
  const Wrapper: React.ElementType = href ? "a" : React.Fragment;
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper {...(wrapperProps as any)}>
      <Card
        className={cn(
          "flex flex-col overflow-hidden ease-out h-full rounded-sm bg-white/5 px-2 py-2 text-sm text-foreground/90 shadow-sm backdrop-blur transition",
          "hover:shadow-md",
          className
        )}
      >
        <CardHeader className="px-2 pt-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {issued && <p className="text-xs text-muted-foreground">{issued}</p>}
        </CardHeader>

        {description && (
          <div className="px-2 text-sm text-muted-foreground">{description}</div>
        )}

        {/* Category badges */}
        {category.length > 0 && (
          <div className="px-2 pb-2 pt-1 flex flex-row flex-wrap gap-1">
            {category.map((c) => (
              <Badge
                key={c}
                className="px-2 py-0.5 text-[10px] bg-white/5 text-foreground/80 hover:bg-white/10"
              >
                {c}
              </Badge>
            ))}
          </div>
        )}

        {/* Links */}
        {links.length > 0 && (
          <CardFooter className="px-2 pb-2">
            <div className="flex flex-row flex-wrap items-center gap-1">
              {links.map((link, idx) => (
                <a
                  href={link.href}
                  key={`${link.title}-${link.href}-${idx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge className="flex items-center gap-1 px-2 py-1 text-[10px] bg-white/5 text-sm text-foreground/90 shadow-sm backdrop-blur transition hover:bg-white/10">
                    {link.icon}
                    {link.title}
                  </Badge>
                </a>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
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
                    "pointer-events-none absolute left-0 bottom-0 h-[2px] bg-[#FF0000] transition-all duration-300 ease-out",
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
        <h3 className="text-xl font-bold mb-4">Certifications</h3>
        {pagedCerts.length > 0 ? (
          <>
            <div
              key={`certs-${pageCerts}-${certifications.length}`}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[800px] mx-auto"
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
        <h3 className="text-xl font-bold mb-4">Learning Certificates</h3>
        {pagedLearn.length > 0 ? (
          <>
            <div
              key={`learn-${pageLearn}-${learningCertificates.length}`}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[800px] mx-auto"
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
