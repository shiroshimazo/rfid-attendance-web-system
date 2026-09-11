begin;
-- LOCAL DEVELOPMENT ONLY: run after all migrations on a fresh local database.
-- Never run this fixture on hosted/production data. Existing rows are not overwritten.
-- Temporary RFID UID; no physical scan or SMS delivery is implied.
-- All three accounts use the password: ChangeMe123!

create extension if not exists pgcrypto with schema extensions;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'admin@rfid.local',
    extensions.crypt('ChangeMe123!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    '{"full_name":"System Administrator"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'teacher@rfid.local',
    extensions.crypt('ChangeMe123!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"teacher"}'::jsonb,
    '{"full_name":"Maria Santos"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '30000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'student@rfid.local',
    extensions.crypt('ChangeMe123!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"student"}'::jsonb,
    '{"full_name":"Juan Dela Cruz"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
on conflict do nothing;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '{"sub":"10000000-0000-0000-0000-000000000001","email":"admin@rfid.local"}'::jsonb,
    'email', now(), now(), now()
  ),
  (
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '{"sub":"20000000-0000-0000-0000-000000000001","email":"teacher@rfid.local"}'::jsonb,
    'email', now(), now(), now()
  ),
  (
    '30000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '{"sub":"30000000-0000-0000-0000-000000000001","email":"student@rfid.local"}'::jsonb,
    'email', now(), now(), now()
  )
on conflict do nothing;

-- Canonical BSIT program and eight subjects come from the pilot migrations.

insert into public.teachers (
  user_id,
  teacher_id,
  full_name,
  gender,
  date_of_birth,
  civil_status,
  email,
  phone_number,
  department,
  date_hired,
  status
)
values (
  '20000000-0000-0000-0000-000000000001',
  'T-001',
  'Maria Santos',
  'Female',
  '1990-05-15',
  'Married',
  'teacher@rfid.local',
  '+639171234567',
  'College of Computer Studies',
  '2022-06-01',
  'active'
)
on conflict do nothing;

insert into public.students (
  user_id,
  student_id,
  full_name,
  gender,
  date_of_birth,
  place_of_birth,
  address,
  contact_number,
  email,
  parent_name,
  parent_contact_number,
  year_level,
  section,
  program_id,
  campus,
  status
)
select
  '30000000-0000-0000-0000-000000000001',
  '2026-001',
  'Juan Dela Cruz',
  'Male',
  '2007-03-12',
  'Quezon City',
  'Novaliches, Quezon City',
  '+639181234567',
  'student@rfid.local',
  'Ana Dela Cruz',
  '+639191234567',
  '2nd Year',
  '21001',
  program.id,
  'Main Campus',
  'active'
from public.programs as program
where program.program_code = 'BSIT'
on conflict do nothing;

insert into public.teacher_assignments (
  teacher_id,
  program_id,
  course_id,
  year_level,
  section,
  campus,
  status
)
select
  teacher.id,
  program.id,
  course.id,
  '2nd Year',
  '21001',
  'Main Campus',
  'active'
from public.teachers as teacher
join public.programs as program on program.program_code = 'BSIT'
join public.courses as course
  on course.program_id = program.id
 and course.course_code = 'CCS2105'
where teacher.teacher_id = 'T-001'
on conflict do nothing;

insert into public.rfid_cards (student_id, rfid_number, card_status, assigned_date)
select id, '00000011', 'Active', '2026-08-01'
from public.students
where student_id = '2026-001'
on conflict do nothing;

-- Attendance and SMS rows are created by explicit tap tests, not fabricated by the seed.
commit;
