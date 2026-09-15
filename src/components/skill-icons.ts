import type { ComponentType } from "react";
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

export type SkillIcon = ComponentType<{ className?: string }>;

/**
 * The icon for each skill name the studio holds.
 *
 * It lived inside the tech stack card, which is a client component, and a server page cannot
 * call a function exported from one. Here it serves both the card and the skills marquee.
 */
const ICONS: Record<string, SkillIcon> = {
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

/** The icon for a skill, or null when there is none for that name. */
export function skillIcon(name: string): SkillIcon | null {
  return ICONS[name.trim().toLowerCase().replace(/\s+/g, " ")] ?? null;
}
