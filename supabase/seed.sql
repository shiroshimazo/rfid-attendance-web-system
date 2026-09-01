-- Local/demo accounts. Change these credentials outside local development.
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
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = now();

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
on conflict (provider_id, provider) do update
set
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.courses (department, course_name)
values
  ('BSIT', 'IPT'),
  ('BSIT', 'ITE'),
  ('BSIT', 'MS101')
on conflict (department, course_name) do nothing;

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
  course,
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
  'BSIT',
  'IPT',
  '2022-06-01',
  'active'
)
on conflict (teacher_id) do update
set
  user_id = excluded.user_id,
  full_name = excluded.full_name,
  email = excluded.email,
  department = excluded.department,
  course = excluded.course,
  status = excluded.status;

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
  course,
  campus,
  status
)
values (
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
  '1st Year',
  'BSIT-1A',
  'BSIT',
  'Main Campus',
  'active'
)
on conflict (student_id) do update
set
  user_id = excluded.user_id,
  full_name = excluded.full_name,
  email = excluded.email,
  parent_name = excluded.parent_name,
  parent_contact_number = excluded.parent_contact_number,
  year_level = excluded.year_level,
  section = excluded.section,
  course = excluded.course,
  campus = excluded.campus,
  status = excluded.status;

insert into public.rfid_cards (student_id, rfid_number, card_status, assigned_date)
select id, '04-A1-B2-C3-D4-E5-80', 'Active', '2026-08-01'
from public.students
where student_id = '2026-001'
on conflict (rfid_number) do update
set
  student_id = excluded.student_id,
  card_status = excluded.card_status,
  assigned_date = excluded.assigned_date;

insert into public.attendance_records (
  student_id,
  rfid_card_id,
  attendance_date,
  time_in,
  time_out,
  attendance_status,
  campus
)
select
  student.id,
  card.id,
  '2026-08-31',
  '07:32:00',
  '16:30:00',
  'Present',
  'Main Campus'
from public.students as student
join public.rfid_cards as card on card.student_id = student.id
where student.student_id = '2026-001'
  and card.rfid_number = '04-A1-B2-C3-D4-E5-80'
on conflict (student_id, attendance_date) do update
set
  rfid_card_id = excluded.rfid_card_id,
  time_in = excluded.time_in,
  time_out = excluded.time_out,
  attendance_status = excluded.attendance_status,
  campus = excluded.campus;

insert into public.sms_notifications (
  attendance_id,
  student_id,
  parent_contact_number,
  message,
  sms_status,
  sent_at
)
select
  attendance.id,
  student.id,
  student.parent_contact_number,
  student.full_name ||
    ' has successfully arrived at BestLink College of the Philippines - ' ||
    attendance.campus || '.',
  'Sent',
  '2026-08-31 07:33:00+08'
from public.students as student
join public.attendance_records as attendance on attendance.student_id = student.id
where student.student_id = '2026-001'
  and attendance.attendance_date = '2026-08-31'
  and not exists (
    select 1
    from public.sms_notifications as existing
    where existing.attendance_id = attendance.id
      and existing.sms_status = 'Sent'
  );

