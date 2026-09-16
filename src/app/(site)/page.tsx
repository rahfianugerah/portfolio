import Link from "next/link";
import Markdown from "react-markdown";
import {
  Activity,
  ArrowRight,
  Bot,
  Camera,
  FolderGit2,
  Layers,
  NotebookPen,
  Quote,
  Share2,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";

import AnalyticsWidget from "@/app/components/widgets/analytics-widget";
import GitHubCard from "@/app/components/widgets/github-card";
import LatestBlogsWidget from "@/app/components/widgets/latest-blogs";
import ProjectsCounter from "@/app/components/widgets/projects-counter";
import ServicesCard from "@/app/components/widgets/services-card";
import SocialLinks from "@/app/components/widgets/social-links";
import ExperienceGraph from "@/app/components/experience-graph";
import ImageCarousel from "@/app/components/image-carousel";
import QuoteCarousel from "@/app/components/quote-carousel";
import Clock from "@/components/clock";
import { HardworkCard } from "@/components/hardwork-card";
import { HeroGlobe } from "@/components/hero-globe";
import { Icons } from "@/components/icons";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
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
         * Magic UI's bento grid: three columns, the wider cards spanning two of them. Each
         * cell names itself and then gets out of the way of the widget inside it.
         */}
        <BlurFade delay={0.06}>
          <BentoGrid className="auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <SignalCard
              Icon={Activity}
              name="Website Visitors"
              description="First-party, counted once per session."
              className="lg:col-span-2"
            >
              <AnalyticsWidget />
            </SignalCard>
            <SignalCard Icon={Camera} name="Moments" description="Photographs, uploaded in the studio.">
              <ImageCarousel />
            </SignalCard>
            <SignalCard
              Icon={Icons.github}
              name="GitHub"
              description="The profile, the activity, and the latest repositories."
              href="https://github.com/rahfianugerah"
              cta="Open GitHub"
              className="lg:col-span-2"
            >
              <GitHubCard />
            </SignalCard>
            <SignalCard Icon={Quote} name="Words I Keep" description="Quotations, uploaded in the studio.">
              <QuoteCarousel />
            </SignalCard>
            <SignalCard
              Icon={Layers}
              name="Tech Stack"
              description="Every language, framework, and tool the work is built with."
              className="lg:col-span-2"
            >
              <TechStack />
            </SignalCard>
            <SignalCard Icon={Sparkles} name="Specialties" description="The same tools, on a cloud that turns.">
              <IconCloudSpecialties />
            </SignalCard>
            <SignalCard
              Icon={TrendingUp}
              name="Experiences Velocity"
              description="How long each role ran, year by year."
              href="/experience"
              cta="The full timeline"
              className="lg:col-span-2"
            >
              <ExperienceGraph />
            </SignalCard>
            <BentoCard
              Icon={NotebookPen}
              name="Latest Writing"
              description="The five most recent posts."
              href="/blog"
              cta="Every post"
              className="col-span-1 min-h-80"
              background={
                <Backdrop>
                  <LatestBlogsWidget />
                </Backdrop>
              }
            />
            <BentoCard
              Icon={Wrench}
              name="Services"
              description="What the work covers, and where a larger engagement goes."
              href="https://consulting.rahfi.pro/#services"
              cta="See Consulting"
              className="col-span-1 min-h-80 lg:col-span-2"
              background={
                <Backdrop>
                  <ServicesCard />
                </Backdrop>
              }
            />
            <BentoCard
              Icon={FolderGit2}
              name="Projects Overview"
              description="Counts, stack, and leading work."
              href="/project"
              cta="Every project"
              className="col-span-1 min-h-80"
              background={
                <Backdrop>
                  <ProjectsCounter />
                </Backdrop>
              }
            />
            <BentoCard
              Icon={Bot}
              name="Ask Ashley"
              description="Rahfi's AI assistant, on her own page."
              href="/chat"
              cta="Open the chat"
              className="col-span-1 min-h-80 lg:col-span-2"
              background={
                <Backdrop className="grid place-items-center *:h-auto">
                  <Bot className="size-24 text-foreground/15" />
                </Backdrop>
              }
            />
            <SignalCard
              Icon={Share2}
              name="Connect"
              description="Where to find me."
              href="/contact"
              cta="Send a message"
            >
              <SocialLinks />
            </SignalCard>
          </BentoGrid>
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

/**
 * A widget behind a bento card's words, for the four cards that are read and then followed rather
 * than used in place: it fills the cell, loses its own frame, and fades out under the card's text,
 * which rises under the pointer to show where the card leads.
 */
function Backdrop({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_top,transparent_35%,#000_80%)]",
        "transition-transform duration-300 ease-out group-hover:scale-[1.02]",
        "*:h-full *:rounded-none *:border-0 *:bg-transparent *:shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * One cell of the signals bento: the icon, the name, and where it leads across the top, and the
 * live widget under them.
 *
 * The widget sits inside the card rather than behind it. As a background it was covered by the
 * card's own words, which hid a quotation and swallowed every link and tooltip under them; here it
 * keeps all of its behaviour and gives up only its own frame to the card around it.
 */
function SignalCard({
  Icon,
  name,
  description,
  href,
  cta,
  className,
  children,
}: {
  Icon: React.ElementType;
  name: string;
  description: string;
  href?: string;
  cta?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external = href?.startsWith("http");

  return (
    <div
      className={cn(
        "flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="size-5 shrink-0 text-foreground/70" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-tight">{name}</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
        {href && cta && (
          <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium underline-offset-4 hover:underline"
          >
            {cta}
            <ArrowRight className="size-3" />
          </Link>
        )}
      </div>

      {/* The widget keeps its behaviour and loses its frame: the card is the frame. */}
      <div className="min-h-0 flex-1 *:h-full *:rounded-none *:border-0 *:bg-transparent *:p-0 *:shadow-none">
        {children}
      </div>
    </div>
  );
}
