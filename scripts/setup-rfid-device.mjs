import { randomBytes } from "node:crypto"
import { existsSync, readFileSync, writeFileSync, appendFileSync } from "node:fs"
import { networkInterfaces } from "node:os"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const nextRequire = createRequire(require.resolve("next/package.json"))
const nextEnv = nextRequire("@next/env")

// Run from any directory. Secrets are written locally, never printed.
const root = new URL("../", import.meta.url)
const envPath = fileURLToPath(new URL(".env", root))
const configPath = fileURLToPath(new URL("firmware/RfidAttendance/config.h", root))
if (existsSync(configPath)) {
  console.error("config.h already exists; left unchanged. Edit it in Arduino IDE.")
  process.exit(1)
}
// Match `next dev`, including higher-priority .env.local overrides.
const { loadedEnvFiles } = nextEnv.loadEnvConfig(fileURLToPath(root), true)
let key = process.env.RFID_DEVICE_API_KEY ?? ""
if (key && key.length < 32) {
  console.error("Existing RFID_DEVICE_API_KEY is too short. Correct it before setup; no files changed.")
  process.exit(1)
}
const addresses = Object.values(networkInterfaces()).flat().filter(address =>
  address && address.family === "IPv4" && !address.internal &&
  /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(address.address))
const ip = process.argv[2] || (addresses.length === 1 ? addresses[0].address : "")
if (!/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip) ||
    ip.split(".").length !== 4 || ip.split(".").some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255)) {
  console.error("Pass this PC's private IPv4 address: node scripts/setup-rfid-device.mjs 192.168.1.9")
  process.exit(1)
}
if (!key) {
  if (loadedEnvFiles.some(file => file.path !== ".env" &&
      /^\s*(?:export\s+)?RFID_DEVICE_API_KEY\s*=/m.test(file.contents))) {
    console.error("A higher-priority environment file overrides RFID_DEVICE_API_KEY with an empty value. Correct that setting before setup; no files changed.")
    process.exit(1)
  }
  key = randomBytes(32).toString("hex")
  // A final assignment overrides a previously empty dotenv value.
  appendFileSync(envPath, `\nRFID_DEVICE_API_KEY=${key}\n`)
}
let config = readFileSync(new URL("firmware/RfidAttendance/config.example.h", root), "utf8")
config = config.replace(/constexpr bool REGISTRATION_ONLY = (?:true|false);/, "constexpr bool REGISTRATION_ONLY = false;")
config = config.replace(/constexpr bool ALLOW_LOCAL_HTTP = (?:true|false);/, "constexpr bool ALLOW_LOCAL_HTTP = true;")
config = config.replace(/constexpr char RFID_API_URL\[\] = .*;/, `constexpr char RFID_API_URL[] = "http://${ip}:3000/api/rfid/tap";`)
config = config.replace(/constexpr char RFID_DEVICE_SECRET\[\] = .*;/, () => `constexpr char RFID_DEVICE_SECRET[] = ${JSON.stringify(key)};`)
writeFileSync(configPath, config, { flag: "wx" })
console.log("Created ignored config.h with matching device key. No secrets printed.")
console.log(`Endpoint: http://${ip}:3000/api/rfid/tap`)
console.log("Edit WIFI_SSID and WIFI_PASSWORD in config.h, then restart the website.")
console.log("Local HTTP is for a trusted private Wi-Fi network only; it is not encrypted.")
