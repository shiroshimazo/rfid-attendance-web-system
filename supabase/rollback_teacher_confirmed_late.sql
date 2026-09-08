-- Optional write-disable rollback. Keep Late confirmations and all history.
-- Reapply 202609140002_teacher_confirmed_late.sql to restore confirmation writes.
revoke execute on function public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz) from authenticated;
