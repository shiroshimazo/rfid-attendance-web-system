## System Overview

The system is an RFID-based attendance monitoring system that records student attendance through RFID card tapping, updates dashboards in real time, and sends SMS notifications to parents or guardians.

# Authentication Requirements

The system shall support three user roles:

- Administrator
- Teacher
- Student

Each user shall have access based on their assigned role.

# Admin Functional Requirements

## Dashboard

Admin can view:

- Total Students
- Present Today
- Absent Today
- Attendance Rate
- RFID Taps Today
- Attendance Trend
- Attendance Distribution
- Student Attendance Status

## Manage Teachers

Admin can:

- Add teacher accounts
- Edit teacher information
- Archive teacher accounts
- View teacher records

## Manage Students

Admin can:

- Add student accounts
- Edit student information
- Archive student accounts
- View student records
- Manage academic information
- Manage parent information

## Manage RFID Cards

Admin can:

- Register RFID cards
- Assign RFID cards to students
- Change RFID card status
- View RFID records

## Attendance Management

Admin can:

- View all attendance records
- Search attendance
- Filter attendance
- View time-in and time-out records

## Reports

Admin can:

- View attendance reports
- Filter by date range
- Export PDF reports

## Settings

Admin can:

- Update profile information
- Change password

# Teacher Functional Requirements

## Dashboard

Teacher can view:

- Assigned student attendance overview
- Present students
- Absent students
- Attendance trends

## Attendance

Teacher can:

- View assigned student attendance
- Search students
- Filter attendance records
- View time-in and time-out

Teacher can only access assigned classes and students.

## Students

Teacher can:

- View assigned student information
- View attendance history

Teacher cannot modify student records.

## Reports

Teacher can:

- View attendance summary
- Generate class attendance reports

# Student Functional Requirements

## Dashboard

Student can view:

- Student information
- Year level
- Section
- Campus
- Attendance status
- Time-in
- Time-out
- RFID status
- SMS notification status

## My Attendance

Student can:

- View attendance history
- View attendance dates
- View time-in and time-out records
- View SMS status

Student can only access personal attendance records.

## Profile

Student can:

- View profile
- Change password

# RFID Attendance Requirements

The system shall:

1. Receive RFID card data from ESP32.
2. Validate RFID card registration.
3. Identify the student.
4. Create attendance records.
5. Display student information on TFT LCD.

The display shall show:

- Student Name
- Year Level
- Date
- Time

## Successful RFID Tap

The system shall:

- Record attendance
- Update dashboards live
- Activate green LED
- Trigger buzzer
- Display success message
- Send SMS notification

## Failed RFID Tap

The system shall:

- Reject invalid cards
- Activate red LED
- Display error message
- Trigger buzzer warning

# Time-In and Time-Out Requirements

First successful tap:

- Creates Time In record

Second successful tap:

- Creates Time Out record

Time Out remains empty until the student taps again.

# SMS Notification Requirements

After successful attendance recording, the system shall:

- Retrieve parent contact number
- Send SMS notification
- Save SMS status

SMS Status:

- Pending
- Sent
- Failed

# Real-Time Update Requirements

Attendance records shall automatically update:

- Admin Dashboard
- Teacher Dashboard
- Student Dashboard

without manual refresh.

# Security Requirements

The system shall:

- Authenticate users
- Apply role-based access
- Protect student information
- Prevent unauthorized modifications

# Report Requirements

The system shall generate reports containing:

- Attendance summary
- Student attendance records
- RFID logs
- SMS notification records

Reports shall support PDF export.

Related Documents:

[[Project Overview]]
[[Admin User Interaction]]
[[Teacher User Interaction]]
[[Student User Interaction]]
[[Database Design]]
