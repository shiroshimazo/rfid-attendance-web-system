#pragma once

// Copy this file to config.h. Keep config.h private and out of version control.
// First flash in registration mode; switch to false for live attendance writes.
constexpr bool REGISTRATION_ONLY = true;

// USB attendance uses the signed-in admin browser; no WiFi or device key needed.
#define RFID_USB_ATTENDANCE 1
// The settings below apply only when RFID_USB_ATTENDANCE is 0.

constexpr char WIFI_SSID[] = "YOUR_2_4_GHZ_WIFI_NAME";
constexpr char WIFI_PASSWORD[] = "YOUR_WIFI_PASSWORD";

// Use the final HTTPS URL: redirects are deliberately not followed.
constexpr char RFID_API_URL[] = "https://YOUR_DEPLOYED_HOST/api/rfid/tap";
// Explicit opt-in for a trusted local WiFi test only. HTTP exposes the device
// secret and card UID to the network. Only private literal IPv4 hosts are accepted,
// e.g. http://192.168.1.50:3000/api/rfid/tap. Never port-forward this endpoint.
constexpr bool ALLOW_LOCAL_HTTP = false;
// Dedicated RFID_DEVICE_API_KEY configured on your server, at least 32 characters.
// Never use a Supabase key here.
constexpr char RFID_DEVICE_SECRET[] = "";

// Paste the trusted root CA PEM for the deployed host's certificate chain.
// Obtain it from the certificate authority's official source. Never use setInsecure.
constexpr char TLS_ROOT_CA[] = R"PEM(
-----BEGIN CERTIFICATE-----
PASTE_TRUSTED_ROOT_CA_HERE
-----END CERTIFICATE-----
)PEM";

// TLS needs correct time. Attendance date/time always comes from the server.
constexpr char NTP_SERVER[] = "pool.ntp.org";
