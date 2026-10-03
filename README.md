# RFID Attendance Web System

An RFID-based smart attendance monitoring system for a school. Students tap a
card at the entrance; the system records attendance, updates every dashboard in
realtime, and notifies the parent or guardian by SMS — automatically.

**Live demo:** <https://rfid-attendance-web-system.vercel.app/sign-in>

> **New here?** Read [The premise](#the-premise) to understand what the project
> is and why it exists, or jump to [Quick start](#quick-start) to run it.

## Table of contents

- [The premise](#the-premise)
- [What it does (features)](#what-it-does-features)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Database and migrations](#database-and-migrations)
- [Commands](#commands)
- [Testing](#testing)
- [RFID device and firmware](#rfid-device-and-firmware)
- [Security](#security)
- [Documentation index](#documentation-index)
- [Release scope and status](#release-scope-and-status)

---

## The premise

### The problem

Manual school attendance does not scale and cannot be trusted in the moment:

- Teachers lose class time calling names and marking paper.
- Paper and spreadsheets are easy to lose, delay, or falsify.
- Nothing outside the classroom knows who has arrived.
- Parents learn about an absence hours later, if at all.
- Administrators have no live view of who is actually on campus.

### The solution

Make attendance a by-product of simply arriving. Every student carries a MIFARE
Classic 1K card, and a reader at the entrance does the rest:

1. **Tap.** The student holds the card to the RC522 reader.
2. **Identify.** The ESP32 sends only the card UID to the server. The device
   never decides anything about attendance.
3. **Decide.** The server resolves the student, applies the school rules in
   Asia/Manila time, and records time-in or time-out.
4. **Notify.** The parent or guardian receives an arrival SMS.
5. **Show.** Admin, Teacher, and Student dashboards update live.

### Why it matters

| Goal | How the system delivers it |
| --- | --- |
| **Accuracy** | Attendance comes from a card and stored rules, not a human tally. |
| **Speed** | No roll call; a tap is recorded the moment it happens. |
| **Awareness** | Guardians are messaged as their student arrives. |
| **Oversight** | Live monitoring, dashboards, logs, and PDF reports for every role. |
| **Integrity** | Role-based access, Row Level Security, and atomic, retry-safe writes. |
| **Continuity** | One server writer serves both USB and Wi-Fi taps, so hardware is optional at the web layer. |

### Who it is for

| Role | Responsibility |
| --- | --- |
| **Administrator** | The whole institution: people, cards, schedules, attendance, reports, and settings. |
| **Teacher** | Their assigned classes: rosters, subject attendance confirmation, and reports. |
| **Student** | Their own record: attendance history, enrollment, and RFID/SMS status. |

---

## What it does (features)

### Administrator — run the whole system

| Feature | What you get |
| --- | --- |
| **Live monitoring** | Watch taps land across the campus as they happen. |
| **Dashboard** | Present/Late/Absent KPIs, attendance rate, RFID tap counts, daily/weekly/monthly trends, and breakdowns by program, year level, and section. |
| **Manage teachers** | Add, edit, archive, and view teachers; multiple subject-section-campus assignments; account status. |
| **Manage students** | Identity, academics, guardian contact, linked account, archive, and RFID assignment. |
| **Manage RFID cards** | Register UIDs, assign or return cards, and retire lost cards, with one active card per student enforced. |
| **Attendance records** | Filter by date, status, program, year, section, or search; time-in/time-out columns; idempotent corrections. |
| **Academic setup** | Programs, sections, and a subject catalog that is archived rather than deleted. |
| **Schedules** | Subject session schedules, student subject enrollment, and class schedules, with overlap protection. |
| **Reports** | Date-range summaries, per-section tables, charts, and PDF export. |
| **Archives and logs** | Archived students and teachers, system logs, and SMS logs. |
| **SMS** | Guardian arrival notifications with delivery status. |
| **Settings** | Profile, photo, email, phone, and password. |

### Teacher — attendance for your classes

| Feature | What you get |
| --- | --- |
| **Dashboard** | KPIs, trends, and distribution scoped to your assigned students only. |
| **My schedule** | The subject sessions you are assigned to teach. |
| **Daily attendance** | Your roster with date and filters, plus read-only student detail. |
| **Subject attendance** | Confirm Present, Late, or Absent for each scheduled session, including students with no card. |
| **Students** | A directory of only your assigned students. |
| **Reports** | Class reports with PDF export. |
| **Settings** | Profile, your assignments, and password. |

### Student — your own attendance record

| Feature | What you get |
| --- | --- |
| **Dashboard** | Today's attendance, RFID card status, SMS status, and your identity card. |
| **Current enrollment** | The subjects you are enrolled in. |
| **My attendance** | Your personal history with time-in and time-out detail. |
| **Profile** | Your details and password. |

### Platform-wide capabilities

| Capability | Detail |
| --- | --- |
| **Authentication** | Password sign-in plus a single-use six-digit email code, with email-code password recovery for every role. |
| **Role-based access** | Admin, Teacher, and Student isolation enforced by Supabase Row Level Security. |
| **Realtime** | Attendance and SMS changes publish to subscribed dashboards. |
| **Device ingestion** | USB through the admin browser or Wi-Fi through an HTTP endpoint; both use the same writer and SMS dispatcher. |
| **Correctness** | Atomic, idempotent tap processing: a retried request cannot create a second tap or a duplicate SMS. |
| **Reporting** | Shared summaries and PDF exports for Admin and Teacher. |

---

## How it works

```text
Student
   |
   v
MIFARE Classic 1K card
   |
   v
RC522 reader  -->  ESP32 (ESP-WROOM-32U)
   |                    |
   |                    +--> 2.8" SPI TFT: name, year, date, time, result
   |                    +--> Green/red LEDs + active buzzer feedback
   v
Transport: USB (signed-in admin browser)  or  Wi-Fi  POST /api/rfid/tap
   |
   v
Next.js application (server actions / route handler)
   |
   +--> Supabase: PostgreSQL + Auth + RLS + Realtime
   |        |
   |        +--> Admin / Teacher / Student dashboards (live updates)
   |
   +--> PhilSMS: arrival SMS to parent/guardian
```

### Attendance rules

- **First accepted tap** on a calendar day records **Time In**.
- A **second distinct tap** fills **Time Out** and keeps the original status.
- A **third tap** is rejected, preserving both saved times.
- A **new calendar day** starts a new Time In; earlier days' missing times stay blank.
- **Late** uses the active class schedule and a grace period in Asia/Manila time.
  At the default cutoffs, 06:15:00 is Present and 06:15:01 is Late; no matching
  schedule means Present.
- **Subject attendance is separate.** Each scheduled session stays unconfirmed
  until its teacher confirms Present, Late, or Absent. A missing tap is never
  automatically an absence.

### What the server decides

The device sends only a request ID and a card UID. The server owns everything
else: student lookup, eligibility, date and time, late classification, time-in
versus time-out, and the SMS. Firmware holds no registered UIDs and never
declares success on its own.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.1.1 (App Router, Turbopack), React 19.2.3 |
| Language | TypeScript 5.9 (strict) |
| Styling and UI | Tailwind CSS 4, shadcn/ui (new-york), Radix UI / Base UI, Hugeicons, Lucide |
| Data and forms | Zod 4, React Hook Form, TanStack Table, Recharts |
| Backend | Supabase (PostgreSQL, Auth, Row Level Security, Realtime) |
| SMS | PhilSMS HTTP API v3 |
| PDF | Forme PDF (`@formepdf/core`, `@formepdf/react`) |
| Testing | Node.js built-in test runner, PGlite, optional Playwright + esbuild |
| Hardware | ESP32 ESP-WROOM-32U, RC522 reader, MIFARE Classic 1K, 2.8" SPI TFT, LEDs, buzzer |

## Repository layout

```text
rfid-attendance-web-system/
├── src/
│   ├── app/                  Next.js App Router: (auth), (portal)/admin|teacher|student, api routes
│   ├── components/           Shared UI (shadcn/ui primitives, tables, navigation, RFID scanners)
│   ├── config/navigation.ts  Per-role navigation menus
│   ├── features/             Domain business logic per module (attendance, rfid, reports, ...)
│   ├── services/             Supabase, SMS, RFID, and directory persistence adapters
│   ├── hooks/                React hooks
│   ├── lib/                  UID normalization, serial/USB helpers, formatting, school time
│   └── proxy.ts              Auth/role request proxy
├── supabase/
│   ├── migrations/           Versioned, ordered schema migrations
│   ├── seed.sql              Local demo accounts and sample attendance flow
│   ├── verify_*.sql          Read-only installation/verification checks
│   └── rollback_*.sql        Optional, non-setup rollback scripts
├── firmware/
│   ├── RfidAttendance/       ESP32 Arduino sketch (RfidAttendance.ino, config.example.h)
│   └── README.md             Wiring, USB/Wi-Fi transport, physical acceptance checklist
├── scripts/                  Device setup and tap-test helpers
├── tests/                    Node test-runner suites and Chromium browser tests
├── rfid-docs/                Project documentation (requirements, architecture, DB design)
├── components/               Additional shared component source
├── .tmp-video-tools/         Checked-in local Python toolchain (Pillow/av) for video tooling
└── *.md                      Root setup/rollout guides and the release scope audit
```

Application conventions live in [src/features/README.md](src/features/README.md)
and [src/services/README.md](src/services/README.md): pages compose features,
features depend on services, and business logic stays out of route files.

---

## Quick start

Not sure where to begin? Pick the path that matches what you want to do:

| I want to... | Go to |
| --- | --- |
| Run the web app locally | Steps 1–4 below |
| Prepare the database | [Database and migrations](#database-and-migrations) |
| Connect the RFID device | [RFID device and firmware](#rfid-device-and-firmware) |
| Understand the code | [Repository layout](#repository-layout) |

### Prerequisites

- **Node.js 20.9+** (required by Next.js 16) and a package manager. The committed
  lockfile is `pnpm-lock.yaml`; the firmware guides also show `npm.cmd` commands.
- A **Supabase project** (hosted, or the local Supabase CLI stack).
- **Arduino IDE** with the esp32 core if you are working with the device.
- Optional: Playwright and esbuild for the browser test suites.

### 1. Install dependencies

```sh
cd rfid-attendance-web-system
pnpm install
```

### 2. Configure the environment

```sh
cp .env.example .env
```

Fill in the values from [Environment variables](#environment-variables).
The `.env` file is git-ignored; never commit real secrets.

### 3. Set up the database

Apply the versioned migrations **in order**, following
[supabase/migrations/README.md](supabase/migrations/README.md). Do not run every
SQL file in `supabase/` as a setup sequence.

```sh
# hosted: run each file under supabase/migrations/ in the Supabase SQL editor
# local (Supabase CLI):
supabase db reset
```

After installing a feature, run its read-only `supabase/verify_*.sql` check and
confirm the expected PASS rows.

### 4. Run the app

```sh
pnpm dev
```

Open <http://localhost:3000> and sign in with a demo account below. To let an
ESP32 on the same network reach the app, bind to all interfaces:

```sh
pnpm dev -- --hostname 0.0.0.0
```

### 5. Build for production

```sh
pnpm build
pnpm start
```

### Demo accounts (local/demo only)

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@rfid.local` | `ChangeMe123!` |
| Teacher | `teacher@rfid.local` | `ChangeMe123!` |
| Student | `student@rfid.local` | `ChangeMe123!` |

> Replace these credentials before using a hosted environment.

## Environment variables

Defined in [.env.example](.env.example):

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Privileged DB access (tap writer, SMS claims) |
| `RFID_DEVICE_API_KEY` | Server + device | Shared secret for `POST /api/rfid/tap` (32+ chars); Wi-Fi transport only |
| `PHILSMS_ENABLED` | Server | Enable PhilSMS sending |
| `PHILSMS_API_TOKEN` | Server | PhilSMS API token |
| `PHILSMS_SENDER_ID` | Server | Authorized PhilSMS sender ID |
| `PHILSMS_API_URL` | Server | PhilSMS endpoint (restricted to the documented hosts) |
| `DATABASE_URL` | Server | Pooled PostgreSQL connection string (migrations/tooling) |
| `DIRECT_URL` | Server | Direct PostgreSQL connection string (migrations/tooling) |

> Never prefix server secrets with `NEXT_PUBLIC_`, paste them into chat or
> screenshots, or embed them in firmware source.

## Database and migrations

The schema follows the documented
[Database Design](<rfid-docs/rfid-docs/Database Design/Database Design.md>).
[supabase/README.md](supabase/README.md) summarises the included tables:
`users`, `teachers`, `students`, `programs`, `courses`,
`academic_sections`, `teacher_assignments`, `rfid_cards`,
`attendance_records`, `subject_schedules`, `subject_attendance`, and
`sms_notifications`, plus supporting constraints, triggers, and RLS policies.

Key rules enforced in the database:

- One active RFID card per student; UIDs are normalized to a canonical hex form.
- Attendance, subject confirmations, and SMS rows are preserved, never silently
  rewritten or deleted.
- Subject attendance is per scheduled session; a teacher must confirm
  Present/Late/Absent, and a missing tap is not automatically an absence.
- Tap processing is atomic and idempotent through request receipts, so a retried
  request cannot become a time-out or send a duplicate arrival SMS.
- Late classification uses Asia/Manila time and active class schedules.

Retired destructive scripts (`cleanup_bshm.sql`, `cleanup_old_sections.sql`)
are historical references only and are excluded from normal setup. Rollback
scripts are optional and are never a setup step.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Production build (also type-checks) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint across the project |
| `pnpm test:lifecycle` | Run the profile-lifecycle test suite |

Repository helpers:

- [scripts/setup-rfid-device.mjs](scripts/setup-rfid-device.mjs) — generate a
  device key, write the ignored firmware `config.h`, and select the transport.
- [scripts/test-rfid-tap.ps1](scripts/test-rfid-tap.ps1) — post a test tap to
  `/api/rfid/tap`; reuse a printed `-RequestId` to prove retry safety.

## Testing

Fast, database-independent suites use the Node.js test runner and PGlite:

```sh
node --test tests/*.test.mjs
```

[tests/helpers/load-typescript.mjs](tests/helpers/load-typescript.mjs) runs the
real TypeScript modules through the installed compiler with explicit
server-boundary mocks, so no extra dependencies are needed.

Browser suites (`tests/*.browser.mjs`) render real components in headless
Chromium with local fixtures:

```sh
node tests/subject-attendance.browser.mjs
# point at an existing tool install if Playwright/esbuild are not in your temp dir:
#   $env:RFID_BROWSER_TOOLS = "C:\\path\\to\\browser-tools"
```

Local suites use PGlite and fixtures. Hosted deployment, concurrent PostgreSQL
connections, live SMS delivery, and physical hardware acceptance are verified
separately by the checklists in the linked guides.

## RFID device and firmware

The full guide — wiring table, USB vs. Wi-Fi transport, Arduino libraries,
registration-only mode, retry rules, and the physical acceptance checklist — is
in [firmware/README.md](firmware/README.md). The endpoint contract is in
[src/app/api/rfid/tap/README.md](src/app/api/rfid/tap/README.md).

Highlights:

- **USB transport (default)** runs through the signed-in admin browser on
  **Admin > Live Monitoring > Connect USB reader**. It needs no ESP32 Wi-Fi and
  exposes no device bearer key to the browser.
- **Wi-Fi transport** uses `POST /api/rfid/tap` with
  `Authorization: Bearer <RFID_DEVICE_API_KEY>` and a JSON body of
  `{"requestId":"<UUID>","uid":"<hex bytes>"}`. Use one UUID per distinct tap
  and reuse it when retrying.
- **Registration mode** sets `REGISTRATION_ONLY = true` so scanning a card fills
  the registration form without recording attendance.

## Security

- Passwords live in Supabase Auth; the app never stores plaintext passwords.
- Sign-in requires password verification plus a single-use six-digit email code.
  Server account checks, restrictive RLS policies, and a PostgREST pre-request
  hook all require the verified session record. See
  [EMAIL-LOGIN-VERIFICATION.md](EMAIL-LOGIN-VERIFICATION.md).
- Row Level Security isolates Admin, Teacher, and Student data: teachers see only
  assigned students and classes, students see only their own records.
- Privileged writes (tap processing, SMS claims, atomic management saves) run
  through service-role-only RPCs; keys stay server-side.
- Local HTTP firmware mode is for trusted test networks only. Use HTTPS and a
  trusted root CA in deployment.

## Documentation index

| Document | Contents |
| --- | --- |
| [RFID-DOCS-SCOPE-AUDIT.md](RFID-DOCS-SCOPE-AUDIT.md) | **Active release backlog** — keep/remove/complete decisions and task status |
| [rfid-docs/rfid-docs/](rfid-docs/rfid-docs/) | Requirements, architecture, database design, role interactions, dev guidelines |
| [supabase/README.md](supabase/README.md) | Schema overview, setup rules, demo data |
| [supabase/migrations/README.md](supabase/migrations/README.md) | Per-feature migration rollout and rollback guidance |
| [firmware/README.md](firmware/README.md) | ESP32 build, wiring, transports, acceptance checklist |
| [src/app/api/rfid/tap/README.md](src/app/api/rfid/tap/README.md) | Tap endpoint contract, school rules, install/test steps |
| [PHILSMS-SETUP.md](PHILSMS-SETUP.md) | SMS provider configuration and live acceptance |
| [P07-REALTIME-SETUP.md](P07-REALTIME-SETUP.md) | Realtime publication install and verification |
| [P10-PILOT-DATA.md](P10-PILOT-DATA.md) | Pilot demo data and historical Late review |
| [ASSIGNMENT-SCHEDULE-SYNC.md](ASSIGNMENT-SCHEDULE-SYNC.md) | Assignment to schedule synchronization |
| [EMAIL-LOGIN-VERIFICATION.md](EMAIL-LOGIN-VERIFICATION.md) | Email code step-up authentication rollout |
| [UI-UX-IMPROVEMENT-PLAN.md](UI-UX-IMPROVEMENT-PLAN.md) | Supporting UI/UX review (subordinate to the audit) |

## Release scope and status

[RFID-DOCS-SCOPE-AUDIT.md](RFID-DOCS-SCOPE-AUDIT.md) is the single controlling
scope checklist; module READMEs and the UI/UX plan must follow it.

- **In scope:** three roles, management, attendance and RFID taps, subject
  attendance confirmation, SMS, Realtime, and PDF reports.
- **Excluded:** the Excused attendance workflow (historical values are preserved
  but not writable or charted).
- **Deferred:** standalone Programs/Courses CRUD, assignment matrix, automatic
  nightly absence job, teacher schedule page, per-period attendance, holiday/exam
  overrides, and extra onboarding programs.

Pending live verification (tracked in the audit): PhilSMS live delivery
acceptance and the P11 physical device end-to-end checklist. Hosted rollout of a
few migrations is likewise confirmed by the operator rather than by this repo.
