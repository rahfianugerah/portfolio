import Image from "next/image";
import Link from "next/link";

import BlurFade from "@/components/magicui/blur-fade";
import { InteractiveHexagonPattern } from "@/components/magicui/interactive-hexagon-pattern";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { getEducation, getPageMeta, getRoles, type Education } from "@/lib/content";
import { groupRolesByCompany, type GroupedCompany } from "@/lib/group-roles";

export async function generateMetadata() {
  const meta = await getPageMeta("/experience");
  return {
    title: meta?.title ?? "Full Experiences",
    description:
      meta?.description ??
      "A comprehensive list of my professional and leadership experiences.",
  };
}

/** The first four-digit year in a period, which is what the timeline's rail is labelled with. */
function yearOf(period: string) {
  return period.match(/\d{4}/)?.[0] ?? period;
}

function Logo({ src }: { src: string | null | undefined }) {
  if (!src) {
    return (
      <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-muted text-[10px] text-muted-foreground">
        Logo
      </div>
    );
  }

  return (
    <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
      <Image src={src} alt="" fill sizes="44px" className="object-contain" />
    </div>
  );
}

function Name({ name, href }: { name: string; href?: string | null }) {
  if (!href) return <span className="text-lg font-bold tracking-tight">{name}</span>;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-lg font-bold tracking-tight underline-offset-4 hover:underline"
    >
      {name}
    </Link>
  );
}

/** One company on the timeline: every role held there, newest first as the data orders it. */
function CompanyCard({ company }: { company: GroupedCompany }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <Logo src={company.logoUrl} />
        <div className="flex min-w-0 flex-col">
          <Name name={company.company} href={company.href} />
          <span className="text-xs tabular-nums text-muted-foreground">{company.period}</span>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-5">
        {company.jobs.map((job) => (
          <li key={`${job.title}-${job.period}`} className="border-l border-border pl-4">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h4 className="text-sm font-semibold">{job.title}</h4>
              <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
                {job.period}
              </span>
            </div>
            {job.subtitle && <span className="block text-xs text-muted-foreground">{job.subtitle}</span>}
            {job.badges && job.badges.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {job.badges.map((badge) => (
                  <span key={badge} className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {badge}
                  </span>
                ))}
              </div>
            )}
            {job.description.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-justify text-sm leading-6 text-muted-foreground">
                {job.description.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** One school on the timeline: the degree, the period, and what it covered. */
function EducationCard({ education }: { education: Education }) {
  const period = `${education.start} - ${education.end ?? "Present"}`;

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <Logo src={education.logo} />
        <div className="flex min-w-0 flex-col">
          <Name name={education.school} href={education.href} />
          <span className="text-xs tabular-nums text-muted-foreground">{period}</span>
        </div>
      </div>
      <h4 className="mt-4 text-sm font-semibold">{education.degree}</h4>
      {education.description.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-justify text-sm leading-6 text-muted-foreground">
          {education.description.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Intro({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      <p className="max-w-3xl text-muted-foreground md:text-lg/relaxed">{children}</p>
    </div>
  );
}

const byCompany = (companies: GroupedCompany[]): TimelineEntry[] =>
  companies.map((company) => ({
    title: yearOf(company.period),
    content: <CompanyCard company={company} />,
  }));

/**
 * Every experience as an Aceternity timeline: the work, the leadership, and the education, each
 * on its own rail that fills as the page scrolls past it.
 */
export default async function ExperiencePage() {
  const [roles, education] = await Promise.all([getRoles(), getEducation()]);
  const work = groupRolesByCompany(roles.filter((role) => role.kind === "work"));
  const leadership = groupRolesByCompany(roles.filter((role) => role.kind === "leadership"));

  return (
    <div className="flex flex-col gap-16 pb-12">
      <header className="relative isolate -mx-4 -mt-24 overflow-hidden px-4 pt-32 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <InteractiveHexagonPattern
          radius={28}
          className="-z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        />
        <BlurFade delay={0.04}>
          <Intro title="Full-List | Experiences.">
            I have engaged in a wide range of experiences, both personal and collaborative, that
            highlight my skills, growth, and creativity. Below is a full list of experiences that I
            am proud to showcase.
          </Intro>
        </BlurFade>
      </header>

      <section id="experiences">
        <Timeline data={byCompany(work)} />
      </section>

      {leadership.length > 0 && (
        <section id="leadership" className="flex flex-col gap-4">
          <BlurFade>
            <Intro title="Leadership | Experiences.">
              I have taken on diverse leadership experience that reflect my ability to guide,
              collaborate, and create meaningful impact. Below is a full list of leadership
              experiences that I am proud to showcase.
            </Intro>
          </BlurFade>
          <Timeline data={byCompany(leadership)} />
        </section>
      )}

      {education.length > 0 && (
        <section id="education" className="flex flex-col gap-4">
          <BlurFade>
            <Intro title="Full-List | Educations.">
              I have pursued a diverse educational journey that has shaped my knowledge, skills,
              and personal growth. Below are some of the key educational experiences that I am
              proud to highlight.
            </Intro>
          </BlurFade>
          <Timeline
            data={education.map((one) => ({
              title: yearOf(one.start),
              content: <EducationCard education={one} />,
            }))}
          />
        </section>
      )}
    </div>
  );
}
