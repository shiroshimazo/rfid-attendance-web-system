# Reports service

Role-scoped report queries and complete PDF export of the documented attendance,
RFID, and authorized SMS content. P08 replaces the report buttons' browser printing
with `/api/reports/pdf`. The user selected pdfcn; its adapted Forme table component
and license are documented in `src/components/pdf/README.md`.

Admin snapshots retain archived attendance and include SMS linked to attendance
dates in the selected range. Teacher snapshots preserve current active assignment
boundaries and do not read guardian-message details. Both use the authenticated
Supabase client and RLS. Exports fetch the full range independently of UI previews.

Reports count explicit stored absences and captured time-in/time-out fields.
Final school absence policy remains P05; this module does not finalize absences
or send SMS. See `RFID-DOCS-SCOPE-AUDIT.md` for verification and live acceptance.
