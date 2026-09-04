# Database migrations

`202609010001_create_rfid_attendance_schema.sql` creates the original RFID attendance schema, relationships, constraints, indexes, authentication synchronization, and role-based Row Level Security.

`202609030001_correct_academic_structure.sql` separates degree programs from courses/subjects, adds multi-class teacher assignments, migrates the original ambiguous columns, and limits teacher access to assigned students.

`202609040001_enable_realtime.sql` adds attendance, RFID card, SMS, and student tables to the Supabase Realtime publication for live dashboards.

`202609050001_class_schedules.sql` creates per-section class schedules with role-based Row Level Security and seeds the BSIT 2nd Year pilot (sections 21001-21010, morning 06:00 and afternoon 13:00 Philippines Time) per the Late Attendance Ruling.

`202609060001_bsit_pilot_courses.sql` seeds the eight BSIT 2nd Year pilot subjects as the course catalog (canonical codes only; aliases stay in the ruling).
