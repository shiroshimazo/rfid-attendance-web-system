#include <SPI.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include <MFRC522.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <esp_system.h>
#include <bootloader_random.h>
#include <time.h>

#if __has_include("config.h")
#include "config.h"
#else
#error "Copy config.example.h to config.h and configure registration or HTTPS attendance mode."
#endif

// USB is the default transport. Set to 0 in config.h to restore WiFi.
#ifndef RFID_USB_ATTENDANCE
#define RFID_USB_ATTENDANCE 1
#endif

constexpr uint8_t RFID_CS = 32, RFID_RST = 33;
constexpr uint8_t TFT_CS = 27, TFT_DC = 26, TFT_RST = 25;
constexpr uint8_t GREEN_LED = 16, RED_LED = 17, BUZZER = 22;
constexpr uint8_t BUZZER_ON = LOW, BUZZER_OFF = HIGH;
constexpr unsigned long RETRY_MS = 15000;
constexpr unsigned long RESULT_MS = 5000;
constexpr unsigned long REMOVAL_POLL_MS = 150;
constexpr uint8_t ABSENT_POLLS = 5;
constexpr size_t MAX_RESPONSE_BYTES = 4096;

MFRC522 reader(RFID_CS, RFID_RST);
Adafruit_ILI9341 tft(&SPI, TFT_DC, TFT_CS, TFT_RST);
Preferences storage;
String pendingId, pendingUid;
bool locked = false, armed = false, feedback = false, sounding = false;
bool retryScheduled = false;
bool networkNotice = false;
bool usePlainHttp = false;
bool usbHostSeen = false;
unsigned long lastUsbHello = 0;
String usbLine;
bool usbOverflow = false;

bool usbConnected() {
  return usbHostSeen && millis() - lastUsbHello < 10000;
}
uint8_t absentCount = 0;
unsigned long lastRemovalPoll = 0, lastAttempt = 0;
unsigned long feedbackStarted = 0, soundDuration = 0;

// HTTP bodies are bounded even when the server uses chunked encoding.
class BoundedBody : public Stream {
 public:
  String body;
  bool overflow = false;
  BoundedBody() { body.reserve(MAX_RESPONSE_BYTES); }
  size_t write(uint8_t value) override { return write(&value, 1); }
  size_t write(const uint8_t *data, size_t length) override {
    if (length > MAX_RESPONSE_BYTES - body.length()) {
      overflow = true;
      return 0;
    }
    if (!body.concat(reinterpret_cast<const char *>(data), length)) return 0;
    return length;
  }
  int available() override { return 0; }
  int read() override { return -1; }
  int peek() override { return -1; }
  void flush() override {}
};

void silence() {
  digitalWrite(BUZZER, BUZZER_OFF);
  sounding = false;
}

void page(const String &title, const String &detail, uint16_t color) {
  tft.fillScreen(ILI9341_BLACK);
  tft.setTextSize(2);
  tft.setTextColor(color);
  tft.setCursor(8, 8);
  tft.println(title);
  tft.setTextColor(ILI9341_WHITE);
  tft.setCursor(8, 45);
  tft.println(detail);
}

void stopWith(const String &title, const String &detail) {
  silence();
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
  locked = true;
  page(title, detail, ILI9341_YELLOW);
  Serial.println(title);
  Serial.println(detail);
}

void readyPage() {
  if (RFID_USB_ATTENDANCE && !REGISTRATION_ONLY && !usbConnected()) {
    page("CONNECT USB", "Open Admin Attendance\nConnect USB reader\nNo new taps accepted", ILI9341_YELLOW);
    return;
  }
  page(REGISTRATION_ONLY ? "REGISTER ONLY" : (RFID_USB_ATTENDANCE ? "USB ATTENDANCE" : "LIVE ATTENDANCE"),
       armed ? "Tap your card" : "Remove all cards\nfrom reader first",
       ILI9341_CYAN);
}

bool validUuid(const String &value) {
  if (value.length() != 36) return false;
  for (size_t i = 0; i < value.length(); ++i) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      if (value[i] != '-') return false;
    } else if (!isxdigit(static_cast<unsigned char>(value[i]))) return false;
  }
  return true;
}

bool validUid(const String &value) {
  if (value.length() != 11 && value.length() != 20 && value.length() != 29) return false;
  for (size_t i = 0; i < value.length(); ++i) {
    if (i % 3 == 2) {
      if (value[i] != ':') return false;
    } else if (!isxdigit(static_cast<unsigned char>(value[i]))) return false;
  }
  return true;
}

bool allowedLocalUrl(const String &url) {
  if (!ALLOW_LOCAL_HTTP || !url.startsWith("http://")) return false;
  int pathStart = url.indexOf('/', 7);
  if (pathStart < 0 || url.substring(pathStart) != "/api/rfid/tap") return false;
  String authority = url.substring(7, pathStart);
  int colon = authority.indexOf(':');
  String host = colon < 0 ? authority : authority.substring(0, colon);
  if (colon >= 0) {
    String port = authority.substring(colon + 1);
    if (port.isEmpty() || port.length() > 5) return false;
    for (size_t i = 0; i < port.length(); ++i) if (!isdigit(static_cast<unsigned char>(port[i]))) return false;
    if (port.toInt() < 1 || port.toInt() > 65535) return false;
  }
  IPAddress ip;
  if (!ip.fromString(host) || ip.toString() != host) return false;
  return ip[0] == 10 || (ip[0] == 172 && ip[1] >= 16 && ip[1] <= 31) ||
         (ip[0] == 192 && ip[1] == 168);
}

bool clockReady() {
  return usePlainHttp || time(nullptr) >= 1704067200;
}

// One NVS string is the atomic journal record. Never split ID and UID across keys.
bool writeJournal(const String &value) {
  return storage.putString("tap", value) == value.length() &&
         storage.getString("tap", "") == value;
}

bool loadJournal() {
  if (!storage.begin("rfid-web", false)) return false;
  if (!storage.isKey("tap")) return writeJournal("{\"state\":\"empty\"}");
  String saved = storage.getString("tap", "");
  if (saved.length() > 256) return false;
  JsonDocument record;
  if (deserializeJson(record, saved)) return false;
  if (record["state"] == "empty") return record.size() == 1;
  if (record["state"] != "pending" || record.size() != 3 ||
      !record["requestId"].is<const char *>() || !record["uid"].is<const char *>()) return false;
  pendingId = record["requestId"].as<String>();
  pendingUid = record["uid"].as<String>();
  return validUuid(pendingId) && validUid(pendingUid);
}

String newRequestId() {
  uint8_t bytes[16];
  // USB mode uses no RF, ADC or I2S peripherals. Enable hardware entropy briefly.
  if (RFID_USB_ATTENDANCE) bootloader_random_enable();
  esp_fill_random(bytes, sizeof(bytes));
  if (RFID_USB_ATTENDANCE) bootloader_random_disable();
  bytes[6] = (bytes[6] & 0x0F) | 0x40;
  bytes[8] = (bytes[8] & 0x3F) | 0x80;
  char id[37];
  snprintf(id, sizeof(id),
           "%02x%02x%02x%02x-%02x%02x-%02x%02x-%02x%02x-%02x%02x%02x%02x%02x%02x",
           bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7],
           bytes[8], bytes[9], bytes[10], bytes[11], bytes[12], bytes[13], bytes[14], bytes[15]);
  return String(id);
}

bool saveTap(const String &uid) {
  JsonDocument record;
  record["state"] = "pending";
  record["requestId"] = newRequestId();
  record["uid"] = uid;
  String saved;
  serializeJson(record, saved);
  if (!writeJournal(saved)) return false;
  pendingId = record["requestId"].as<String>();
  pendingUid = uid;
  return true;
}

bool clearTap() {
  if (!writeJournal("{\"state\":\"empty\"}")) {
    stopWith("STORAGE ERROR", "Outcome received.\nDo not tap again.\nAsk administrator.");
    return false;
  }
  pendingId = "";
  pendingUid = "";
  return true;
}

bool textField(JsonVariantConst value, size_t maxLength) {
  if (!value.is<const char *>()) return false;
  size_t length = strlen(value.as<const char *>());
  return length > 0 && length <= maxLength;
}

bool formattedTime(const char *value, bool date) {
  if (!value || strlen(value) != (date ? 10U : 8U)) return false;
  for (size_t i = 0; value[i]; ++i) {
    bool separator = date ? (i == 4 || i == 7) : (i == 2 || i == 5);
    if (separator ? value[i] != (date ? '-' : ':') : !isdigit(static_cast<unsigned char>(value[i]))) return false;
  }
  if (date) return atoi(value + 5) >= 1 && atoi(value + 5) <= 12 &&
                   atoi(value + 8) >= 1 && atoi(value + 8) <= 31;
  return atoi(value) <= 23 && atoi(value + 3) <= 59 && atoi(value + 6) <= 59;
}

bool validSuccess(JsonDocument &body) {
  return body["ok"].is<bool>() && body["ok"].as<bool>() &&
    (body["action"] == "time_in" || body["action"] == "time_out") &&
    body["attendanceId"].is<int64_t>() && body["attendanceId"].as<int64_t>() > 0 &&
    (body["attendanceStatus"] == "Present" || body["attendanceStatus"] == "Late") &&
    textField(body["student"]["name"], 200) && textField(body["student"]["yearLevel"], 80) &&
    textField(body["date"], 10) && formattedTime(body["date"].as<const char *>(), true) &&
    textField(body["time"], 8) && formattedTime(body["time"].as<const char *>(), false) &&
    body["timezone"] == "Asia/Manila" && textField(body["message"], 500) &&
    body["replayed"].is<bool>() && body["feedback"]["led"] == "green" &&
    body["feedback"]["buzzer"] == "success";
}

void startFeedback(bool accepted) {
  digitalWrite(GREEN_LED, accepted ? HIGH : LOW);
  digitalWrite(RED_LED, accepted ? LOW : HIGH);
  feedbackStarted = millis();
  soundDuration = accepted ? 150 : 1000;
  feedback = true;
  sounding = true;
  digitalWrite(BUZZER, BUZZER_ON);
}

void uncertain(const String &reason, bool retry) {
  silence();
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
  page("NOT CONFIRMED", reason + "\nDo not tap again.\n" +
       (retry ? "Retrying same request" : "Ask administrator."), ILI9341_YELLOW);
  Serial.print("Pending request: ");
  Serial.println(pendingId);
  Serial.println(reason);
  retryScheduled = true;
  lastAttempt = millis();
  if (!retry) locked = true; // Retain journal; reboot retries the same ID, never a new tap.
}

void handleTapResponse(int status, JsonDocument &body) {
  if (status == 503) { uncertain("Server unavailable", true); return; }
  if (status == 200 && validSuccess(body)) {
    if (!clearTap()) return;
    String detail = body["student"]["name"].as<String>().substring(0, 40) + "\n" +
      body["student"]["yearLevel"].as<String>().substring(0, 24) + "\n" +
      body["attendanceStatus"].as<String>() + "\n" + body["date"].as<String>() + "\n" +
      body["time"].as<String>() + " Manila";
    page(body["action"] == "time_in" ? "TIME IN RECORDED" : "TIME OUT RECORDED",
         detail, ILI9341_GREEN);
    Serial.println(body["message"].as<String>());
    startFeedback(true);
    return;
  }

  // Authentication/configuration errors do not resolve an earlier uncertain write.
  // Keep its ID until an administrator fixes the device and reboots it.
  bool terminalStatus = status == 409 || status == 422;
  bool rejected = terminalStatus && body["ok"].is<bool>() && !body["ok"].as<bool>() &&
    textField(body["code"], 80) && textField(body["message"], 500) &&
    body["feedback"]["led"] == "red" && body["feedback"]["buzzer"] == "warning";
  if (rejected) {
    // Conflicting IDs need investigation; clearing could turn an uncertain tap into another attendance write.
    if (body["code"] == "REQUEST_ID_CONFLICT") {
      uncertain("Request ID conflict", false);
      return;
    }
    if (!clearTap()) return;
    page("TAP REJECTED", body["message"].as<String>().substring(0, 180), ILI9341_RED);
    Serial.println(body["code"].as<String>());
    Serial.println(body["message"].as<String>());
    startFeedback(false);
    return;
  }
  uncertain("Unexpected HTTP " + String(status), false);
}

void submitPending() {
  if (REGISTRATION_ONLY || pendingId.isEmpty() || locked) return;
  if (RFID_USB_ATTENDANCE) {
    retryScheduled = true;
    lastAttempt = millis();
    if (!usbConnected()) {
      uncertain("Connect USB on PC", true);
      return;
    }
    JsonDocument frame;
    frame["type"] = "tap";
    frame["requestId"] = pendingId;
    frame["uid"] = pendingUid;
    page("SAVING ATTENDANCE", "Wait for PC confirmation", ILI9341_CYAN);
    serializeJson(frame, Serial);
    Serial.println();
    return;
  }
  if (WiFi.status() != WL_CONNECTED) {
    uncertain("WiFi unavailable", true);
    return;
  }
  if (!clockReady()) {
    uncertain("Waiting for TLS clock", true);
    return;
  }

  WiFiClient plainClient;
  WiFiClientSecure secureClient;
  secureClient.setCACert(TLS_ROOT_CA);
  secureClient.setHandshakeTimeout(10);
  secureClient.setTimeout(12000);
  plainClient.setTimeout(12000);
  HTTPClient http;
  http.setConnectTimeout(10000);
  http.setTimeout(12000);
  http.setFollowRedirects(HTTPC_DISABLE_FOLLOW_REDIRECTS);
  http.setReuse(false);
  bool began = usePlainHttp ? http.begin(plainClient, RFID_API_URL) : http.begin(secureClient, RFID_API_URL);
  if (!began) {
    uncertain("HTTP setup failed", false);
    return;
  }
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + RFID_DEVICE_SECRET);
  JsonDocument request;
  request["requestId"] = pendingId;
  request["uid"] = pendingUid;
  String payload;
  serializeJson(request, payload);
  page("SAVING ATTENDANCE", "Wait for confirmation", ILI9341_CYAN);
  int status = http.POST(payload);
  if (status <= 0 || status == 503) {
    http.end();
    uncertain(status == 503 ? "Server unavailable" : "Network/TLS failure", true);
    return;
  }

  BoundedBody response;
  int transferred = http.writeToStream(&response);
  http.end();
  if (transferred < 0 || response.overflow) {
    uncertain("Incomplete response", transferred < 0 && !response.overflow);
    return;
  }
  JsonDocument body;
  if (deserializeJson(body, response.body)) {
    uncertain("Invalid server reply", false);
    return;
  }
  handleTapResponse(status, body);
}

// Newline framing tolerates boot logs and rejects oversized/mismatched replies.
void serviceUsb() {
  if (!RFID_USB_ATTENDANCE || REGISTRATION_ONLY || locked) return;
  while (Serial.available()) {
    char character = Serial.read();
    if (character != '\n') {
      if (usbLine.length() < MAX_RESPONSE_BYTES) usbLine += character;
      else usbOverflow = true;
      continue;
    }
    JsonDocument frame;
    bool valid = !usbOverflow && !deserializeJson(frame, usbLine);
    usbLine = "";
    usbOverflow = false;
    if (!valid) continue;
    if (frame["type"] == "hello" && frame["protocol"] == 1 && frame["mode"] == "attendance") {
      bool wasConnected = usbConnected();
      usbHostSeen = true;
      lastUsbHello = millis();
      Serial.println("{\"type\":\"ready\",\"protocol\":1,\"mode\":\"attendance\"}");
      if (!wasConnected) {
        retryScheduled = false;
        if (!feedback && pendingId.isEmpty()) readyPage();
      }
    } else if (frame["type"] == "result" && !pendingId.isEmpty() &&
               frame["requestId"].as<String>() == pendingId && frame["status"].is<int>()) {
      JsonDocument body;
      body.set(frame["body"]);
      handleTapResponse(frame["status"].as<int>(), body);
      if (locked) return;
    }
  }
}

// WUPA detects halted cards too; only repeated true timeouts arm the next tap.
void checkRemoval() {
  if (millis() - lastRemovalPoll < REMOVAL_POLL_MS) return;
  lastRemovalPoll = millis();
  byte atqa[2], size = sizeof(atqa);
  MFRC522::StatusCode status = reader.PICC_WakeupA(atqa, &size);
  if (status == MFRC522::STATUS_TIMEOUT) {
    if (++absentCount >= ABSENT_POLLS) {
      absentCount = 0;
      armed = true;
      readyPage();
    }
  } else {
    absentCount = 0;
    if (status == MFRC522::STATUS_OK || status == MFRC522::STATUS_COLLISION) {
      reader.PICC_ReadCardSerial();
      reader.PICC_HaltA();
      reader.PCD_StopCrypto1();
    }
  }
}

void setup() {
  // The new module is LOW-triggered. Silence it before display/network startup.
  pinMode(BUZZER, INPUT_PULLUP);
  digitalWrite(BUZZER, BUZZER_OFF);
  pinMode(BUZZER, OUTPUT);
  silence();
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
  // A full server reply can arrive while the TFT is drawing.
  Serial.setRxBufferSize(8192);
  Serial.begin(115200);

  digitalWrite(RFID_CS, HIGH);
  pinMode(RFID_CS, OUTPUT);
  digitalWrite(TFT_CS, HIGH);
  pinMode(TFT_CS, OUTPUT);
  SPI.begin(18, 19, 23);
  tft.begin(10000000);
  tft.setRotation(1);
  tft.setTextWrap(true);
  reader.PCD_Init();
  delay(50);
  byte version = reader.PCD_ReadRegister(MFRC522::VersionReg);
  Serial.printf("RC522 version register: 0x%02X\n", version);
  if (version == 0 || version == 0xFF) {
    stopWith("READER ERROR", "Check RC522 wiring.");
    return;
  }
  if (!loadJournal()) {
    stopWith("STORAGE ERROR", "Do not scan.\nAsk administrator.\nDo not erase NVS.");
    return;
  }
  if (REGISTRATION_ONLY) {
    Serial.println("REGISTRATION ONLY: no API calls or attendance writes.");
    if (!pendingId.isEmpty()) Serial.println("An attendance request is preserved for live mode.");
    readyPage();
    return;
  }
  if (RFID_USB_ATTENDANCE) {
    Serial.println("USB ATTENDANCE: open Admin Attendance and connect the USB reader.");
    readyPage();
    return;
  }
  String url(RFID_API_URL);
  usePlainHttp = allowedLocalUrl(url);
  bool validHttps = url.startsWith("https://") && url.indexOf("YOUR_") < 0 &&
    url.indexOf('@') < 0 && strlen(TLS_ROOT_CA) >= 200 && String(TLS_ROOT_CA).indexOf("PASTE_") < 0;
  if ((!usePlainHttp && !validHttps) || strlen(RFID_DEVICE_SECRET) < 32 || strlen(WIFI_SSID) == 0) {
    stopWith("CONFIG ERROR", "Check URL, WiFi, key\nand HTTPS CA or\nlocal HTTP opt-in.");
    return;
  }
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  if (!usePlainHttp) configTime(0, 0, NTP_SERVER);
  else Serial.println("LOCAL HTTP: traffic is unencrypted; use a trusted private network only.");
  Serial.println("LIVE ATTENDANCE: scans write attendance through the server.");
  if (!pendingId.isEmpty()) {
    Serial.print("Resuming pending request: ");
    Serial.println(pendingId);
  }
  readyPage();
}

void loop() {
  serviceUsb();
  if (locked) { delay(25); return; }
  if (feedback) {
    unsigned long elapsed = millis() - feedbackStarted;
    if (sounding && elapsed >= soundDuration) silence();
    if (elapsed >= RESULT_MS) {
      silence();
      digitalWrite(GREEN_LED, LOW);
      digitalWrite(RED_LED, LOW);
      feedback = false;
      readyPage();
    }
    delay(5);
    return;
  }
  if (!REGISTRATION_ONLY && !pendingId.isEmpty()) {
    if (!retryScheduled || millis() - lastAttempt >= RETRY_MS) submitPending();
    delay(10);
    return;
  }
  if (!armed) { checkRemoval(); delay(5); return; }
  if (!REGISTRATION_ONLY && (RFID_USB_ATTENDANCE ? !usbConnected() : (WiFi.status() != WL_CONNECTED || !clockReady()))) {
    // Do not accept fresh taps offline; a persisted tap may still be retried later.
    static unsigned long lastNotice = 0;
    if (millis() - lastNotice >= 2000) {
      lastNotice = millis();
      networkNotice = true;
      if (RFID_USB_ATTENDANCE) readyPage();
      else page("WAIT FOR NETWORK", "WiFi/TLS clock needed\nNo new taps accepted", ILI9341_YELLOW);
    }
    delay(20);
    return;
  }
  if (networkNotice) {
    networkNotice = false;
    readyPage();
  }
  if (!reader.PICC_IsNewCardPresent() || !reader.PICC_ReadCardSerial()) { delay(10); return; }
  armed = false;
  absentCount = 0;
  String uid;
  for (byte i = 0; i < reader.uid.size; ++i) {
    if (i) uid += ':';
    if (reader.uid.uidByte[i] < 16) uid += '0';
    uid += String(reader.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  reader.PICC_HaltA();
  reader.PCD_StopCrypto1();
  if (!validUid(uid)) {
    page("UNSUPPORTED UID", "Remove card and retry", ILI9341_YELLOW);
    return;
  }
  Serial.print("Card detected! UID: ");
  Serial.println(uid);
  if (REGISTRATION_ONLY) {
    page("REGISTER ONLY", "UID:\n" + uid + "\nNo attendance write", ILI9341_CYAN);
    feedback = true;
    feedbackStarted = millis();
    return;
  }
  if (!saveTap(uid)) {
    stopWith("STORAGE ERROR", "Tap not submitted.\nAsk administrator.\nDo not erase NVS.");
    return;
  }
  retryScheduled = false;
  submitPending();
}
