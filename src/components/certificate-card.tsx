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
  // Optional unique id if you have one in your data:
  id?: string | number;
}

interface CertificateCardProps {
  title: string;
  issued?: string;
  href?: string;
  description?: string;
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
export function filterCertificates(
  certificates: readonly Certificate[],
  category: string
): Certificate[] {
  if (category === "All Categories") return [...certificates];
  return certificates.filter((cert) => cert.category.includes(category));
}

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

  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [pageCerts, setPageCerts] = useState(1);
  const [pageLearn, setPageLearn] = useState(1);

  const onSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setPageCerts(1);
    setPageLearn(1);
  };

  // Build categories (deduped & sorted) — pure (no mutation)
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    [...certifications, ...learningCertificates].forEach((c) =>
      c.category.forEach((k) => set.add(k))
    );
    return ["All Categories", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [certifications, learningCertificates]);

  // Filtered lists (memoized)
  const filteredCertifications = useMemo(
    () => filterCertificates(certifications, selectedCategory),
    [certifications, selectedCategory]
  );
  const filteredLearningCerts = useMemo(
    () => filterCertificates(learningCertificates, selectedCategory),
    [learningCertificates, selectedCategory]
  );

  // Totals
  const totalPagesCerts = Math.max(1, Math.ceil(filteredCertifications.length / PAGE_SIZE));
  const totalPagesLearn = Math.max(1, Math.ceil(filteredLearningCerts.length / PAGE_SIZE));

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
      filteredCertifications.slice(
        (pageCerts - 1) * PAGE_SIZE,
        (pageCerts - 1) * PAGE_SIZE + PAGE_SIZE
      ),
    [filteredCertifications, pageCerts]
  );
  const pagedLearn = useMemo(
    () =>
      filteredLearningCerts.slice(
        (pageLearn - 1) * PAGE_SIZE,
        (pageLearn - 1) * PAGE_SIZE + PAGE_SIZE
      ),
    [filteredLearningCerts, pageLearn]
  );

  // Pagination UI
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
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className={cn(
            "px-2 py-1 text-sm rounded border border-border",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Prev
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: total }).map((_, i) => {
            const n = i + 1;
            const active = n === page;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "min-w-8 px-2 py-1 text-sm rounded",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:bg-accent hover:text-accent-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {n}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPage(Math.min(total, page + 1))}
          disabled={page === total}
          className={cn(
            "px-2 py-1 text-sm rounded border border-border",
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
      {/* Filter Buttons (underline slide, #FF0000) */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "relative pb-1 text-foreground transition-colors duration-300",
              "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#FF0000]",
              "after:transition-all after:duration-300 after:ease-out",
              selectedCategory === cat ? "after:w-full" : "after:w-0 hover:after:w-full"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Certifications */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Certifications</h3>
        {pagedCerts.length > 0 ? (
          <>
            {/* Force remount when category/page/length changes to kill any stale children */}
            <div
              key={`certs-${selectedCategory}-${pageCerts}-${filteredCertifications.length}`}
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
            {/* Same remount trick here */}
            <div
              key={`learn-${selectedCategory}-${pageLearn}-${filteredLearningCerts.length}`}
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
