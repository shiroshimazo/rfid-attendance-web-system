-- Remove BSHM data but keep the program row for future dropdowns.
-- The program row is set to inactive (dropdowns list all programs regardless
-- of status, so BSHM stays selectable later). Its students, courses, and
-- assignments are deleted.
-- DANGER: deleting students cascades to RFID cards, attendance, and SMS.
-- Login accounts (auth.users / public.users) survive; remove in Authentication.
--
-- STEP 1: preview. STEP 2: transaction. STEP 3: confirm.

-- STEP 1: preview what will go.
select id, program_code, program_name, status
from public.programs
where upper(btrim(program_code)) = 'BSHM';

select student_id, full_name, year_level, section, campus, status
from public.students
where program_id in (
  select id from public.programs where upper(btrim(program_code)) = 'BSHM'
)
order by section, full_name;

select course_code, course_name
from public.courses
where program_id in (
  select id from public.programs where upper(btrim(program_code)) = 'BSHM'
)
order by course_code;

select count(*) as assignments_to_delete
from public.teacher_assignments
where program_id in (
  select id from public.programs where upper(btrim(program_code)) = 'BSHM'
);

-- STEP 2: wipe BSHM rows, park the program as inactive.
begin;

delete from public.teacher_assignments
where program_id in (
  select id from public.programs where upper(btrim(program_code)) = 'BSHM'
);

delete from public.courses
where program_id in (
  select id from public.programs where upper(btrim(program_code)) = 'BSHM'
);

delete from public.students
where program_id in (
  select id from public.programs where upper(btrim(program_code)) = 'BSHM'
);

update public.programs
set status = 'inactive',
    updated_at = now()
where upper(btrim(program_code)) = 'BSHM';

commit;

-- STEP 3 (optional): confirm. BSHM row stays, empty and inactive.
select program_code, program_name, status
from public.programs
order by program_code;

select program_id, count(*) as remaining_students
from public.students
group by program_id;
