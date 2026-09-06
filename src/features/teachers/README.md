# Teachers

Teacher profiles, employment information, section assignments, archive state, and read-only assigned-student access.

P02 create/edit actions validate BSIT and subject membership before Auth account
creation. Every assignment requires explicit pilot year, section, and campus.
`save_teacher_profile` commits the profile and replacement assignments together;
failure preserves the previous assignments. Auth owns accepted email changes,
with explicit partial-save errors if its API rejects an email. Apply the
[P02 migration](../../../supabase/migrations/README.md#p02-safe-management-saves-rollout)
before deploying these actions.
