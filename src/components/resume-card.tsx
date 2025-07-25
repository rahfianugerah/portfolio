'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

interface Job {
  title: string;
  subtitle?: string;
  period: string;
  description?: string;
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
  description?: string;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  logoUrl,
  altText,
  title,
  href,
  period,
  jobs,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const jobsSorted = [...jobs].sort((a, b) => {
    const dateA = new Date(a.period.split(' - ')[0]).getTime();
    const dateB = new Date(b.period.split(' - ')[0]).getTime();
    return dateB - dateA;
  });
  const latestJob = jobsSorted[0];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExpanded(prev => !prev);
  };
  return (
    <a href={href || '#'} className="block cursor-pointer" onClick={handleClick}>
      <Card className="flex">
        <div className="flex-none">
          <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain"
            />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow ml-4 flex flex-col group">
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
                <div className="text-xs text-muted-foreground">
                  {latestJob.title}
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
                <div className="flex items-center gap-x-2">
                  <span className="h-5 w-0.5 bg-primary block" />
                  <h4 className="font-medium text-sm">{job.title}</h4>
                </div>
                {job.subtitle && (
                  <div className="text-xs text-muted-foreground ml-2">
                    {job.subtitle}
                  </div>
                )}
                {job.badges && job.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 justify-start ml-2">
                    {job.badges.map((b, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {b}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="text-xs tabular-nums ml-2 mt-1">
                  {job.period}
                </div>
                {job.description && (
                  <p className="text-xs ml-2 mt-1">{job.description}</p>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </Card>
    </a>
  );
};