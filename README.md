# RFID Attendance Web System

An RFID-based smart attendance monitoring system for **BestLink College of the
Philippines** (Main, MV, and Bulacan campuses). An ESP32 + RC522 reader captures
student taps, a Next.js portal records time-in/time-out, updates Admin, Teacher,
and Student dashboards in realtime, and sends an arrival SMS to the registered
parent or guardian through PhilSMS.

This repository contains the web application, the ESP32 firmware, the Supabase
schema/migrations, and the test suite.

---

## Table of contents

- [How it works](#how-it-works)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database and migrations](#database-and-migrations)
- [Scripts](#scripts)
- [Testing](#testing)
- [RFID device and firmware](#rfid-device-and-firmware)
- [Security notes](#security-notes)
- [Documentation index](#documentation-index)
- [Release scope and status](#release-scope-and-status)

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

The server is the source of truth: it resolves the card UID, decides whether the
tap is a time-in or time-out, applies the Asia/Manila late rule, and only then
reports success. Firmware never decides attendance and holds no registered UIDs.

## Features

**Administrator**
- Dashboard KPIs and charts, live monitoring of taps as they happen
- Manage teachers, students, and RFID cards (register, assign, reassign, retire)
- Attendance records with filters, time-in/time-out, and idempotent corrections
- Academic setup (programs, sections, subjects) and schedules
  (subject schedules, student subject enrollment, class schedules)
- Reports with date ranges and PDF export, archives, system logs, SMS logs
- Profile and password settings

**Teacher**
- Dashboard scoped to assigned students and classes
- My schedule, daily attendance, subject attendance, and per-session
  Present/Late/Absent confirmation for scheduled subject rosters
- Assigned student directory (read-only detail), class reports with PDF export
- Profile, assignments, and password settings

**Student**
- Personal dashboard with today's attendance, RFID card status, and SMS status
- Attendance history with time-in/time-out detail
- Current subject enrollment, profile, and password settings

**Cross-cutting**
- Password sign-in followed by a six-digit email verification code (step-up)
- Email-code password recovery for all three roles
- Role-based routing and Supabase Row Level Security
- Realtime publication/subscriptions for attendance and SMS changes

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.1.1 (App Router, Turbopack), React 19.2.3 |
| Language | TypeScript 5.9 (strict) |
| Styling / UI | Tailwind CSS 4, shadcn/ui (new-york), Radix UI / Base UI, Hugeicons, Lucide |
| Data / forms | Zod 4, React Hook Form, TanStack Table, Recharts |
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
├── rfid-docs/                Obsidian project documentation (requirements, architecture, DB design)
├── components/               Additional shared component source
├── .tmp-video-tools/         Checked-in local Python toolchain (Pillow/av) for video tooling
└── *.md                      Root setup/rollout guides and the release scope audit
```

Application conventions live in [src/features/README.md](src/features/README.md)
and [src/services/README.md](src/services/README.md): pages compose features,
features depend on services, and business logic stays out of route files.

## Getting started

### Prerequisites

- **Node.js 20.9+** (required by Next.js 16) and a package manager. The committed
  lockfile is `pnpm-lock.yaml`; the firmware guides also show `npm.cmd` commands.
- A **Supabase project** (hosted or the local Supabase CLI stack).
- For device work: Arduino IDE with the esp32 core (see
  [firmware/README.md](firmware/README.md)).
- For browser tests only: Chromium via optional Playwright/esbuild tooling.

### 1. Install dependencies

```sh
cd rfid-attendance-web-system
pnpm install
# or: npm install
```

### 2. Configure the environment

```sh
cp .env.example .env     # then fill in your project values
```

See [Environment variables](#environment-variables) for each key. `.env*` is
git-ignored; never commit real secrets.

### 3. Set up the database

Apply the versioned migrations to your Supabase project **in order**, following
[supabase/migrations/README.md](supabase/migrations/README.md). Do not execute
every SQL file in `supabase/` as a setup sequence.

```sh
# hosted: run each file under supabase/migrations/ in the Supabase SQL Editor
# local (Supabase CLI):
supabase db reset        # rebuilds local schema + seed; discards local data only
```

After installing a feature, run its read-only `supabase/verify_*.sql` check and
confirm the expected PASS rows before using it in production.

### 4. Run the app

```sh
pnpm dev          # http://localhost:3000
# For ESP32 on the same LAN, bind to all interfaces:
pnpm dev -- --hostname 0.0.0.0
```

Sign in with a seeded demo account (local/demo only — replace before hosting):
`admin@rfid.local`, `teacher@rfid.local`, or `student@rfid.local`, all with
password `ChangeMe123!`.

### 5. Production build

```sh
pnpm build
pnpm start
```

## Environment variables

Defined in [.env.example](.env.example):

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Privileged DB access (tap writer, SMS claims) |
| `RFID_DEVICE_API_KEY` | Server + device | Shared secret for `POST /api/rfid/tap` (≥32 chars); Wi-Fi transport only |
| `PHILSMS_ENABLED` | Server | Enable PhilSMS sending |
| `PHILSMS_API_TOKEN` | Server | PhilSMS API token |
| `PHILSMS_SENDER_ID` | Server | Authorized PhilSMS sender ID |
| `PHILSMS_API_URL` | Server | PhilSMS endpoint (restricted to the documented hosts) |
| `DATABASE_URL` | Server | Pooled PostgreSQL connection string (migrations/tooling) |
| `DIRECT_URL` | Server | Direct PostgreSQL connection string (migrations/tooling) |

Never prefix server secrets with `NEXT_PUBLIC_`, paste them into chat/screenshots,
or embed them in firmware source.

## Database and migrations

The schema follows the documented
[Database Design](<rfid-docs/rfid-docs/Database Design/Database Design.md>).
[supabase/README.md](supabase/README.md) summarises the included tables —
`users`, `teachers`, `students`, `programs`, `courses`,
`academic_sections`, `teacher_assignments`, `rfid_cards`,
`attendance_records`, `subject_schedules`, `subject_attendance`,
`sms_notifications`, and the supporting constraints, triggers, and RLS policies.

Key rules enforced in the database:

- One active RFID card per student; UIDs are normalized to a canonical hex form.
- Attendance, subject confirmations, and SMS rows are preserved — never silently
  rewritten or deleted.
- Subject attendance is per scheduled session; a teacher must confirm
  Present/Late/Absent, and a missing tap is *not* automatically an absence.
- Tap processing is atomic and idempotent through request receipts, so a retried
  request cannot become a time-out or send a duplicate arrival SMS.
- Late classification uses Asia/Manila time and active class schedules.

Retired destructive scripts (`cleanup_bshm.sql`, `cleanup_old_sections.sql`)
are historical references only and are excluded from normal setup. Rollback
scripts are optional and are never a setup step.

## Scripts

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
  `/api/rfid/tap`; supports reusing a printed `-RequestId` to prove retry safety.

## Testing

Fast, database-independent suites use the Node.js test runner and PGlite:

```sh
node --test tests/*.test.mjs
```

`tests/helpers/load-typescript.mjs` executes the real TypeScript modules through
the installed compiler with explicit server-boundary mocks, so no extra
dependencies are needed.

Browser suites (`tests/*.browser.mjs`) exercise real components in headless
Chromium with local fixtures and optional Playwright/esbuild tooling:

```sh
node tests/subject-attendance.browser.mjs
# point at an existing tool install if Playwright/esbuild are not in your temp dir:
#   $env:RFID_BROWSER_TOOLS = "C:\\path\\to\\browser-tools"
```

Local suites use PGlite and fixtures; hosted deployment, concurrent PostgreSQL
connections, live SMS delivery, and physical hardware acceptance are verified
separately (see the checklists below).

## RFID device and firmware

The full guide — wiring table, USB vs. Wi-Fi transport, Arduino libraries,
registration-only mode, retry/flash rules, and the physical acceptance checklist
— is in [firmware/README.md](firmware/README.md). The endpoint contract is in
[src/app/api/rfid/tap/README.md](src/app/api/rfid/tap/README.md).

Highlights:

- **USB transport (default)** runs through the signed-in admin browser on
  **Admin > Live Monitoring > Connect USB reader**; it needs no ESP32 Wi-Fi and
  exposes no device bearer key to the browser.
- **Wi-Fi transport** uses `POST /api/rfid/tap` with
  `Authorization: Bearer <RFID_DEVICE_API_KEY>` and a newline-free JSON body of
  `{"requestId":"<UUID>","uid":"<hex bytes>"}`. One UUID per distinct tap; reuse
  the same ID on retry.
- School rules: first accepted tap = Time In, second distinct tap = Time Out,
  third tap rejected; a new calendar day starts a new Time In; unmatched
  schedules are Present.
- Set `REGISTRATION_ONLY = true` when enrolling cards so scanning does not
  record attendance.

## Security notes

- Passwords live in Supabase Auth; the app never stores plaintext passwords.
- Sign-in requires password verification plus a single-use six-digit email code;
  server checks, restrictive RLS policies, and a PostgREST pre-request hook all
  require the verified session record. See
  [EMAIL-LOGIN-VERIFICATION.md](EMAIL-LOGIN-VERIFICATION.md).
- Row Level Security isolates Admin, Teacher, and Student data; teachers see only
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
| [ASSIGNMENT-SCHEDULE-SYNC.md](ASSIGNMENT-SCHEDULE-SYNC.md) | Assignment→schedule synchronization |
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
