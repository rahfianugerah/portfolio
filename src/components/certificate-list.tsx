import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

import type { Certificate } from "@/lib/content";

/**
 * A certificate, readable in place when its PDF has been uploaded.
 *
 * The expander is a native <details>, not a dialog. It is keyboard accessible and deep
 * linkable without a line of JavaScript, and the iframe inside it is lazy, so a page of
 * forty certificates fetches no PDF until someone opens one. A certificate that only exists
 * on the issuer's site has nothing to embed and gets a link out instead.
 */
function CertificateRow({ certificate }: { certificate: Certificate }) {
  const header = (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{certificate.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{certificate.issuer}</p>
        {certificate.categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {certificate.categories.map((category) => (
              <span
                key={category}
                className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (certificate.fileUrl) {
    return (
      <details className="group rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
        <summary className="flex cursor-pointer list-none items-start gap-3 p-5 [&::-webkit-details-marker]:hidden">
          {header}
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-sm transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            <FileText className="size-3" />
            <span className="group-open:hidden">View</span>
            <span className="hidden group-open:inline">Close</span>
          </span>
        </summary>
        <div className="border-t border-border p-3">
          <iframe
            src={`${certificate.fileUrl}#view=FitH`}
            loading="lazy"
            title={certificate.title}
            className="h-[70vh] w-full rounded-md border border-border bg-muted/40"
          />
          <Link
            href={certificate.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ExternalLink className="size-3" />
            Open the PDF in a new tab
          </Link>
        </div>
      </details>
    );
  }

  const body = (
    <div className="flex items-start gap-3 p-5">
      {header}
      {certificate.externalUrl && (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-sm transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <ExternalLink className="size-3" />
          View
        </span>
      )}
    </div>
  );

  const className =
    "group block rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md";

  return certificate.externalUrl ? (
    <Link href={certificate.externalUrl} target="_blank" rel="noreferrer" className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function CertificateList({ certificates }: { certificates: Certificate[] }) {
  if (certificates.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground shadow-sm">
        Nothing here yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {certificates.map((certificate) => (
        <CertificateRow key={certificate.id} certificate={certificate} />
      ))}
    </div>
  );
}
