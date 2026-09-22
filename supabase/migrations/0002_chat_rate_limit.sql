-- Rate limiting for Ashley, the assistant on the site.
--
-- Every answer costs a call to Ollama Cloud, so an open chat endpoint is someone else's
-- budget to spend. The counter lives here rather than in the application because a
-- serverless instance is replaced constantly: an in-process counter resets before it ever
-- limits anyone, and two instances never see each other's count.

create table if not exists public.chat_requests (
  id         bigserial primary key,
  ip_hash    text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_requests_ip_hash_created_at
  on public.chat_requests (ip_hash, created_at desc);

-- No policy is created for this table, and none should be. The anon key reaches the limit
-- only through the function below, so the counter cannot be read, reset, or deleted from a
-- browser holding the public key.
alter table public.chat_requests enable row level security;

revoke all on public.chat_requests from anon;
revoke all on public.chat_requests from authenticated;

-- The ceiling and the window are constants in here, not arguments. The anon key is public,
-- so a caller that could pass its own limit would have no limit at all.
create or replace function public.check_chat_rate_limit(p_ip_hash text)
returns table (allowed boolean, remaining integer, reset_seconds integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  c_limit          constant integer := 20;
  c_window_seconds constant integer := 3600;
  v_used           integer;
  v_oldest         timestamptz;
begin
  -- A digest is 64 hex characters. Anything else did not come from the application.
  if p_ip_hash is null or length(p_ip_hash) <> 64 then
    return query select false, 0, c_window_seconds;
    return;
  end if;

  -- Keeps the table bounded: a day covers every window that can still be open.
  delete from public.chat_requests where created_at < now() - interval '1 day';

  select count(*), min(created_at) into v_used, v_oldest
  from public.chat_requests
  where ip_hash = p_ip_hash
    and created_at >= now() - make_interval(secs => c_window_seconds);

  if v_used >= c_limit then
    return query select
      false,
      0,
      greatest(1, ceil(extract(epoch from
        (v_oldest + make_interval(secs => c_window_seconds)) - now()
      ))::integer);
    return;
  end if;

  insert into public.chat_requests (ip_hash) values (p_ip_hash);
  return query select true, c_limit - v_used - 1, c_window_seconds;
end;
$$;

revoke all on function public.check_chat_rate_limit(text) from public;
grant execute on function public.check_chat_rate_limit(text) to anon;
