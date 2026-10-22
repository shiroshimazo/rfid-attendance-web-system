module.exports = [
"[project]/src/lib/rfid-uid.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Reader bytes in order: 4, 7 or 10 bytes; preserve every leading zero.
 * Printed decimal card numbers are not converted or guessed. */ __turbopack_context__.s([
    "normalizeRfidUid",
    ()=>normalizeRfidUid,
    "rfidUidMessage",
    ()=>rfidUidMessage
]);
function normalizeRfidUid(input) {
    if (input.length > 64) return null;
    const value = input.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "").toUpperCase();
    if (!/^(?:[0-9A-F]+|[0-9A-F]{2}(?::[0-9A-F]{2})+|[0-9A-F]{2}(?:-[0-9A-F]{2})+|[0-9A-F]{2}(?: [0-9A-F]{2})+)$/.test(value)) return null;
    const uid = value.replace(/[: -]/g, "");
    return [
        8,
        14,
        20
    ].includes(uid.length) ? uid : null;
}
const rfidUidMessage = "Enter a 4, 7, or 10-byte hexadecimal UID from the reader, such as 00:00:00:11.";
}),
"[project]/src/features/rfid-tap/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rfidTapSchema",
    ()=>rfidTapSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.3.2/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rfid$2d$uid$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rfid-uid.ts [app-rsc] (ecmascript)");
;
;
const rfidTapSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    requestId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].uuid(),
    uid: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(64).transform(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rfid$2d$uid$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeRfidUid"]).refine((value)=>value !== null, "Invalid reader UID")
}).strict();
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/services/supabase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminSupabaseClient",
    ()=>createAdminSupabaseClient,
    "isSupabaseAdminConfigured",
    ()=>isSupabaseAdminConfigured,
    "missingServiceRoleMessage",
    ()=>missingServiceRoleMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$112$2e$4$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.112.4/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/config.ts [app-rsc] (ecmascript)");
;
;
/**
 * Deliberately not prefixed with NEXT_PUBLIC_, so the key never reaches the
 * browser bundle. Only server actions and route handlers may read it.
 */ const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const missingServiceRoleMessage = "Supabase administration is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env on the server.";
function isSupabaseAdminConfigured() {
    return Boolean(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseUrl"] && serviceRoleKey);
}
function createAdminSupabaseClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!isSupabaseAdminConfigured()) {
        throw new Error(missingServiceRoleMessage);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$112$2e$4$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseUrl"], serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });
}
}),
"[project]/src/services/sms/philsms.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deliverArrivalSms",
    ()=>deliverArrivalSms,
    "normalizePhilippineMobile",
    ()=>normalizePhilippineMobile,
    "sendPhilSms",
    ()=>sendPhilSms
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/admin.ts [app-rsc] (ecmascript)");
;
;
function normalizePhilippineMobile(input) {
    const number = input.trim().replace(/[ ()-]/g, "");
    if (/^09\d{9}$/.test(number)) return `63${number.slice(1)}`;
    if (/^\+?639\d{9}$/.test(number)) return number.replace(/^\+/, "");
    return null;
}
function configuration() {
    if (process.env.PHILSMS_ENABLED !== "true") return null;
    const token = process.env.PHILSMS_API_TOKEN?.trim();
    const sender = process.env.PHILSMS_SENDER_ID?.trim();
    const endpoint = process.env.PHILSMS_API_URL?.trim() || "https://app.philsms.com/api/v3/sms/send";
    if (!token || !sender || !/^[A-Za-z0-9 ]{1,11}$/.test(sender) || ![
        "https://app.philsms.com/api/v3/sms/send",
        "https://dashboard.philsms.com/api/v3/sms/send"
    ].includes(endpoint)) return null;
    return {
        token,
        sender,
        endpoint
    };
}
async function sendPhilSms(config, recipient, message) {
    try {
        const response = await fetch(config.endpoint, {
            method: "POST",
            redirect: "error",
            signal: AbortSignal.timeout(8000),
            headers: {
                Authorization: `Bearer ${config.token}`,
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipient,
                sender_id: config.sender,
                type: /^[\x20-\x7E\r\n]*$/.test(message) ? "plain" : "unicode",
                message
            })
        });
        const payload = await response.json();
        if (response.ok && payload?.status === "success") {
            const report = Array.isArray(payload.data) ? payload.data[0] : payload.data;
            // A top-level success is API acceptance, not proof of handset delivery.
            if (report && typeof report.status === "string" && /^(failed|rejected|undelivered)$/i.test(report.status)) return {
                result: "rejected"
            };
            return {
                result: "accepted",
                providerId: typeof report?.uid === "string" ? report.uid : undefined
            };
        }
        if (payload?.status === "error" && response.status < 500) return {
            result: "rejected"
        };
        return {
            result: "unknown"
        };
    } catch  {
        return {
            result: "unknown"
        };
    }
}
async function deliverArrivalSms(attendanceId) {
    const config = configuration();
    if (!config || !Number.isSafeInteger(attendanceId) || attendanceId <= 0) return;
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])();
        const attempt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        const { data, error } = await supabase.rpc("claim_arrival_sms", {
            p_attendance_id: attendanceId,
            p_attempt: attempt
        });
        if (error || !data) return;
        const recipient = normalizePhilippineMobile(data.recipient);
        const outcome = recipient ? await sendPhilSms(config, recipient, data.message) : {
            result: "invalid_recipient"
        };
        // The durable claim remains even if persistence fails: retries cannot send twice.
        await supabase.rpc("finish_arrival_sms", {
            p_id: data.id,
            p_attempt: attempt,
            p_result: outcome.result,
            p_provider_id: "providerId" in outcome ? outcome.providerId ?? null : null
        });
    } catch  {}
}
}),
"[project]/src/services/rfid/tap.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "recordValidatedTap",
    ()=>recordValidatedTap,
    "tapFailure",
    ()=>tapFailure
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sms$2f$philsms$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/sms/philsms.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/admin.ts [app-rsc] (ecmascript)");
;
;
function tapFailure(status, code, message) {
    return {
        status,
        body: {
            ok: false,
            code,
            message,
            feedback: {
                led: "red",
                buzzer: "warning"
            }
        }
    };
}
async function recordValidatedTap(input) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSupabaseAdminConfigured"])()) {
        return tapFailure(503, "NOT_CONFIGURED", "RFID attendance is not configured on the server.");
    }
    try {
        const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])().rpc("record_rfid_tap", {
            p_request_id: input.requestId,
            p_uid: input.uid
        });
        if (error || !data || typeof data.ok !== "boolean") {
            return tapFailure(503, "SAVE_UNAVAILABLE", "Could not confirm attendance. Retry with the same request ID.");
        }
        if (data.ok && data.action === "time_in") await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sms$2f$philsms$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deliverArrivalSms"])(data.attendanceId);
        return {
            status: data.ok ? 200 : data.code === "INVALID_CARD" ? 422 : 409,
            body: data
        };
    } catch  {
        return tapFailure(503, "SAVE_UNAVAILABLE", "Could not record attendance. Retry with the same request ID.");
    }
}
}),
"[project]/src/services/audit/log.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auditActivity",
    ()=>auditActivity,
    "auditRoute",
    ()=>auditRoute,
    "recordActivity",
    ()=>recordActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/admin.ts [app-rsc] (ecmascript)");
;
;
async function recordActivity(event, entity, outcome, httpStatus) {
    try {
        const account = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAccount"])().catch(()=>null);
        const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])().from("system_logs").insert({
            actor_id: account?.id ?? null,
            actor_name: account?.name ?? "Unauthenticated / service",
            actor_role: account?.role ?? "system",
            source: "application",
            event,
            entity,
            outcome,
            details: httpStatus === undefined ? {} : {
                http_status: httpStatus
            }
        });
        if (error) console.error("System audit append failed; check database migration and connectivity.");
    } catch  {
        // Auth, device responses and already-committed writes must remain truthful during outages.
        console.error("System audit append unavailable; check database migration and connectivity.");
    }
}
async function auditActivity(event, entity, operation) {
    try {
        const result = await operation();
        const failed = typeof result === "object" && result !== null && ("ok" in result && result.ok === false || "error" in result && Boolean(result.error));
        await recordActivity(event, entity, failed ? "failed" : "success");
        return result;
    } catch (error) {
        const redirect = typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT");
        await recordActivity(event, entity, redirect ? "denied" : "failed");
        throw error;
    }
}
async function auditRoute(event, entity, operation) {
    try {
        const response = await operation();
        const outcome = [
            401,
            403
        ].includes(response.status) ? "denied" : response.status >= 400 ? "failed" : "success";
        await recordActivity(event, entity, outcome, response.status);
        return response;
    } catch (error) {
        await recordActivity(event, entity, "failed", 500);
        throw error;
    }
}
}),
"[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"404da90a4e7fe8872422ffb49914fe4ba62af27f09":"recordUsbTapAction"},"",""] */ __turbopack_context__.s([
    "recordUsbTapAction",
    ()=>recordUsbTapAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid-tap/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$rfid$2f$tap$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/rfid/tap.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/audit/log.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function recordUsbTapAction(input) {
    // Browser authentication is mandatory; no device/service key reaches the browser.
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditRoute"])("rfid_usb_tap", "rfid_cards", async ()=>{
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfidTapSchema"].safeParse(input);
        const result = parsed.success ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$rfid$2f$tap$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordValidatedTap"])({
            requestId: parsed.data.requestId,
            uid: parsed.data.uid
        }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$rfid$2f$tap$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["tapFailure"])(400, "INVALID_REQUEST", "Send a UUID requestId and a valid reader UID.");
        return Response.json(result.body, {
            status: result.status
        });
    });
    return {
        status: response.status,
        body: await response.json()
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    recordUsbTapAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordUsbTapAction, "404da90a4e7fe8872422ffb49914fe4ba62af27f09", null);
}),
"[project]/src/features/academic/pilot.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * BSIT 2nd Year pilot academic scope (Late Attendance Ruling).
 * Single source of truth for every form, filter, and validation that must
 * stay inside the pilot: program locked to BSIT, year fixed to 2nd Year,
 * sections 21001-21010, three campuses, eight subjects.
 *
 * Picker options now come from `public.academic_sections` and
 * `public.courses`, managed in Admin → Academic Setup. These constants still
 * define what the pilot validations accept and seeded that catalog, so do not
 * use them as dropdown sources.
 */ __turbopack_context__.s([
    "PILOT_CAMPUSES",
    ()=>PILOT_CAMPUSES,
    "PILOT_COURSE_CODES",
    ()=>PILOT_COURSE_CODES,
    "PILOT_PROGRAM_CODE",
    ()=>PILOT_PROGRAM_CODE,
    "PILOT_PROGRAM_NAME",
    ()=>PILOT_PROGRAM_NAME,
    "PILOT_SECTIONS",
    ()=>PILOT_SECTIONS,
    "PILOT_SECTION_CODES",
    ()=>PILOT_SECTION_CODES,
    "PILOT_YEAR_LEVEL",
    ()=>PILOT_YEAR_LEVEL,
    "isPilotCampus",
    ()=>isPilotCampus,
    "isPilotSection",
    ()=>isPilotSection,
    "roomForSection",
    ()=>roomForSection
]);
const PILOT_PROGRAM_CODE = "BSIT";
const PILOT_PROGRAM_NAME = "BS Information Technology";
const PILOT_YEAR_LEVEL = "2nd Year";
const MORNING_SECTIONS = [
    "21001",
    "21002",
    "21003",
    "21004",
    "21005"
];
const AFTERNOON_SECTIONS = [
    "21006",
    "21007",
    "21008",
    "21009",
    "21010"
];
const PILOT_SECTIONS = [
    ...MORNING_SECTIONS.map((code)=>({
            code,
            session: "morning",
            timeStart: "06:00",
            timeEnd: "12:30"
        })),
    ...AFTERNOON_SECTIONS.map((code)=>({
            code,
            session: "afternoon",
            timeStart: "13:00",
            timeEnd: "19:30"
        }))
];
const PILOT_SECTION_CODES = PILOT_SECTIONS.map((section)=>section.code);
function roomForSection(section) {
    const code = section.trim();
    return PILOT_SECTION_CODES.includes(code) ? `ROOM ${Number(code) - 20800}` : null;
}
const PILOT_CAMPUSES = [
    "Main Campus",
    "MV Campus",
    "Bulacan Campus"
];
const PILOT_COURSE_CODES = [
    "CCS2207",
    "CCS1204",
    "CCS1201",
    "CCS2105",
    "CCS2107",
    "ITE1",
    "SOSLIT",
    "PE3"
];
function isPilotSection(value) {
    return PILOT_SECTION_CODES.includes(value);
}
function isPilotCampus(value) {
    return PILOT_CAMPUSES.includes(value);
}
}),
"[project]/src/features/shared/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accountStatuses",
    ()=>accountStatuses,
    "applyCredentialRules",
    ()=>applyCredentialRules,
    "civilStatusOptions",
    ()=>civilStatusOptions,
    "databaseIdSchema",
    ()=>databaseIdSchema,
    "emailField",
    ()=>emailField,
    "genderOptions",
    ()=>genderOptions,
    "optionalDate",
    ()=>optionalDate,
    "optionalText",
    ()=>optionalText,
    "optionalUrl",
    ()=>optionalUrl,
    "passwordFields",
    ()=>passwordFields,
    "passwordsMatch",
    ()=>passwordsMatch,
    "requiredDate",
    ()=>requiredDate,
    "requiredText",
    ()=>requiredText,
    "rfidCardStatuses",
    ()=>rfidCardStatuses,
    "rfidNumberField",
    ()=>rfidNumberField,
    "selectedId",
    ()=>selectedId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.3.2/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rfid$2d$uid$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rfid-uid.ts [app-rsc] (ecmascript)");
;
;
const accountStatuses = [
    "active",
    "inactive",
    "archived"
];
const genderOptions = [
    "Male",
    "Female",
    "Prefer not to say"
];
const civilStatusOptions = [
    "Single",
    "Married",
    "Widowed",
    "Separated"
];
const optionalDate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().refine((value)=>value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Use the date picker to choose a valid date"
});
const optionalText = (max)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().max(max);
const requiredText = (max, message)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(2, message).max(max);
const optionalUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().max(500).refine((value)=>value === "" || URL.canParse(value), {
    message: "Enter a full image URL, or leave this empty"
});
const emailField = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().toLowerCase().pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].email("Enter a valid email"));
const passwordFields = {
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "Use at least 8 characters").max(72, "Use at most 72 characters"),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
};
const passwordsMatch = {
    check: (values)=>values.password === values.confirmPassword,
    message: "Passwords do not match"
};
function applyCredentialRules(values, ctx) {
    if (values.mode !== "create") return;
    if (values.password.length < 8) {
        ctx.addIssue({
            code: "custom",
            path: [
                "password"
            ],
            message: "Use at least 8 characters"
        });
        return;
    }
    if (!passwordsMatch.check(values)) {
        ctx.addIssue({
            code: "custom",
            path: [
                "confirmPassword"
            ],
            message: passwordsMatch.message
        });
    }
}
const databaseIdSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().positive();
const selectedId = (message)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int(message).positive(message);
const rfidCardStatuses = [
    "Active",
    "Inactive",
    "Lost",
    "Deactivated"
];
const rfidNumberField = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(64).transform((value, ctx)=>{
    const uid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rfid$2d$uid$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeRfidUid"])(value);
    if (uid !== null) return uid;
    ctx.addIssue({
        code: "custom",
        message: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rfid$2d$uid$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfidUidMessage"]
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].NEVER;
});
const requiredDate = (message)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, message);
}),
"[project]/src/lib/format.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatClockTime",
    ()=>formatClockTime,
    "formatDateValue",
    ()=>formatDateValue,
    "formatNumber",
    ()=>formatNumber,
    "formatPercent",
    ()=>formatPercent,
    "formatTimestamp",
    ()=>formatTimestamp,
    "initialsOf",
    ()=>initialsOf
]);
const numberFormatter = new Intl.NumberFormat("en-US");
const percentFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});
function formatNumber(value) {
    return numberFormatter.format(value);
}
function formatPercent(value) {
    return `${percentFormatter.format(value)}%`;
}
function formatClockTime(value) {
    if (!value) return "—";
    const [hours, minutes] = value.split(":");
    const hour = Number(hours);
    const minute = Number(minutes);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return "—";
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}
function initialsOf(name) {
    const parts = name.split(/\s+/).map((part)=>part.trim()).filter(Boolean);
    if (parts.length === 0) return "?";
    const first = parts[0][0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
    return `${first}${last}`.toUpperCase();
}
function formatDateValue(value) {
    if (!value) return "—";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
function formatTimestamp(value) {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}
}),
"[project]/src/features/academic/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "academicTabs",
    ()=>academicTabs,
    "campusPickerOptions",
    ()=>campusPickerOptions,
    "catalogFormStatuses",
    ()=>catalogFormStatuses,
    "catalogKinds",
    ()=>catalogKinds,
    "catalogSpelling",
    ()=>catalogSpelling,
    "catalogStatusFilters",
    ()=>catalogStatusFilters,
    "catalogStatusSchema",
    ()=>catalogStatusSchema,
    "courseFormSchema",
    ()=>courseFormSchema,
    "createCourseSchema",
    ()=>createCourseSchema,
    "createProgramSchema",
    ()=>createProgramSchema,
    "createSectionSchema",
    ()=>createSectionSchema,
    "describeUsage",
    ()=>describeUsage,
    "isAssignableGrouping",
    ()=>isAssignableGrouping,
    "isOfferedCampus",
    ()=>isOfferedCampus,
    "isPilotProgramCode",
    ()=>isPilotProgramCode,
    "matchesStatusFilter",
    ()=>matchesStatusFilter,
    "parseAcademicTab",
    ()=>parseAcademicTab,
    "pilotGroupingScope",
    ()=>pilotGroupingScope,
    "programArchiveBlocker",
    ()=>programArchiveBlocker,
    "programFormSchema",
    ()=>programFormSchema,
    "programUsageParts",
    ()=>programUsageParts,
    "sectionFormSchema",
    ()=>sectionFormSchema,
    "sectionPickerOptions",
    ()=>sectionPickerOptions,
    "sectionStatusFormSchema",
    ()=>sectionStatusFormSchema,
    "toClassGroupingOptions",
    ()=>toClassGroupingOptions,
    "updateCourseSchema",
    ()=>updateCourseSchema,
    "updateProgramSchema",
    ()=>updateProgramSchema,
    "updateSectionSchema",
    ()=>updateSectionSchema,
    "usageSentence",
    ()=>usageSentence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.3.2/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/academic/pilot.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-rsc] (ecmascript)");
;
;
;
;
const catalogFormStatuses = [
    "active",
    "inactive"
];
const catalogKinds = [
    "program",
    "course",
    "section"
];
const academicTabs = [
    "programs",
    "subjects",
    "sections"
];
function parseAcademicTab(value) {
    const candidate = (Array.isArray(value) ? value[0] : value)?.trim().toLowerCase();
    return academicTabs.find((tab)=>tab === candidate) ?? "programs";
}
function listPhrase(items) {
    if (items.length <= 2) return items.join(" and ");
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
const pilotGroupingScope = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_PROGRAM_CODE"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_YEAR_LEVEL"]} sections ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_SECTION_CODES"][0]}–${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_SECTION_CODES"][__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_SECTION_CODES"].length - 1]} at ${listPhrase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_CAMPUSES"])}`;
function collapseSpaces(value) {
    return value.replace(/\s+/g, " ");
}
function catalogSpelling(value, existing) {
    const normalized = collapseSpaces(value.trim());
    return existing.find((candidate)=>candidate.toLowerCase() === normalized.toLowerCase()) ?? normalized;
}
/** Catalog wording is trimmed and single-spaced so near-duplicates cannot slip in. */ const catalogText = (max, message)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(2, message).max(max, `Use at most ${max} characters`).transform(collapseSpaces);
/** The unique indexes compare codes case-insensitively, so codes are stored uppercase. */ const codeField = (label, max, pattern, allowed)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, `${label} is required`).max(max, `Use at most ${max} characters`).regex(pattern, `${label} can use ${allowed}`).transform((value)=>collapseSpaces(value).toUpperCase());
const codeCharacters = "letters, numbers, spaces, periods, slashes, and hyphens";
const programFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    programCode: codeField("Program code", 20, /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/, codeCharacters),
    programName: catalogText(120, "Program name is required"),
    department: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["optionalText"])(120).transform(collapseSpaces),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(catalogFormStatuses)
});
const createProgramSchema = programFormSchema;
const updateProgramSchema = programFormSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"]
});
const courseFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    programId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Select a program"),
    courseCode: codeField("Subject code", 30, /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/, codeCharacters),
    courseName: catalogText(160, "Subject name is required"),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(catalogFormStatuses)
});
const createCourseSchema = courseFormSchema.extend({
    programId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["selectedId"])("Select a program")
});
const updateCourseSchema = courseFormSchema.omit({
    programId: true
}).extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"]
});
const sectionFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    programId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Select a program"),
    yearLevel: catalogText(40, "Year level is required"),
    sectionCode: codeField("Section code", 20, /^[A-Za-z0-9][A-Za-z0-9-]*$/, "letters, numbers, and hyphens"),
    campus: catalogText(80, "Campus is required")
});
const createSectionSchema = sectionFormSchema.extend({
    programId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["selectedId"])("Select a program")
});
const sectionStatusFormSchema = sectionFormSchema.extend({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(catalogFormStatuses)
});
const updateSectionSchema = sectionStatusFormSchema.extend({
    programId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["selectedId"])("Select a program"),
    id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"]
});
const catalogStatusSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(catalogKinds),
    id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"],
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "active",
        "archived"
    ])
});
function isPilotProgramCode(code) {
    return code.trim().toUpperCase() === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_PROGRAM_CODE"];
}
function isAssignableGrouping(grouping) {
    return Boolean(grouping.programCode && grouping.yearLevel && grouping.sectionCode && grouping.campus);
}
const catalogStatusFilters = [
    {
        value: "current",
        label: "Active and inactive"
    },
    {
        value: "active",
        label: "Active"
    },
    {
        value: "inactive",
        label: "Inactive"
    },
    {
        value: "archived",
        label: "Archived"
    },
    {
        value: "all",
        label: "All statuses"
    }
];
function matchesStatusFilter(status, filter) {
    if (filter === "all") return true;
    if (filter === "current") return status !== "archived";
    return status === filter;
}
function describeUsage(parts) {
    return listPhrase(parts.filter(([count])=>count > 0).map(([count, singular, plural])=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatNumber"])(count)} ${count === 1 ? singular : plural}`));
}
function usageSentence(parts, target) {
    const counted = parts.filter(([count])=>count > 0);
    if (counted.length === 0) return "";
    const singular = counted.length === 1 && counted[0][0] === 1;
    return `${describeUsage(counted)} still ${singular ? "uses" : "use"} ${target}.`;
}
function programUsageParts(usage) {
    return [
        [
            usage.courses,
            "subject",
            "subjects"
        ],
        [
            usage.students,
            "student",
            "students"
        ],
        [
            usage.sections,
            "class grouping",
            "class groupings"
        ],
        [
            usage.assignments,
            "teaching assignment",
            "teaching assignments"
        ],
        [
            usage.schedules,
            "subject schedule",
            "subject schedules"
        ]
    ];
}
function programArchiveBlocker(program) {
    if (program.isPilot) {
        return `${program.code} is the pilot program, so it stays in the catalog while the pilot runs.`;
    }
    const sentence = usageSentence(programUsageParts(program.usage), "this program");
    return sentence ? `${sentence} Archive or reassign them first.` : null;
}
function toClassGroupingOptions(sections, programs) {
    const programCodes = new Map(programs.map((program)=>[
            program.id,
            program.program_code
        ]));
    return sections.map((row)=>({
            programId: row.program_id,
            yearLevel: row.year_level,
            sectionCode: row.section_code,
            campus: row.campus,
            status: row.status,
            assignable: row.status === "active" && programs.some((program)=>program.id === row.program_id && program.status === "active") && isAssignableGrouping({
                programCode: programCodes.get(row.program_id) ?? "",
                yearLevel: row.year_level,
                sectionCode: row.section_code,
                campus: row.campus
            })
        }));
}
const sessionLabels = {
    morning: "Morning",
    afternoon: "Afternoon"
};
const pilotSessions = new Map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_SECTIONS"].map((section)=>[
        section.code,
        section.session
    ]));
const collator = new Intl.Collator(undefined, {
    numeric: true
});
function inScope(groupings, scope) {
    if (scope.programId === null) return [];
    return groupings.filter((row)=>row.programId === scope.programId && row.yearLevel === scope.yearLevel);
}
/** Keeps a saved value selectable after its grouping left the catalog. */ function withCurrent(options, current, known) {
    if (!current || options.some((option)=>option.value === current)) {
        return options;
    }
    return [
        ...options,
        {
            value: current,
            label: `${current} — ${known ? "No longer offered" : "Not in catalog"}`,
            disabled: false
        }
    ];
}
function sectionPickerOptions(groupings, scope) {
    const rows = inScope(groupings, scope);
    const active = rows.filter((row)=>row.status === "active");
    const codes = [
        ...new Set(active.map((row)=>row.sectionCode))
    ].sort(collator.compare);
    const options = codes.map((code)=>{
        const assignable = active.some((row)=>row.sectionCode === code && row.assignable);
        const session = pilotSessions.get(code);
        return {
            value: code,
            label: !assignable ? `${code} — Program unavailable` : session ? `${code} — ${sessionLabels[session]}` : code,
            disabled: !assignable
        };
    });
    return withCurrent(options, scope.current, rows.some((row)=>row.sectionCode === scope.current));
}
function campusPickerOptions(groupings, scope) {
    const rows = inScope(groupings, scope).filter((row)=>!scope.section || row.sectionCode === scope.section);
    const active = rows.filter((row)=>row.status === "active");
    const campuses = [
        ...new Set(active.map((row)=>row.campus))
    ].sort(collator.compare);
    const options = campuses.map((campus)=>{
        const assignable = active.some((row)=>row.campus === campus && row.assignable);
        return {
            value: campus,
            label: assignable ? campus : `${campus} — Program unavailable`,
            disabled: !assignable
        };
    });
    return withCurrent(options, scope.current, rows.some((row)=>row.campus === scope.current));
}
function isOfferedCampus(groupings, scope, campus) {
    return campusPickerOptions(groupings, {
        ...scope,
        current: ""
    }).some((option)=>option.value === campus && !option.disabled);
}
}),
"[project]/src/features/shared/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "describeError",
    ()=>describeError,
    "failure",
    ()=>failure,
    "flattenIssues",
    ()=>flattenIssues,
    "nullable",
    ()=>nullable,
    "success",
    ()=>success,
    "validationFailureMessage",
    ()=>validationFailureMessage
]);
function nullable(value) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}
function failure(message, fieldErrors) {
    return {
        ok: false,
        message,
        fieldErrors
    };
}
function success(message) {
    return {
        ok: true,
        message
    };
}
function flattenIssues(issues) {
    const fieldErrors = {};
    for (const issue of issues){
        const path = issue.path.map(String).join(".");
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return fieldErrors;
}
const validationFailureMessage = "Check the highlighted fields and try again.";
function describeError(error, duplicateMessage = "A record with those unique details already exists.") {
    if (error.code === "23505") return duplicateMessage;
    return error.message;
}
}),
"[project]/src/services/supabase/pagination.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PAGE_SIZE",
    ()=>PAGE_SIZE,
    "fetchAllRows",
    ()=>fetchAllRows
]);
const PAGE_SIZE = 1000;
const MAX_PAGES = 1000;
async function fetchAllRows(loadPage) {
    const rows = [];
    for(let page = 0; page < MAX_PAGES; page += 1){
        const from = rows.length;
        const { data, error } = await loadPage(from, from + PAGE_SIZE - 1);
        if (error) throw new Error(error.message);
        if (!data || data.length === 0) return rows;
        rows.push(...data);
    }
    throw new Error("The result is too large to load completely. Narrow the date range and try again.");
}
}),
"[project]/src/features/academic/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403d001e384cf3a819fbdb86878ff802a73ee9e697":"updateProgramAction","406172448ac619889f88084b4a84c314236043b7e6":"updateSectionAction","407f2f9576e2fc8a04870746b52b3bff75350d036c":"createSectionAction","409211bc4581791006476ca7f66ad1cb040121c999":"updateCourseAction","40c470a00b1ee7b13007cd02b558223ca26c4fb031":"createProgramAction","40c4dc6f18c5e2af4d4a9d8ab25e5b8a68e4978201":"createCourseAction","40d76555c4ba92aec18a014e4009aa264af0042ca5":"setCatalogStatusAction"},"",""] */ __turbopack_context__.s([
    "createCourseAction",
    ()=>createCourseAction,
    "createProgramAction",
    ()=>createProgramAction,
    "createSectionAction",
    ()=>createSectionAction,
    "setCatalogStatusAction",
    ()=>setCatalogStatusAction,
    "updateCourseAction",
    ()=>updateCourseAction,
    "updateProgramAction",
    ()=>updateProgramAction,
    "updateSectionAction",
    ()=>updateSectionAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/audit/log.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/academic/pilot.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/academic/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/pagination.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
const ACADEMIC_PATH = "/admin/academic";
/** Pickers on these pages read the catalog, so they refresh with it. */ function refreshCatalogViews() {
    for (const path of [
        ACADEMIC_PATH,
        "/admin/students",
        "/admin/teachers",
        "/admin/schedules/subject-schedules",
        "/admin/schedules/class-schedules",
        "/admin/schedules",
        "/teacher",
        "/student"
    ]){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(path);
    }
}
const duplicateMessages = {
    programCode: "A program with that code already exists.",
    courseCode: "A subject with that code already exists in this program.",
    sectionCode: "That section already exists for this program, year level, and campus."
};
/** Unique violations become a message on the field that caused them. */ function describeError(error, field) {
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["describeError"])(error, duplicateMessages[field]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(message, error.code === "23505" ? {
        [field]: message
    } : undefined);
}
function readProgram(supabase, id) {
    return supabase.from("programs").select("id, program_code, status").eq("id", id).maybeSingle();
}
/** New subjects and groupings need a program that is still in the catalog. */ async function openProgram(supabase, id) {
    const { data, error } = await readProgram(supabase, id);
    if (error) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(error.message)
    };
    if (!data) {
        const message = "That program no longer exists.";
        return {
            refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(message, {
                programId: message
            })
        };
    }
    if (data.status === "archived") {
        const message = `Restore ${data.program_code} before adding to it.`;
        return {
            refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(message, {
                programId: message
            })
        };
    }
    return {
        ok: data
    };
}
async function createProgramAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("create_program", "programs", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProgramSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const { error } = await supabase.from("programs").insert({
            program_code: values.programCode,
            program_name: values.programName,
            department: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.department),
            status: values.status
        });
        if (error) return describeError(error, "programCode");
        refreshCatalogViews();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(`${values.programCode} was added. Add class groupings and subjects to assign it to students and teachers.`);
    });
}
async function updateProgramAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("update_program", "programs", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProgramSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const { data: existing, error: readError } = await readProgram(supabase, values.id);
        if (readError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(readError.message);
        if (!existing) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That program no longer exists.");
        if (existing.status === "archived") {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("Restore this program before editing it.");
        }
        // The pilot lock and the schedule RPCs match BSIT by code and need it active.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPilotProgramCode"])(existing.program_code)) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPilotProgramCode"])(values.programCode)) {
                const message = `The pilot lock matches ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$pilot$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PILOT_PROGRAM_CODE"]} by code, so it cannot change while the pilot runs.`;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(message, {
                    programCode: message
                });
            }
            if (values.status !== "active") {
                const message = "The pilot program stays active while the pilot runs.";
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(message, {
                    status: message
                });
            }
        }
        // This updates the catalog row only. subject_attendance keeps the
        // program_code it captured at confirmation time; renaming must never
        // backfill or rewrite that historical snapshot.
        const { error } = await supabase.from("programs").update({
            program_code: values.programCode,
            program_name: values.programName,
            department: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.department),
            status: values.status
        }).eq("id", values.id);
        if (error) return describeError(error, "programCode");
        refreshCatalogViews();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(`${values.programCode} was updated.`);
    });
}
async function createCourseAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("create_course", "courses", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCourseSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const program = await openProgram(supabase, values.programId);
        if ("refused" in program) return program.refused;
        const { error } = await supabase.from("courses").insert({
            program_id: values.programId,
            course_code: values.courseCode,
            course_name: values.courseName,
            status: values.status
        });
        if (error) return describeError(error, "courseCode");
        refreshCatalogViews();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPilotProgramCode"])(program.ok.program_code) && values.status === "active" ? `${values.courseCode} was added. Teacher assignment pickers offer it now.` : `${values.courseCode} was added to the ${program.ok.program_code} catalog.`);
    });
}
async function updateCourseAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("update_course", "courses", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCourseSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const { data: existing, error: readError } = await supabase.from("courses").select("id, status").eq("id", values.id).maybeSingle();
        if (readError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(readError.message);
        if (!existing) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That subject no longer exists.");
        if (existing.status === "archived") {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("Restore this subject before editing it.");
        }
        // This updates the catalog row only, and never program_id: (id, program_id)
        // anchors the composite keys from teacher_assignments and subject_schedules.
        // subject_attendance keeps the course_code and course_name it captured at
        // confirmation time; renaming must never backfill or rewrite that snapshot.
        const { error } = await supabase.from("courses").update({
            course_code: values.courseCode,
            course_name: values.courseName,
            status: values.status
        }).eq("id", values.id);
        if (error) return describeError(error, "courseCode");
        refreshCatalogViews();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(`${values.courseCode} was updated.`);
    });
}
async function createSectionAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("create_section", "academic_sections", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSectionSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const program = await openProgram(supabase, values.programId);
        if ("refused" in program) return program.refused;
        // Reuse the catalog's spelling when only letter case differs, so "2nd year"
        // cannot become a second grouping that never matches stored placements.
        let spellings;
        try {
            spellings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("academic_sections").select("year_level, campus").order("id", {
                    ascending: true
                }).range(from, to).returns());
        } catch (error) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(error instanceof Error ? error.message : "The class groupings could not be read.");
        }
        const yearLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["catalogSpelling"])(values.yearLevel, spellings.map((row)=>row.year_level));
        const campus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["catalogSpelling"])(values.campus, spellings.map((row)=>row.campus));
        const { error } = await supabase.from("academic_sections").insert({
            program_id: values.programId,
            year_level: yearLevel,
            section_code: values.sectionCode,
            campus
        });
        if (error) return describeError(error, "sectionCode");
        refreshCatalogViews();
        const label = `Section ${values.sectionCode} (${campus})`;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAssignableGrouping"])({
            programCode: program.ok.program_code,
            yearLevel,
            sectionCode: values.sectionCode,
            campus
        }) ? `${label} was added.` : `${label} was added to the catalog. Complete the grouping before assigning it.`);
    });
}
async function updateSectionAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("update_section", "academic_sections", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSectionSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const { error } = await supabase.rpc("update_academic_section", {
            p_id: values.id,
            p_program_id: values.programId,
            p_year_level: values.yearLevel,
            p_section_code: values.sectionCode,
            p_campus: values.campus,
            p_status: values.status
        });
        if (error) return describeError(error, "sectionCode");
        refreshCatalogViews();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(`Section ${values.sectionCode} (${values.campus}) was updated.`);
    });
}
const noUsage = {
    courses: 0,
    students: 0,
    sections: 0,
    assignments: 0,
    schedules: 0
};
/** Counted before writing: a foreign-key error would not say what to fix. */ async function countProgramUsage(supabase, programId) {
    const head = {
        count: "exact",
        head: true
    };
    const counted = await Promise.all([
        supabase.from("courses").select("id", head).eq("program_id", programId).neq("status", "archived"),
        supabase.from("students").select("id", head).eq("program_id", programId).neq("status", "archived"),
        supabase.from("academic_sections").select("id", head).eq("program_id", programId).neq("status", "archived"),
        supabase.from("teacher_assignments").select("id", head).eq("program_id", programId).eq("status", "active"),
        supabase.from("subject_schedules").select("id", head).eq("program_id", programId).eq("status", "active")
    ]);
    const failed = counted.find((response)=>response.error);
    if (failed?.error) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(failed.error.message)
    };
    const [courses, students, sections, assignments, schedules] = counted.map((response)=>response.count ?? 0);
    return {
        ok: {
            courses,
            students,
            sections,
            assignments,
            schedules
        }
    };
}
/** Restoring under an archived program would offer it for a program nobody can pick. */ async function archivedProgramRefusal(supabase, programId) {
    const { data, error } = await readProgram(supabase, programId);
    if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(error.message);
    if (data?.status === "archived") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(`Restore ${data.program_code} first.`);
    return null;
}
async function checkProgramStatus(supabase, id, status) {
    const { data, error } = await readProgram(supabase, id);
    if (error) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(error.message)
    };
    if (!data) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That program no longer exists.")
    };
    if (status === "archived") {
        const isPilot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPilotProgramCode"])(data.program_code);
        const usage = isPilot ? {
            ok: noUsage
        } : await countProgramUsage(supabase, id);
        if ("refused" in usage) return usage;
        const blocker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["programArchiveBlocker"])({
            code: data.program_code,
            isPilot,
            usage: usage.ok
        });
        if (blocker) return {
            refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(blocker)
        };
    }
    return {
        ok: data.program_code
    };
}
async function checkCourseStatus(supabase, id, status) {
    const { data, error } = await supabase.from("courses").select("id, course_code, program_id").eq("id", id).maybeSingle();
    if (error) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(error.message)
    };
    if (!data) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That subject no longer exists.")
    };
    if (status === "active") {
        const refusal = await archivedProgramRefusal(supabase, data.program_id);
        if (refusal) return {
            refused: refusal
        };
    }
    return {
        ok: data.course_code
    };
}
async function checkSectionStatus(supabase, id, status) {
    const { data, error } = await supabase.from("academic_sections").select("id, section_code, campus, program_id").eq("id", id).maybeSingle();
    if (error) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(error.message)
    };
    if (!data) return {
        refused: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That class grouping no longer exists.")
    };
    if (status === "active") {
        const refusal = await archivedProgramRefusal(supabase, data.program_id);
        if (refusal) return {
            refused: refusal
        };
    }
    return {
        ok: `Section ${data.section_code} (${data.campus})`
    };
}
const catalogTables = {
    program: "programs",
    course: "courses",
    section: "academic_sections"
};
async function setCatalogStatusAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("set_catalog_status", "academic_catalog", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["catalogStatusSchema"].safeParse(input);
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That request was not valid.");
        const { kind, id, status } = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const checked = kind === "program" ? await checkProgramStatus(supabase, id, status) : kind === "course" ? await checkCourseStatus(supabase, id, status) : await checkSectionStatus(supabase, id, status);
        if ("refused" in checked) return checked.refused;
        const { error } = await supabase.from(catalogTables[kind]).update({
            status
        }).eq("id", id);
        if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["describeError"])(error));
        refreshCatalogViews();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(status === "archived" ? `${checked.ok} was archived.` : `${checked.ok} was restored.`);
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createProgramAction,
    updateProgramAction,
    createCourseAction,
    updateCourseAction,
    createSectionAction,
    updateSectionAction,
    setCatalogStatusAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createProgramAction, "40c470a00b1ee7b13007cd02b558223ca26c4fb031", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProgramAction, "403d001e384cf3a819fbdb86878ff802a73ee9e697", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCourseAction, "40c4dc6f18c5e2af4d4a9d8ab25e5b8a68e4978201", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCourseAction, "409211bc4581791006476ca7f66ad1cb040121c999", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createSectionAction, "407f2f9576e2fc8a04870746b52b3bff75350d036c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSectionAction, "406172448ac619889f88084b4a84c314236043b7e6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setCatalogStatusAction, "40d76555c4ba92aec18a014e4009aa264af0042ca5", null);
}),
"[project]/.next-internal/server/app/(portal)/admin/academic/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/features/academic/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/academic/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(portal)/admin/academic/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/features/academic/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "403d001e384cf3a819fbdb86878ff802a73ee9e697",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProgramAction"],
    "404da90a4e7fe8872422ffb49914fe4ba62af27f09",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordUsbTapAction"],
    "406172448ac619889f88084b4a84c314236043b7e6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSectionAction"],
    "407f2f9576e2fc8a04870746b52b3bff75350d036c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSectionAction"],
    "409211bc4581791006476ca7f66ad1cb040121c999",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCourseAction"],
    "40c470a00b1ee7b13007cd02b558223ca26c4fb031",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProgramAction"],
    "40c4dc6f18c5e2af4d4a9d8ab25e5b8a68e4978201",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCourseAction"],
    "40d76555c4ba92aec18a014e4009aa264af0042ca5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setCatalogStatusAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$portal$292f$admin$2f$academic$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(portal)/admin/academic/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/features/academic/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/academic/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__62004fb8._.js.map