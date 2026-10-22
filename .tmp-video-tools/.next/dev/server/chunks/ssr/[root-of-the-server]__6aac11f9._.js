module.exports = [
"[project]/src/features/auth/roles.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dashboardPathByRole",
    ()=>dashboardPathByRole,
    "isUserRole",
    ()=>isUserRole,
    "userRoles",
    ()=>userRoles
]);
const userRoles = [
    "admin",
    "teacher",
    "student"
];
const dashboardPathByRole = {
    admin: "/admin/dashboard",
    teacher: "/teacher/dashboard",
    student: "/student/dashboard"
};
function isUserRole(value) {
    return typeof value === "string" && userRoles.includes(value);
}
}),
"[project]/src/services/supabase/config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured,
    "missingSupabaseConfigurationMessage",
    ()=>missingSupabaseConfigurationMessage,
    "supabasePublishableKey",
    ()=>supabasePublishableKey,
    "supabaseUrl",
    ()=>supabaseUrl
]);
const supabaseUrl = ("TURBOPACK compile-time value", "https://izfvtsgrvbzmygmpcarb.supabase.co") ?? "";
const supabasePublishableKey = ("TURBOPACK compile-time value", "sb_publishable_sEUob9zzedsntud1_PsfFw_JYsVVagy") ?? "";
function isSupabaseConfigured() {
    return Boolean(supabaseUrl && supabasePublishableKey);
}
const missingSupabaseConfigurationMessage = "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.";
}),
"[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createServerSupabaseClient",
    ()=>createServerSupabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$12$2e$5_$40$supabase$2b$supabase$2d$js$40$2$2e$112$2e$4$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.12.5_@supabase+supabase-js@2.112.4/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/config.ts [app-rsc] (ecmascript)");
;
;
;
async function createServerSupabaseClient() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
        throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["missingSupabaseConfigurationMessage"]);
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$12$2e$5_$40$supabase$2b$supabase$2d$js$40$2$2e$112$2e$4$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseUrl"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabasePublishableKey"], {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>{
                        cookieStore.set(name, value, options);
                    });
                } catch  {
                // Server Components cannot always write cookies. The proxy refreshes
                // the same session and persists any updated cookies on the response.
                }
            }
        }
    });
}
}),
"[project]/src/features/auth/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentAccount",
    ()=>getCurrentAccount,
    "requireCurrentAccount",
    ()=>requireCurrentAccount,
    "requireRole",
    ()=>requireRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/roles.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const getCurrentAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) return null;
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: verified, error: verificationError } = await supabase.rpc("has_verified_email_session");
    if (verificationError || verified !== true) return null;
    const { data } = await supabase.from("users").select("id, email, role, status").eq("id", user.id).maybeSingle();
    const account = data;
    if (!account || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isUserRole"])(account.role)) return null;
    const metadataName = user.user_metadata?.full_name;
    return {
        id: account.id,
        email: account.email,
        name: typeof metadataName === "string" && metadataName.trim() ? metadataName : account.email,
        role: account.role,
        status: account.status
    };
});
async function requireCurrentAccount() {
    const account = await getCurrentAccount();
    if (!account) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/sign-in");
    if (account.status !== "active") (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/errors/unauthorized");
    return account;
}
async function requireRole(role) {
    const account = await requireCurrentAccount();
    if (account.role !== role) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dashboardPathByRole"][account.role]);
    }
    return account;
}
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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/features/auth/email-login-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"007e519d3fc1b61147881119ea14b7751066142abd":"resendEmailLogin","00b14c3c3901adf0352d40cb1bbd822d7ec16b5ebd":"cancelEmailLogin","4040241167bea0f3ab268861f3378d821ccc0d29cb":"verifyEmailLogin","409447040e70d715a769fe15192bc57d42887b4192":"beginEmailLogin"},"",""] */ __turbopack_context__.s([
    "beginEmailLogin",
    ()=>beginEmailLogin,
    "cancelEmailLogin",
    ()=>cancelEmailLogin,
    "resendEmailLogin",
    ()=>resendEmailLogin,
    "verifyEmailLogin",
    ()=>verifyEmailLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/audit/log.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$112$2e$4$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.112.4/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.3.2/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/roles.ts [app-rsc] (ecmascript)");
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
const cookieName = "login-email-challenge";
const cookieOptions = {
    httpOnly: true,
    secure: ("TURBOPACK compile-time value", "development") === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 600
};
const trustCookieName = "login-email-trust";
const trustSeconds = 3 * 24 * 60 * 60;
const credentials = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().max(254),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(6).max(1024)
});
const hash = (value)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(value).digest("hex");
const authClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$112$2e$4$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseUrl"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabasePublishableKey"], {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
const unavailable = {
    error: "Unable to complete verification. Please try again or contact your administrator."
};
async function activateVerifiedSession(session, userId) {
    // Sessions come directly from Auth after a password or OTP verification.
    const payload = JSON.parse(Buffer.from(session.access_token.split(".")[1], "base64url").toString());
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$2$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().safeParse(payload.session_id).success) return false;
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])();
    const { error } = await admin.from("email_verified_sessions").insert({
        session_id: payload.session_id,
        user_id: userId
    });
    if (error) return false;
    const server = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const { error: cookieError } = await server.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
    });
    if (cookieError) {
        await admin.from("email_verified_sessions").delete().eq("session_id", payload.session_id);
        return false;
    }
    return true;
}
async function beginEmailLogin(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("begin_email_login", "authentication", async ()=>{
        const parsed = credentials.safeParse(input);
        if (!parsed.success) return {
            error: "Enter a valid email and password."
        };
        let auth;
        let keepSession = false;
        try {
            auth = authClient();
            const { data, error } = await auth.auth.signInWithPassword(parsed.data);
            if (error || !data.user || !data.session) return {
                error: "Invalid email or password."
            };
            const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])();
            const { data: account, error: accountError } = await admin.from("users").select("role,status").eq("id", data.user.id).maybeSingle();
            if (accountError) return {
                error: "Account verification is unavailable. Ask your administrator to check database permissions."
            };
            if (!account || account.status !== "active" || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isUserRole"])(account.role) || !data.user.email) {
                return {
                    error: "This account is inactive or does not have a valid system role."
                };
            }
            const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
            const remembered = jar.get(trustCookieName)?.value;
            if (remembered && /^[a-f0-9]{64}$/.test(remembered)) {
                const { data: trust, error: trustError } = await admin.from("login_email_trust").select("user_id").eq("token_hash", hash(remembered)).eq("user_id", data.user.id).eq("email", data.user.email).gt("expires_at", new Date().toISOString()).maybeSingle();
                if (!trustError && trust) {
                    if (!await activateVerifiedSession(data.session, data.user.id)) return unavailable;
                    keepSession = true;
                    await cancelEmailLogin();
                    // Do not renew the remembered deadline on password-only logins.
                    return {
                        path: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dashboardPathByRole"][account.role]
                    };
                }
            }
            // Unverified password sessions are never given to the browser.
            await auth.auth.signOut({
                scope: "local"
            });
            const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("hex");
            const tokenHash = hash(token);
            const { error: saveError } = await admin.from("login_email_challenges").insert({
                token_hash: tokenHash,
                user_id: data.user.id,
                email: data.user.email,
                expires_at: new Date(Date.now() + 600_000).toISOString()
            });
            if (saveError) return unavailable;
            const { error: sendError } = await auth.auth.signInWithOtp({
                email: data.user.email,
                options: {
                    shouldCreateUser: false
                }
            });
            if (sendError) {
                await admin.from("login_email_challenges").delete().eq("token_hash", tokenHash);
                return {
                    error: "Unable to send a code. Wait 60 seconds and try again. Contact your administrator if delivery keeps failing."
                };
            }
            const previous = jar.get(cookieName)?.value;
            if (previous) await admin.from("login_email_challenges").delete().eq("token_hash", hash(previous));
            jar.set(cookieName, token, cookieOptions);
            return {
                email: data.user.email
            };
        } catch  {
            return unavailable;
        } finally{
            if (auth && !keepSession) await auth.auth.signOut({
                scope: "local"
            }).catch(()=>{});
        }
    });
}
async function verifyEmailLogin(code) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("verify_email_login", "authentication", async ()=>{
        if (!/^\d{6}$/.test(code)) return {
            error: "Enter the six-digit code from your email."
        };
        let auth;
        let keepSession = false;
        try {
            const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
            const token = jar.get(cookieName)?.value;
            if (!token) return {
                error: "Verification expired. Start again with your email and password."
            };
            const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])();
            // Atomic attempt reservation prevents concurrent requests bypassing the limit.
            const { data: attempts, error: attemptError } = await admin.rpc("claim_email_attempt", {
                challenge_hash: hash(token)
            });
            const challenge = attempts?.[0];
            if (attemptError || !challenge) return {
                error: "Code expired or attempt limit reached. Start again with your email and password."
            };
            auth = authClient();
            const { data, error } = await auth.auth.verifyOtp({
                email: challenge.email,
                token: code,
                type: "email"
            });
            if (error || !data.session || !data.user || data.user.id !== challenge.user_id) return {
                error: "Invalid or expired code. Check your email and try again."
            };
            const { data: account, error: accountError } = await admin.from("users").select("role,status").eq("id", data.user.id).maybeSingle();
            if (accountError) return {
                error: "Account verification is unavailable. Ask your administrator to check database permissions."
            };
            if (!account || account.status !== "active" || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isUserRole"])(account.role)) return {
                error: "This account is no longer active."
            };
            // Consume password proof once, even if two requests verified concurrently.
            const { data: consumed, error: consumeError } = await admin.from("login_email_challenges").delete().eq("token_hash", hash(token)).gt("expires_at", new Date().toISOString()).select("user_id");
            if (consumeError || consumed?.length !== 1) return {
                error: "Verification expired. Please sign in again."
            };
            const remembered = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("hex");
            const expiresAt = new Date(Date.now() + trustSeconds * 1000);
            const { error: trustError } = await admin.from("login_email_trust").insert({
                token_hash: hash(remembered),
                user_id: data.user.id,
                email: challenge.email,
                expires_at: expiresAt.toISOString()
            });
            if (trustError) return unavailable;
            if (!await activateVerifiedSession(data.session, data.user.id)) {
                await admin.from("login_email_trust").delete().eq("token_hash", hash(remembered));
                return unavailable;
            }
            keepSession = true;
            jar.set(trustCookieName, remembered, {
                ...cookieOptions,
                maxAge: trustSeconds,
                expires: expiresAt
            });
            jar.delete(cookieName);
            return {
                path: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dashboardPathByRole"][account.role]
            };
        } catch  {
            return unavailable;
        } finally{
            if (auth && !keepSession) await auth.auth.signOut({
                scope: "local"
            }).catch(()=>{});
        }
    });
}
async function cancelEmailLogin() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("cancel_email_login", "authentication", async ()=>{
        const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        const token = jar.get(cookieName)?.value;
        jar.delete(cookieName);
        if (token) {
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])().from("login_email_challenges").delete().eq("token_hash", hash(token));
            } catch  {}
        }
    });
}
async function resendEmailLogin() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$audit$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActivity"])("resend_email_login", "authentication", async ()=>{
        try {
            const token = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get(cookieName)?.value;
            if (!token) return {
                error: "Verification expired. Please start again."
            };
            const now = Date.now();
            const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSupabaseClient"])().from("login_email_challenges").update({
                sent_at: new Date(now).toISOString()
            }).eq("token_hash", hash(token)).gt("expires_at", new Date(now).toISOString()).lt("attempts", 5).lt("sent_at", new Date(now - 60_000).toISOString()).select("email").maybeSingle();
            if (error || !data) return {
                error: "Wait 60 seconds before resending. If verification expired, start again."
            };
            const { error: sendError } = await authClient().auth.signInWithOtp({
                email: data.email,
                options: {
                    shouldCreateUser: false
                }
            });
            if (sendError) return {
                error: "Unable to resend the code. Please wait and try again."
            };
            return {
                sent: true
            };
        } catch  {
            return unavailable;
        }
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    beginEmailLogin,
    verifyEmailLogin,
    cancelEmailLogin,
    resendEmailLogin
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(beginEmailLogin, "409447040e70d715a769fe15192bc57d42887b4192", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyEmailLogin, "4040241167bea0f3ab268861f3378d821ccc0d29cb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelEmailLogin, "00b14c3c3901adf0352d40cb1bbd822d7ec16b5ebd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resendEmailLogin, "007e519d3fc1b61147881119ea14b7751066142abd", null);
}),
"[project]/.next-internal/server/app/(auth)/sign-in/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/auth/email-login-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$email$2d$login$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/email-login-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/.next-internal/server/app/(auth)/sign-in/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/features/auth/email-login-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "007e519d3fc1b61147881119ea14b7751066142abd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$email$2d$login$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resendEmailLogin"],
    "00b14c3c3901adf0352d40cb1bbd822d7ec16b5ebd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$email$2d$login$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelEmailLogin"],
    "4040241167bea0f3ab268861f3378d821ccc0d29cb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$email$2d$login$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyEmailLogin"],
    "409447040e70d715a769fe15192bc57d42887b4192",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$email$2d$login$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["beginEmailLogin"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$auth$292f$sign$2d$in$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$features$2f$auth$2f$email$2d$login$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(auth)/sign-in/page/actions.js { ACTIONS_MODULE0 => "[project]/src/features/auth/email-login-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$email$2d$login$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/email-login-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6aac11f9._.js.map