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
import { HeroGlobe } from "@/components/hero-globe";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BentoGrid } from "@/components/magicui/bento-grid";
import BlurFade from "@/components/magicui/blur-fade";
import { InteractiveHexagonPattern } from "@/components/magicui/interactive-hexagon-pattern";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { MarqueeBand } from "@/components/marquee-band";
import { ResumeCard } from "@/components/resume-card";
import { SOCIAL_ICON } from "@/components/social-icon";
import { skillIcon } from "@/components/skill-icons";
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

// A signal card fills the height of its bento cell, so every row ends on one line.
const CELL = "*:h-full";

/**
 * The home page, read top to bottom in a centred column.
 *
 * The hero and the skills band run to both edges of the screen; everything else keeps to the
 * column. The signal cards sit in a bento grid, sized so each row of cards ends on one line.
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
      <section id="hero" className="bleed relative isolate -mt-24 overflow-hidden border-b border-border">
        <InteractiveHexagonPattern
          radius={30}
          className="-z-10 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-32 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-8 lg:pt-36 lg:pb-20">
          <BlurFade delay={0.04}>
            {profile?.location && (
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {profile.location}
              </p>
            )}
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              {profile?.name}
            </h1>
            <p className="mt-4 text-lg sm:text-2xl">
              <AnimatedShinyText className="mx-0 max-w-none">{profile?.role}</AnimatedShinyText>
            </p>
            {profile?.summary && (
              <div className="prose mt-6 max-w-2xl text-sm leading-7 text-muted-foreground dark:prose-invert sm:text-base">
                <Markdown>{profile.summary}</Markdown>
              </div>
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
            <div className="mx-auto flex w-full max-w-[440px] flex-col gap-4">
              {/* Jakarta, marked on a globe that turns on its own and follows a drag. */}
              <HeroGlobe avatar={profile?.avatar ?? null} initials={profile?.initials ?? ""} />
              <Clock />
            </div>
          </BlurFade>
        </div>
      </section>

      <MarqueeBand
        label="Skills"
        items={skills.map((skill) => {
          const Icon = skillIcon(skill);
          return { key: skill, label: skill, icon: Icon ? <Icon /> : undefined };
        })}
      />

      <section aria-label="At a glance" className="mt-16">
        <BlurFade>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse bg-background p-6 sm:p-8">
                <dt className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="text-4xl font-bold tracking-tight sm:text-5xl">
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
            The full timeline
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

      <section id="signals" className="mt-24 flex flex-col gap-8">
        <BlurFade>
          <SectionTitle title="Signals">Live from this site, GitHub, and the studio.</SectionTitle>
        </BlurFade>

        {/*
         * A bento grid of four columns. Every card fills its cell, so each row's edges run
         * straight: the photographs and the quotations, at either end of the first row, are at
         * least square and grow with the visitors card between them; the spans tile every row
         * with no hole.
         */}
        <BlurFade delay={0.06}>
          <BlurFadeFreeBento>
            <div className={CELL}>
              <ImageCarousel />
            </div>
            <div className={cn("lg:col-span-2", CELL)}>
              <AnalyticsWidget />
            </div>
            <div className={CELL}>
              <QuoteCarousel />
            </div>
            <div className={cn("lg:col-span-2", CELL)}>
              <ExperienceGraph />
            </div>
            <div className={CELL}>
              <div className="flex flex-col rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Rahfi&apos;s Specialties
                </div>
                <IconCloudSpecialties />
              </div>
            </div>
            <div className={CELL}>
              <LatestBlogsWidget />
            </div>
            <div className={cn("lg:col-span-2 lg:row-span-2", CELL)}>
              <GitHubCard />
            </div>
            <div className={cn("lg:col-span-2 lg:row-span-2", CELL)}>
              <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
                <TechStack />
              </div>
            </div>
            <div className={cn("lg:col-span-2", CELL)}>
              <ServicesCard />
            </div>
            <div className={CELL}>
              <ProjectsCounter />
            </div>
            <div className={CELL}>
              <SocialLinks />
            </div>
            <div className={cn("lg:col-span-4", CELL)}>
              <Link
                href="/chat"
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs transition-shadow hover:shadow-md"
              >
                <AssistantAvatar className="size-9" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">Ask Ashley</span>
                  <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">
                    Rahfi&apos;s AI assistant, on her own page
                  </span>
                </span>
              </Link>
            </div>
          </BlurFadeFreeBento>
        </BlurFade>
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
        className="relative isolate mt-24 overflow-hidden rounded-xl border border-border px-6 py-16 text-center sm:py-24"
      >
        <InteractiveHexagonPattern
          radius={28}
          className="-z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        />
        <BlurFade>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Let&apos;s Connect.</h2>
          <p className="mx-auto mt-4 max-w-[600px] text-center text-muted-foreground md:text-lg/relaxed">
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

/** Magic UI's bento grid as the frame for the signal cards: rows sized by their content. */
function BlurFadeFreeBento({ children }: { children: React.ReactNode }) {
  return (
    <BentoGrid className="auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-flow-row-dense lg:grid-cols-4">
      {children}
    </BentoGrid>
  );
}
