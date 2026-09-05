# RFID Attendance System: UI/UX Improvement Plan

Reviewed: September 5, 2026. Source baseline: `d592923`, including the current working tree.

**R02 scope update (2026-09-05):** this is a supporting review, not an independent
release backlog. [RFID-DOCS-SCOPE-AUDIT.md](RFID-DOCS-SCOPE-AUDIT.md) controls active
tasks. Its exclusions/deferred decisions override proposals here. In particular,
do not add teacher SMS access, a retry console, or a new PDF library to satisfy
this review. The R03 recovery decision remains a separate task.

The main improvement is to make attendance information trustworthy and daily tasks easier to complete. Prioritize accurate status labels, accessible sign-in, reliable recovery, visible connection status, and complete reports. Then improve mobile controls and reduce interruptions during everyday work.

This is a source-based professional assessment with 15 findings: **5 HIGH and 10 MEDIUM**. It proposes changes; it does not implement them.

## 1. Scope and confidence

**Review mode:** Full. The implementation uses Next.js 16, React 19, Tailwind CSS 4, shared Radix-based components, Lucide icons, Recharts, and Motion. Keep recommendations within those existing systems.

**Evidence boundary:** Findings come from component markup, styles, event handlers, state management, and attendance presentation logic. No authenticated browser session, screenshots, usability interviews, screen-reader session, or physical RFID test was performed. Layout and interaction effects inferred from source require browser confirmation. This document does not certify accessibility compliance or production readiness.

| Area | What was inspected |
| --- | --- |
| Shared shell | Portal layout, role navigation, header, theme configuration, global styles, buttons, inputs, dialogs, pagination, form associations, and live refresh. |
| Authentication | Sign-in fields, validation, password visibility, loading and error feedback, and the recovery form. |
| Administrator | Dashboard composition and KPIs; representative attendance and directory controls; student and teacher form steps; archive confirmation; RFID directory controls; schedule editing; report tables, range selection, and printing. |
| Teacher | Dashboard composition, attendance page and table state, student details and history link, report controls and section table, and password form structure. |
| Student | Dashboard composition, current attendance mapping, attendance history, RFID and SMS cards, and password form structure. |
| Product rules | The BSIT second-year pilot, first-tap late classification, the student interaction specification, and relevant entries in the existing codebase backlog. |

The review covers representative paths through these areas, not every field or every rendered state.

### Design coverage

| Category | Evidence inspected | Result |
| --- | --- | --- |
| Typography | Global font configuration, dashboard headings, KPI labels, descriptions, status badges, and error copy. | Existing `text-balance`, `text-pretty`, and `tabular-nums` are useful. UX03, UX11, and UX13 address meaning and hierarchy. Rendered contrast and truncation are not verified. |
| Surfaces | Shared buttons, input and dialog styles, pagination, date popover, and responsive page ordering. | UX08–UX11 and UX15 address interaction surfaces. Optical alignment, actual overflow, and elevation are not verified visually. |
| Animations | Sign-in icon transitions, administrator password toggle, dialog transitions, shared button styles, and `SlidingNumber`. | UX14. The counter already checks reduced motion. Motion was not replayed at 10% speed. |
| Icons | Lucide imports, password visibility controls, row actions, dialog close, and text-bearing status badges. | Inspected action icons generally have accessible names. UX10 addresses their hit areas. No icon-library replacement is justified. |
| Performance | Realtime subscription/debounce, refresh behavior, table reset effects, and transition declarations. | UX04, UX05, and UX14. No latency, frame-rate, or workload measurement was performed. |

## 2. Preserve the useful foundation

- Keep the separate administrator, teacher, and student navigation. Each role already has a focused menu.
- Keep shared theme tokens, Lucide icons, and existing form and table components. A second design system would increase inconsistency.
- Keep text inside attendance and RFID badges. Meaning is not conveyed through color alone.
- Keep sortable table headers with `aria-sort`, labeled row actions, loading skeletons, and reusable empty/error states.
- Keep the student and teacher form steps, field validation, review content, and pending submission states.
- Keep the archive/restore confirmation that explains account access, attendance retention, and RFID consequences.
- Keep the schedule cutoff preview and its Philippines Time explanation.

These strengths are visible in source. Their presence does not replace interaction testing.

## 3. Prioritized findings

**HIGH:** An interaction is inaccessible, misleading, or threatens confidence in operational information. Resolve these before UX sign-off.

**MEDIUM:** A noticeable usability problem, interruption, or consistency gap. Include these in the next focused improvement cycle.

**Evidence labels:** “Confirmed” describes source behavior. “Inferred” describes its expected user impact. “Design proposal” requires validation with users.

### Trustworthy actions and attendance information

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH · UX01 | [src/app/(auth)/forgot-password/components/forgot-password-form-1.tsx:28](<src/app/(auth)/forgot-password/components/forgot-password-form-1.tsx#L28>), [same file:35](<src/app/(auth)/forgot-password/components/forgot-password-form-1.tsx#L35>) | **Confirmed:** The page promises a reset email. Submit only displays that Supabase recovery is not connected. | Complete the recovery request, reset form, and expired-link path. Until recovery is available, replace the form with truthful school-account assistance instructions using a verified contact route. | Match the action to its promise. A locked-out user currently reaches a dead end after entering information. |
| HIGH · UX02 | [src/app/(auth)/sign-in/components/login-form-1.tsx:118](<src/app/(auth)/sign-in/components/login-form-1.tsx#L118>), [same file:152](<src/app/(auth)/sign-in/components/login-form-1.tsx#L152>), [src/components/ui/form.tsx:107](<src/components/ui/form.tsx#L107>) | **Confirmed:** `FormControl` wraps a `div` around each sign-in input. The shared slot places its generated ID and error associations on that wrapper. | Put the decorative wrapper outside `FormControl`. Make the actual input its direct child, retaining password-toggle labels and autocomplete. | Preserve programmatic label and error relationships. The visible label currently targets a wrapper instead of the input. |
| HIGH · UX03 | [src/features/attendance/student-dashboard.ts:79](<src/features/attendance/student-dashboard.ts#L79>), [src/app/(portal)/student/dashboard/components/today-attendance-card.tsx:38](<src/app/(portal)/student/dashboard/components/today-attendance-card.tsx#L38>) | **Updated by current status fixes and R01:** Present/Late/Absent are preserved; missing taps stay provisional and legacy values display neutrally. | Preserve recorded Present, Late, and Absent states; keep legacy rows available without promoting a retired status. Distinguish “No tap recorded yet” from a finalized absence. Keep Late included in attended totals. | Maintain consistent meaning between the dashboard and history. A missing record alone does not establish the school's final absence decision. |
| HIGH · UX04 | [src/components/live-refresh.tsx:39](<src/components/live-refresh.tsx#L39>), [same file:55](<src/components/live-refresh.tsx#L55>), [src/components/refresh-button.tsx:9](<src/components/refresh-button.tsx#L9>) | **Confirmed:** Live refresh renders nothing and does not surface subscription status. Each event restarts its 800 ms trailing debounce. **Inferred:** Users cannot distinguish quiet attendance from disconnected or stale data; sustained events can delay refreshing. | Show connection state and the time of the last successful data refresh. Reuse the refresh button as a fallback. Bound refresh delay during sustained activity and refresh after reconnecting. | Make system status visible. “Connected” must describe the subscription; “Updated at” must describe successfully loaded data. Neither proves that a physical reader is healthy. |
| HIGH · UX06 | [src/app/(portal)/admin/reports/components/export-pdf-button.tsx:14](<src/app/(portal)/admin/reports/components/export-pdf-button.tsx#L14>), [teacher equivalent:14](<src/app/(portal)/teacher/reports/components/export-pdf-button.tsx#L14>), [src/app/(portal)/admin/reports/components/recent-logs-table.tsx:96](<src/app/(portal)/admin/reports/components/recent-logs-table.tsx#L96>), [admin section table:100](<src/app/(portal)/admin/reports/components/attendance-by-section-table.tsx#L100>), [teacher section table:97](<src/app/(portal)/teacher/reports/components/section-attendance-table.tsx#L97>), [src/app/globals.css:174](<src/app/globals.css#L174>) | **Confirmed:** Export calls `window.print()`. The report DOM contains only the current ten-row table pages; recent logs are a separately described maximum of 50. The export action is outside the loading report content. | Define the exported scope and render its complete dataset independently of screen pagination. Label a retained print action “Print / Save as PDF.” Disable it until the report is ready. Include range, scope, generation time, and explicit sample limits. | Prevent a partial or loading screen from being mistaken for a complete report. Existing print CSS cannot print rows absent from the DOM. |

UX02 concerns the relationship between labels and controls, which W3C treats separately from merely displaying a label. See [W3C: Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html).

### Stable navigation and recoverable work

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM · UX05 | [src/app/(portal)/admin/attendance/components/attendance-table.tsx:112](<src/app/(portal)/admin/attendance/components/attendance-table.tsx#L112>), [teacher attendance:130](<src/app/(portal)/teacher/attendance/components/attendance-table.tsx#L130>), [teacher dashboard table:121](<src/app/(portal)/teacher/dashboard/components/assigned-attendance-table.tsx#L121>), [student history:110](<src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx#L110>), [admin report sections:94](<src/app/(portal)/admin/reports/components/attendance-by-section-table.tsx#L94>), [admin report logs:90](<src/app/(portal)/admin/reports/components/recent-logs-table.tsx#L90>), [teacher report sections:91](<src/app/(portal)/teacher/reports/components/section-attendance-table.tsx#L91>), [schedules table:129](<src/app/(portal)/admin/schedules/components/schedules-table.tsx#L129>) | **Confirmed:** These tables reset to page one when the incoming row array changes. **Inferred:** A live refresh interrupts someone reading a later page. | Preserve the current page during background updates. Reset for intentional filter changes and clamp only when the current page no longer exists. Preserve selection and focus where possible. | Keep the user's place. Follow the existing directory approach, which resets on filter changes rather than every incoming dataset. |
| MEDIUM · UX07 | [src/app/(portal)/teacher/students/components/student-view-dialog.tsx:102](<src/app/(portal)/teacher/students/components/student-view-dialog.tsx#L102>), [src/features/attendance/schema.ts:62](<src/features/attendance/schema.ts#L62>), [src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx:94](<src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx#L94>) | **Confirmed:** “View attendance history” opens a student search on the daily attendance page, defaulting to today. Student history has sorting and pagination but no date or status filters. | Provide an assigned-student history view with an explicit date range. Until it exists, rename the teacher link “View today's attendance.” Add date and status filters to student history. | Help users retrieve a specific record without repeatedly changing dates or paging through unrelated days. The destination must match the link label. |
| MEDIUM · UX08 | [src/app/(portal)/admin/students/components/student-form-dialog.tsx:276](<src/app/(portal)/admin/students/components/student-form-dialog.tsx#L276>), [same file:343](<src/app/(portal)/admin/students/components/student-form-dialog.tsx#L343>), [teacher form:297](<src/app/(portal)/admin/teachers/components/teacher-form-dialog.tsx#L297>), [same file:373](<src/app/(portal)/admin/teachers/components/teacher-form-dialog.tsx#L373>), [schedule form:91](<src/app/(portal)/admin/schedules/components/schedule-form-dialog.tsx#L91>) | **Confirmed:** Forms reset when opened and pass close events directly to the parent. There is no dirty-form dismissal guard in these flows. **Inferred:** Accidental dismissal can discard several completed fields or steps. | Ask “Discard unsaved changes?” only when a dirty form is dismissed. Offer “Keep editing” and “Discard changes.” Guard Escape, outside click, close, and Cancel consistently. Keep drafts in memory while editing. | Prevent avoidable data entry loss. Clean forms should still close immediately. Do not persist account passwords in browser storage. |
| MEDIUM · UX15 | [src/components/ui/date-range-picker.tsx:80](<src/components/ui/date-range-picker.tsx#L80>), [same file:110](<src/components/ui/date-range-picker.tsx#L110>), [src/app/(portal)/admin/reports/components/date-range-picker.tsx:33](<src/app/(portal)/admin/reports/components/date-range-picker.tsx#L33>), [teacher equivalent:33](<src/app/(portal)/teacher/reports/components/date-range-picker.tsx#L33>) | **Confirmed:** Selecting a draft changes the trigger's displayed range immediately. Only Apply changes the report URL. Dismissing the popover does not restore the committed dates. | Keep draft dates inside the open picker. Show the committed report range in the closed trigger. Discard draft changes on dismissal or make their unapplied state explicit. | Prevent the filter control from describing one period while the report displays another. |

### Mobile usability and task hierarchy

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM · UX09 | [src/components/data-table.tsx:35](<src/components/data-table.tsx#L35>), [same file:117](<src/components/data-table.tsx#L117>), [src/components/ui/pagination.tsx:30](<src/components/ui/pagination.tsx#L30>) | **Confirmed:** Up to seven page numbers plus Previous and Next occupy a single non-wrapping row. **Inferred:** At narrow widths, the combined control exceeds the padded content width. | Use Previous, “Page X of Y,” and Next on small screens. Keep numbered navigation where space permits. Verify both shared and directory-specific pagers. | Pagination must remain usable inside a phone viewport without making the entire page scroll sideways. |
| MEDIUM · UX10 | [src/components/ui/button.tsx:24](<src/components/ui/button.tsx#L24>), [src/components/ui/dialog.tsx:71](<src/components/ui/dialog.tsx#L71>), [src/components/data-table.tsx:82](<src/components/data-table.tsx#L82>), [src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx:216](<src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx#L216>) | **Confirmed:** Shared controls include 32 px row actions and sort buttons, 36 px default buttons, and a dialog close control with a 16 px icon and no explicit hit-area expansion. | Give mobile controls a 44 by 44 CSS px hit area. Prefer at least 40 by 40 CSS px for dense desktop actions. Adjust shared variants or use non-overlapping hit-area expansion, then verify local overrides. | Improve touch accuracy while retaining compact icons. These are product usability targets, not a claim that every smaller control violates WCAG. |
| MEDIUM · UX11 | [src/app/(portal)/admin/dashboard/page.tsx:56](<src/app/(portal)/admin/dashboard/page.tsx#L56>), [src/app/(portal)/teacher/dashboard/page.tsx:55](<src/app/(portal)/teacher/dashboard/page.tsx#L55>), [src/app/(portal)/student/dashboard/page.tsx:56](<src/app/(portal)/student/dashboard/page.tsx#L56>), [student KPI cards:53](<src/app/(portal)/student/dashboard/components/kpi-cards.tsx#L53>) | **Confirmed:** Administrator and teacher charts precede working attendance tables. Four student total cards and the identity card precede today's attendance. **Design proposal:** Routine questions require too much scanning on phones. | Put today's attendance first for students, followed by actionable RFID/SMS information and historical totals. Put a compact daily summary and attendance lookup before trend charts for staff. Retain full analysis below. | Order content by the role's immediate task. Validate this ordering with real users before treating it as a measured improvement. |

For UX09, test reflow at a 320 CSS px viewport. Data tables may need two-dimensional scrolling, but that exception should not justify an overflowing pager or page shell. See [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

For UX10, WCAG 2.2's AA target-size criterion uses 24 by 24 CSS px with specified exceptions. The proposed 44 px touch target is a stronger product target. Do not report conformance from source dimensions alone. See [W3C: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### Clear feedback, copy, and restrained motion

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM · UX12 | [src/app/(portal)/student/dashboard/components/sms-status-card.tsx:22](<src/app/(portal)/student/dashboard/components/sms-status-card.tsx#L22>), [src/app/(portal)/student/dashboard/components/rfid-status-card.tsx:14](<src/app/(portal)/student/dashboard/components/rfid-status-card.tsx#L14>) | **Confirmed:** SMS state is repeated as a badge and plain text without state-specific guidance. RFID messages describe readiness but provide no next step for Lost, inactive, or unassigned cards. | Explain what each state means and what the student can do. For example: “Your card is marked lost. Contact the school administrator for a replacement.” Explain that SMS failure does not by itself cancel recorded attendance. | Turn status reporting into useful guidance. Keep card replacement and notification retries with authorized staff; do not add student controls for unavailable operations. |
| MEDIUM · UX13 | [src/app/(portal)/admin/dashboard/page.tsx:32](<src/app/(portal)/admin/dashboard/page.tsx#L32>), [teacher dashboard:31](<src/app/(portal)/teacher/dashboard/page.tsx#L31>), [student dashboard:32](<src/app/(portal)/student/dashboard/page.tsx#L32>), [admin reports:39](<src/app/(portal)/admin/reports/page.tsx#L39>), [src/components/data-error-card.tsx:34](<src/components/data-error-card.tsx#L34>), [src/app/(portal)/admin/schedules/components/schedule-form-dialog.tsx:233](<src/app/(portal)/admin/schedules/components/schedule-form-dialog.tsx#L233>), [same file:287](<src/app/(portal)/admin/schedules/components/schedule-form-dialog.tsx#L287>) | **Confirmed:** Data panels can display raw `error.message` values. Schedule help talks about rows being retained or retired. | Map failures to plain messages such as “Attendance could not be loaded. Try again.” Keep diagnostic detail in developer logs. Describe schedule changes through their effect on late detection and future taps. | Use language that helps someone decide or recover. Database implementation details do not explain the next action. |
| MEDIUM · UX14 | [src/components/ui/button.tsx:8](<src/components/ui/button.tsx#L8>), [src/components/ui/dialog.tsx:64](<src/components/ui/dialog.tsx#L64>), [src/app/(auth)/sign-in/components/login-form-1.tsx:176](<src/app/(auth)/sign-in/components/login-form-1.tsx#L176>), [src/app/(portal)/admin/settings/components/password-form.tsx:107](<src/app/(portal)/admin/settings/components/password-form.tsx#L107>), [student form:116](<src/app/(portal)/admin/students/components/student-form-dialog.tsx#L116>), [teacher form:124](<src/app/(portal)/admin/teachers/components/teacher-form-dialog.tsx#L124>), [src/app/globals.css:152](<src/app/globals.css#L152>) | **Confirmed:** Shared buttons use `transition-all`. Several icon, press, dialog, and scrolling effects have no explicit reduced-motion treatment in the inspected application code. `SlidingNumber` already has one. | Specify transition properties. Apply Tailwind reduced-motion variants to CSS effects and the existing Motion preference pattern to animated components. Preserve static labels and focus states. | Keep repeated interactions calm and honor motion preferences. This is a source-level gap; actual animation behavior and performance remain unmeasured. |

For UX14, disabling nonessential interaction animation follows [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). That criterion is Level AAA; this review does not present it as an AA failure.

## 4. Acceptance checks

All items below are **pending implementation and verification**. They are completion conditions, not tests claimed to have passed.

- [ ] **UX01:** A real recovery request reaches the documented outcome. A valid link supports password replacement; expired links explain how to restart. Unavailable recovery does not request an email under a false promise. Request feedback does not reveal whether an account exists.
- [ ] **UX02:** Clicking each sign-in label focuses its input. Inspect the rendered input's accessible name, `aria-describedby`, and invalid state. Complete both success and invalid-input paths with keyboard and screen reader.
- [ ] **UX03:** Check Present, Late, preserved historical rows, explicit Absent, no record before class, and an unscheduled day. Dashboard and history agree on recorded status. A provisional no-tap state does not silently change the stored record or KPI policy.
- [ ] **UX04:** Test initial connection, disconnect, reconnect, failed refresh, and sustained incoming events. The last-success timestamp changes only after fresh data loads. Connection errors remain visible. Manual refresh works without losing filters.
- [ ] **UX05:** Open page three, focus a row action, then deliver a relevant background update. The page does not jump to one. An intentional filter change resets appropriately. Removing the final page clamps to the nearest valid page.
- [ ] **UX06:** Use more than ten matching rows. Export from different screen pages and compare the resulting row counts and totals. Export scope stays identical. Verify report range, sample limits, print page breaks, chart labels, dark-theme printing, and loading/error behavior.
- [ ] **UX07:** A teacher retrieves multiple dates for one assigned student without re-entering the student ID. A student filters personal history by date and status, clears filters, and sees a useful no-results state. Keep role and assignment restrictions intact.
- [ ] **UX08:** Fill part of a form, then try Escape, outside click, close, and Cancel. “Keep editing” retains values and step position. Explicit discard works. Clean dialogs close immediately. Check that a parent rerender does not erase an active draft.
- [ ] **UX09:** Check pagination at 320, 375, 390, and 768 CSS px, including seven pages and many pages. The pager does not overflow the page. Previous/Next remain named and keyboard-operable.
- [ ] **UX10:** Measure actual clickable bounds for sort, pagination, close, password visibility, and row actions. Verify 44 px mobile targets and non-overlapping hit areas. Check focus visibility after any size change.
- [ ] **UX11:** On a phone, a student finds today's status and time in before historical totals. Staff reach attendance lookup before trend analysis. Compare task time and scrolling with the current layout in a short usability session.
- [ ] **UX12:** Test Pending, Sent, Failed, and no SMS; Active, Lost, Inactive, Deactivated, and unassigned RFID states. Each message explains the consequence and the appropriate next step. Only describe provider behavior supported by the delivery implementation.
- [ ] **UX13:** Simulate data-load failure and retry. Users see understandable recovery copy without backend error text. Schedule help explains when late detection applies, including the effect of disabled days.
- [ ] **UX14:** Test with reduced motion enabled. Nonessential scale, blur, zoom, and smooth scrolling are removed. Labels and focus feedback remain. Inspect applicable animations at 10% speed, then confirm normal-speed interactions remain unobtrusive.
- [ ] **UX15:** Change dates and dismiss with Escape or outside click. The closed trigger still matches the loaded report. Apply updates the trigger, URL, heading, and report consistently; browser navigation restores the committed range.

### Shared visual and accessibility checks

Use light and dark themes, keyboard-only navigation, 200% text enlargement, long names, long identifiers, empty data, loading, failure, and populated states. Check dialog scrolling and access to fields when the mobile keyboard is open. Verify that information hidden from mobile table columns remains available through the existing detail views.

Measure text contrast in rendered states. The baseline is 4.5:1 for ordinary text and 3:1 for qualifying large text; exceptions apply. No contrast failure is asserted here because colors were not measured in the browser. See [W3C: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

For charts, verify that essential values are discoverable without hover or color alone. For dialogs, verify focus entry, containment, Escape behavior, and return to the opener. For the shell, verify a usable keyboard route to the main content. These remain validation checks, not additional confirmed findings.

## 5. Recommended implementation order

| Stage | Work | Completion condition |
| --- | --- | --- |
| 1. Restore trust and access | UX01, UX02, UX03, UX04, UX06. Include UX15 while working on reports. | The HIGH findings pass their acceptance checks. Recovery, status labels, freshness, and report output match their promises. |
| 2. Protect daily work | UX05, UX07, UX08, UX12, UX13. | Reading, editing, and investigating attendance no longer require avoidable repetition or guesswork. |
| 3. Improve mobile use and polish | UX09, UX10, UX11, UX14. | Narrow-screen, keyboard, theme, and reduced-motion checks pass. Users validate the proposed content order. |

Choose small implementation batches around shared components or one workflow. Recheck affected roles after shared changes. Do not combine this audit with an unrelated rebrand or framework migration.

### Dependencies and existing backlog

Use [RFID-DOCS-SCOPE-AUDIT.md](RFID-DOCS-SCOPE-AUDIT.md) for active requirements and
acceptance. The old `RFID-CODEBASE-TODO.md` is no longer present. W-numbered
references in the historical findings are provenance, not active tasks.

| UI/UX work | Related codebase items | Dependency |
| --- | --- | --- |
| UX01 | R03 | Handle the unfinished recovery promise within R03; do not make self-service recovery a new release requirement. |
| UX03 | P05, P07, P09 | Preserve Asia/Manila dates and approved status meaning; resolve absence policy before adding finalization behavior. |
| UX04, UX05 | P07, P08 | Verify required live updates and complete reads. Optional connection UI is not a separate release module. |
| UX06 | P08 | Export complete, accurate reports; no specific PDF library or event-table design is mandated. |
| UX07 | P09 | Verify authorized access to an assigned student's past attendance through the existing workflow. |
| UX08–UX10, UX14 | Supporting review only | These proposals do not authorize new features or change current-release priorities. |
| UX12 | P06, P08 | Match notification copy to actual delivery states and existing permissions; no retry console or automatic teacher SMS-access expansion. |

The pilot's [Late Attendance Ruling](<rfid-docs/rfid-docs/Functional Requirements/Late Attendance Ruling.md>) remains the business reference. Do not expand this UI work into per-subject timetables, holiday management, or additional academic programs.

## 6. Considered but not recommended for this pass

| Location | Candidate | Rejected because |
| --- | --- | --- |
| [src/app/globals.css:45](<src/app/globals.css#L45>) | Replace the neutral theme with gradients, glass effects, and new brand colors. | The strongest evidence concerns task completion and truthful information. No visual study supports a rebrand. |
| [src/components/motion-primitives/sliding-number.tsx:79](<src/components/motion-primitives/sliding-number.tsx#L79>) | Add more counter animation or replace the counter component. | It already handles reduced motion and uses stable digit columns. Additional movement would not resolve the identified workflow issues. |
| [src/app/(portal)/admin/students/components/student-archive-dialog.tsx:60](<src/app/(portal)/admin/students/components/student-archive-dialog.tsx#L60>) | Add another generic warning before archiving a student. | The existing confirmation already explains retained history, account access, and card deactivation. A second warning adds repetition. |
| [src/app/(portal)/admin/students/components/student-form-dialog.tsx:517](<src/app/(portal)/admin/students/components/student-form-dialog.tsx#L517>), [teacher form:546](<src/app/(portal)/admin/teachers/components/teacher-form-dialog.tsx#L546>) | Make photo upload a blocker for this improvement cycle. | These forms explicitly label the field “Profile picture URL.” Uploading can be a later product improvement, but storage work is not required to correct that label. |
| [src/app/(portal)/admin/schedules/components/schedule-form-dialog.tsx:101](<src/app/(portal)/admin/schedules/components/schedule-form-dialog.tsx#L101>) | Build a full timetable to clarify the late rule. | The existing form already previews the cutoff and names Philippines Time. Improve its copy within the pilot scope. |

## 7. Verification record and verdict

Read-only inspection used these commands and targeted file reads:

```powershell
git status --short
git rev-parse --short HEAD
rg --files src tests
rg --files --hidden -g AGENTS.md -g '!node_modules' -g '!.git' -g '!.next'
rg -n 'useReducedMotion|motion-reduce|prefers-reduced-motion|transition-all|skip.to|aria-current' src/app src/components -g '*.tsx' -g '*.css'
rg -n -U 'setPage\(1\)[\s\S]{0,80}\}, \[(rows|logs|students|data)' src/app
Get-Content -LiteralPath 'src/components/live-refresh.tsx'
Get-Content -LiteralPath 'src/components/ui/form.tsx'
Get-Content -LiteralPath 'src/components/ui/date-range-picker.tsx'
```

Observed: the working tree contains existing changes; the baseline commit is `d592923`; no repository `AGENTS.md` was found by the instruction-file search. Source inspection confirmed the recovery placeholder, sign-in wrapper associations, binary student status mapping, silent refresh component, row-array page resets, page-limited print content, and draft range behavior. W3C references were consulted for the accessibility checks above.

No application code was edited for this report. Application build, lint, backend tests, and lifecycle tests were not run because the deliverable is documentation. Findings about behavior are source-based, not executed end-to-end reproductions.

**Verdict: Block UI/UX sign-off until the five HIGH findings are resolved.** This is an assessment of the inspected interface code, not a statement about a tested production deployment.

**Not verified:** Authenticated workflows; real recovery emails; browser label/error announcements; keyboard focus behavior; rendered contrast; responsive overflow and mobile keyboard behavior; real connection loss and refresh timing; export output; physical taps; SMS delivery; animation playback at 10% speed; runtime performance; and usability outcomes with students, teachers, and administrators.
