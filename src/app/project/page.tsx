import React from "react";
import { ProjectCard } from "@/components/project-card";
import { HyperText } from "@/components/magicui/hyper-text";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { CertificateCard } from "@/components/certificate-card";

const BLUR_FADE_DELAY = 0.04;

export const metadata = {
    title: "Projects",
    description: "A showcase of my work and collaborations.",
};

export default function ProjectPage() {
    // sequential counter for delay
    let seq = 0;
    const nextDelay = () => {
        seq += 1;
        return seq * BLUR_FADE_DELAY;
    };

    return (
        <>
            <section id="projects">
                <div className="space-y-12 w-full py-12">
                    <BlurFade delay={nextDelay()}>
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    <HyperText>Rahfi's Projects</HyperText>
                                </h2>
                                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    I have worked on various projects, both personal and collaborative,
                                    that showcase my skills and creativity. Here are some of my notable
                                    projects that I am proud to share.
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                        {DATA.projects.map((project) => (
                            <BlurFade
                                key={project.title}
                                delay={nextDelay()}
                            >
                                <ProjectCard
                                    href={project.href}
                                    title={project.title}
                                    description={project.description}
                                    status={project.status}
                                    tags={project.technologies}
                                    image={project.image}
                                    video={project.video}
                                    links={project.links}
                                />
                            </BlurFade>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <BlurFade delay={nextDelay()}>
                            <p className="text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                If you want to see more of my projects check out my GitHub or press the button on the navbar.
                            </p>
                        </BlurFade>
                    </div>
                </div>
            </section>
            <section id="certifications">
                <div className="space-y-12 w-full py-12">
                    <BlurFade delay={nextDelay()}>
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    <HyperText>Rahfi's Certifications</HyperText>
                                </h2>
                                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    I have obtained various certifications that demonstrate my expertise
                                    and commitment to continuous learning. Here are some of the certifications
                                    that I am proud to showcase.
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                    <BlurFade delay={nextDelay()}>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            <HyperText>Certified Certificates</HyperText>
                        </h2>
                    </BlurFade>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                        {DATA.certifications.map((cert) => (
                            <BlurFade
                                key={cert.title}
                                delay={nextDelay()}
                            >
                                <CertificateCard
                                    title={cert.title}
                                    issued={cert.issued}
                                    links={cert.links?.map(link => ({
                                        icon: link.icon,
                                        href: link.href,
                                        type: link.title ?? "Certificate"
                                    }))}
                                />
                            </BlurFade>
                        ))}
                    </div>
                    <BlurFade delay={nextDelay()}>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            <HyperText>Learning Certificates</HyperText>
                        </h2>
                    </BlurFade>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                        {DATA.learning_certificate.map((cert) => (
                            <BlurFade
                                key={cert.title}
                                delay={nextDelay()}
                            >
                                <CertificateCard
                                    title={cert.title}
                                    issued={cert.issued}
                                    links={cert.links?.map(link => ({
                                        icon: link.icon,
                                        href: link.href,
                                        type: link.title ?? "Certificate"
                                    }))}
                                />
                            </BlurFade>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <BlurFade delay={nextDelay()}>
                            <p className="text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                If you want to see more of my certificates check out my LinkedIn or press the button on the navbar.
                            </p>
                        </BlurFade>
                    </div>
                </div>
            </section>
        </>
    );
}
