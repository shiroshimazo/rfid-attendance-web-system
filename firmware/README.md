# ESP32 attendance integration (P11)

The default transport is USB through the signed-in admin browser. Optional Wi-Fi
uses `POST /api/rfid/tap`. Both call the same attendance writer and SMS dispatcher.
The server looks up the card; the firmware has no hardcoded registered UIDs.
The TFT and green LED report success only after a valid server confirmation.
This implements the P11 device layer; physical deployed acceptance remains a
separate check from a successful compile.

## USB attendance (current setup, no ESP32 antenna required)

1. Open `RfidAttendance/RfidAttendance.ino` in Arduino IDE. Use the existing private
   `config.h`; do not overwrite its settings. For a new checkout, copy
   `config.example.h` to `config.h`.
2. Set `REGISTRATION_ONLY = false`. USB is the default, even if an older
   `config.h` has no transport setting. If present, set `RFID_USB_ATTENDANCE` to
   `1`. Wi-Fi credentials, TLS time, and a device API key are not used in USB mode.
3. Close the browser reader and Arduino Serial Monitor, select **ESP32 Dev Module**
   and the ESP32 COM port, and upload. Keep the same verified wiring below.
4. Run the website with `npm.cmd run dev` if it is not running. On this PC, open
   `http://localhost:3000` in desktop Chrome or Edge and sign in as an admin.
5. Open **Admin > Attendance**, click **Connect USB reader**, and select the ESP32
   port. Wait for **Reader connected**, remove any card, then tap.
6. You may navigate between admin pages; the USB connection stays active. Keep
   the tab open, preferably in the foreground, and the PC awake and online.
   The server still needs internet for hosted Supabase and the SMS provider.
   ESP32 Wi-Fi is not needed. Do not open Serial Monitor at the same time.

Accepted taps return the server's name, year, date/time, green LED, and short
beep. Rejected cards return red LED and a long beep. Arrival (Time In) and departure
(Time Out) SMS use the existing server configuration; a successful tap does not guarantee SMS delivery. Review
SMS Logs for the provider outcome.

A lost USB connection preserves the pending tap on the ESP32. Reconnect using
**Connect USB reader**; the same request ID is retried. Never erase flash to clear
an uncertain tap. A plain UID test sketch is insufficient: the browser requires
the USB attendance protocol. The reader controls remain available on every admin
page. Reloading, closing the tab, signing out, or leaving the admin area disconnects
the reader. Reconnect after returning. Before USB registration, disconnect the
attendance reader and use registration-only firmware; registration does not record
attendance.

The browser forwards authenticated server actions, not device bearer keys. No
new database migration is needed beyond the existing RFID/SMS migrations below.
Web Serial requires localhost or HTTPS; a plain LAN-IP website will not work for
the browser's USB connection.

### USB protocol

Newline-delimited JSON at 115200 baud; input frames are limited to 4096 bytes.
The browser sends `{"type":"hello","protocol":1,"mode":"attendance"}` every
three seconds. Firmware replies with the same fields and `type: "ready"`. Fresh
scans stop when no hello arrives for ten seconds. Pending taps use
`{"type":"tap","requestId":"<UUID>","uid":"<UID>"}`. The browser returns
`{"type":"result","requestId":"<same UUID>","status":200,"body":{...}}`,
with the existing tap response body and actual status (including 409/422/503).
Firmware validates the matching ID and response before signaling success.

UUID generation in USB mode briefly enables the ESP32 hardware entropy source,
as described in [Espressif's RNG documentation](https://docs.espressif.com/projects/esp-idf/en/v5.3/esp32/api-reference/system/random.html).
This sketch does not use ADC or I2S, which must not run alongside that source.

## Wiring

Keep the user's verified wiring. Power off before changing connections.

| Device | Pin | ESP32 |
| --- | --- | --- |
| RC522 | SDA/CS | GPIO32 |
| RC522 | RST | GPIO33 |
| RC522 | MISO | GPIO19 |
| RC522 and TFT | SCK | GPIO18 |
| RC522 MOSI / TFT SDI | MOSI | GPIO23 |
| TFT | CS | GPIO27 |
| TFT | DC | GPIO26 |
| TFT | RESET | GPIO25 |
| TFT | SDO | Unconnected |
| TFT | LED, VCC | 3V3 |
| TFT | T_CS (unused touch) | 3V3 |
| RC522 | 3.3V | 3V3 |
| Green LED | Anode, through its own 240-ohm resistor | GPIO16 |
| Red LED | Anode, through its own 240-ohm resistor | GPIO17 |
| New low-trigger buzzer module | I/O | GPIO22 |
| New low-trigger buzzer module | VCC | 3V3 |
| All modules and LED cathodes | GND | GND |

The buzzer is the replacement module with separate VCC/I/O/GND and a driver,
not the earlier AB011 breakout. HIGH is silent and LOW sounds. Do not use a
different module's physical pin order. If the board heats rapidly or the display
blanks and reader dims, disconnect power and repair the wiring before continuing.

## Optional Wi-Fi setup on a local PC

Set `#define RFID_USB_ATTENDANCE 0` in `config.h` to use this transport.
Keep the PC and ESP32 on the same trusted Wi-Fi network. The ESP32 uses 2.4 GHz;
the PC may use another band on the same LAN. The PC must remain awake with the
website running. The PC's current Wi-Fi address is `192.168.1.9` (2026-09-22).
Use `http://192.168.1.9:3000/api/rfid/tap`, never `localhost`, in firmware.

Run this once if `config.h` does not yet exist:

```powershell
node scripts/setup-rfid-device.mjs 192.168.1.9
```

The setup creates a separate device key in `.env` only if missing, copies the
same key into ignored `config.h`, selects attendance mode, and explicitly enables
local HTTP. It never prints secrets or overwrites an existing `config.h`. The
assistant has already run this setup for the current checkout. Enter only your
Wi-Fi name/password in `config.h` before upload. If the router changes the PC's
address, update the URL; a DHCP reservation can keep the address stable.

Start or restart the website from the project root:

```powershell
npm.cmd run dev -- --hostname 0.0.0.0
```

Use `http://localhost:3000` in the PC browser so USB registration remains
available. Use the PC's LAN address only for ESP32 and other LAN devices. If
Windows asks, allow Node.js on **Private networks only**; do not disable the
firewall. A phone on the same Wi-Fi should reach `http://192.168.1.9:3000`.
Guest-network/client isolation can prevent device-to-PC connections.

Local HTTP is unencrypted and exposes the device key to network observers.
Use only a trusted test network; do not port-forward this server or expose it
publicly. Firmware allows HTTP only when explicitly enabled and only for a
private IPv4 literal. Use verified HTTPS for deployment beyond this LAN.

## Server prerequisites

1. USB requires an active admin session in the browser. Optional Wi-Fi uses
   the local setup above or a deployed HTTPS website with `/api/rfid/tap`; the
   device must reach that route without a login page or redirect.
2. Apply the existing migrations in the repository's documented order. Run
   `supabase/verify_rfid_tap.sql` and confirm seven PASS results. See the
   [endpoint rollout](../src/app/api/rfid/tap/README.md).
3. Keep `SUPABASE_SERVICE_ROLE_KEY` on the server only. Configure a separate
   `RFID_DEVICE_API_KEY` of at least 32 characters **only for Wi-Fi transport** in `.env` or the hosting environment.
   Use the same device key in the private firmware configuration. Never paste
   secrets into chat, screenshots, or source control. Do not rotate an existing
   key without updating its other devices. Restart/redeploy after changing the
   server environment.
4. Register the physical UID under an active student and active account. Use
   the existing card registration page. Manual UID entry remains available.
5. SMS credentials and delivery stay server-side. Follow
   [PHILSMS-SETUP.md](../PHILSMS-SETUP.md); never copy provider credentials into
   the device. Accepted attendance does not itself prove SMS delivery.

## Arduino setup

Open `RfidAttendance/RfidAttendance.ino` in Arduino IDE. Install **esp32 by
Espressif Systems**, select **ESP32 Dev Module**, and install these libraries:

- MFRC522
- Adafruit ILI9341
- Adafruit GFX Library and Adafruit BusIO
- ArduinoJson **7.x**

Copy `RfidAttendance/config.example.h` to `RfidAttendance/config.h` and edit the
private copy, or use the local setup script above. It is ignored by Git.
For USB, only the registration/transport settings matter. For Wi-Fi, supply
the 2.4 GHz Wi-Fi name/password and matching device API key. For HTTPS, also
provide the full HTTPS tap endpoint and the endpoint's trusted root CA
certificate in PEM format. Obtain the root certificate from the certificate
authority's official site or the browser's validated certificate chain. Do not
use the leaf certificate or disable TLS verification. The Wi-Fi network must
allow time synchronization so TLS certificate validity can be checked. Local
HTTP mode does not use a CA certificate or require the TLS clock.

Close Arduino Serial Monitor and stop browser USB scanning before uploading.
Select the board's COM port and upload. If necessary, hold BOOT while pressing
and releasing EN during `Connecting...`; release BOOT when writing begins.
Serial diagnostics use 115200 baud and never print the device key.

## Enrollment and attendance are separate

Set `REGISTRATION_ONLY = true` when scanning cards into the
website registration form. It emits `Card detected! UID: ...` and sends **no
attendance request**. Click **Scan card via USB** in the website and choose the
ESP32 port. Saving the form is still required to register the card.

Set `REGISTRATION_ONLY = false` and upload when registration is finished. In
attendance mode, keep the registration scanner closed. For USB attendance,
connect the reader on Admin > Attendance. Each eligible physical tap can write
real attendance and trigger an arrival SMS.

## Retry and removal behavior

One UUID and UID are saved to ESP32 nonvolatile storage before each request.
Network retries reuse that pair, including after reset. An unresolved request
blocks new attendance taps; the device never signals success from a timeout.
Do not erase flash or discard the pending request to clear an uncertain result:
the server may already have recorded it. Review the pending request with the
administrator if the endpoint or credentials must change.

Remove the card fully before tapping again. Holding it against the reader must
not create a second attendance request. Removal detection is also required
after a restart, so a card held on the antenna cannot immediately check out.

The API uses the server's processing time in Asia/Manila, not an offline device
timestamp. A pending tap first processed after a long outage can be recorded
later than the physical scan. This is not an offline attendance queue. A replay
of an already saved request returns its original date/time.

## Physical acceptance checklist

These steps write real attendance. Use a designated active test student/card
with no existing attendance for the test day and a controlled guardian number.

- [ ] Upload USB firmware, connect through Admin > Attendance, and confirm
  no overheating or dimming. No ESP32 Wi-Fi connection is required.
- [ ] Unregistered/inactive card: rejection message, red LED, long beep, no row.
- [ ] First registered tap: Time In, server name/year/date/time, green LED and
  short beep; verify the website attendance row and arrival SMS status.
- [ ] Keep card on reader: no Time Out. Remove it fully, then tap again: one
  Time Out; a third distinct tap reports the completed day.
- [ ] Accepted changes update the authorized role dashboards.
- [ ] Disconnect USB or the PC network during a request, then reconnect: no false success;
  retry cannot create both arrival and departure from one physical tap.
- [ ] Reset during an unresolved request: the same request ID is recovered.
- [ ] Registration-only mode fills the website UID without recording attendance.

Record these results in P11 of `RFID-DOCS-SCOPE-AUDIT.md`. The earlier hardware
sample test does not establish deployed end-to-end acceptance.
