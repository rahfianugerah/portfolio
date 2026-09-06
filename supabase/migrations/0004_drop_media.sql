-- 0004 drop the media library
--
-- Google Cloud Storage is gone. Every image, document and post lives in Sanity now, which
-- stores the bytes and the metadata together, so a second table describing files in a
-- bucket that no longer exists describes nothing.
--
-- This is a separate migration rather than an edit to 0002 and 0003 because migrations are
-- forward-only: 0002 may already have run, and rewriting an applied file leaves the
-- recorded history disagreeing with what is actually in the database.
--
-- Dropping the table cascades to its own policies, indexes and triggers. It does not drop
-- the function 0002 declared beside it, which would otherwise survive with nothing left to
-- fire on. public.touch_updated_at has exactly one user, the trigger on this table, so it
-- goes too; check that before copying this pattern to a table whose helper is shared.

drop table if exists public.media cascade;

drop function if exists public.touch_updated_at() cascade;
