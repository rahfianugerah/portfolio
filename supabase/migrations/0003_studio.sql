-- The studio: one owner, the content of both sites, the posts, and the credentials.
--
-- Sanity held all of this before. It lives here now so that one sign-in edits both
-- rahfi.pro and consulting.rahfi.pro, and so that a post is written in Markdown rather than
-- re-entered into someone else's editor.
--
-- Two kinds of table, and the difference is the whole security model:
--
--   documents, posts     Public by definition. The anon key may read them, and nothing else.
--   everything else      Closed. No policy exists, so the anon key cannot see a row. Only the
--                        backend reaches them, through the service role, which bypasses RLS.

create extension if not exists pgcrypto;

-- Every content document either site renders: a role, a project, a quote, a page's metadata.
-- One table rather than fifteen, because the shape of each belongs to the page that draws it
-- and changes with it; a column per field would turn every copy edit into a migration.
create table if not exists public.documents (
  id         uuid primary key default gen_random_uuid(),
  type       text not null,
  data       jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_type_sort on public.documents (type, sort_order);

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  summary      text not null default '',
  cover_url    text,
  tags         text[] not null default '{}',
  body_md      text not null default '',
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_posts_published_at on public.posts (published, published_at desc);

alter table public.documents enable row level security;
alter table public.posts     enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename='documents' and policyname='documents_public_read') then
    create policy documents_public_read on public.documents for select to anon using (true);
  end if;
  -- A draft is not public. This predicate is the only thing that keeps one off the internet.
  if not exists (select 1 from pg_policies where tablename='posts' and policyname='posts_public_read_published') then
    create policy posts_public_read_published on public.posts for select to anon using (published);
  end if;
end $$;

revoke insert, update, delete on public.documents from anon, authenticated;
revoke insert, update, delete on public.posts     from anon, authenticated;

-- The one account. The row is created by hand in the table editor, with the email address
-- and nothing else: there is no sign-up, and the address a reset code is sent to is whatever
-- sits here, never something a request supplies.
--
-- password_blob is an Argon2id digest sealed with AES-256-GCM. The key is in the deployment
-- environment and never in this database, so a dump of this table is not even material for
-- offline guessing. The row id is bound in as associated data.
create table if not exists public.studio_owner (
  id                  uuid primary key default gen_random_uuid(),
  email               text not null unique,
  password_blob       text,
  password_nonce      text,
  key_version         integer not null default 1,
  failed_attempts     integer not null default 0,
  locked_until        timestamptz,
  last_login_at       timestamptz,
  password_changed_at timestamptz,
  created_at          timestamptz not null default now()
);

-- A session is a random token in an HttpOnly cookie. Only its SHA-256 is kept, so this table
-- cannot be replayed as a set of cookies.
create table if not exists public.studio_sessions (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references public.studio_owner (id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

-- A reset code: six digits, kept as a hash, short-lived, single use, and attempt-limited.
create table if not exists public.studio_otps (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references public.studio_owner (id) on delete cascade,
  code_hash  text not null,
  attempts   integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at    timestamptz
);

-- Model keys, the mail password, the storage service account. Each value is AES-256-GCM
-- ciphertext with its own nonce; the name is bound in as associated data, so a blob lifted
-- from one row cannot be pasted into another.
create table if not exists public.credentials (
  name        text primary key,
  blob        text not null,
  nonce       text not null,
  key_version integer not null default 1,
  updated_at  timestamptz not null default now()
);

create table if not exists public.rate_limit_events (
  id         bigserial primary key,
  bucket     text not null,
  key_hash   text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_rate_limit_events_lookup
  on public.rate_limit_events (bucket, key_hash, created_at desc);

alter table public.studio_owner      enable row level security;
alter table public.studio_sessions   enable row level security;
alter table public.studio_otps       enable row level security;
alter table public.credentials       enable row level security;
alter table public.rate_limit_events enable row level security;

revoke all on public.studio_owner      from anon, authenticated;
revoke all on public.studio_sessions   from anon, authenticated;
revoke all on public.studio_otps       from anon, authenticated;
revoke all on public.credentials       from anon, authenticated;
revoke all on public.rate_limit_events from anon, authenticated;

-- One limiter for every bucket the backend has: sign-in, reset codes, the contact form, the
-- assistants. Unlike check_chat_rate_limit it takes its ceiling as an argument, which is safe
-- only because the anon key cannot call it.
create or replace function public.check_rate_limit(
  p_bucket text,
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, remaining integer, reset_seconds integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_used   integer;
  v_oldest timestamptz;
begin
  delete from public.rate_limit_events where created_at < now() - interval '1 day';

  select count(*), min(created_at) into v_used, v_oldest
  from public.rate_limit_events
  where bucket = p_bucket
    and key_hash = p_key_hash
    and created_at >= now() - make_interval(secs => p_window_seconds);

  if v_used >= p_limit then
    return query select
      false,
      0,
      greatest(1, ceil(extract(epoch from
        (v_oldest + make_interval(secs => p_window_seconds)) - now()
      ))::integer);
    return;
  end if;

  insert into public.rate_limit_events (bucket, key_hash) values (p_bucket, p_key_hash);
  return query select true, p_limit - v_used - 1, p_window_seconds;
end;
$$;

revoke all on function public.check_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, text, integer, integer) to service_role;
