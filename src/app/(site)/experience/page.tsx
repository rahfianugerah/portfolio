import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { getEducation, getPageMeta, getRoles } from "@/lib/content";
import { groupRolesByCompany, type GroupedJob } from "@/lib/group-roles";
import Image from "next/image";

// Base delay for all staggered animations on this page
const BLUR_FADE_DELAY = 0.04;

export async function generateMetadata() {
  const meta = await getPageMeta("/experience");
  return {
    title: meta?.title ?? "Full Experiences",
    description:
      meta?.description ??
      "A comprehensive list of my professional and leadership experiences.",
  };
}

export default async function ExperiencePage() {
  const [roles, education] = await Promise.all([getRoles(), getEducation()]);
  const groupedWorkExp = groupRolesByCompany(roles.filter((role) => role.kind === "work"));
  const groupedLeadershipExp = groupRolesByCompany(
    roles.filter((role) => role.kind === "leadership")
  );

  // Sequential delay helper (stable across a single render)
  let seq = 0;
  const nextDelay = () => {
    seq += 1;
    return seq * BLUR_FADE_DELAY;
  };

  return (
    <div className="flex flex-col space-y-10">
      {/* Hero */}
      <section id="hero" className="pt-12">
        <div className="flex flex-col items-center justify-center text-center">
          <BlurFade delay={nextDelay()}>
            <h2 className="text-3xl font-bebas">
              Full-List | Experiences.
            </h2>
          </BlurFade>
          <BlurFade delay={nextDelay()}>
            <p className="mt-2 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I have engaged in a wide range of experiences, both personal and collaborative, 
              that highlight my skills, growth, and creativity. Below is a full list of experiences that I am proud to showcase.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* All Experiences */}
      <section id="experiences" className="py-6">
        <div className="flex min-h-0 flex-col gap-y-6">
          {groupedWorkExp.map((company) => (
            <BlurFade key={company.company} delay={nextDelay()}>
              <div className="flex items-start gap-4">
                {/* Company logo */}
                {company.logoUrl ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                    <Image
                      src={company.logoUrl}
                      alt={`${company.company} logo`}
                      fill
                      sizes="48px"
                      className="object-contain bg-muted"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg border bg-muted/40 grid place-items-center text-xs text-muted-foreground">
                    Logo
                  </div>
                )}

                {/* ResumeCard */}
                <div className="flex-1">
                  <ResumeCard
                    logoUrl={company.logoUrl}
                    altText={company.company}
                    title={company.company}
                    href={company.href}
                    period={company.period}
                    jobs={company.jobs}
                    description={company.jobs[0]?.description}
                  />
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Leadership Experiences */}
      {groupedLeadershipExp.length > 0 && (
        <section id="leadership" className="py-6">
           <div className="flex flex-col items-center justify-center text-center">
          <BlurFade delay={nextDelay()}>
            <h2 className="text-3xl font-bebas">
              Leadership | Experiences.
            </h2>
          </BlurFade>
          <BlurFade delay={nextDelay()}>
            <p className="mt-2 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I have taken on diverse leadership experience that reflect my ability to guide, collaborate, and create meaningful impact. 
              Below is a full list of leadership experiences that I am proud to showcase.
            </p>
          </BlurFade>
        </div>

          <div className="flex min-h-0 flex-col gap-y-6 mt-8">
            {groupedLeadershipExp.map((org) => (
              <BlurFade key={org.company} delay={nextDelay()}>
                <div className="flex items-start gap-4">
                  {org.logoUrl ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                      <Image src={org.logoUrl} alt={`${org.company} logo`} fill sizes="48px" className="object-contain bg-muted" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg border bg-muted/40 grid place-items-center text-xs text-muted-foreground">
                      Logo
                    </div>
                  )}
                  <div className="flex-1">
                    <ResumeCard
                      logoUrl={org.logoUrl || ""}
                      altText={org.company}
                      title={org.company}
                      href={org.href}
                      period={org.period}
                      jobs={org.jobs}
                      description={org.jobs[0]?.description}
                    />
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </section>
      )}

      {/* Education (All) */}
      <section id="education" className="py-6">
         <div className="flex flex-col items-center justify-center text-center">
          <BlurFade delay={nextDelay()}>
            <h2 className="text-3xl font-bebas">
              Full-List | Educations.
            </h2>
          </BlurFade>
          <BlurFade delay={nextDelay()}>
            <p className="mt-2 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I have pursued a diverse educational journey that has shaped my knowledge, skills, and personal growth. 
                Below are some of the key educational experiences that I am proud to highlight.
            </p>
          </BlurFade>
        </div>

        <div className="flex min-h-0 flex-col gap-y-6 mt-6">
          {education.map((edu) => {
            const period = `${edu.start} - ${edu.end ?? "Present"}`;
            const job: GroupedJob = {
              title: edu.degree,
              period,
              description: edu.description,
            };
            return (
              <BlurFade key={edu.id} delay={nextDelay()}>
                <div className="flex items-start gap-4">
                  {edu.logo ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                      <Image src={edu.logo} alt={`${edu.school} logo`} fill sizes="48px" className="object-contain bg-muted" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg border bg-muted/40 grid place-items-center text-xs text-muted-foreground">
                      Logo
                    </div>
                  )}
                  <div className="flex-1">
                    <ResumeCard
                      logoUrl={edu.logo ?? ""}
                      altText={edu.school}
                      title={edu.school}
                      href={edu.href ?? undefined}
                      period={period}
                      jobs={[job]}
                      description={job.description}
                    />
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </section>
    </div>
  );
}
