'use client';

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { AnimatedShinyText } from "./magicui/animated-shiny-text";

interface Job {
  title: string;
  period: string;
  description: string | string[];
  badges?: readonly string[];
}

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  href?: string;
  period: string;
  badges?: readonly string[];
  jobs: Job[];
  description: string | string[];
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  logoUrl,
  altText,
  title,
  href,
  period,
  badges,
  jobs,
  description,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [expandedJobs, setExpandedJobs] = React.useState<boolean[]>(
    jobs.map(() => false)
  );

  // Sort jobs by start date descending
  const jobsSorted = [...jobs].sort((a, b) => {
    const dateA = new Date(a.period.split(' - ')[0]).getTime();
    const dateB = new Date(b.period.split(' - ')[0]).getTime();
    return dateB - dateA;
  });

  // Find job with longest duration
  const getDuration = (job: Job) => {
    const [startStr, endStr] = job.period.split(' - ');
    const start = new Date(startStr).getTime();
    const end = /present/i.test(endStr) ? Date.now() : new Date(endStr).getTime();
    return end - start;
  };
  const longestJob = jobsSorted.reduce((prev, curr) =>
    getDuration(curr) > getDuration(prev) ? curr : prev
  );

  const handleCompanyClick = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleJob = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setExpandedJobs((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <div className="block cursor-pointer" onClick={handleCompanyClick}>
      <Card className="flex">
        <div className="flex-none">
          {/* <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar> */}
        </div>
        <div className="flex-grow flex flex-col group">
          <CardHeader>
            <div className="flex items-center justify-between gap-x-4">
              <div>
                <h3 className="flex items-center gap-x-1 font-semibold text-sm">
                  {title}
                  <ChevronRightIcon
                    className={cn(
                      "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out",
                      "group-hover:translate-x-1 group-hover:opacity-100",
                      isExpanded ? "rotate-90" : "rotate-0"
                    )}
                  />
                </h3>
                <div className="text-xs">
                  <AnimatedShinyText>
                    {longestJob.title}
                  </AnimatedShinyText>
                </div>
              </div>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground">
                {period}
              </div>
            </div>
          </CardHeader>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              height: isExpanded ? 'auto' : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-2 overflow-hidden"
          >
            {jobsSorted.map((job, idx) => (
              <div key={idx} className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={(e) => toggleJob(e, idx)}
                >
                  <div className="flex items-center gap-x-2">
                    <span className="h-5 w-0.5 bg-primary block" />
                    <h4 className="font-medium text-sm">{job.title}</h4>
                  </div>
                  <ChevronRightIcon
                    className={cn(
                      "size-4 transform transition-transform",
                      expandedJobs[idx] ? "rotate-90" : "rotate-0"
                    )}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: expandedJobs[idx] ? 1 : 0,
                    height: expandedJobs[idx] ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden ml-4 mt-2"
                >
                  {job.badges && job.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {job.badges.map((b, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs tabular-nums mb-1">
                    {job.period}
                  </div>
                  {Array.isArray(job.description) ? (
                    <ul className="text-xs list-disc pl-4 space-y-1">
                      {job.description.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs whitespace-pre-line">
                      {job.description}
                    </p>
                  )}
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </Card>
    </div>
  );
};
