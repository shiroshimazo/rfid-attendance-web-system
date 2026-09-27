-- The server resolves names only after validating the student's own active
-- enrollments. Grant only the two columns used by that lookup; student roles
-- retain their existing teacher-profile restrictions.
grant select (id, full_name) on public.teachers to service_role;
