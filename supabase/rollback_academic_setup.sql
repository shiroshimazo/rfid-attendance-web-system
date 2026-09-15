-- Reverse 202609220001_academic_catalog.sql. Restore the previous application
-- version together with this rollback: it reads the pilot constants instead of
-- this catalog and does not know subject status.
-- No student, assignment, schedule, or attendance row references the catalog,
-- so their stored text and all history stay intact. Class groupings added in
-- Academic Setup and subject archive flags are discarded; reapplying the
-- migration rebuilds the catalog from the pilot scope and the groupings in use.
begin;
drop table if exists public.academic_sections;
alter table public.courses drop column if exists status;
notify pgrst, 'reload schema';
commit;
