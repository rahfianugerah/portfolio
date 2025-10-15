import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";
import Image from "next/image";

// Base delay for all staggered animations on this page
const BLUR_FADE_DELAY = 0.04;

type JobEntry = {
  title: string;
  subtitle?: string;
  period: string;
  description: string | string[];
  badges?: readonly string[];
};

type GroupedCompany = {
  company: string;
  logoUrl: string;
  href?: string;
  jobs: JobEntry[];
  period: string;
};

// ---------- Group work by company ----------
const groupedRawExp = DATA.work.reduce((acc, item) => {
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

const groupedWorkExp: GroupedCompany[] = Object.values(groupedRawExp).map((group) => {
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

// ---------- Group leadership by company (same schema as work) ----------
const groupedLeadershipRaw = (DATA.leadership ?? []).reduce((acc, item) => {
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
    description: typeof item.description === "string" ? item.description : [...item.description],
    badges: item.badges,
  });
  return acc;
}, {} as Record<string, Omit<GroupedCompany, "period">>);

const groupedLeadershipExp: GroupedCompany[] = Object.values(groupedLeadershipRaw).map((group) => {
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

export default function ExperiencePage() {
  // Sequential delay helper (stable across a single render)
  let seq = 0;
  const nextDelay = () => {
    seq += 1;
    return seq * BLUR_FADE_DELAY;
  };

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-12">
      {/* Hero */}
      <section id="hero" className="pt-12">
        <div className="flex flex-col items-center justify-center text-center">
          <BlurFade delay={nextDelay()}>
            <h2 className="text-3xl font-bebas">
              Full-List <span className="text-[#FF0000]">|</span> Experiences
              <span className="text-[#FF0000]">.</span>
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
              Leadership <span className="text-[#FF0000]">|</span> Experiences
              <span className="text-[#FF0000]">.</span>
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
                      <Image src={org.logoUrl} alt={`${org.company} logo`} fill className="object-contain bg-muted" />
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
              Full-List <span className="text-[#FF0000]">|</span> Educations
              <span className="text-[#FF0000]">.</span>
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
          {[...DATA.education]
            .sort((a: any, b: any) => {
              const parseEnd = (x: any) => (x.end === "Present" ? Infinity : new Date(x.end).getTime());
              return parseEnd(b) - parseEnd(a);
            })
            .map((edu: any) => {
              const job: JobEntry = {
                title: edu.degree,
                period: `${edu.start} - ${edu.end ?? "Present"}`,
                description: typeof edu.description === "string" ? edu.description : [...edu.description],
              };
              return (
                <BlurFade key={`${edu.school}-${edu.degree}-${edu.start}`} delay={nextDelay()}>
                  <div className="flex items-start gap-4">
                    {edu.logoUrl ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                        <Image src={edu.logoUrl} alt={`${edu.school} logo`} fill className="object-contain bg-muted" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border bg-muted/40 grid place-items-center text-xs text-muted-foreground">
                        Logo
                      </div>
                    )}
                    <div className="flex-1">
                      <ResumeCard
                        logoUrl={edu.logoUrl}
                        altText={edu.school}
                        title={edu.school}
                        href={edu.href}
                        period={`${edu.start} - ${edu.end ?? "Present"}`}
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
    </main>
  );
}
