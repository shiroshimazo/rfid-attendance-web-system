-- Remove old section formats (e.g. BSIT-1A). Pilot keeps 21001-21010 only.
-- Run in the Supabase SQL editor.
-- DANGER: deleting students cascades to their RFID cards, attendance records,
-- and SMS notifications. Their login accounts (auth.users / public.users) are
-- NOT deleted by this script; remove those in Authentication afterwards.
--
-- STEP 1: run the preview SELECTs, confirm every listed section is junk.
-- STEP 2: run the transaction (BEGIN ... COMMIT).

-- STEP 1: preview non-pilot sections.
select 'students' as source, section, count(*)
from public.students
where section not in ('21001', '21002', '21003', '21004', '21005',
                      '21006', '21007', '21008', '21009', '21010')
group by section
order by section;

select 'teacher_assignments' as source, section, count(*)
from public.teacher_assignments
where section is not null
  and section not in ('21001', '21002', '21003', '21004', '21005',
                      '21006', '21007', '21008', '21009', '21010')
group by section
order by section;

-- STEP 2: delete them.
begin;

delete from public.teacher_assignments
where section is not null
  and section not in ('21001', '21002', '21003', '21004', '21005',
                      '21006', '21007', '21008', '21009', '21010');

delete from public.students
where section not in ('21001', '21002', '21003', '21004', '21005',
                      '21006', '21007', '21008', '21009', '21010');

commit;

-- STEP 3 (optional): confirm only pilot sections remain.
select section, count(*)
from public.students
group by section
order by section;
