import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Services",
  description:
    "Full-stack web development, machine learning and AI integration, backend and API work, and cloud infrastructure.",
};

const SERVICES = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications using Next.js, React, Node.js, and modern databases, from UI to deployment.",
  },
  {
    id: 2,
    title: "Machine Learning & AI Integration",
    description:
      "Building and integrating ML models (TensorFlow, PyTorch, scikit-learn) into production-ready APIs and pipelines.",
  },
  {
    id: 3,
    title: "Backend & API Development",
    description:
      "Scalable REST APIs with FastAPI or Flask, backed by SQL/NoSQL databases and containerized with Docker.",
  },
  {
    id: 4,
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

      <div className="grid border-l border-t border-border sm:grid-cols-2">
        {SERVICES.map((service, i) => (
          <BlurFade key={service.id} delay={0.1 + i * 0.07}>
            <article className="flex h-full flex-col border-b border-r border-border p-8 transition-colors hover:bg-white/[0.02]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="heading-display mt-5 text-lg text-white">
                {service.title}
              </h2>
              <p className="mt-4 text-xs leading-6 text-zinc-400">
                {service.description}
              </p>
              <Link
                href="/contact"
                className="mt-auto inline-flex min-h-11 items-center pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Get in touch &rarr;
              </Link>
            </article>
          </BlurFade>
        ))}
      </div>
    </>
  );
}
