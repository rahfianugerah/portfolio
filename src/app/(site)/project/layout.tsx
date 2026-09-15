import { ProjectSplash } from "@/components/project-splash";

/** Every /project route: the terminal that plays on opening /project, then the page. */
export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectSplash />
      {children}
    </>
  );
}
