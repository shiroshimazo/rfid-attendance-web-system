## Database Overview

The database is designed to support the RFID-based school attendance
monitoring system.

The main purpose of the database is to manage:

-   User authentication and roles
-   Student information
-   Teacher information
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

    course

    campus

    status

    created_at

    updated_at

### Example Data

    Student Name:
    Juan Dela Cruz

    Student ID:
    2026-001

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

    course

    date_hired

    status

    created_at

    updated_at

### Example Data

    Teacher ID:
    T-001

    Department:
    BSIT

    Course:
    IT Fundamentals

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

# 7. Courses Table

### Purpose

Stores department and course information.

This supports academic classification such as BSIT, BSHM, and other
programs.

### Table Structure

    courses

    id (PK)

    department

    course_name

    created_at

### Example

    Department:
    BSIT

    Courses:

    IPT
    ITE
    MS101

------------------------------------------------------------------------

# Database Relationship Diagram

                     USERS
                       |
            +----------+----------+
            |                     |
            v                     v
       TEACHERS              STUDENTS
                                  |
                                  |
                           RFID CARDS
                                  |
                                  |
                           ATTENDANCE
                                  |
                                  |
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
  Courses              Academic classification

------------------------------------------------------------------------

# Database Design Summary

The database supports the complete attendance workflow of the system by
connecting user accounts, student information, RFID cards, attendance
transactions, and parent SMS notifications.

The structure is designed specifically for the current system scope of
Admin, Teacher, and Student users.

Related Documents:

[[System Architecture]]
[[Admin User Interaction]]
[[Teacher User Interaction]]
[[Student User Interaction]]