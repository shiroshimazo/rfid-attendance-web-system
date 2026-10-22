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
"[project]/src/features/academic/validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertActiveAssignments",
    ()=>assertActiveAssignments,
    "assertActiveProgram",
    ()=>assertActiveProgram
]);
async function assertActiveProgram(supabase, programId) {
    const { data, error } = await supabase.from("programs").select("id, status").eq("id", programId).maybeSingle();
    if (error) return error.message;
    if (!data) return "That program no longer exists.";
    return data.status === "active" ? null : "Select an active program.";
}
async function assertActiveAssignments(supabase, assignments) {
    for (const programId of new Set(assignments.map((row)=>row.programId))){
        const error = await assertActiveProgram(supabase, programId);
        if (error) return error;
    }
    const { data, error } = await supabase.from("courses").select("id, program_id, status").in("id", [
        ...new Set(assignments.map((row)=>row.courseId))
    ]);
    if (error) return error.message;
    if (assignments.some((row)=>!data?.some((course)=>course.id === row.courseId && course.program_id === row.programId && course.status === "active"))) {
        return "Select an active subject belonging to the selected program.";
    }
    return null;
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
"[project]/src/features/shared/management.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "changeManagedLoginEmail",
    ()=>changeManagedLoginEmail,
    "cleanupFailedProfileCreation",
    ()=>cleanupFailedProfileCreation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/actions.ts [app-rsc] (ecmascript)");
;
async function changeManagedLoginEmail(admin, userId, email) {
    try {
        const { data, error } = await admin.auth.admin.updateUserById(userId, {
            email,
            email_confirm: true
        });
        if (!error && data.user?.email?.toLowerCase() === email) return null;
        const message = error ? `Profile details were saved, but the login email could not be changed: ${error.message}` : "Profile details were saved, but the email change is not confirmed. Reload to check the current email before retrying.";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(message, {
            email: message
        });
    } catch  {
        // A network failure does not establish whether the Auth transaction committed.
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("Profile details were saved, but the email change could not be confirmed. Reload to check the current email before retrying.");
    }
}
async function cleanupFailedProfileCreation(admin, table, userId, code) {
    const retained = " The account was retained because the save outcome could not be safely rolled back. Reload the directory and check Supabase Authentication before retrying.";
    if (!code || !(/^(22|23|40)[0-9A-Z]{3}$/.test(code) || [
        "42501",
        "P0001"
    ].includes(code))) return retained;
    try {
        const { data, error } = await admin.from(table).select("id").eq("user_id", userId).maybeSingle();
        if (error || data) return retained;
        const removed = await admin.auth.admin.deleteUser(userId);
        if (removed.error) return " The unused login account could not be removed. Resolve that account in Supabase Authentication before retrying.";
        return "";
    } catch  {
        return " The unused login account cleanup could not be confirmed. Check Supabase Authentication before retrying.";
    }
}
}),
"[project]/src/features/rfid/write.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "writeRfidCard",
    ()=>writeRfidCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)");
;
;
;
const savedMessage = {
    save: "RFID card saved.",
    assign: "RFID card assigned.",
    release: "The card was returned to the card list.",
    status: ""
};
async function writeRfidCard(values) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const { error } = await supabase.rpc("save_rfid_card", {
        p_operation: values.operation,
        p_student_id: values.studentId ?? null,
        p_uid: values.rfidNumber ?? null,
        p_card_id: values.id ?? null,
        p_status: values.cardStatus,
        p_assigned_date: values.assignedDate ?? null
    });
    if (error) {
        const message = error.code === "23505" && !error.message.startsWith("That UID belongs") ? "That UID is already registered or another card became active. Reload before retrying." : error.code === "23503" && !error.message.startsWith("Attendance history") ? "The card or student no longer exists, or attendance history prevents changing the holder." : error.message;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(message);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/rfid-cards");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/students");
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(values.operation === "status" ? `Card is now ${values.cardStatus.toLowerCase()}.` : savedMessage[values.operation]);
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
"[project]/src/features/students/schema.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cardAssignmentFormSchema",
    ()=>cardAssignmentFormSchema,
    "cardAssignmentSchema",
    ()=>cardAssignmentSchema,
    "cardReleaseSchema",
    ()=>cardReleaseSchema,
    "createStudentSchema",
    ()=>createStudentSchema,
    "studentDialogSchema",
    ()=>studentDialogSchema,
    "studentIdSchema",
    ()=>studentIdSchema,
    "studentProfileSchema",
    ()=>studentProfileSchema,
    "updateStudentSchema",
    ()=>updateStudentSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.3.2/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/schema.ts [app-rsc] (ecmascript)");
;
;
;
/** Fields shared by the browser form and the authoritative server schema. */ const studentFields = {
    // Personal
    fullName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredText"])(120, "Full name is required"),
    gender: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["genderOptions"]).or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("")),
    dateOfBirth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["optionalDate"],
    placeOfBirth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["optionalText"])(120),
    address: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["optionalText"])(240),
    contactNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["optionalText"])(32),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailField"],
    profilePicture: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["optionalUrl"],
    // Parent or guardian
    parentName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredText"])(120, "Parent or guardian name is required"),
    parentContactNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(7, "Parent or guardian contact number is required").max(32),
    // Academic placement is checked against the catalog when saving.
    studentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredText"])(40, "Student ID is required"),
    yearLevel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredText"])(40, "Year level is required"),
    section: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredText"])(40, "Section is required"),
    campus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredText"])(80, "Campus is required"),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["accountStatuses"])
};
const studentDialogSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    mode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "create",
        "edit"
    ]),
    ...studentFields,
    // The combobox holds the program id as a string.
    programId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Select a program"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(72),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}).superRefine(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyCredentialRules"]);
const studentProfileSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    ...studentFields,
    programId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["selectedId"])("Select a program")
});
const createStudentSchema = studentProfileSchema.extend(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passwordFields"]).refine(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passwordsMatch"].check, {
    path: [
        "confirmPassword"
    ],
    message: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passwordsMatch"].message
});
const updateStudentSchema = studentProfileSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"]
});
const cardAssignmentFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    cardId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Select a registered card"),
    cardStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfidCardStatuses"]),
    assignedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredDate"])("Choose the date the card was issued")
});
const cardAssignmentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"],
    cardId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["selectedId"])("Select a registered card"),
    cardStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rfidCardStatuses"]),
    assignedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requiredDate"])("Choose the date the card was issued")
});
const cardReleaseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    cardId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"]
});
const studentIdSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["databaseIdSchema"];
}),
"[project]/src/features/students/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"400dbfafec10f094a1fc652da85700d1259d3ed652":"assignRfidCardAction","40581afb4c043ccc919af188e1dcfdf97d09b3c4c2":"updateStudentAction","40a51611cac943d1b5e98284da9abb664e66b608b4":"releaseRfidCardAction","40d95d4cc517b626f7dd135df508d5990583ced018":"createStudentAction","607f243ae7ae49b0391dede7740bd323fed89ccc85":"setStudentStatusAction"},"",""] */ __turbopack_context__.s([
    "assignRfidCardAction",
    ()=>assignRfidCardAction,
    "createStudentAction",
    ()=>createStudentAction,
    "releaseRfidCardAction",
    ()=>releaseRfidCardAction,
    "setStudentStatusAction",
    ()=>setStudentStatusAction,
    "updateStudentAction",
    ()=>updateStudentAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/audit/log.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/academic/validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$management$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/management.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2f$write$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid/write.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/shared/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/students/schema.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/admin.ts [app-rsc] (ecmascript)");
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
;
;
;
const STUDENTS_PATH = "/admin/students";
function describeError(error) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["describeError"])(error, "A student with that ID or email already exists.");
}
/** Columns written by both the create and the edit paths. */ function studentColumns(values) {
    return {
        student_id: values.studentId,
        full_name: values.fullName,
        gender: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.gender),
        date_of_birth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.dateOfBirth),
        place_of_birth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.placeOfBirth),
        address: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.address),
        contact_number: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.contactNumber),
        email: values.email,
        profile_picture: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nullable"])(values.profilePicture),
        parent_name: values.parentName,
        parent_contact_number: values.parentContactNumber,
        program_id: values.programId,
        year_level: values.yearLevel,
        section: values.section,
        campus: values.campus,
        status: values.status
    };
}
async function createStudentAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("create_student", "students", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStudentSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const programError = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertActiveProgram"])(supabase, values.programId);
        if (programError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(programError);
        let admin;
        try {
            admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])();
        } catch (error) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(error instanceof Error ? error.message : "Supabase administration is not configured.");
        }
        // The login account is created with the service role, which never leaves
        // this server action. Everything after it runs under the admin's own
        // session, so Row Level Security still applies.
        const created = await admin.auth.admin.createUser({
            email: values.email,
            password: values.password,
            email_confirm: true,
            app_metadata: {
                role: "student"
            },
            user_metadata: {
                full_name: values.fullName
            }
        });
        if (created.error || !created.data.user) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(created.error?.message ?? "The login account could not be created.");
        }
        const userId = created.data.user.id;
        const { error: studentError } = await supabase.rpc("save_student_profile", {
            p_user_id: userId,
            p_profile: studentColumns(values)
        });
        if (studentError) {
            const cleanup = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$management$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cleanupFailedProfileCreation"])(admin, "students", userId, studentError.code);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(describeError(studentError) + cleanup);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(STUDENTS_PATH);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/archives");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/rfid-cards");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(`${values.fullName} was added.`);
    });
}
async function updateStudentAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("update_student", "students", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["updateStudentSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        }
        const values = parsed.data;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const programError = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$academic$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertActiveProgram"])(supabase, values.programId);
        if (programError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(programError);
        const { data: existing, error: existingError } = await supabase.from("students").select("id, user_id, email").eq("id", values.id).maybeSingle();
        if (existingError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(describeError(existingError));
        if (!existing) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That student record no longer exists.");
        const emailChanged = existing.email.toLowerCase() !== values.email;
        let admin;
        if (emailChanged) {
            try {
                admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])();
            } catch  {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("Supabase administration is not configured. No changes were saved.");
            }
        }
        const { error: updateError } = await supabase.rpc("save_student_profile", {
            p_id: values.id,
            p_profile: studentColumns(values)
        });
        if (updateError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(describeError(updateError));
        // Non-email edits commit together. Email remains Auth-owned even if its API fails.
        const emailResult = admin ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$management$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changeManagedLoginEmail"])(admin, existing.user_id, values.email) : null;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(STUDENTS_PATH);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/archives");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/rfid-cards");
        if (emailResult) return emailResult;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(`${values.fullName} was updated.`);
    });
}
async function setStudentStatusAction(id, status) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("set_student_status", "students", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsedId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["studentIdSchema"].safeParse(id);
        if (!parsedId.success || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["accountStatuses"].includes(status)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That request was not valid.");
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
        const { data: student, error: readError } = await supabase.from("students").select("id, user_id, full_name").eq("id", parsedId.data).maybeSingle();
        if (readError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(describeError(readError));
        if (!student) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])("That student record no longer exists.");
        // The database synchronizes account status and retires the active card
        // atomically, just as it does when status changes through the edit dialog.
        const { error: studentError } = await supabase.from("students").update({
            status
        }).eq("id", student.id);
        if (studentError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(describeError(studentError));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(STUDENTS_PATH);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/archives");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/rfid-cards");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["success"])(status === "archived" ? `${student.full_name} was archived.` : status === "inactive" ? `${student.full_name} was made inactive.` : `${student.full_name} was restored.`);
    });
}
async function assignRfidCardAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("assign_rfid_card", "students", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cardAssignmentSchema"].safeParse(input);
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        const { cardId, studentId, cardStatus, assignedDate } = parsed.data;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2f$write$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeRfidCard"])({
            operation: "assign",
            id: cardId,
            studentId,
            cardStatus,
            assignedDate
        });
    });
}
async function releaseRfidCardAction(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("release_rfid_card", "students", async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cardReleaseSchema"].safeParse(input);
        if (!parsed.success) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["failure"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validationFailureMessage"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$shared$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenIssues"])(parsed.error.issues));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2f$write$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeRfidCard"])({
            operation: "release",
            id: parsed.data.cardId,
            cardStatus: "Inactive"
        });
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createStudentAction,
    updateStudentAction,
    setStudentStatusAction,
    assignRfidCardAction,
    releaseRfidCardAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createStudentAction, "40d95d4cc517b626f7dd135df508d5990583ced018", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateStudentAction, "40581afb4c043ccc919af188e1dcfdf97d09b3c4c2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setStudentStatusAction, "607f243ae7ae49b0391dede7740bd323fed89ccc85", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(assignRfidCardAction, "400dbfafec10f094a1fc652da85700d1259d3ed652", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(releaseRfidCardAction, "40a51611cac943d1b5e98284da9abb664e66b608b4", null);
}),
"[project]/.next-internal/server/app/(portal)/admin/students/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/features/students/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/students/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(portal)/admin/students/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/features/students/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "400dbfafec10f094a1fc652da85700d1259d3ed652",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assignRfidCardAction"],
    "404da90a4e7fe8872422ffb49914fe4ba62af27f09",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordUsbTapAction"],
    "40581afb4c043ccc919af188e1dcfdf97d09b3c4c2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateStudentAction"],
    "40a51611cac943d1b5e98284da9abb664e66b608b4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["releaseRfidCardAction"],
    "40d95d4cc517b626f7dd135df508d5990583ced018",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createStudentAction"],
    "607f243ae7ae49b0391dede7740bd323fed89ccc85",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setStudentStatusAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$portal$292f$admin$2f$students$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(portal)/admin/students/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/features/students/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$rfid$2d$tap$2f$usb$2d$action$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/rfid-tap/usb-action.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$students$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/students/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__12ce351e._.js.map