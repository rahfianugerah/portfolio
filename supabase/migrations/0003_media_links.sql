-- 0003 links alongside files
--
-- The library holds two kinds of thing now. A file is uploaded and stored in the bucket;
-- a link is a URL to a document that lives somewhere else, such as a credential, a paper
-- or a drive folder, and has no object behind it.
--
-- One table rather than two: they are listed together, filtered together, and ordered
-- together, and a second table would mean every read became a union.

alter table public.media
  add column if not exists kind text not null default 'file'
    check (kind in ('file', 'link'));

alter table public.media
  add column if not exists title text;

alter table public.media
  add column if not exists external_url text;

alter table public.media
  add column if not exists category text;

-- A file must have an object; a link must have a URL and must not claim one. Enforced in
-- the database rather than only in the route, because a constraint holds for every writer
-- and a validation only holds for the one that ran.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'media_kind_shape'
  ) then
    alter table public.media add constraint media_kind_shape check (
      (kind = 'file' and storage_path is not null and external_url is null)
      or
      (kind = 'link' and external_url is not null)
    );
  end if;
end $$;

-- A link has no bytes, so the columns describing bytes stop being required.
alter table public.media alter column storage_path      drop not null;
alter table public.media alter column original_filename drop not null;
alter table public.media alter column mime_type         drop not null;
alter table public.media alter column original_bytes    drop not null;
alter table public.media alter column stored_bytes      drop not null;
alter table public.media alter column sha256            drop not null;

create index if not exists idx_media_kind on public.media (kind);
