"use client";

import { ReactNode } from "react";

type ProjectCardWrapperProps = {
  children: ReactNode;
};

export function ProjectCardWrapper({ children }: ProjectCardWrapperProps) {
  const handleClick = () => {
    // Track project click
    fetch("/api/analytics?action=project-click").catch((err) => {
      console.error("Failed to track project click:", err);
    });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}
