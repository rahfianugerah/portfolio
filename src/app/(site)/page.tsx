import Link from "next/link";
import Markdown from "react-markdown";
import { ArrowRight } from "lucide-react";

import AnalyticsWidget from "@/app/components/widgets/analytics-widget";
import GitHubCard from "@/app/components/widgets/github-card";
import LatestBlogsWidget from "@/app/components/widgets/latest-blogs";
import ProjectsCounter from "@/app/components/widgets/projects-counter";
import ServicesCard from "@/app/components/widgets/services-card";
import SocialLinks from "@/app/components/widgets/social-links";
import ExperienceGraph from "@/app/components/experience-graph";
import ImageCarousel from "@/app/components/image-carousel";
import QuoteCarousel from "@/app/components/quote-carousel";
import { AssistantAvatar } from "@/components/assistant-avatar";
import Clock from "@/components/clock";
import { HardworkCard } from "@/components/hardwork-card";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import BlurFade from "@/components/magicui/blur-fade";
import { Globe } from "@/components/magicui/globe";
import { Meteors } from "@/components/magicui/meteors";
import { NumberTicker } from "@/components/magicui/number-ticker";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity";
import { ProjectShowcase } from "@/components/project-showcase";
import { ProjectVelocity } from "@/components/project-velocity";
import { ResumeCard } from "@/components/resume-card";
import { SOCIAL_ICON } from "@/components/social-icon";
import { IconCloudSpecialties } from "@/components/specialties-icon";
import TechStack from "@/components/techstack";
import { buttonVariants } from "@/components/ui/button";
import {
  getAchievements,
  getCertificates,
  getEducation,
  getPageMeta,
  getProfile,
  getProjects,
  getRoles,
  getSkillGroups,
} from "@/lib/content";
import { groupRolesByCompany, type GroupedJob } from "@/lib/group-roles";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const meta = await getPageMeta("/");
  if (!meta) return {};

  // Absolute, or the layout template appends the site name to a title that already is it.
  return {
    title: { absolute: meta.title },
    description: meta.description ?? undefined,
  };
}

/** "Rahfi's | Title." with the paragraph under it, the way every section opens. */
function SectionTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Rahfi&apos;s | {title}.</h2>
      {children && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {children}
        </p>
      )}
    </div>
  );
}

// Runs a band past the page's side padding to both edges of the screen.
const BLEED = "-mx-4 sm:-mx-6 lg:-mx-8";

/**
 * The home page, as one full-width landing page read top to bottom.
 *
 * It replaced a 440 pixel column between four sticky rails. Every card those rails carried is
 * still here, gathered into the signals section, and everything the column carried is still
 * here too, now with the width to breathe: the hero, the experience, the education, the
 * projects, the achievements, and the way to get in touch.
 */
export default async function Page() {
  const [profile, roles, education, achievements, projects, certificates, skillGroups] =
    await Promise.all([
      getProfile(),
      getRoles(),
      getEducation(),
      getAchievements(),
      getProjects(),
      getCertificates(),
      getSkillGroups(),
    ]);

  const linkedIn = profile?.social.find((link) => link.icon === "linkedin")?.url;
  const companies = groupRolesByCompany(roles.filter((role) => role.kind === "work"));
  const skills = Array.from(new Set(skillGroups.flatMap((group) => group.items)));

  // Every figure is counted from the dataset, so none of them can drift from the content.
  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Companies", value: companies.length },
    { label: "Certifications", value: certificates.length },
    { label: "Achievements", value: achievements.length },
  ];

  return (
    <div className="flex flex-col pb-12">
      <section
        id="hero"
        className={cn(
          "relative isolate -mt-24 overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40",
          BLEED
        )}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Meteors number={24} />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <BlurFade delay={0.04}>
            {profile?.location && (
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {profile.location}
              </p>
            )}
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
              {profile?.name}
            </h1>
            <p className="mt-4 text-lg sm:text-2xl">
              <AnimatedShinyText className="mx-0 max-w-none">{profile?.role}</AnimatedShinyText>
            </p>
            {profile?.summary && (
              <Markdown className="prose mt-6 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground dark:prose-invert sm:text-base">
                {profile.summary}
              </Markdown>
            )}
            <div className="mt-8 flex flex-wrap gap-2">
              {profile?.social.map((link) => {
                const Icon = SOCIAL_ICON[link.icon] ?? SOCIAL_ICON.globe;
                return (
                  <Link
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
                  >
                    <Icon className="size-4" />
                    {link.name}
                  </Link>
                );
              })}
              <Link href="/chat" className={cn(buttonVariants(), "gap-2")}>
                Ask Ashley
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </BlurFade>

          <BlurFade delay={0.12}>
            <div className="mx-auto flex w-full max-w-[520px] flex-col gap-4">
              {/* Jakarta, marked on a globe that turns on its own and follows a drag. */}
              <div className="relative aspect-square w-full">
                <Globe />
              </div>
              <Clock />
            </div>
          </BlurFade>
        </div>
      </section>

      {skills.length > 0 && (
        <section
          aria-label="Skills"
          className={cn("relative overflow-hidden border-y border-border py-6", BLEED)}
        >
          <ScrollVelocityContainer className="text-3xl font-bold tracking-tight sm:text-5xl">
            <ScrollVelocityRow baseVelocity={2} direction={1} className="py-2">
              {skills.map((skill) => (
                <span key={skill} className="px-6">
                  {skill}
                </span>
              ))}
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={2} direction={-1} className="py-2 text-muted-foreground">
              {skills
                .slice()
                .reverse()
                .map((skill) => (
                  <span key={skill} className="px-6">
                    {skill}
                  </span>
                ))}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
        </section>
      )}

      <section aria-label="At a glance" className="mt-16">
        <BlurFade>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse bg-background p-6 sm:p-8">
                <dt className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="text-4xl font-bold tracking-tight sm:text-6xl">
                  <NumberTicker value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </BlurFade>
      </section>

      <section id="experience" className="mt-24 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <BlurFade className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle title="Experiences">
            Every company I have worked with. Open one to see the roles inside it.
          </SectionTitle>
          <Link
            href="/experience"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
          >
            Leadership and the full history
            <ArrowRight className="size-3.5" />
          </Link>
        </BlurFade>
        <BlurFade delay={0.08}>
          <div className="flex flex-col gap-3">
            {companies.map((company) => (
              <ResumeCard
                key={company.company}
                logoUrl={company.logoUrl}
                altText={company.company}
                title={company.company}
                href={company.href}
                period={company.period}
                jobs={company.jobs}
                description={company.jobs[0]?.description}
              />
            ))}
          </div>
        </BlurFade>
      </section>

      {education.length > 0 && (
        <section id="education" className="mt-24 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <BlurFade className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle title="Education" />
          </BlurFade>
          <BlurFade delay={0.08}>
            <div className="flex flex-col gap-3">
              {education.map((edu) => {
                const period = `${edu.start} - ${edu.end ?? "Present"}`;
                const job: GroupedJob = { title: edu.degree, period, description: edu.description };
                return (
                  <ResumeCard
                    key={edu.id}
                    logoUrl={edu.logo ?? ""}
                    altText={edu.school}
                    title={edu.school}
                    href={edu.href ?? undefined}
                    period={period}
                    jobs={[job]}
                    description={job.description}
                  />
                );
              })}
            </div>
          </BlurFade>
        </section>
      )}

      {projects.length > 0 && (
        <section id="projects" className="mt-24 flex flex-col gap-8">
          <BlurFade className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle title="Projects">
              Personal and collaborative work. The rows speed up as you scroll.
            </SectionTitle>
            <Link
              href="/project"
              className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
            >
              Every project and certificate
              <ArrowRight className="size-3.5" />
            </Link>
          </BlurFade>

          <ProjectVelocity projects={projects} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 8).map((project, i) => (
              <BlurFade key={project.id} delay={0.04 * i} className="h-full">
                <ProjectShowcase project={project} />
              </BlurFade>
            ))}
          </div>
        </section>
      )}

      <section id="signals" className="mt-24 flex flex-col gap-8">
        <BlurFade>
          <SectionTitle title="Signals">Live from this site, GitHub, and the studio.</SectionTitle>
        </BlurFade>

        {/*
         * Columns rather than a grid: every card keeps its own height and the columns pack
         * them, so no card is stretched to fill a row and no cell is ever left empty.
         */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 2xl:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
          <AnalyticsWidget />
          <GitHubCard />
          <ExperienceGraph />
          <ProjectsCounter />
          <ImageCarousel />
          <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Rahfi&apos;s Specialties
            </div>
            <IconCloudSpecialties />
          </div>
          <QuoteCarousel />
          <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <TechStack />
          </div>
          <LatestBlogsWidget />
          <ServicesCard />
          <Link
            href="/chat"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
          >
            <AssistantAvatar className="size-9" />
            <span className="min-w-0">
              <span className="block text-xs font-medium">Ask Ashley</span>
              <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
                Rahfi&apos;s AI assistant, on her own page
              </span>
            </span>
          </Link>
          <SocialLinks />
        </div>
      </section>

      {achievements.length > 0 && (
        <section id="achievements" className="mt-24 flex flex-col gap-8">
          <BlurFade>
            <SectionTitle title="Achievements">
              I have participated in various events, where I have honed my skills and achieved
              significant milestones. Here are some of my notable results.
            </SectionTitle>
          </BlurFade>
          <BlurFade delay={0.08}>
            <ul className="grid gap-x-12 md:grid-cols-2 [&>li]:border-b [&>li]:border-border">
              {achievements.map((achievement) => (
                <HardworkCard
                  key={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  location={achievement.location ?? ""}
                  issued={achievement.issuer ?? ""}
                  dates={achievement.dates ?? ""}
                  image={achievement.image ?? ""}
                  links={achievement.links}
                />
              ))}
            </ul>
          </BlurFade>
        </section>
      )}

      <section
        id="contact"
        className="relative isolate mt-24 overflow-hidden rounded-lg border border-border px-6 py-16 text-center sm:py-24"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Meteors number={16} />
        </div>
        <BlurFade>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Let&apos;s Connect.</h2>
          <p className="mx-auto mt-4 max-w-[600px] text-muted-foreground md:text-lg/relaxed">
            Want to chat? Just shoot me a dm with a direct question on{" "}
            <Link href={linkedIn ?? "#"} className="font-medium text-foreground underline underline-offset-4">
              LinkedIn
            </Link>{" "}
            and I&apos;ll respond whenever I can. I am always eager to collaborate on innovative
            projects and engage in meaningful discussions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link href="/contact" className={buttonVariants()}>
              Send a Message
            </Link>
            <Link href="/chat" className={buttonVariants({ variant: "outline" })}>
              Ask Ashley
            </Link>
          </div>
        </BlurFade>
      </section>
    </div>
  );
}
