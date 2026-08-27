import Link from "next/link";
import { Code2, Brain, Server, Cloud } from "lucide-react";
import { VscChevronRight } from "react-icons/vsc";
import BlurFade from "@/components/magicui/blur-fade";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Services",
  description:
    "Full-stack web development, machine learning and AI integration, backend and API work, and cloud infrastructure.",
};

// Icons are the same lucide set the consulting site uses for its own service pillars, so
// the two read as one practice rather than two unrelated lists.
const SERVICES = [
  {
    id: 1,
    icon: Code2,
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications using Next.js, React, Node.js, and modern databases, from UI to deployment.",
  },
  {
    id: 2,
    icon: Brain,
    title: "Machine Learning & AI Integration",
    description:
      "Building and integrating ML models (TensorFlow, PyTorch, scikit-learn) into production-ready APIs and pipelines.",
  },
  {
    id: 3,
    icon: Server,
    title: "Backend & API Development",
    description:
      "Scalable REST APIs with FastAPI or Flask, backed by SQL/NoSQL databases and containerized with Docker.",
  },
  {
    id: 4,
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "Infrastructure setup, CI/CD pipelines, and cloud deployments on AWS, GCP, or Azure.",
  },
];

export default function ServicePage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What I Can Build"
        subtitle="Four things I am asked for most. If your problem sits between them, it is still worth a conversation."
      />

      <div className="-mr-px grid border-border sm:grid-cols-2">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <BlurFade key={service.id} delay={0.1 + i * 0.07}>
              <article className="flex h-full flex-col border-b border-r border-border p-8 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="heading-display mt-6 text-lg text-white">
                  {service.title}
                </h2>
                <p className="mt-4 text-[13px] leading-6 text-zinc-200">
                  {service.description}
                </p>
                <Link
                  href="/contact"
                  className="mt-auto inline-flex min-h-11 items-center pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Get in touch
                  <VscChevronRight className="ml-1.5 h-3 w-3" />
                </Link>
              </article>
            </BlurFade>
          );
        })}
      </div>

      {/* Larger engagements are a different product with a different contract, and they
          live on the consulting site. Pointing at it here is the only place the two
          properties reference each other. */}
      <section className="border-b border-border px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
              For companies
            </p>
            <h2 className="heading-display mt-4 text-2xl text-white sm:text-3xl">
              Bigger Than a Single Build
            </h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-zinc-200">
              Audits, retainers, automation programmes, and team enablement run through
              the consulting practice, where scope, pricing, and the engagement model are
              written down before anything starts.
            </p>
            <a
              href="https://consulting.rahfi.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center border border-zinc-600 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Rahfi Consulting
              <VscChevronRight className="ml-1.5 h-3 w-3" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
