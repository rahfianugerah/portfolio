import { Widget } from "./widget";

// What this page is actually made of. Every row is something a visitor can verify by
// opening the network tab, which is the point: the consulting site sells work you can
// inspect, and this is the smallest possible version of that claim.
const stack = [
  ["Framework", "Next.js 14, App Router"],
  ["Language", "TypeScript"],
  ["Styling", "Tailwind CSS"],
  ["Content", "Sanity CMS, Portable Text"],
  ["Data", "Supabase, PostgreSQL"],
  ["Assistant", "Google Gemini"],
  ["Hosting", "Vercel"],
  ["Type", "Copperplate CC, Montserrat"],
];

export default function Colophon() {
  return (
    <Widget title="Colophon" meta="How this is built">
      <dl className="flex flex-1 flex-col justify-between gap-3">
        {stack.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-3 border-b border-border pb-2 last:border-b-0 last:pb-0"
          >
            <dt className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              {label}
            </dt>
            <dd className="truncate text-right text-[11px] text-zinc-300">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Widget>
  );
}
