import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// Removed incorrect import of image component

interface Props {
  title: string;
  description: string | string[];
  dates: string;
  location: string;
  image?: string;
  issued?: string;
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
}

export function HardworkCard({
  title,
  description,
  dates,
  location,
  image,
  issued,
  links,
}: Props) {
  return (
    <li className="relative py-4">
      <div className="flex flex-1 flex-col justify-start gap-1">
      <div className="absolute -left-16 top-2 flex items-center justify-center rounded-full">
        {/* <Avatar className="border size-12 m-auto">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar> */}
      </div>
        {dates && (
          <time className="text-xs text-muted-foreground">{dates}</time>
        )}
        <h2 className="font-semibold leading-none">{title}</h2>
        {location && (
          <p className="text-sm text-muted-foreground">{location}</p>
        )}
        {issued && (
          <p className="text-sm">Issued by {issued}</p>
        )}
        {description && (
          <span className="prose dark:prose-invert text-muted-foreground">
            {description}
          </span>
        )}
        
      </div>
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap items-start gap-2 ">
          {links?.map((link, idx) => (
            <Link href={link.href} key={idx}>
              <Badge key={idx} title={link.title} className="flex gap-2 inline-flex items-center rounded-sm bg-white/5 px-2 py-2 text-sm text-foreground/90 shadow-sm backdrop-blur transition hover:bg-white/10">
                {link.icon}
                {link.title}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
