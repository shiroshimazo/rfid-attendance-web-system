# Students

Student profiles, academic placement, guardian contacts, archive state, and role-safe presentation models.

P02 create/edit actions validate the active program catalog entry and use
`save_student_profile` for atomic profile/lifecycle changes. Auth owns email;
an email API failure reports which profile details already saved. See the
[migration rollout](../../../supabase/migrations/README.md#p02-safe-management-saves-rollout)
before deploying these actions. Cards are registered and edited in Manage RFID
Cards; this directory assigns a stored card to a student and releases it back to
the card list through the same `save_rfid_card` writer. See the
[card inventory rollout](../../../supabase/migrations/README.md#rfid-card-inventory-and-student-assignment).
