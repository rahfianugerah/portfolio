import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";

const SERVICES = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description: "End-to-end web applications using Next.js, React, Node.js, and modern databases, from UI to deployment.",
  },
  {
    id: 2,
    title: "Machine Learning & AI Integration",
    description: "Building and integrating ML models (TensorFlow, PyTorch, scikit-learn) into production-ready APIs and pipelines.",
  },
  {
    id: 3,
    title: "Backend & API Development",
    description: "Scalable REST APIs with FastAPI or Flask, backed by SQL/NoSQL databases and containerized with Docker.",
  },
  {
    id: 4,
    title: "Cloud & DevOps",
    description: "Infrastructure setup, CI/CD pipelines, and cloud deployments on AWS, GCP, or Azure.",
  },
];

export default function ServicePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-8">
      <BlurFade delay={0.05}>
        <h1 className="text-3xl font-bebas">
          Rahfi<span className="text-[#FF0000]">&apos;</span>s <span className="text-[#FF0000]">|</span> Services<span className="text-[#FF0000]">.</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s what I can help you build. Interested in any of these? Let&apos;s talk.
        </p>
      </BlurFade>

      <div className="flex flex-col gap-4">
        {SERVICES.map((service, i) => (
          <BlurFade key={service.id} delay={0.1 + i * 0.07}>
            <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3 shadow-sm">
              <div>
                <h2 className="font-semibold text-base">{service.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
              </div>
              <Link
                href="/contact"
                className="self-start text-xs font-medium underline underline-offset-4 hover:text-primary transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
