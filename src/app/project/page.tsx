import React from "react";
import { ProjectCard } from "@/components/project-card";
import { ProjectCardWrapper } from "@/components/project-card-wrapper";
import { CertificateSection } from "@/components/certificate-card";
import { PageHeader } from "@/components/page-header";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";

const DELAY = 0.04;

export const metadata = {
  title: "Projects",
  description: "A showcase of my work, collaborations, and certifications.",
};

export default function ProjectPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title="Projects"
        subtitle="Personal and collaborative work, from research models to production systems. More on GitHub."
      />

      <section id="projects" className="scroll-mt-16">
        <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {DATA.projects.map((project: any, i: number) => (
            <BlurFade key={project.title} delay={DELAY * (i + 1)} className="flex">
              <ProjectCardWrapper>
                <ProjectCard
                  href={project.href}
                  title={project.title}
                  description={project.description}
                  status={project.status}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                  className="h-full w-full"
                />
              </ProjectCardWrapper>
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="certifications" className="scroll-mt-16 px-6 py-16 sm:px-10 sm:py-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
          Credentials
        </p>
        <h2 className="heading-display mt-4 text-2xl text-white sm:text-3xl">
          Certifications
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Certifications and course completions, most recent first.
        </p>

        <div className="mt-10">
          <CertificateSection
            certifications={DATA.certifications}
            learningCertificates={DATA.learning_certificate}
          />
        </div>
      </section>
    </>
  );
}
