-- BSIT 2nd Year pilot course catalog (Late Attendance Ruling subjects).
-- Slashed codes are one subject: only the first (canonical) code is stored.
-- Aliases (CPE211, CC104, ADV02) stay documented in the ruling until a future
-- migration adds an alias column.

do $$
declare
  bsit_id bigint;
begin
  insert into public.programs (program_code, program_name)
  values ('BSIT', 'BS Information Technology')
  on conflict do nothing;

  select id into bsit_id
  from public.programs
  where upper(program_code) = 'BSIT';

  insert into public.courses (program_id, course_code, course_name)
  values
    (bsit_id, 'CCS2207', 'Quantitative Methods with Modelling Simulation'),
    (bsit_id, 'CCS1204', 'Data Structures And Algorithms'),
    (bsit_id, 'CCS1201', 'Introduction To Human Computer Interaction'),
    (bsit_id, 'CCS2105', 'Integrative Programming And Technologies 1'),
    (bsit_id, 'CCS2107', 'Networking 1'),
    (bsit_id, 'ITE1', 'IT ELECTIVE 1 (Web Fundamental)'),
    (bsit_id, 'SOSLIT', 'Sosyedad at Literatura'),
    (bsit_id, 'PE3', 'Individual and Dual Sports')
  on conflict do nothing;
end
$$;
