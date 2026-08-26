import Link from "next/link";

interface Props {
  title: string;
  description: string | string[];
  dates: string;
  location: string;
  issued?: string;
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
}

/**
 * One achievement, as a row.
 *
 * The previous version carried an absolutely-positioned box at `-left-16` holding a
 * commented-out avatar — the fossil of a timeline layout that reserved a 64px left rail.
 * It reserved nothing and rendered nothing, but it was half the gutter this section
 * appeared to have. The `image` prop went with it: only the deleted avatar read it.
 */
export function HardworkCard({
  title,
  description,
  dates,
  location,
  issued,
  links,
}: Props) {
  return (
    <li className="py-6">
      <div className="flex flex-col gap-2">
        {dates && (
          <time className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            {dates}
          </time>
        )}
        <h3 className="heading-display text-base leading-snug text-white">{title}</h3>

        {(location || issued) && (
          <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
            {[location, issued && `Issued by ${issued}`].filter(Boolean).join(" · ")}
          </p>
        )}

        {description && (
          <p className="mt-1 max-w-3xl text-[13px] leading-6 text-zinc-200">
            {description}
          </p>
        )}
      </div>

      {links && links.length > 0 && (
        <div className="mt-4 flex flex-row flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              target="_blank"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
