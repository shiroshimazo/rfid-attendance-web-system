# Database migrations

`202609010001_create_rfid_attendance_schema.sql` creates the original RFID attendance schema, relationships, constraints, indexes, authentication synchronization, and role-based Row Level Security.

`202609030001_correct_academic_structure.sql` separates degree programs from courses/subjects, adds multi-class teacher assignments, migrates the original ambiguous columns, and limits teacher access to assigned students.
