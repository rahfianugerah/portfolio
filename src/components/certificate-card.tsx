'use client';

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
          "flex flex-col overflow-hidden border transition-shadow duration-200 ease-out h-full",
          "hover:shadow-md",
          className
        )}
      >
        <CardHeader className="px-2 pt-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {issued && <p className="text-xs text-muted-foreground">{issued}</p>}
        </CardHeader>
        {description && (
          <div className="px-2 text-sm text-muted-foreground">
            {description}
          </div>
        )}
        {links.length > 0 && (
          <CardFooter className="px-2 pb-2">
            <div className="flex flex-row flex-wrap items-center gap-1">
              {links.map((link, idx) => (
                <a
                  href={link.href}
                  key={idx}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge className="flex items-center gap-1 px-2 py-1 text-[10px]">
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

// Fungsi untuk memfilter sertifikat berdasarkan kategori
export function filterCertificates(
  certificates: readonly Certificate[],
  category: string
): Certificate[] {
  if (category === "All") return [...certificates];
  return certificates.filter((cert) => cert.category.includes(category));
}

interface CertificateSectionProps {
  certifications: readonly Certificate[];
  learningCertificates: readonly Certificate[];
}

export function CertificateSection({
  certifications,
  learningCertificates,
}: CertificateSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = Array.from(
    new Set(
      [...certifications, ...learningCertificates].flatMap((cert) => cert.category)
    )
  );
  const allCategories = ["All", ...categories];

  const filteredCertifications = filterCertificates(
    certifications,
    selectedCategory
  );
  const filteredLearningCerts = filterCertificates(
    learningCertificates,
    selectedCategory
  );

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-2 border rounded-lg transition-shadow",
              "bg-background text-foreground border-border hover:shadow-md",
              selectedCategory === cat && "invert"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Certifications Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold tracking-tighter mb-4">
          Certifications
        </h3>
        {filteredCertifications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[800px] mx-auto">
            {filteredCertifications.map((cert) => (
              <CertificateCard
                key={cert.title}
                title={cert.title}
                issued={cert.issued}
                href={cert.href}
                description={cert.description}
                links={cert.links}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No Certificates</p>
        )}
      </div>

      {/* Learning Certificates Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold tracking-tighter mb-4">
          Learning Certificates
        </h3>
        {filteredLearningCerts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[800px] mx-auto">
            {filteredLearningCerts.map((cert) => (
              <CertificateCard
                key={cert.title}
                title={cert.title}
                issued={cert.issued}
                href={cert.href}
                description={cert.description}
                links={cert.links}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No Certificates</p>
        )}
      </div>
    </>
  );
}
