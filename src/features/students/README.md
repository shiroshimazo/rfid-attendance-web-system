# Students

Student profiles, academic placement, guardian contacts, archive state, and role-safe presentation models.

P02 create/edit actions validate the actual BSIT catalog entry and use
`save_student_profile` for atomic profile/lifecycle changes. Auth owns email;
an email API failure reports which profile details already saved. See the
[migration rollout](../../../supabase/migrations/README.md#p02-safe-management-saves-rollout)
before deploying these actions. RFID replacement remains the separate P03 task.
