// components/TechStack.tsx
import { ComponentType } from "react";
import { DATA } from "@/data/resume";
import { Widget } from "@/app/components/widgets/widget";
import {
  SiPython, SiJavascript, SiTypescript, SiCplusplus, SiC,
  SiTensorflow, SiScikitlearn, SiPandas, SiNumpy,
  SiFlask, SiFastapi, SiNextdotjs, SiReact, SiNodedotjs,
  SiTailwindcss, SiBootstrap, SiMysql, SiSqlite, SiPostgresql,
  SiDocker, SiGooglecloud, SiGnubash,
  SiGit, SiGithub, SiPostman,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { FaAws } from "react-icons/fa";
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
  "aws": FaAws,
  "amazon web services": FaAws,
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

export default function TechStack() {
  const sections = [
    { label: "Languages", items: DATA.programmingLanguages ?? [] },
    { label: "Frameworks", items: DATA.frameworks ?? [] },
    { label: "Databases", items: DATA.databases ?? [] },
    { label: "Tools", items: DATA.tools ?? [] },
  ];

  const total = sections.reduce((n, s) => n + s.items.length, 0);

  // The widget frame supplies the label and the padding. This component used to draw a
  // text-lg heading of its own with no padding around it, which is why it sat flush
  // against the cell edge and pushed the whole grid row taller than its neighbours.
  return (
    <Widget title="Tech Stack" meta={`${total} tools`}>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto no-scrollbar">
        {sections.map(({ label, items }) => (
          <div key={label}>
            <h4 className="mb-2.5 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              {label}
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {items.map((name: string) => {
                const Icon = getIcon(name);
                return (
                  <li
                    key={`${label}-${name}`}
                    className="inline-flex items-center gap-1.5 border border-border px-2 py-1 text-[10px] text-zinc-300 transition-colors hover:border-white hover:text-white"
                  >
                    <Icon className="h-3 w-3" />
                    <span>{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Widget>
  );
}
