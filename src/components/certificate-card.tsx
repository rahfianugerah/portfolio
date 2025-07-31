import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  title: string;
  issued?: string;
  href?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
  description?: string;
}

export function CertificateCard({
  title,
  issued,
  links = [],
  className,
}: CertificateCardProps) {
  return (
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
      {links.length > 0 && (
        <CardFooter className="px-2 pb-2">
          <div className="flex flex-row flex-wrap items-center gap-1">
            {links.map((link, idx) => (
              <a href={link.href} key={idx} target="_blank" rel="noopener noreferrer">
                <Badge className="flex items-center gap-1 px-2 py-1 text-[10px]">
                  {link.icon}
                  {link.type}
                </Badge>
              </a>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
