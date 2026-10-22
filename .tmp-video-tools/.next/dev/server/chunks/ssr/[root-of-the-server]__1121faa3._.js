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
"[project]/.next-internal/server/app/(portal)/admin/system-logs/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/(portal)/admin/system-logs/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "404da90a4e7fe8872422ffb49914fe4ba62af27f09",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordUsbTapAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$portal$292f$admin$2f$system$2d$logs$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(portal)/admin/system-logs/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1121faa3._.js.map