export type JobEntry = {
  title: string;
  subtitle?: string;
  period: string; // "Jan 2022 - Mar 2023", or "Feb 2023 - Present"
  description: string | string[];
  badges?: readonly string[];
};

export type GroupedCompany = {
  company: string;
  logoUrl: string;
  href?: string;
  jobs: JobEntry[];
  period: string; // taken from whichever job ran latest
};

type WorkItem = {
  company: string;
  title: string;
  location?: string;
  logoUrl: string;
  href?: string;
  start: string;
  end?: string;
  description: string | readonly string[];
  badges?: readonly string[];
};

const endTimeOf = (period: string) => {
  const end = period.split(" - ")[1];
  return end === "Present" ? Infinity : new Date(end).getTime();
};

/**
 * Collapse a flat list of roles into one entry per company, each holding its roles.
 *
 * This was written out three times across the home and experience pages, and the copies
 * had already begun to differ in how they handled a missing end date. One version now.
 */
export function groupByCompany(
  items: readonly WorkItem[] | undefined
): GroupedCompany[] {
  const grouped = (items ?? []).reduce((acc, item) => {
    if (!acc[item.company]) {
      acc[item.company] = {
        company: item.company,
        logoUrl: item.logoUrl,
        href: item.href,
        jobs: [],
      };
    }
    acc[item.company].jobs.push({
      title: item.title,
      subtitle: item.location,
      period: `${item.start} - ${item.end ?? "Present"}`,
      description:
        typeof item.description === "string"
          ? item.description
          : [...item.description],
      badges: item.badges,
    });
    return acc;
  }, {} as Record<string, Omit<GroupedCompany, "period">>);

  return Object.values(grouped).map((group) => ({
    ...group,
    period: group.jobs.reduce(
      (latest, job) =>
        endTimeOf(job.period) >= endTimeOf(latest.period) ? job : latest,
      group.jobs[0]
    ).period,
  }));
}
