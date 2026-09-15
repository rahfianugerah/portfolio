import BlurFade from "@/components/magicui/blur-fade";
import { HardworkCard } from "@/components/hardwork-card";
import { ResumeCard } from "@/components/resume-card";

import {
  getAchievements,
  getEducation,
  getPageMeta,
  getProfile,
  getRoles,
} from "@/lib/content";
import { groupRolesByCompany, type GroupedJob } from "@/lib/group-roles";
import Link from "next/link";
import Markdown from "react-markdown";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

const BLUR_FADE_DELAY = 0.04;

export async function generateMetadata() {
  const meta = await getPageMeta("/");
  if (!meta) return {};

  // Absolute, or the layout template appends the site name to a title that already is it.
  return {
    title: { absolute: meta.title },
    description: meta.description ?? undefined,
  };
}

export default async function Page() {
  const [profile, roles, education, achievements] = await Promise.all([
    getProfile(),
    getRoles(),
    getEducation(),
    getAchievements(),
  ]);
  const linkedIn = profile?.social.find((link) => link.icon === "linkedin")?.url;
  const groupedWorkAll = groupRolesByCompany(roles.filter((role) => role.kind === "work"));
  const groupedWorkLimited = groupedWorkAll.slice(0, 8);

  return (
    <div className="flex flex-col space-y-10">
      <section id="hero">
        <div className="flex-col flex flex-1 space-y-1.5 pt-12">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bebas">{profile?.name}</h2>
                <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  <AnimatedShinyText>{profile?.role}</AnimatedShinyText>
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-2xl font-bebas">
            About | Rahfi.
          </h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="font-garamond prose max-w-full text-pretty text-justify font-sans text-sm text-muted-foreground dark:prose-invert">
            {profile?.summary ?? ""}
          </Markdown>
        </BlurFade>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-2xl font-bebas">
              Rahfi&apos;s | Experiences.
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
            <h2 className="text-2xl font-bebas">
              Rahfi&apos;s | Education.
            </h2>
          </BlurFade>

          {education.slice(0, 4).map((edu, id) => {
            const period = `${edu.start} - ${edu.end ?? "Present"}`;
            const job: GroupedJob = {
              title: edu.degree,
              period,
              description: edu.description,
            };
            return (
              <BlurFade key={edu.id} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
                <ResumeCard
                  logoUrl={edu.logo ?? ""}
                  altText={edu.school}
                  title={edu.school}
                  href={edu.href ?? undefined}
                  period={period}
                  jobs={[job]}
                  description={job.description}
                />
              </BlurFade>
            );
          })}

          {/* Link to view all education (full list in /experience#education) */}
          {education.length > 4 && (
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
                <h2 className="text-3xl font-bebas">
                  Rahfi&apos;s | Achievements.
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
              {achievements.map((achievement, id) => (
                <BlurFade
                  key={achievement.id}
                  delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                >
                  <HardworkCard
                    title={achievement.title}
                    description={achievement.description}
                    location={achievement.location ?? ""}
                    issued={achievement.issuer ?? ""}
                    dates={achievement.dates ?? ""}
                    image={achievement.image ?? ""}
                    links={achievement.links}
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
              <h2 className="text-3xl font-bebas">
                Let&apos;s Connect.
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me a dm
                with a direct question on {" "}
                <Link href={linkedIn ?? "#"} className="text-primary">
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
