# RFID tap endpoint

This folder is reserved for the authenticated ESP32 ingestion route. The future `route.ts` must validate a device credential, validate and normalize the RFID UID, reject replayed events, persist an immutable scan event, apply the time-in/time-out rule, and return a device-safe LCD/LED/buzzer response.

Do not expose a Supabase service-role key to ESP32 firmware.
