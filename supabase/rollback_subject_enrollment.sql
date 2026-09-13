-- Stop roster edits and subject confirmations while retaining all enrollment,
-- attendance and RFID data. Roll back the application release at the same time.
begin;
revoke execute on function public.save_subject_enrollment(bigint,bigint[],integer) from authenticated;
revoke execute on function public.confirm_subject_attendance(bigint,date,bigint,text,timestamptz) from authenticated;
commit;
-- Reapply 202609190001_subject_enrollment.sql to resume checked writes.
