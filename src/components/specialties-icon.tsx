"use client";

import React from "react";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { Widget } from "@/app/components/widgets/widget";

import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiC,
  SiTensorflow,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiFlask,
  SiFastapi,
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiBootstrap,
  SiMysql,
  SiSqlite,
  SiDocker,
  SiGooglecloud,
  SiGit,
  SiGithub,
  SiPostman,
  SiLinux,
  SiGnubash,
} from "react-icons/si";
import { FaAws, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { VscAzure, VscVscode } from "react-icons/vsc";

const ICON_SIZE = 75;

const ICON_DEFINITIONS: Array<{
  key: string;
  Component: React.ComponentType<{ size: number; color: string }>;
}> = [
  { key: "python", Component: SiPython },
  { key: "javascript", Component: SiJavascript },
  { key: "typescript", Component: SiTypescript },
  { key: "cpp", Component: SiCplusplus },
  { key: "c", Component: SiC },
  { key: "html", Component: FaHtml5 },
  { key: "css", Component: FaCss3Alt },
  { key: "tensorflow", Component: SiTensorflow },
  { key: "pandas", Component: SiPandas },
  { key: "numpy", Component: SiNumpy },
  { key: "scikitlearn", Component: SiScikitlearn },
  { key: "flask", Component: SiFlask },
  { key: "fastapi", Component: SiFastapi },
  { key: "nextjs", Component: SiNextdotjs },
  { key: "react", Component: SiReact },
  { key: "nodejs", Component: SiNodedotjs },
  { key: "tailwindcss", Component: SiTailwindcss },
  { key: "bootstrap", Component: SiBootstrap },
  { key: "mysql", Component: SiMysql },
  { key: "sqlite", Component: SiSqlite },
  { key: "docker", Component: SiDocker },
  { key: "aws", Component: FaAws },
  { key: "googlecloud", Component: SiGooglecloud },
  { key: "azure", Component: VscAzure },
  { key: "git", Component: SiGit },
  { key: "github", Component: SiGithub },
  { key: "postman", Component: SiPostman },
  { key: "linux", Component: SiLinux },
  { key: "bash", Component: SiGnubash },
  { key: "vscode", Component: VscVscode },
];

export function IconCloudSpecialties() {
  // Always white: the site forces the dark theme, so the light branch this used to carry
  // was unreachable, and reading the theme only delayed the first paint of the cloud.
  const icons = ICON_DEFINITIONS.map(({ key, Component }) => (
    <Component key={key} size={ICON_SIZE} color="#FFFFFF" />
  ));

  return (
    <Widget title="Specialties" meta={`${ICON_DEFINITIONS.length} tools`}>
      {/* Fills the cell rather than a fixed 240px box, which is what cropped the sphere
          and left it sitting off-centre against its neighbours. */}
      <div className="relative flex min-h-[13rem] flex-1 items-center justify-center">
        <IconCloud icons={icons} />
      </div>
    </Widget>
  );
}
