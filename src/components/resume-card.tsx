"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobEntry } from "@/lib/group-work";

interface ResumeRowProps {
  title: string;
  href?: string;
  period: string;
  jobs: JobEntry[];
}

/**
 * One company, as a row rather than a card.
 *
 * The list is read as a sequence, so it is divided by a single hairline between entries
 * instead of each entry drawing its own box. Hierarchy comes from type and space.
 */
export const ResumeCard: React.FC<ResumeRowProps> = ({ title, period, jobs }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Most recent role first, and the longest-running one is what labels the company.
  const jobsSorted = [...jobs].sort(
    (a, b) =>
      new Date(b.period.split(" - ")[0]).getTime() -
      new Date(a.period.split(" - ")[0]).getTime()
  );

  const durationOf = (job: JobEntry) => {
    const [start, end] = job.period.split(" - ");
    const finish = /present/i.test(end) ? Date.now() : new Date(end).getTime();
    return finish - new Date(start).getTime();
  };
  const longestJob = jobsSorted.reduce(
    (prev, curr) => (durationOf(curr) > durationOf(prev) ? curr : prev),
    jobsSorted[0]
  );

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
        className="group flex w-full min-h-11 items-baseline justify-between gap-6 py-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="heading-display text-base text-white">{title}</span>
            <ChevronRightIcon
              className={cn(
                "size-4 shrink-0 text-zinc-600 transition-transform duration-300 group-hover:text-white",
                isExpanded && "rotate-90"
              )}
            />
          </span>
          <span className="mt-1 block text-xs text-zinc-500">
            {longestJob?.title}
          </span>
        </span>
        <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] tabular-nums text-zinc-500">
          {period}
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-6">
          {jobsSorted.map((job, idx) => (
            <div
              key={`${job.title}-${idx}`}
              className="border-l border-border py-3 pl-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4 className="text-sm font-semibold text-white">{job.title}</h4>
                <span className="text-[11px] tabular-nums text-zinc-500">
                  {job.period}
                </span>
              </div>

              {job.badges && job.badges.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {job.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-[10px] uppercase tracking-[0.14em] text-zinc-600"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {Array.isArray(job.description) ? (
                <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-6 text-zinc-400 marker:text-zinc-700">
                  {job.description.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 whitespace-pre-line text-xs leading-6 text-zinc-400">
                  {job.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
