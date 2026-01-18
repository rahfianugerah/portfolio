// components/TechStack.tsx
import { ComponentType } from "react";
import { DATA } from "@/data/resume";
import {
  SiPython, SiJavascript, SiTypescript, SiCplusplus, SiC,
  SiTensorflow, SiScikitlearn, SiPandas, SiNumpy,
  SiFlask, SiFastapi, SiNextdotjs, SiReact, SiNodedotjs,
  SiTailwindcss, SiBootstrap, SiMysql, SiSqlite, SiPostgresql,
  SiDocker, SiAmazonwebservices, SiGooglecloud, SiGnubash
,
  SiGit, SiGithub, SiPostman,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { RxQuestionMarkCircled } from "react-icons/rx";

type IconT = ComponentType<{ className?: string }>;

const ICONS: Record<string, IconT> = {
  // languages
  "python": SiPython,
  "javascript": SiJavascript,
  "js": SiJavascript,
  "typescript": SiTypescript,
  "ts": SiTypescript,
  "bash": SiGnubash,
  "c++": SiCplusplus,
  "cpp": SiCplusplus,
  "c": SiC,

  // frameworks/libs
  "tensorflow": SiTensorflow,
  "scikit-learn": SiScikitlearn,
  "scikitlearn": SiScikitlearn,
  "pandas": SiPandas,
  "numpy": SiNumpy,
  "flask": SiFlask,
  "fastapi": SiFastapi,
  "next.js": SiNextdotjs,
  "nextjs": SiNextdotjs,
  "react": SiReact,
  "node.js": SiNodedotjs,
  "nodejs": SiNodedotjs,
  "tailwind css": SiTailwindcss,
  "tailwind": SiTailwindcss,
  "bootstrap": SiBootstrap,

  // databases
  "mysql": SiMysql,
  "sqlite": SiSqlite,
  "postgresql": SiPostgresql,
  "postgres": SiPostgresql,

  // tools/platforms
  "docker": SiDocker,
  "aws": SiAmazonwebservices,
  "amazon web services": SiAmazonwebservices,
  "google cloud": SiGooglecloud,
  "gcp": SiGooglecloud,
  "azure": VscAzure,
  "git": SiGit,
  "github": SiGithub,
  "postman": SiPostman,
};

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}
function getIcon(name: string): IconT {
  return ICONS[norm(name)] ?? RxQuestionMarkCircled; // safe fallback
}

interface TechStackProps {
  title?: string;
  className?: string;
}

export default function TechStack({
  title = "Tech Stack",
  className = "",
}: TechStackProps) {
  // expect these arrays in your DATA (resume.tsx)
  const sections = [
    { label: "Programming Languages", items: DATA.programmingLanguages ?? [] },
    { label: "Frameworks & Libraries", items: DATA.frameworks ?? [] },
    { label: "Databases", items: DATA.databases ?? [] },
    { label: "Tools & Platforms", items: DATA.tools ?? [] },
  ];

  return (
    <section className={className}>
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-6">
        {sections.map(({ label, items }) => (
          <div key={label}>
            <h4 className="mb-2 text-sm font-medium text-foreground/80">{label}</h4>
            <ul className="flex flex-wrap gap-2">
              {items.map((name: string) => {
                const Icon = getIcon(name);
                return (
                  <li
                    key={`${label}-${name}`}
                    className="group inline-flex items-center rounded-sm bg-white/5 px-3 py-2 text-sm text-foreground/90 shadow-sm backdrop-blur transition hover:bg-white/10"
                  >
                    <Icon className="mr-2 h-4 w-4 opacity-90 transition" />
                    <span>{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
