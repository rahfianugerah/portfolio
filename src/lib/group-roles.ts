import type { Role } from "@/lib/content";

export type GroupedJob = {
  title: string;
  subtitle?: string;
  period: string;
  description: string[];
  badges?: readonly string[];
};

export type GroupedCompany = {
  company: string;
  logoUrl: string;
  href?: string;
  jobs: GroupedJob[];
  period: string;
};

/**
 * Collapses a flat list of roles into one entry per company.
 *
 * Two promotions at the same employer are one card with two jobs inside it, not two cards
 * with the same logo. This was written out three times across two pages before, and the
 * copies had started to disagree about what "Present" meant.
 *
 * The company's period runs from the earliest start to the latest end, and a role still held
 * ends at "Present", which sorts after every real date.
 */
export function groupRolesByCompany(roles: Role[]): GroupedCompany[] {
  const groups = new Map<string, Omit<GroupedCompany, "period">>();

  for (const role of roles) {
    const existing = groups.get(role.company);
    const group =
      existing ??
      { company: role.company, logoUrl: role.logo ?? "", href: role.href ?? undefined, jobs: [] };

    group.jobs.push({
      title: role.title,
      subtitle: role.location ?? undefined,
      period: `${role.start} - ${role.end ?? "Present"}`,
      description: role.description,
      badges: role.badges,
    });

    if (!existing) groups.set(role.company, group);
  }

  return Array.from(groups.values()).map((group): GroupedCompany => ({
    ...group,
    period: group.jobs.reduce(
      (latest: GroupedJob, job: GroupedJob) => (endsAfter(job, latest) ? job : latest),
      group.jobs[0]
    ).period,
  }));
}

/** A role still held outranks every dated one, and an unparseable date outranks nothing. */
function endsAfter(candidate: GroupedJob, incumbent: GroupedJob): boolean {
  return endTime(candidate) >= endTime(incumbent);
}

function endTime(job: GroupedJob): number {
  const end = job.period.split(" - ")[1];
  if (end === "Present") return Infinity;
  const parsed = new Date(end).getTime();
  return Number.isNaN(parsed) ? -Infinity : parsed;
}
