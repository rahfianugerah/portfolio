import BlurFade from "@/components/magicui/blur-fade";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";

/**
 * The header every page opens with: eyebrow, title, and an optional line under it.
 *
 * The four pages each built their own version of this at four different sizes. One of
 * them now — which also means the hero's grid texture reaches every page by changing one
 * file rather than four.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* The grid stays hit-testable or its hover trail never fires; the mouse is let
          through by making the content above it pointer-events-none instead. Same
          arrangement as the home hero and the consulting site. */}
      <div className="absolute inset-0">
        <InteractiveGridPattern />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),#000_94%)]" />

      <div className="pointer-events-none relative z-10 px-6 py-16 sm:px-10 sm:py-20">
        <BlurFade delay={0.05}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
            {eyebrow}
          </p>
          <h1 className="heading-display mt-4 text-3xl text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-200">{subtitle}</p>
          )}
        </BlurFade>
      </div>
    </header>
  );
}
