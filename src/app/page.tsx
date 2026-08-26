import BlurFade from "@/components/magicui/blur-fade";
import { HardworkCard } from "@/components/hardwork-card";
import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";

const BLUR_FADE_DELAY = 0.04;

type JobEntry = {
  title: string;
  subtitle?: string;
  period: string; // e.g. "Jan 2022 - Mar 2023" or "Feb 2023 - Present"
  description: string | string[];
  badges?: readonly string[];
};

type GroupedCompany = {
  company: string;
  logoUrl: string;
  href?: string;
  jobs: JobEntry[];
  period: string; // taken from the latest job below
};

// ---- group work by company ----
const groupedRaw = DATA.work.reduce((acc, item) => {
  if (!acc[item.company]) {
    acc[item.company] = {
      company: item.company,
      logoUrl: item.logoUrl,
      href: item.href,
      jobs: [] as JobEntry[],
    };
  }
  acc[item.company].jobs.push({
    title: item.title,
    subtitle: item.location,
    period: `${item.start} - ${item.end ?? "Present"}`,
    description:
      typeof item.description === "string" ? item.description : [...item.description],
    badges: item.badges,
  });
  return acc;
}, {} as Record<string, Omit<GroupedCompany, "period">>);

const groupedWorkAll: GroupedCompany[] = Object.values(groupedRaw).map((group) => {
  const latestJob = group.jobs.reduce((prev, curr) => {
    const getEndTime = (p: string) => {
      const end = p.split(" - ")[1];
      return end === "Present" ? Infinity : new Date(end).getTime();
    };
    return getEndTime(curr.period) >= getEndTime(prev.period) ? curr : prev;
  }, group.jobs[0]);

  return {
    ...group,
    period: latestJob.period,
  };
});

const groupedWorkLimited = groupedWorkAll.slice(0, 8);

export default function Page() {
  return (
    <div className="flex flex-col space-y-10">
      <section id="hero" className="relative overflow-hidden border border-border">
        {/* The consulting hero texture. The component is copied from consulting so both sites
            share one grid (one line differs, noted in the file); the opacity and fade are this site's,
            because the portfolio hero sits in a 440px column rather than a full page. */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <InteractiveGridPattern />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),#000_88%)]" />
        <div className="relative z-10 flex-col flex flex-1 space-y-1.5 px-4 py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-accent">{DATA.name}</h2>
                <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  <AnimatedShinyText>{DATA.description}</AnimatedShinyText>
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-2xl font-display tracking-[-0.04em]">
            About <span className="text-white">|</span> Rahfi<span className="text-white">.</span>
          </h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="font-garamond prose max-w-full text-pretty text-justify font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-2xl font-display tracking-[-0.04em]">
              Rahfi<span className="text-white">&apos;</span>s <span className="text-white">|</span> Experiences<span className="text-white">.</span>
            </h2>
          </BlurFade>

          {groupedWorkLimited.map((company, id) => (
            <BlurFade key={company.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
              <ResumeCard
                logoUrl={company.logoUrl}
                altText={company.company}
                title={company.company}
                href={company.href}
                period={company.period}
                jobs={company.jobs}
                description={company.jobs[0]?.description}
              />
            </BlurFade>
          ))}

          {/* Link to the full experiences page if there are more than 8 */}
          {groupedWorkAll.length > 8 && (
            <BlurFade delay={BLUR_FADE_DELAY * 6 + groupedWorkLimited.length * 0.05}>
              <div className="text-center pt-2">
                <Link href="/experience" className="underline underline-offset-4">
                  View All Experiences &gt;
                </Link>
              </div>
            </BlurFade>
          )}
        </div>
      </section>

      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-2xl font-display tracking-[-0.04em]">
              Rahfi<span className="text-white">&apos;</span>s <span className="text-white">|</span> Education<span className="text-white">.</span>
            </h2>
          </BlurFade>

          {DATA.education.slice(0, 4).map((edu, id) => {
            const job: JobEntry = {
              title: edu.degree,
              period: `${edu.start} - ${edu.end}`,
              description:
                typeof edu.description === "string" ? edu.description : [...edu.description],
            };
            return (
              <BlurFade key={edu.school} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
                <ResumeCard
                  logoUrl={edu.logoUrl}
                  altText={edu.school}
                  title={edu.school}
                  href={edu.href}
                  period={`${edu.start} - ${edu.end}`}
                  jobs={[job]}
                  description={job.description}
                />
              </BlurFade>
            );
          })}

          {/* Link to view all education (full list in /experience#education) */}
          {Array.isArray(DATA.education) && DATA.education.length > 4 && (
            <BlurFade delay={BLUR_FADE_DELAY * 8 + 4 * 0.05}>
              <div className="text-center pt-2">
                <Link href="/experience" className="underline underline-offset-4">
                  View All Educations &gt;
                </Link>
              </div>
            </BlurFade>
          )}
        </div>
      </section>

      {/* Skills/Specialties section moved to Left Rail */}

      <section id="hardwork">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-display tracking-[-0.04em]">
                  Rahfi<span className="text-white">&apos;</span>s <span className="text-white">|</span> Achievements<span className="text-white">.</span>
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  I have participated in various events, where I have
                  honed my skills and achieved significant milestones. Here are some of my
                  notable results.
                </p>
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <ul className="mb-4 text-justify divide-y">
              {DATA.hardwork.map((project, id) => (
                <BlurFade
                  key={project.title + project.dates}
                  delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                >
                  <HardworkCard
                    title={project.title}
                    description={project.description}
                    location={project.location}
                    issued={project.issued}
                    dates={project.dates}
                    image={project.image}
                    links={project.links}
                  />
                </BlurFade>
              ))}
            </ul>
          </BlurFade>
        </div>
      </section>

      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <h2 className="text-3xl font-display tracking-[-0.04em]">
                Let<span className="text-white">&apos;</span>s Connect<span className="text-white">.</span>
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me a dm
                with a direct question on {" "}
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  className="text-primary"
                >
                  LinkedIn
                </Link>{" "}
                and I&apos;ll respond whenever I can. I am always eager to
                collaborate on innovative projects and engage in meaningful discussions.
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </div>
  );
}
