import BlurFade from "@/components/magicui/blur-fade";
import { CertificateList } from "@/components/certificate-list";
import { ProjectShowcase } from "@/components/project-showcase";
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
      <h2 className="font-bebas text-3xl">
        Rahfi<span className="text-[#FF0000]">&apos;</span>s{" "}
        <span className="text-[#FF0000]">|</span> {title}
        <span className="text-[#FF0000]">.</span>
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
    <div className="flex w-full flex-col gap-16 py-8">
      <section id="projects" className="flex flex-col gap-6">
        <BlurFade delay={next()}>
          <Heading title={meta?.heading ?? FALLBACK.heading}>
            {meta?.subtitle ?? FALLBACK.subtitle}
          </Heading>
        </BlurFade>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <BlurFade key={project.id} delay={next()}>
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
            <h3 className="font-bebas text-xl">
              Professional<span className="text-[#FF0000]">.</span>
            </h3>
            <CertificateList certificates={professional} />
          </div>
        </BlurFade>

        <BlurFade delay={next()}>
          <div className="flex flex-col gap-3">
            <h3 className="font-bebas text-xl">
              Courses<span className="text-[#FF0000]">.</span>
            </h3>
            <CertificateList certificates={courses} />
          </div>
        </BlurFade>
      </section>
    </div>
  );
}
