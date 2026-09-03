## Database Overview

The database is designed to support the RFID-based school attendance
monitoring system.

The main purpose of the database is to manage:

-   User authentication and roles
-   Student information
-   Teacher information
-   Degree programs and courses/subjects
-   Teacher class assignments
-   RFID card assignment
-   Attendance records
-   Parent SMS notifications

The database structure is based on the three main system users:

-   Administrator
-   Teacher
-   Student

The main system flow is:

    RFID Tap
       |
    Student Validation
       |
    Attendance Record Creation
       |
    Dashboard Live Update
       |
    SMS Notification to Parent

------------------------------------------------------------------------

# Database Tables

## 1. Users Table

### Purpose

Stores account information and user roles for system authentication.

Users include:

-   Admin
-   Teacher
-   Student

### Table Structure

    users

    id (PK)

    email

    password

    role

    status

    created_at

    updated_at

### Role Values

    admin
    teacher
    student

### Relationship

    Users

     |
     +---- Teacher

     |
     +---- Student

------------------------------------------------------------------------

# 2. Students Table

### Purpose

Stores student personal, academic, and parent information.

### Table Structure

    students

    id (PK)

    user_id (FK)

    student_id

    full_name

    profile_picture

    gender

    date_of_birth

    place_of_birth

    address

    contact_number

    email

    parent_name

    parent_contact_number

    year_level

    section

    program_id (FK)

    campus

    status

    created_at

    updated_at

### Example Data

    Student Name:
    Juan Dela Cruz

    Student ID:
    2026-001

    Program:
    BSIT

    Year Level:
    1st Year

    Section:
    BSIT-1A

    Campus:
    Main Campus

------------------------------------------------------------------------

# 3. Teachers Table

### Purpose

Stores teacher profile and employment information.

### Table Structure

    teachers

    id (PK)

    user_id (FK)

    teacher_id

    full_name

    profile_picture

    gender

    date_of_birth

    civil_status

    email

    phone_number

    department

    date_hired

    status

    created_at

    updated_at

### Example Data

    Teacher ID:
    T-001

    Department:
    College of Computer Studies

Course/subject, program, year level, section, and campus are stored in
the Teacher Assignments table because a teacher may handle multiple
classes.

------------------------------------------------------------------------

# 4. RFID Cards Table

### Purpose

Stores RFID card information and connects physical RFID cards to
students.

### Table Structure

    rfid_cards

    id (PK)

    student_id (FK)

    rfid_number

    card_status

    assigned_date

    created_at

    updated_at

### Card Status

    Active
    Inactive
    Lost
    Deactivated

### Relationship

    Student

       |

    RFID Card

One student should have one active RFID card.

------------------------------------------------------------------------

# 5. Attendance Records Table

### Purpose

Stores all student attendance transactions.

Every successful RFID tap creates an attendance record.

### Table Structure

    attendance_records

    id (PK)

    student_id (FK)

    rfid_card_id (FK)

    attendance_date

    time_in

    time_out

    attendance_status

    campus

    created_at

    updated_at

### Example Data

    Student:
    Juan Dela Cruz

    Date:
    August 31, 2026

    Time In:
    7:32 AM

    Time Out:
    4:30 PM

    Status:
    Present

    Campus:
    Main Campus

------------------------------------------------------------------------

# 6. SMS Notifications Table

### Purpose

Tracks SMS notifications sent to parents or guardians.

### Table Structure

    sms_notifications

    id (PK)

    attendance_id (FK)

    student_id (FK)

    parent_contact_number

    message

    sms_status

    sent_at

    created_at

### SMS Status

    Pending
    Sent
    Failed

### Example

    Student:
    Juan Dela Cruz

    Message:

    Juan Dela Cruz has successfully arrived at BestLink College of the Philippines - Main Campus.

    Status:
    Sent

------------------------------------------------------------------------

# 7. Programs Table

### Purpose

Stores degree programs such as BSIT and BSHM. A program is not a
course/subject.

### Table Structure

    programs

    id (PK)

    program_code

    program_name

    department

    status

    created_at

    updated_at

### Example

    Program Code:
    BSIT

    Program Name:
    Bachelor of Science in Information Technology

------------------------------------------------------------------------

# 8. Courses Table

### Purpose

Stores courses or subjects taught within a program, such as IPT, ITE,
and MS101.

### Table Structure

    courses

    id (PK)

    program_id (FK)

    course_code

    course_name

    created_at

    updated_at

### Example

    Program:
    BSIT

    Course Code:
    IPT

    Course Name:
    Integrative Programming and Technologies

------------------------------------------------------------------------

# 9. Teacher Assignments Table

### Purpose

Connects a teacher to a program, course/subject, year level, section,
and campus. This allows one teacher to handle multiple classes without
duplicating the teacher profile.

### Table Structure

    teacher_assignments

    id (PK)

    teacher_id (FK)

    program_id (FK)

    course_id (FK)

    year_level

    section

    campus

    status

    created_at

    updated_at

### Example

    Teacher:
    Maria Santos

    Program:
    BSIT

    Course/Subject:
    IPT

    Year Level:
    1st Year

    Section:
    BSIT-1A

------------------------------------------------------------------------

# Database Relationship Diagram

                         USERS
                           |
                +----------+----------+
                |                     |
                v                     v
           TEACHERS                STUDENTS ------> PROGRAMS
                |                     |
                v                     v
      TEACHER ASSIGNMENTS         RFID CARDS
          |            |              |
          v            v              v
      PROGRAMS       COURSES       ATTENDANCE
                                      |
                                      v
                              SMS NOTIFICATIONS

------------------------------------------------------------------------

# Use Case Diagram

## System Users

                             SYSTEM

                               |
            ------------------------------------
            |                  |               |
            |                  |               |
          ADMIN             TEACHER        STUDENT

------------------------------------------------------------------------

# Admin Use Cases

Admin can:

-   Login
-   Manage Teachers
-   Manage Students
-   Manage RFID Cards
-   View Attendance
-   Generate Reports
-   Manage Settings

------------------------------------------------------------------------

# Teacher Use Cases

Teacher can:

-   Login
-   View Assigned Students
-   View Attendance
-   Generate Class Reports

------------------------------------------------------------------------

# Student Use Cases

Student can:

-   Login
-   View Personal Attendance
-   View SMS Notification Status

------------------------------------------------------------------------

# RFID Attendance Use Case

    Student

     |

    Tap RFID Card

     |

    RFID System

     |

    Validate Student

     |

    Create Attendance Record

     |

    Update Dashboard

     |

    Send SMS Notification

     |

    Parent Receives SMS

------------------------------------------------------------------------

# Database Scope

  Table                Purpose
  -------------------- ---------------------------
  Users                Login and role management
  Students             Student information
  Teachers             Teacher information
  RFID Cards           RFID assignment
  Attendance Records   Attendance history
  SMS Notifications    Parent notification logs
  Programs             Degree program catalog (BSIT, BSHM)
  Courses              Course/subject catalog (IPT, ITE, MS101)
  Teacher Assignments  Teacher class and subject assignments

------------------------------------------------------------------------

# Database Design Summary

The database supports the complete attendance workflow of the system by
connecting user accounts, student information, RFID cards, attendance
transactions, and parent SMS notifications.

Academic data uses distinct concepts: programs are degree programs,
courses are subjects, and teacher assignments connect teachers to
programs, courses, year levels, sections, and campuses.

The structure is designed specifically for the current system scope of
Admin, Teacher, and Student users.

Related Documents:

[[System Architecture]]
[[Admin User Interaction]]
[[Teacher User Interaction]]
[[Student User Interaction]]
