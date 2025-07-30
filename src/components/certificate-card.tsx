import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CertificateCardProps {
  title: string;
  issued?: string;
  image?: string;
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
  image,
  href,
  description,
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
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {image && (
            <div className="relative h-24 w-full bg-muted">
              <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
        </a>
      ) : (
        image && (
          <div className="relative h-24 w-full bg-muted">
            <Image src={image} alt={title} layout="fill" objectFit="cover" />
          </div>
        )
      )}
      <CardHeader className="px-2 pt-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {issued && <p className="text-xs text-muted-foreground">{issued}</p>}
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1 px-2 pt-1">
            {description && (
                <p className="text-xs text-muted-foreground mb-1">
                {description}
                </p>
            )}
        </CardContent>
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
