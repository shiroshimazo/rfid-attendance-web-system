## Project Description

The project is an RFID-based smart attendance monitoring system
developed using an ESP32-based RFID device integrated with a web-based
dashboard for administrators, teachers, and students.

The system automates student attendance monitoring through RFID
identification. Each student is assigned a MIFARE Classic 1K RFID card
as their attendance identifier.

When a student taps their RFID card, the RC522 RFID Reader Module
connected to the ESP32 reads the card information and sends the
attendance transaction to the web system. After verification, the system
records the student's attendance including the date and time.

The 2.8-inch SPI TFT LCD Display shows the student's name, year level,
date, and time after a successful tap. Green LEDs indicate successful
transactions, red LEDs indicate errors, and an active buzzer provides
confirmation.

After recording attendance, the Admin, Teacher, and Student dashboards
receive live updates. The system also sends an SMS notification to the
registered parent or guardian.

Example SMS:

"Juan Dela Cruz has successfully arrived at BestLink College of the
Philippines - Main Campus."

Supported campuses: - Main Campus - MV Campus - Bulacan Campus

------------------------------------------------------------------------

# Project Goal

The goal of this project is to create an automated attendance monitoring
system that connects an RFID attendance device with a web-based
management platform to improve attendance accuracy, provide real-time
monitoring, and notify parents immediately when students arrive at
school.

------------------------------------------------------------------------

# Project Objectives

## General Objective

To design and develop an RFID-based attendance monitoring system using
ESP32 with a web-based dashboard that records student attendance and
sends SMS notifications to parents or guardians after successful RFID
verification.

## Specific Objectives

1.  Develop an RFID attendance device using ESP32 30-Pin ESP-WROOM-32U
    and RC522 RFID Reader Module.
2.  Use MIFARE Classic 1K RFID cards as student attendance
    identification.
3.  Display student information after successful RFID tapping.
4.  Provide feedback using TFT LCD, LEDs, and active buzzer.
5.  Record student time-in and time-out attendance data.
6.  Provide real-time attendance monitoring through Admin, Teacher, and
    Student dashboards.
7.  Allow administrators to manage students, teachers, RFID cards,
    attendance, reports, and settings.
8.  Allow teachers to monitor assigned student attendance.
9.  Allow students to view their attendance records and SMS status.
10. Automatically send SMS notifications to parents after successful
    attendance recording.
11. Support multiple campus identification.
12. Store attendance information in a centralized database.

------------------------------------------------------------------------

# Technology Stack

## Hardware

-   ESP32 30-Pin ESP-WROOM-32U
-   RC522 RFID Reader Module
-   MIFARE Classic 1K RFID Cards
-   2.8 Inch SPI TFT LCD Display
-   Green LEDs
-   Red LEDs
-   Active Buzzer
-   240 Ohm Resistors

## Software

### Frontend

-   Next.js 16.1.1
-   React 19.2.3
-   TypeScript 5.9.3
-   Tailwind CSS 4.1.18
-   shadcn/ui

### Backend and Database

-   Supabase
-   PostgreSQL Database
-   Authentication
-   Row Level Security
-   Realtime Updates

Related Documents:
[[System Architecture]]
[[Functional Requirement]]
[[Database Design]]
[[Admin User Interaction]]
[[Teacher User Interaction]]
[[Student User Interaction]]
[[Development Guidelines]]