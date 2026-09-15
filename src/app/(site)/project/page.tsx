import BlurFade from "@/components/magicui/blur-fade";
import { CertificateList } from "@/components/certificate-list";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { InteractiveHexagonPattern } from "@/components/magicui/interactive-hexagon-pattern";
import { ProjectShowcase } from "@/components/project-showcase";
import { ProjectMarquee } from "@/components/project-marquee";
import { getCertificates, getPageMeta, getProjects } from "@/lib/content";
import { cn } from "@/lib/utils";

const DELAY = 0.04;

// Five projects tile three columns by three rows exactly: one large cell, two stacked beside it,
// then one and one wide. A short last group takes the tiling for its own count, so the grid never
// ends on a hole. Every span is lg-only: below it the grid is one or two plain columns.
const GROUP = ["lg:col-span-2 lg:row-span-2", "", "", "", "lg:col-span-2"];
const TAIL: Record<number, string[]> = {
  1: ["lg:col-span-3"],
  2: ["lg:col-span-2", ""],
  3: ["", "", ""],
  4: ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-3"],
};

function span(index: number, total: number) {
  const slot = index % 5;
  const left = total - (index - slot);
  return left >= 5 ? GROUP[slot] : TAIL[left][slot];
}

// What the page said before the studio could say it. A route with no pageMeta document
// keeps these words, so writing one is optional rather than a prerequisite.
const FALLBACK = {
  title: "Project",
  description: "A showcase of my work, and the certifications behind it.",
  heading: "Projects",
  subtitle:
    "Personal and collaborative work, each with its source and, where there is one, a running site.",
};

export async function generateMetadata() {
  const meta = await getPageMeta("/project");
  return {
    title: meta?.title ?? FALLBACK.title,
    description: meta?.description ?? FALLBACK.description,
  };
}

function Heading({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Rahfi&apos;s | {title}.
      </h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

export default async function ProjectPage() {
  const [projects, certificates, meta] = await Promise.all([
    getProjects(),
    getCertificates(),
    getPageMeta("/project"),
  ]);

  const professional = certificates.filter((one) => one.kind === "professional");
  const courses = certificates.filter((one) => one.kind === "learning");

  // Each block fades in after the ones above it.
  const count = projects.length;

  return (
    <div className="flex w-full flex-col gap-16 pb-8">
      <section id="projects" className="flex flex-col gap-6">
        {/* The heading band runs to both edges and up under the top bar, over the interactive hexagons. */}
        <div className="relative isolate -mx-4 -mt-24 overflow-hidden px-4 pb-8 pt-32 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <InteractiveHexagonPattern
            radius={28}
            className="-z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
          />
          <BlurFade delay={DELAY}>
            <Heading title={meta?.heading ?? FALLBACK.heading}>
              {meta?.subtitle ?? FALLBACK.subtitle}
            </Heading>
          </BlurFade>
        </div>

        <ProjectMarquee projects={projects} className="border-t" />

        <BentoGrid className="auto-rows-[18rem] grid-cols-1 md:grid-cols-2 lg:auto-rows-[15rem] lg:grid-flow-row-dense lg:grid-cols-3">
          {projects.map((project, i) => (
            <BlurFade
              key={project.id}
              delay={DELAY * (2 + i)}
              className={cn("h-full", span(i, projects.length))}
            >
              <ProjectShowcase project={project} />
            </BlurFade>
          ))}
        </BentoGrid>
      </section>

      <section id="certifications" className="flex flex-col gap-6">
        <BlurFade delay={DELAY * (2 + count)}>
          <Heading title="Certifications">
            Professional certifications first, then the courses behind them. Any certificate
            with an uploaded PDF opens on this page.
          </Heading>
        </BlurFade>

        <BlurFade delay={DELAY * (3 + count)}>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold tracking-tight">
              Professional.
            </h3>
            <CertificateList certificates={professional} />
          </div>
        </BlurFade>

        <BlurFade delay={DELAY * (4 + count)}>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold tracking-tight">
              Courses.
            </h3>
            <CertificateList certificates={courses} />
          </div>
        </BlurFade>
      </section>
    </div>
  );
}
