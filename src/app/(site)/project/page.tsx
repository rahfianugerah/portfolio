import BlurFade from "@/components/magicui/blur-fade";
import { CertificateList } from "@/components/certificate-list";
import { Meteors } from "@/components/magicui/meteors";
import { ProjectShowcase } from "@/components/project-showcase";
import { ProjectVelocity } from "@/components/project-velocity";
import { getCertificates, getPageMeta, getProjects } from "@/lib/content";

const DELAY = 0.04;

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

  let step = 0;
  const next = () => (step += 1) * DELAY;

  return (
    <div className="flex w-full flex-col gap-16 pb-8">
      <section id="projects" className="flex flex-col gap-6">
        {/* The heading band runs to both edges and up under the top bar, with meteors behind it. */}
        <div className="relative isolate -mx-4 -mt-24 overflow-hidden px-4 pb-8 pt-32 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <Meteors number={20} />
          </div>
          <BlurFade delay={next()}>
            <Heading title={meta?.heading ?? FALLBACK.heading}>
              {meta?.subtitle ?? FALLBACK.subtitle}
            </Heading>
          </BlurFade>
        </div>

        <ProjectVelocity projects={projects} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project) => (
            <BlurFade key={project.id} delay={next()} className="h-full">
              <ProjectShowcase project={project} />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="certifications" className="flex flex-col gap-6">
        <BlurFade delay={next()}>
          <Heading title="Certifications">
            Professional certifications first, then the courses behind them. Any certificate
            with an uploaded PDF opens on this page.
          </Heading>
        </BlurFade>

        <BlurFade delay={next()}>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold tracking-tight">
              Professional.
            </h3>
            <CertificateList certificates={professional} />
          </div>
        </BlurFade>

        <BlurFade delay={next()}>
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
