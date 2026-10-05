-- 0001 analytics baseline
--
-- Replaces supabase-schema.sql and supabase-rls-policies.sql, which contradicted each
-- other: the first disabled row-level security on all three tables and the second enabled
-- it with permissive policies. Which was true depended on which had been pasted into the
-- console most recently, and nothing recorded the answer.
--
-- This states the intended end state and is safe to re-run: every statement is guarded.
-- RLS is ON, and the anon role gets exactly the verbs the site actually issues.

create table if not exists public.counters (
  id          bigserial primary key,
  name        text unique not null,
  value       integer default 0,
  updated_at  timestamptz default now()
);

create table if not exists public.daily_stats (
  id           bigserial primary key,
  date         date not null,
  counter_type text not null default 'visits',
  visits       integer default 0,
  updated_at   timestamptz default now(),
  unique (date, counter_type)
);

create table if not exists public.sessions (
  id         bigserial primary key,
  session_id text unique not null,
  created_at timestamptz default now()
);

create index if not exists idx_daily_stats_date   on public.daily_stats (date);
create index if not exists idx_sessions_session_id on public.sessions (session_id);
create index if not exists idx_counters_name       on public.counters (name);

insert into public.counters (name, value) values ('visitors', 0)
  on conflict (name) do nothing;
insert into public.counters (name, value) values ('project_views', 0)
  on conflict (name) do nothing;

alter table public.counters    enable row level security;
alter table public.daily_stats enable row level security;
alter table public.sessions    enable row level security;

-- The anon key is public, so these policies are the only thing standing between the
-- internet and this data. Each grants one verb the site actually issues; no DELETE
-- policy exists anywhere, so nothing can be removed through the public key.
do $$
begin
  if not exists (select 1 from pg_policies where tablename='counters' and policyname='counters_public_read') then
    create policy counters_public_read on public.counters for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='counters' and policyname='counters_public_update') then
    create policy counters_public_update on public.counters for update to anon using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename='daily_stats' and policyname='daily_stats_public_read') then
    create policy daily_stats_public_read on public.daily_stats for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='daily_stats' and policyname='daily_stats_public_insert') then
    create policy daily_stats_public_insert on public.daily_stats for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='daily_stats' and policyname='daily_stats_public_update') then
    create policy daily_stats_public_update on public.daily_stats for update to anon using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename='sessions' and policyname='sessions_public_read') then
    create policy sessions_public_read on public.sessions for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='sessions' and policyname='sessions_public_insert') then
    create policy sessions_public_insert on public.sessions for insert to anon with check (true);
  end if;
end $$;
