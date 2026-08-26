import Image from "next/image";
import Link from "next/link";
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
import ExperienceGraph from "@/app/components/experience-graph";
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
        <div className="absolute inset-0 opacity-50">
          <InteractiveGridPattern />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),#000_92%)]" />

        <div className="pointer-events-none relative z-10 grid items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <BlurFade delay={DELAY * 2}>
            <div>
              <p className="w-fit border border-border bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Available for work
              </p>
              <h1 className="heading-display mt-6 text-4xl leading-[1.1] text-white sm:text-5xl">
                {DATA.name}
              </h1>
              <p className="mt-4 text-base text-zinc-400 sm:text-lg">
                {DATA.description}
              </p>

              <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {heroLinks.map(([name, social]: [string, any]) => (
                  <Link
                    key={name}
                    href={social.url}
                    target="_blank"
                    className="inline-flex min-h-11 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
                  className="inline-flex min-h-11 items-center justify-center border border-zinc-700 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Ask my assistant
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
                className="object-cover grayscale"
                priority
              />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <Section id="about" eyebrow="About" title="Who I Am">
        <Markdown className="prose prose-invert max-w-3xl text-pretty text-sm leading-7 text-zinc-400">
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
        <div className="max-w-4xl">
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
            <h3 className="mt-16 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              Leadership
            </h3>
            <div className="mt-6 max-w-4xl">
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

        <h3 className="mt-16 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
          Education
        </h3>
        <div className="mt-6 max-w-4xl">
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
        <div className="-mx-6 grid border-l border-t border-border sm:-mx-10 sm:grid-cols-2 lg:grid-cols-3">
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
        <ul className="max-w-4xl divide-y divide-border border-y border-border">
          {DATA.hardwork.map((item: any, i: number) => (
            <BlurFade key={item.title + item.dates} delay={DELAY * (i + 1)}>
              <HardworkCard
                title={item.title}
                description={item.description}
                location={item.location}
                issued={item.issued}
                dates={item.dates}
                image={item.image}
                links={item.links}
              />
            </BlurFade>
          ))}
        </ul>
      </Section>

      {/* ---------------- Stats ---------------- */}
      <section id="stats" className="scroll-mt-16 border-b border-border">
        <div className="border-b border-border px-6 py-16 sm:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
            Signals
          </p>
          <h2 className="heading-display mt-4 text-2xl text-white">
            What This Site Knows
          </h2>
        </div>

        {/* The grid draws its own left and top edge; every cell draws its right and
            bottom. Each division is then one hairline shared by two cells, with no gaps
            and no last-child arithmetic. */}
        <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            <Clock key="clock" />,
            <AnalyticsWidget key="analytics" />,
            <ProjectsCounter key="projects" />,
            <GithubActivity key="github" />,
            <TechStack key="stack" />,
            <IconCloudSpecialties key="specialties" />,
            <ExperienceGraph key="velocity" />,
            <LatestBlogsWidget key="blogs" />,
            <QuoteCarousel key="quotes" />,
            <ImageCarousel key="images" />,
            <SocialLinks key="social" />,
          ].map((widget, i) => (
            <div key={i} className="border-b border-r border-border">
              {widget}
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
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
            {eyebrow}
          </p>
          <h2 className="heading-display mt-4 text-2xl text-white sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{subtitle}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex min-h-11 items-center text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {action.label} &rarr;
          </Link>
        )}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
