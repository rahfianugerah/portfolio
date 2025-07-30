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
    return (
        <>
            <section id="projects">
                <div className="space-y-12 w-full py-12">
                    <BlurFade delay={BLUR_FADE_DELAY * 11}>
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
                        {DATA.projects.map((project, id) => (
                            <BlurFade
                                key={project.title}
                                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                            >
                                <ProjectCard
                                    href={project.href}
                                    key={project.title}
                                    title={project.title}
                                    description={project.description}
                                    dates={project.dates}
                                    tags={project.technologies}
                                    image={project.image}
                                    video={project.video}
                                    links={project.links}
                                />
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>
            <section id="certifications">
                <div className="space-y-12 w-full py-12">
                    <BlurFade delay={BLUR_FADE_DELAY * 11}>
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
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                        {DATA.certifications.map((cert, id) => (
                            <BlurFade
                                key={cert.title}
                                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                            >
                                <CertificateCard
                                    title={cert.title}
                                    issued={cert.issued}
                                    description={cert.description}
                                    image={cert.image}
                                    links={cert.links?.map(link => ({
                                        icon: link.icon,
                                        href: link.href,
                                        type: link.title ?? "Certificate"
                                    }))}
                                />
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
