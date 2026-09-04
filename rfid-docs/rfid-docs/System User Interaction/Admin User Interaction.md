## Academic Terminology

- **Program**: A degree program such as BSIT or BSHM.
- **Course/Subject**: A subject taught within a program, such as IPT, ITE, or MS101.
- **Year Level**: The academic level, such as 1st Year or 2nd Year.
- **Section**: A class group, such as BSIT-1A.

## Sidebar Menu

- Dashboard
- Manage Teachers
- Manage Students
- Manage RFID Cards
- Attendance
- Schedules
- Reports
- Settings

## Dashboard Panel

### KPI Cards

- Total Students
- Present Today
- Absent Today
- Attendance Rate
- RFID Taps Today

### Charts

- Line Chart: Attendance Trend (Daily/Weekly/Monthly)
- Bar Chart: Attendance by Program, Year Level, or Section
- Circle Chart: Attendance Status Distribution (Present/Absent)

### Student Attendance Status Table

Columns: Name, Program, Year Level, Section, Attendance Status, Time In,
Time Out, and RFID Status.

## Manage Teachers

Table columns: No., Teacher Name, Teacher ID, Department, Teaching
Assignments, Email, Status, and Actions. The Teaching Assignments column
summarizes each assigned Program, Course/Subject, Year Level, and Section
without duplicating the teacher row.

### Add Teacher Modal

Personal Information: Profile Picture, Full Name, Gender, Date of Birth,
Civil Status, Email Address, and Phone Number.

Employment Information: Teacher ID, Department, Date Hired, and Status.

Teaching Assignments: Program, Course/Subject, Year Level, Section, and
Campus. A teacher may have multiple teaching assignments.

Account Information: Email Address, Password, and Confirm Password. Email is
the Supabase Auth login identifier; the application does not use a separate
username.

## Manage Students

Table columns: No., Student Name, Program, Year Level, Section, RFID Number,
Status, and Actions.

### Add Student Modal

Personal Information: Profile Picture, Full Name, Gender, Date of Birth,
Place of Birth, Address, Contact Number, and Email.

Parent/Guardian Information: Full Name and Contact Number.

Academic Information: Student ID, Program, Year Level, Section, and Campus.

## Manage RFID Cards

Table columns: No., RFID Card Number, Student Name, Student ID, Assigned On,
Card Status, and Actions.

Add RFID Modal: RFID Card Number, Card Status, Search Student, and Assign RFID.

## Attendance Panel

KPI Cards: Total Students, Present, and Absent.

Filters: Search, Status, Program, Year Level, and Section.

Table columns: Student Name, Program, Year Level, Section, Attendance Status,
Time In, and Time Out.

## Schedules Panel

KPI Cards: Sections Scheduled, Morning Sections, Afternoon Sections, and
Average Grace (minutes).

Filters: Search Section, Session (Morning/Afternoon), and Day (Mon-Fri).

Table columns: Section, Session, Class Days, Time Start, Time End
(informational only), Grace (minutes), Late Cutoff, Status, and Actions.

Edit Schedule Modal: Time Start, Grace (minutes), Status, and Class Days.
Program is locked to BSIT and Year Level to 2nd Year per the pilot scope.

Rules: Late Cutoff = Time Start + Grace. Sections without a schedule row are
never flagged Late. See [[Late Attendance Ruling]].

Delete is deliberately absent. A removed row would silently mean "never Late",
so a schedule is switched off with its Status instead, and unchecking a class
day retires that day's row rather than dropping it.

Status: built at `/admin/schedules` (admin only). Grouping, cutoff arithmetic,
and the pilot locks live in `src/features/schedules/`; the reads live in
`src/services/schedules/`.

## Reports Panel

KPI Cards: Total Students, Total Present, Total Absent, and RFID Scans.

Charts: Attendance Summary, Attendance by Program/Year Level, and Attendance
Status.

Attendance by Section table: Program, Year Level, Section, Total Students,
Present, Absent, and Attendance Rate.

Recent Attendance Logs table: Time, Student Name, Program, Year Level,
Section, Status, and RFID Status.

Export: PDF Report.

## Settings

Admin Information: Change Photo, Full Name, Email Address, and Phone Number.

Change Password: New Password and Confirm Password.

Related Documents:
[[Functional Requirement]]
[[Database Design]]
