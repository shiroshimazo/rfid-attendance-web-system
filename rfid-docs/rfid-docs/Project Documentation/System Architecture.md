## System Overview

The system architecture consists of three main layers:

1.  RFID Attendance Device Layer
2.  Web Application Layer
3.  Database and Notification Layer

These layers work together to capture RFID attendance, process records,
update dashboards in real time, and send SMS notifications.

------------------------------------------------------------------------

# Overall System Flow

    Student
       |
       v
    MIFARE RFID Card
       |
       v
    RC522 RFID Reader
       |
       v
    ESP32 30-Pin ESP-WROOM-32U
       |
       v
    Wi-Fi Communication
       |
       v
    Next.js Web Application
       |
       +----------------+
       |                |
       v                v
    Supabase        SMS Notification
    Database            |
       |                |
       v                v
    Admin/Teacher    Parent/
    Student          Guardian
    Dashboards

------------------------------------------------------------------------

# RFID Attendance Device Layer

The RFID device is responsible for collecting attendance information.

## ESP32

Responsibilities:

-   Control RFID reader communication
-   Process RFID card data
-   Connect to the web system
-   Control LCD display
-   Control LEDs and buzzer
-   Receive attendance results

## RC522 RFID Reader

Process:

1.  Student taps RFID card.
2.  RC522 reads the RFID UID.
3.  UID is sent to ESP32.
4.  ESP32 sends the attendance request.

## TFT LCD Display

Displays:

-   Student Name
-   Year Level
-   Date
-   Time
-   Attendance Result
-   Error Messages

## LED and Buzzer Feedback

Successful tap: - Green LED - Success sound - Confirmation message

Failed tap: - Red LED - Error sound - Error message

------------------------------------------------------------------------

# Web Application Layer

The web application manages attendance data and provides dashboards.

Technology:

-   Next.js 16.1.1
-   React 19.2.3
-   TypeScript
-   Tailwind CSS
-   shadcn/ui

------------------------------------------------------------------------

# Admin Dashboard

Admin manages the entire system.

Functions:

-   Manage teachers
-   Manage students
-   Manage RFID cards
-   Monitor attendance
-   View reports
-   Manage settings

------------------------------------------------------------------------

# Teacher Dashboard

Teacher monitors assigned students.

Functions:

-   View assigned students
-   Monitor attendance
-   View attendance history
-   Generate class reports

------------------------------------------------------------------------

# Student Dashboard

Student views personal attendance information.

Functions:

-   View attendance history
-   View time-in and time-out
-   View RFID status
-   View SMS notification status

------------------------------------------------------------------------

# Database and Backend Layer

## Supabase

Handles:

-   Authentication
-   Database services
-   Realtime updates
-   Security policies

## PostgreSQL

Stores:

-   Student information
-   Teacher information
-   RFID records
-   Attendance records
-   Parent contact information
-   SMS records

------------------------------------------------------------------------

# Attendance Process

## Time-In

1.  Student taps RFID card.
2.  RC522 reads the UID.
3.  ESP32 sends data to the system.
4.  System validates the student.
5.  Attendance record is created.
6.  Dashboards update live.
7.  SMS notification is sent.
8.  LCD displays attendance confirmation.

## Time-Out

1.  Student taps RFID card again.
2.  System identifies the existing attendance record.
3.  Time-out is recorded.
4.  Dashboards update.

------------------------------------------------------------------------

# Real-Time Data Flow

    ESP32 RFID Device
            |
            v
    Next.js Application
            |
            v
    Supabase Database
            |
            +----------------+
            |                |
            v                v
    Dashboards          SMS Notification

------------------------------------------------------------------------

# Security Architecture

The system uses:

-   Authentication
-   Role-based access
-   Supabase Row Level Security

Access:

Admin: Full system access.

Teacher: Only assigned students and classes.

Student: Only personal attendance records.

------------------------------------------------------------------------

# Architecture Summary

The RFID device serves as the attendance collection point. The Next.js
application processes attendance transactions and provides dashboards,
while Supabase manages data storage, authentication, and realtime
updates. The complete system enables automatic attendance recording,
live monitoring, and parent SMS notifications.

Related Documents:

[[Project Overview]]
[[Database Design]]
[[Functional Requirement]]