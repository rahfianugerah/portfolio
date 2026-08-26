import BlurFade from "@/components/magicui/blur-fade";

/**
 * The header every page opens with: eyebrow, title, and an optional line under it.
 *
 * The four pages each built their own version of this, and they had drifted into four
 * different sizes and spacings. One of them now, sitting on the same full-width hairline
 * the sections below it use.
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
    <header className="border-b border-border px-6 py-16 sm:px-10 sm:py-20">
      <BlurFade delay={0.05}>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
          {eyebrow}
        </p>
        <h1 className="heading-display mt-4 text-3xl text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">{subtitle}</p>
        )}
      </BlurFade>
    </header>
  );
}
