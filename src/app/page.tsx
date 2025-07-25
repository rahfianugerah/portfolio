import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { HackathonCard } from "@/components/hackathon-card";
import { ResumeCard } from "@/components/resume-card";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

type JobEntry = {
  title: string;
  subtitle?: string;
  period: string;        // e.g. "Jan 2022 - Mar 2023" or "Feb 2023 - Present"
  description?: string;
};

type GroupedCompany = {
  company: string;
  logoUrl: string;
  href?: string;
  badges?: readonly string[];
  jobs: JobEntry[];
  period: string;        // taken from the latest job below
};

const groupedRaw = DATA.work.reduce((acc, item) => {
  if (!acc[item.company]) {
    acc[item.company] = {
      company: item.company,
      logoUrl: item.logoUrl,
      href: item.href,
      badges: item.badges,
      jobs: [] as JobEntry[],
    };
  }
  acc[item.company].jobs.push({
    title:       item.title,
    subtitle:    item.location,
    period:      `${item.start} - ${item.end ?? "Present"}`,
    description: item.description,
  });
  return acc;
}, {} as Record<string, Omit<GroupedCompany, "period">>);

const groupedWork: GroupedCompany[] = Object.values(groupedRaw).map(group => {
  const latestJob = group.jobs.reduce((prev, curr) => {
    const getEndTime = (p: string) => {
      const end = p.split(" - ")[1];
      return end === "Present"
        ? Infinity
        : new Date(end).getTime();
    };
    return getEndTime(curr.period) >= getEndTime(prev.period)
      ? curr
      : prev;
  }, group.jobs[0]);

  return {
    ...group,
    period: latestJob.period,
  };
});

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="flex-col flex flex-1 space-y-1.5">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Welcome to Rahfi's Space
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Hello, World! I&apos;m Rahfi
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {DATA.description}
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About Rahfi.</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty text-justify font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Rahfi's Experiences.</h2>
          </BlurFade>
          {groupedWork.map((company, id) => (
            <BlurFade key={company.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
              <ResumeCard
                logoUrl={company.logoUrl}
                altText={company.company}
                title={company.company}
                href={company.href}
                badges={company.badges}
                period={company.period}
                jobs={company.jobs}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Rahfi's Education.</h2>
          </BlurFade>
          {DATA.education.map((edu, id) => (
            <BlurFade key={edu.school} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
              <ResumeCard
                logoUrl={edu.logoUrl}
                altText={edu.school}
                title={edu.school}
                href={edu.href}
                badges={[]}
                period={`${edu.start} - ${edu.end}`}
                jobs={[{
                  title: edu.degree,
                  period: `${edu.start} - ${edu.end}`,
                }]}
              />
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Rahfi's Specialties.</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="font-bold text-muted-foreground">Programming Languages.</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.programmingLanguages.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="font-bold text-muted-foreground">Frameworks.</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.frameworks.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="font-bold text-muted-foreground">Databases.</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.databases.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="font-bold text-muted-foreground">Tools.</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.tools.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="hardwork">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Hardwork
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Achievements
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
            <ul className="mb-4 ml-4 text-justify divide-y divide-dashed border-l">
              {DATA.hardwork.map((project, id) => (
                <BlurFade
                  key={project.title + project.dates}
                  delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                >
                  <HackathonCard
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
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Contact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Let&apos;s Connect
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me a dm
                with a direct question on {" "}
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  className="text-blue-500 hover:underline"
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
    </main>
  );
}
