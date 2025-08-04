"use client";

import React from "react";
import { useTheme } from "next-themes";
import { IconCloud } from "@/components/magicui/icon-cloud";

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
  const { theme } = useTheme();
  const color = theme === "dark" ? "#FFFFFF" : "#000000";

  const icons = ICON_DEFINITIONS.map(({ key, Component }) => (
    <Component key={key} size={ICON_SIZE} color={color} />
  ));

  return (
    <div className="relative flex w-full h-full items-center justify-center overflow-hidden">
      <IconCloud icons={icons} />
    </div>
  );
};