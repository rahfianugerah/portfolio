import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VscChevronRight } from "react-icons/vsc";
import Markdown from "react-markdown";
import BlurFade from "@/components/magicui/blur-fade";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { ResumeCard } from "@/components/resume-card";
import { HardworkCard } from "@/components/hardwork-card";
import { ProjectCard } from "@/components/project-card";
import { groupByCompany } from "@/lib/group-work";
import { DATA } from "@/data/resume";

import AnalyticsWidget from "@/app/components/widgets/analytics-widget";
import ProjectsCounter from "@/app/components/widgets/projects-counter";
import LatestBlogsWidget from "@/app/components/widgets/latest-blogs";
import SocialLinks from "@/app/components/widgets/social-links";
import GithubActivity from "@/app/components/widgets/github-activity";
import TechStack from "@/components/techstack";
import { IconCloudSpecialties } from "@/components/specialties-icon";
import QuoteCarousel from "@/app/components/quote-carousel";
import ImageCarousel from "@/app/components/image-carousel";
import Colophon from "@/app/components/widgets/colophon";
import Clock from "@/components/clock";

const DELAY = 0.04;

// The full history, not the first eight. The separate experience page that used to hold
// the rest is gone, so this is the only place it lives.
const companies = groupByCompany(DATA.work);
const organisations = groupByCompany(DATA.leadership);

// Everything below is a link the site already knows about; the keys come from the resume
// data rather than being written out again here.
const PRIMARY_LINKS = ["CV", "GitHub", "LinkedIn"];

export default function Page() {
  const heroLinks = Object.entries(DATA.contact.social).filter(([name]) =>
    PRIMARY_LINKS.includes(name)
  );

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute -inset-px">
          <InteractiveGridPattern />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),#000_94%)]" />

        <div className="pointer-events-none relative z-10 grid items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <BlurFade delay={DELAY * 2}>
            <div>
              <p className="w-fit border border-border bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-200">
                Available for work
              </p>
              <h1 className="heading-display mt-6 text-4xl leading-[1.1] text-white sm:text-5xl">
                {DATA.name}
              </h1>
              <p className="mt-4 text-base text-zinc-200 sm:text-lg">
                {DATA.description}
              </p>

              <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {heroLinks.map(([name, social]: [string, any]) => (
                  <Link
                    key={name}
                    href={social.url}
                    target="_blank"
                    className="inline-flex min-h-11 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <social.icon className="size-4" />
                    {name === "CV" ? "Résumé" : name}
                  </Link>
                ))}
              </div>

              <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#experiences"
                  className="inline-flex min-h-11 items-center justify-center border border-white bg-white px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:border-zinc-300 hover:bg-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  View Work
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex min-h-11 items-center justify-center border border-zinc-600 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Ask AI
                </Link>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={DELAY * 4}>
            <div className="relative aspect-[4/5] w-full max-w-sm border border-border lg:ml-auto">
              <Image
                src="/me-google-1.jpeg"
                alt={`${DATA.name}, portrait`}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <Section id="about" eyebrow="About" title="Who I Am">
        <Markdown className="prose prose-invert max-w-3xl text-pretty text-sm leading-7 text-zinc-200">
          {DATA.summary}
        </Markdown>
      </Section>

      {/* ---------------- Experience ---------------- */}
      <Section
        id="experiences"
        eyebrow="Experience"
        title="Where I Have Worked"
        subtitle="Every role, in full. Select a company to read what each one involved."
      >
        <div>
          {companies.map((company, i) => (
            <BlurFade key={company.company} delay={DELAY * (i + 1)}>
              <ResumeCard
                title={company.company}
                href={company.href}
                period={company.period}
                jobs={company.jobs}
              />
            </BlurFade>
          ))}
        </div>

        {organisations.length > 0 && (
          <>
            <h3 className="mt-16 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
              Leadership
            </h3>
            <div className="mt-6">
              {organisations.map((org, i) => (
                <BlurFade key={org.company} delay={DELAY * (i + 1)}>
                  <ResumeCard
                    title={org.company}
                    href={org.href}
                    period={org.period}
                    jobs={org.jobs}
                  />
                </BlurFade>
              ))}
            </div>
          </>
        )}

        <h3 className="mt-16 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
          Education
        </h3>
        <div className="mt-6">
          {DATA.education.map((edu: any, i: number) => (
            <BlurFade key={`${edu.school}-${edu.start}`} delay={DELAY * (i + 1)}>
              <ResumeCard
                title={edu.school}
                href={edu.href}
                period={`${edu.start} - ${edu.end ?? "Present"}`}
                jobs={[
                  {
                    title: edu.degree,
                    period: `${edu.start} - ${edu.end ?? "Present"}`,
                    description:
                      typeof edu.description === "string"
                        ? edu.description
                        : [...edu.description],
                  },
                ]}
              />
            </BlurFade>
          ))}
        </div>
      </Section>

      {/* ---------------- Projects ---------------- */}
      <Section
        id="projects"
        eyebrow="Selected Work"
        title="Things I Have Built"
        action={{ label: "All projects", href: "/project" }}
      >
        <div className="-mx-6 grid border-t border-border sm:-mx-10 sm:grid-cols-2 lg:grid-cols-3">
          {DATA.projects.slice(0, 6).map((project: any, i: number) => (
            <BlurFade key={project.title} delay={DELAY * (i + 1)} className="flex">
              <ProjectCard
                href={project.href}
                title={project.title}
                description={project.description}
                status={project.status}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
                className="w-full"
              />
            </BlurFade>
          ))}
        </div>
      </Section>

      {/* ---------------- Achievements ---------------- */}
      <Section id="achievements" eyebrow="Recognition" title="Achievements">
        <ul className="divide-y divide-border border-y border-border">
          {DATA.hardwork.map((item: any, i: number) => (
            <BlurFade key={item.title + item.dates} delay={DELAY * (i + 1)}>
              <HardworkCard
                title={item.title}
                description={item.description}
                location={item.location}
                issued={item.issued}
                dates={item.dates}
                links={item.links}
              />
            </BlurFade>
          ))}
        </ul>
      </Section>

      {/* ---------------- Stats ---------------- */}
      <section id="stats" className="scroll-mt-16">
        <div className="border-b border-border px-6 py-16 sm:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
            Signals
          </p>
          <h2 className="heading-display mt-4 text-2xl text-white">
            What This Site Knows
          </h2>
        </div>

        {/* Bento. Two rules govern this array and both are load-bearing:

            1. Every span is lg:-prefixed. An unprefixed col-span-2 inside a one-column
               grid makes the browser ADD a column, so the mobile layout would silently
               become two-wide with half of it empty.
            2. The tiling must be exact. Grid auto-placement is sparse — the cursor never
               moves backwards — so a skipped slot is never backfilled, and an empty slot
               has no element, therefore no border, therefore a black hole with a missing
               hairline. The spans below sum to exactly 24 across 4 columns x 6 rows, so
               reordering this array is a layout change, not a cosmetic one.

            The shared-edge scheme is unchanged and needs no adjustment for spans: each
            cell paints its own right and bottom edge, and a cell covering 2x2 still has
            exactly one of each. Some grid lines become partial as a result — that is the
            bento reading, not a defect. */}
        <div className="-mr-px grid auto-rows-auto border-border sm:auto-rows-[minmax(9rem,auto)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { node: <ImageCarousel key="moments" />, span: "lg:col-span-2 lg:row-span-2", bleed: true },
            { node: <SocialLinks key="social" />, span: "" },
            { node: <TechStack key="stack" />, span: "lg:row-span-2" },

            { node: <Clock key="clock" />, span: "" },

            { node: <IconCloudSpecialties key="specialties" />, span: "" },
            { node: <LatestBlogsWidget key="blogs" />, span: "" },
            { node: <GithubActivity key="github" />, span: "lg:row-span-2" },
            { node: <Colophon key="colophon" />, span: "" },

            { node: <AnalyticsWidget key="analytics" />, span: "lg:col-span-2 lg:row-span-2" },
            { node: <QuoteCarousel key="quotes" />, span: "lg:row-span-2", bleed: true },

            { node: <ProjectsCounter key="projects" />, span: "" },
          ].map(({ node, span, bleed }, i) => (
            <div
              key={i}
              className={cn(
                "border-b border-r border-border transition-colors duration-200",
                span,
                bleed ? "relative" : "hover:bg-white/[0.04]"
              )}
            >
              {node}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/** A page section: eyebrow, heading, optional action, then its content. */
function Section({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 border-b border-border px-6 py-16 sm:px-10 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
            {eyebrow}
          </p>
          <h2 className="heading-display mt-4 text-2xl text-white sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">{subtitle}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex min-h-11 items-center text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {action.label}
            <VscChevronRight className="ml-1.5 h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
