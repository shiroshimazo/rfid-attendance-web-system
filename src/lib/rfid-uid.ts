/** Reader bytes in order: 4, 7 or 10 bytes; preserve every leading zero.
 * Printed decimal card numbers are not converted or guessed. */
export function normalizeRfidUid(input: string): string | null {
  if (input.length > 64) return null
  const value = input.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "").toUpperCase()
  if (!/^(?:[0-9A-F]+|[0-9A-F]{2}(?::[0-9A-F]{2})+|[0-9A-F]{2}(?:-[0-9A-F]{2})+|[0-9A-F]{2}(?: [0-9A-F]{2})+)$/.test(value)) return null
  const uid = value.replace(/[: -]/g, "")
  return [8, 14, 20].includes(uid.length) ? uid : null
}

export const rfidUidMessage = "Enter a 4, 7, or 10-byte hexadecimal UID from the reader, such as 00:00:00:11."
