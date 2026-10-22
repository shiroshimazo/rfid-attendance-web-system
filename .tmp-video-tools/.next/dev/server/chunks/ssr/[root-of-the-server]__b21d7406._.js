module.exports = [
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/(portal)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(portal)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/(portal)/student/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(portal)/student/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/(portal)/student/my-attendance/error.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/error.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/(portal)/student/my-attendance/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/school-time.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Returns the school's calendar date independently of the host timezone. */ __turbopack_context__.s([
    "schoolDateKey",
    ()=>schoolDateKey
]);
function schoolDateKey(value) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(value);
}
}),
"[project]/src/lib/search-tags.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Search bars in this app accept several terms at once. Each term is a tag, and
 * a row is kept when it matches at least one tag, so adding a term widens the
 * result set rather than narrowing it.
 */ /** A short list of terms stays readable in the filter row. */ __turbopack_context__.s([
    "MAX_SEARCH_TAGS",
    ()=>MAX_SEARCH_TAGS,
    "MAX_SEARCH_TAG_LENGTH",
    ()=>MAX_SEARCH_TAG_LENGTH,
    "isSearchFiltered",
    ()=>isSearchFiltered,
    "matchesAnySearchTag",
    ()=>matchesAnySearchTag,
    "matchesAnySearchTagIn",
    ()=>matchesAnySearchTagIn,
    "normalizeSearchTags",
    ()=>normalizeSearchTags,
    "searchTagsEqual",
    ()=>searchTagsEqual,
    "searchTagsFromParams",
    ()=>searchTagsFromParams
]);
const MAX_SEARCH_TAGS = 8;
const MAX_SEARCH_TAG_LENGTH = 60;
function normalizeSearchTags(tags) {
    const seen = new Set();
    const normalized = [];
    for (const raw of tags){
        const tag = raw.trim().slice(0, MAX_SEARCH_TAG_LENGTH);
        if (!tag) continue;
        const key = tag.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        normalized.push(tag);
        if (normalized.length >= MAX_SEARCH_TAGS) break;
    }
    return normalized;
}
function searchTagsFromParams(value) {
    if (value === undefined) return [];
    if (Array.isArray(value)) return normalizeSearchTags(value);
    return normalizeSearchTags([
        value
    ]);
}
function isSearchFiltered(tags) {
    return tags.length > 0;
}
function matchesAnySearchTag(haystack, tags) {
    if (tags.length === 0) return true;
    const lowered = haystack.toLowerCase();
    return tags.some((tag)=>lowered.includes(tag.toLowerCase()));
}
function matchesAnySearchTagIn(values, tags) {
    if (tags.length === 0) return true;
    const lowered = values.filter((value)=>Boolean(value)).map((value)=>value.toLowerCase());
    return tags.some((tag)=>{
        const needle = tag.toLowerCase();
        return lowered.some((value)=>value.includes(needle));
    });
}
function searchTagsEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((tag, index)=>tag === b[index]);
}
}),
"[project]/src/features/attendance/status.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** The current business contract. Historical database values are read as strings. */ __turbopack_context__.s([
    "isAttendanceStatus",
    ()=>isAttendanceStatus,
    "recordStatus",
    ()=>recordStatus
]);
function isAttendanceStatus(value) {
    return value === "Present" || value === "Late" || value === "Absent";
}
function recordStatus(value) {
    return isAttendanceStatus(value) ? value : "LegacyRecord";
}
}),
"[project]/src/features/attendance/schema.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NO_RECORD_LABEL",
    ()=>NO_RECORD_LABEL,
    "attendanceRowStatuses",
    ()=>attendanceRowStatuses,
    "attendanceStatusLabel",
    ()=>attendanceStatusLabel,
    "attendanceStatuses",
    ()=>attendanceStatuses,
    "isAttendancePanelFiltered",
    ()=>isAttendancePanelFiltered,
    "parseAttendancePanelQuery",
    ()=>parseAttendancePanelQuery,
    "toDateKey",
    ()=>toDateKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/format.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/isValid.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/parseISO.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/school-time.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2d$tags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/search-tags.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/attendance/status.ts [app-rsc] (ecmascript)");
;
;
;
;
const attendanceStatuses = [
    "Present",
    "Late",
    "Absent"
];
const attendanceRowStatuses = [
    ...attendanceStatuses,
    "NoRecord"
];
const NO_RECORD_LABEL = "No tap recorded yet";
function attendanceStatusLabel(status) {
    if (status === "Attended") return "Present and late";
    if (status === "LegacyRecord") return "Historical record";
    return status === "NoRecord" ? NO_RECORD_LABEL : status;
}
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
function toDateKey(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(value, "yyyy-MM-dd");
}
function firstValue(value) {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}
function readDate(value, now) {
    const candidate = value.trim();
    if (DATE_KEY_PATTERN.test(candidate) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$isValid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isValid"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseISO"])(candidate))) {
        return candidate;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["schoolDateKey"])(now);
}
function readStatus(value) {
    const candidate = value.trim();
    if (candidate === "Attended") return candidate;
    return attendanceRowStatuses.find((status)=>status === candidate) ?? "all";
}
function readProgramId(value) {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
function parseAttendancePanelQuery(params, now = new Date()) {
    return {
        date: readDate(firstValue(params.date), now),
        status: readStatus(firstValue(params.status)),
        programId: readProgramId(firstValue(params.program)),
        yearLevel: firstValue(params.yearLevel).trim() || null,
        section: firstValue(params.section).trim() || null,
        search: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2d$tags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchTagsFromParams"])(params.search)
    };
}
function isAttendancePanelFiltered(query) {
    return query.status !== "all" || query.programId !== null || query.yearLevel !== null || query.section !== null || query.search.length > 0;
}
}),
"[project]/src/components/data-error-card.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataErrorCard",
    ()=>DataErrorCard
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DataErrorCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DataErrorCard() from the server but DataErrorCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/data-error-card.tsx <module evaluation>", "DataErrorCard");
}),
"[project]/src/components/data-error-card.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataErrorCard",
    ()=>DataErrorCard
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DataErrorCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DataErrorCard() from the server but DataErrorCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/data-error-card.tsx", "DataErrorCard");
}),
"[project]/src/components/data-error-card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$error$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/data-error-card.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$error$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/data-error-card.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$error$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/features/subject-attendance/model.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "belongsToSubject",
    ()=>belongsToSubject,
    "enrolledSubjectStudents",
    ()=>enrolledSubjectStudents,
    "latestSubjectDate",
    ()=>latestSubjectDate,
    "subjectAttendancePolicy",
    ()=>subjectAttendancePolicy,
    "subjectTotals",
    ()=>subjectTotals,
    "weekdayLabel",
    ()=>weekdayLabel,
    "weekdays",
    ()=>weekdays
]);
const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
function weekdayLabel(day) {
    return weekdays[day] ?? "—";
}
function latestSubjectDate(schedules, today) {
    const days = new Set(schedules.filter((row)=>row.status === "active").map((row)=>row.day_of_week));
    const date = new Date(`${today}T00:00:00Z`);
    for(let offset = 0; offset < 7; offset++){
        if (days.has(date.getUTCDay())) return date.toISOString().slice(0, 10);
        date.setUTCDate(date.getUTCDate() - 1);
    }
    return today;
}
function enrolledSubjectStudents(students, enrollments, scheduleId) {
    const ids = new Set(enrollments.filter((row)=>row.schedule_id === scheduleId && row.active).map((row)=>row.student_id));
    return students.filter((student)=>ids.has(student.id));
}
function belongsToSubject(student, schedule) {
    return student.program_id === schedule.program_id && student.year_level === schedule.year_level && student.section === schedule.section && student.campus === schedule.campus;
}
function subjectTotals(rows) {
    const present = rows.filter((row)=>row.attendance_status === "Present").length;
    const late = rows.filter((row)=>row.attendance_status === "Late").length;
    const absent = rows.filter((row)=>row.attendance_status === "Absent").length;
    const confirmed = present + late + absent;
    return {
        present,
        late,
        absent,
        confirmed,
        rate: confirmed ? (present + late) / confirmed * 100 : null
    };
}
const subjectAttendancePolicy = "Subject attendance is teacher-confirmed as Present, Late or Absent. Campus taps leave subject sessions unconfirmed. A teacher confirmation creates no RFID time-in/time-out or scans. Rates use confirmed (Present + Late) / (Present + Late + Absent) student-sessions; unconfirmed sessions are excluded.";
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
"[project]/src/services/attendance/subject-attendance.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchSubjectAssignments",
    ()=>fetchSubjectAssignments,
    "fetchSubjectAttendance",
    ()=>fetchSubjectAttendance,
    "fetchSubjectEnrollments",
    ()=>fetchSubjectEnrollments,
    "fetchSubjectRfidEvidence",
    ()=>fetchSubjectRfidEvidence,
    "fetchSubjectSchedules",
    ()=>fetchSubjectSchedules,
    "fetchSubjectStudents",
    ()=>fetchSubjectStudents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/pagination.ts [app-rsc] (ecmascript)");
;
;
async function fetchSubjectAttendance(range = {}) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>{
        let query = supabase.from("subject_attendance").select("id, schedule_id, student_id, attendance_date, attendance_status, time_start, time_end, student_number, student_name, teacher_name, course_code, course_name, program_code, year_level, section, campus, confirmed_at");
        if (range.from) query = query.gte("attendance_date", range.from);
        if (range.to) query = query.lte("attendance_date", range.to);
        return query.order("attendance_date", {
            ascending: false
        }).order("id", {
            ascending: false
        }).range(from, to).returns();
    });
}
async function fetchSubjectSchedules() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("subject_schedules").select("id, roster_version, program_id, teacher_id, course_id, year_level, section, campus, day_of_week, time_start, time_end, status, course:courses(course_code, course_name), teacher:teachers(full_name)").order("day_of_week").order("time_start").order("id").range(from, to).returns());
}
async function fetchSubjectEnrollments() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("subject_enrollments").select("schedule_id, student_id, active").order("schedule_id").order("student_id").range(from, to).returns());
}
async function fetchSubjectRfidEvidence(date) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("attendance_records").select("student_id, time_in, time_out").eq("attendance_date", date).order("student_id").range(from, to).returns());
}
async function fetchSubjectStudents() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("students").select("id, student_id, full_name, program_id, year_level, section, campus").eq("status", "active").order("full_name").order("id").range(from, to).returns());
}
async function fetchSubjectAssignments() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("teacher_assignments").select("id, year_level, section, campus, teacher:teachers(full_name, status), course:courses(course_code, course_name, status)").eq("status", "active").order("id").range(from, to).returns());
}
}),
"[project]/src/features/subject-attendance/records.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubjectRecords",
    ()=>SubjectRecords
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SubjectRecords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SubjectRecords() from the server but SubjectRecords is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/records.tsx <module evaluation>", "SubjectRecords");
}),
"[project]/src/features/subject-attendance/records.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubjectRecords",
    ()=>SubjectRecords
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SubjectRecords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SubjectRecords() from the server but SubjectRecords is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/records.tsx", "SubjectRecords");
}),
"[project]/src/features/subject-attendance/records.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$records$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/records.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$records$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/records.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$records$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/features/subject-attendance/student-history.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StudentSubjectHistory",
    ()=>StudentSubjectHistory
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StudentSubjectHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StudentSubjectHistory() from the server but StudentSubjectHistory is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/student-history.tsx <module evaluation>", "StudentSubjectHistory");
}),
"[project]/src/features/subject-attendance/student-history.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StudentSubjectHistory",
    ()=>StudentSubjectHistory
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StudentSubjectHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StudentSubjectHistory() from the server but StudentSubjectHistory is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/student-history.tsx", "StudentSubjectHistory");
}),
"[project]/src/features/subject-attendance/student-history.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$student$2d$history$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/student-history.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$student$2d$history$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/student-history.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$student$2d$history$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/features/subject-attendance/teacher-console.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TeacherSubjectConsole",
    ()=>TeacherSubjectConsole
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TeacherSubjectConsole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TeacherSubjectConsole() from the server but TeacherSubjectConsole is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/teacher-console.tsx <module evaluation>", "TeacherSubjectConsole");
}),
"[project]/src/features/subject-attendance/teacher-console.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TeacherSubjectConsole",
    ()=>TeacherSubjectConsole
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TeacherSubjectConsole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TeacherSubjectConsole() from the server but TeacherSubjectConsole is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/teacher-console.tsx", "TeacherSubjectConsole");
}),
"[project]/src/features/subject-attendance/teacher-console.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$teacher$2d$console$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/teacher-console.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$teacher$2d$console$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/teacher-console.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$teacher$2d$console$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/features/subject-attendance/schedules-editor.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubjectSchedulesEditor",
    ()=>SubjectSchedulesEditor
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SubjectSchedulesEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SubjectSchedulesEditor() from the server but SubjectSchedulesEditor is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/schedules-editor.tsx <module evaluation>", "SubjectSchedulesEditor");
}),
"[project]/src/features/subject-attendance/schedules-editor.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubjectSchedulesEditor",
    ()=>SubjectSchedulesEditor
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SubjectSchedulesEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SubjectSchedulesEditor() from the server but SubjectSchedulesEditor is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/schedules-editor.tsx", "SubjectSchedulesEditor");
}),
"[project]/src/features/subject-attendance/schedules-editor.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$schedules$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/schedules-editor.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$schedules$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/schedules-editor.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$schedules$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/features/subject-attendance/enrollment-editor.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubjectEnrollmentEditor",
    ()=>SubjectEnrollmentEditor
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SubjectEnrollmentEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SubjectEnrollmentEditor() from the server but SubjectEnrollmentEditor is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/enrollment-editor.tsx <module evaluation>", "SubjectEnrollmentEditor");
}),
"[project]/src/features/subject-attendance/enrollment-editor.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubjectEnrollmentEditor",
    ()=>SubjectEnrollmentEditor
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SubjectEnrollmentEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SubjectEnrollmentEditor() from the server but SubjectEnrollmentEditor is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/features/subject-attendance/enrollment-editor.tsx", "SubjectEnrollmentEditor");
}),
"[project]/src/features/subject-attendance/enrollment-editor.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$enrollment$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/enrollment-editor.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$enrollment$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/enrollment-editor.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$enrollment$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/features/subject-attendance/server-panels.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminSubjectEnrollmentPanel",
    ()=>AdminSubjectEnrollmentPanel,
    "AdminSubjectSchedulesPanel",
    ()=>AdminSubjectSchedulesPanel,
    "SubjectHistoryPanel",
    ()=>SubjectHistoryPanel,
    "TeacherSubjectPanel",
    ()=>TeacherSubjectPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$error$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-error-card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/school-time.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/model.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/attendance/subject-attendance.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$records$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/records.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$student$2d$history$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/student-history.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$teacher$2d$console$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/teacher-console.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$schedules$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/schedules-editor.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$enrollment$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/enrollment-editor.tsx [app-rsc] (ecmascript)");
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
function errorPanel(error) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$error$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataErrorCard"], {
        title: "Subject attendance could not be loaded",
        message: error instanceof Error ? error.message : "Apply the P05 subject-attendance migration, then refresh."
    }, void 0, false, {
        fileName: "[project]/src/features/subject-attendance/server-panels.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
async function SubjectHistoryPanel({ from, to, summaryOnly = false }) {
    const account = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireCurrentAccount"])();
    let rows;
    try {
        rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectAttendance"])({
            from,
            to
        });
    } catch (error) {
        return errorPanel(error);
    }
    if (!summaryOnly) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$student$2d$history$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StudentSubjectHistory"], {
        rows: rows,
        studentView: account.role === "student"
    }, void 0, false, {
        fileName: "[project]/src/features/subject-attendance/server-panels.tsx",
        lineNumber: 21,
        columnNumber: 28
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$records$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SubjectRecords"], {
        rows: rows,
        summaryOnly: summaryOnly
    }, void 0, false, {
        fileName: "[project]/src/features/subject-attendance/server-panels.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
async function TeacherSubjectPanel({ date, automaticDate = false }) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("teacher");
    let data;
    try {
        const schedules = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectSchedules"])();
        if (automaticDate) date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["latestSubjectDate"])(schedules, date);
        const [students, records, enrollments] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectStudents"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectAttendance"])({
                from: date,
                to: date
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectEnrollments"])()
        ]);
        data = [
            schedules,
            students,
            records,
            enrollments
        ];
    } catch (error) {
        return errorPanel(error);
    }
    const [schedules, students, records, enrollments] = data;
    // RFID failure must not prevent a teacher from marking the class roster.
    let evidence;
    try {
        evidence = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectRfidEvidence"])(date);
    } catch  {
        evidence = null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$teacher$2d$console$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TeacherSubjectConsole"], {
        schedules: schedules,
        students: students,
        records: records,
        enrollments: enrollments,
        evidence: evidence,
        date: date,
        today: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["schoolDateKey"])(new Date())
    }, void 0, false, {
        fileName: "[project]/src/features/subject-attendance/server-panels.tsx",
        lineNumber: 38,
        columnNumber: 10
    }, this);
}
async function AdminSubjectSchedulesPanel() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
    let data;
    try {
        data = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectAssignments"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectSchedules"])()
        ]);
    } catch (error) {
        return errorPanel(error);
    }
    const [assignments, schedules] = data;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$schedules$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SubjectSchedulesEditor"], {
        assignments: assignments,
        schedules: schedules
    }, void 0, false, {
        fileName: "[project]/src/features/subject-attendance/server-panels.tsx",
        lineNumber: 48,
        columnNumber: 10
    }, this);
}
async function AdminSubjectEnrollmentPanel() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("admin");
    let data;
    try {
        data = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectSchedules"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectStudents"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$subject$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSubjectEnrollments"])()
        ]);
    } catch (error) {
        return errorPanel(error);
    }
    const [schedules, students, enrollments] = data;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$enrollment$2d$editor$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SubjectEnrollmentEditor"], {
        schedules: schedules,
        students: students,
        enrollments: enrollments
    }, void 0, false, {
        fileName: "[project]/src/features/subject-attendance/server-panels.tsx",
        lineNumber: 58,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/live-refresh.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveRefresh",
    ()=>LiveRefresh
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LiveRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LiveRefresh() from the server but LiveRefresh is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/live-refresh.tsx <module evaluation>", "LiveRefresh");
}),
"[project]/src/components/live-refresh.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveRefresh",
    ()=>LiveRefresh
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LiveRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LiveRefresh() from the server but LiveRefresh is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/live-refresh.tsx", "LiveRefresh");
}),
"[project]/src/components/live-refresh.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$live$2d$refresh$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/live-refresh.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$live$2d$refresh$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/live-refresh.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$live$2d$refresh$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/services/attendance/student-dashboard.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchStudentDashboardSnapshot",
    ()=>fetchStudentDashboardSnapshot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/pagination.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)");
;
;
async function fetchStudentDashboardSnapshot({ authUserId, date }) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const { data: student, error: studentError } = await supabase.from("students").select("id, student_id, full_name, profile_picture, year_level, section, campus").eq("user_id", authUserId).maybeSingle();
    if (studentError) throw new Error(studentError.message);
    if (!student) {
        throw new Error("No student record is linked to this account. Contact an administrator.");
    }
    const [{ data: attendance, error: attendanceError }, cards, history] = await Promise.all([
        supabase.from("attendance_records").select("id, time_in, time_out, attendance_status").eq("student_id", student.id).eq("attendance_date", date).maybeSingle(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("rfid_cards").select("rfid_number, card_status, assigned_date").eq("student_id", student.id).order("assigned_date", {
                ascending: false
            }).order("id", {
                ascending: true
            }).range(from, to).returns()),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("attendance_records").select("attendance_date, attendance_status, time_out").eq("student_id", student.id).order("attendance_date", {
                ascending: true
            }).order("id", {
                ascending: true
            }).range(from, to).returns())
    ]);
    if (attendanceError) throw new Error(attendanceError.message);
    let sms = null;
    // The parent notification belongs to today's tap, so there is nothing to
    // read until the first tap creates an attendance record.
    if (attendance) {
        const { data: smsRow, error: smsError } = await supabase.from("sms_notifications").select("sms_status, sent_at").eq("attendance_id", attendance.id).order("created_at", {
            ascending: false
        }).order("id", {
            ascending: false
        }).limit(1).maybeSingle();
        if (smsError) throw new Error(smsError.message);
        sms = smsRow;
    }
    return {
        student,
        attendance,
        cards: cards ?? [],
        sms,
        history: history ?? []
    };
}
}),
"[project]/src/features/attendance/student-dashboard.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildStudentDashboardData",
    ()=>buildStudentDashboardData,
    "countPersonalAbsentDays",
    ()=>countPersonalAbsentDays,
    "getStudentDashboardData",
    ()=>getStudentDashboardData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/attendance/schema.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/attendance/status.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/school-time.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$student$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/attendance/student-dashboard.ts [app-rsc] (ecmascript)");
;
;
;
;
/** Preserve the recorded first-tap classification; never infer an absence. */ function resolveTodayStatus(attendance) {
    if (attendance && (attendance.attendance_status === "Present" || attendance.attendance_status === "Late")) {
        return {
            status: attendance.attendance_status,
            timeIn: attendance.time_in,
            timeOut: attendance.time_out
        };
    }
    const historical = attendance && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAttendanceStatus"])(attendance.attendance_status);
    return {
        status: attendance ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordStatus"])(attendance.attendance_status) : "NoRecord",
        timeIn: historical ? attendance.time_in : null,
        timeOut: historical ? attendance.time_out : null
    };
}
function resolveRfidInfo(cards) {
    // An active card always wins over retained historical cards.
    const active = cards.find((card)=>card.card_status === "Active");
    if (active) {
        return {
            display: "Active",
            cardStatus: "Active",
            rfidNumber: active.rfid_number,
            assignedDate: active.assigned_date
        };
    }
    const latest = cards[0];
    if (!latest) {
        return {
            display: "Not registered",
            cardStatus: "Unassigned",
            rfidNumber: null,
            assignedDate: null
        };
    }
    return {
        display: "Registered",
        cardStatus: latest.card_status,
        rfidNumber: latest.rfid_number,
        assignedDate: latest.assigned_date
    };
}
/** Present and Late both mean the student physically tapped in. */ function isAttended(status) {
    return status === "Present" || status === "Late";
}
function countPersonalAbsentDays(history, today) {
    return new Set(history.filter((record)=>record.attendance_status === "Absent" && record.attendance_date <= today).map((record)=>record.attendance_date)).size;
}
function buildKpis(history, today) {
    const currentHistory = history.filter((record)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAttendanceStatus"])(record.attendance_status));
    return {
        totalPresent: currentHistory.filter((record)=>isAttended(record.attendance_status)).length,
        totalLate: currentHistory.filter((record)=>record.attendance_status === "Late").length,
        totalAbsent: countPersonalAbsentDays(history, today),
        totalRfidTaps: currentHistory.length + currentHistory.filter((record)=>record.time_out).length
    };
}
function buildStudentDashboardData(snapshot, today) {
    return {
        today,
        student: {
            fullName: snapshot.student.full_name,
            studentId: snapshot.student.student_id,
            yearLevel: snapshot.student.year_level,
            section: snapshot.student.section,
            campus: snapshot.student.campus,
            profilePicture: snapshot.student.profile_picture
        },
        attendance: resolveTodayStatus(snapshot.attendance),
        rfid: resolveRfidInfo(snapshot.cards),
        sms: {
            status: snapshot.sms?.sms_status ?? null,
            sentAt: snapshot.sms?.sent_at ?? null
        },
        kpis: buildKpis(snapshot.history, today)
    };
}
async function getStudentDashboardData(now = new Date()) {
    const account = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("student");
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["schoolDateKey"])(now);
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$student$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchStudentDashboardSnapshot"])({
        authUserId: account.id,
        date: today
    });
    return buildStudentDashboardData(snapshot, today);
}
}),
"[project]/src/services/attendance/student-attendance.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchStudentAttendanceSnapshot",
    ()=>fetchStudentAttendanceSnapshot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/pagination.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/server.ts [app-rsc] (ecmascript)");
;
;
async function fetchStudentAttendanceSnapshot({ authUserId }) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const { data: student, error: studentError } = await supabase.from("students").select("id").eq("user_id", authUserId).maybeSingle();
    if (studentError) throw new Error(studentError.message);
    if (!student) {
        throw new Error("No student record is linked to this account. Contact an administrator.");
    }
    const [records, cards, sms] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("attendance_records").select("id, attendance_date, time_in, time_out, attendance_status, campus, rfid_card_id").eq("student_id", student.id).order("attendance_date", {
                ascending: false
            }).order("id", {
                ascending: false
            }).range(from, to).returns()),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("rfid_cards").select("id, rfid_number, card_status").eq("student_id", student.id).order("id", {
                ascending: true
            }).range(from, to).returns()),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$pagination$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllRows"])((from, to)=>supabase.from("sms_notifications").select("attendance_id, sms_status, sent_at, created_at").eq("student_id", student.id).order("created_at", {
                ascending: false
            }).order("id", {
                ascending: false
            }).range(from, to).returns())
    ]);
    return {
        records,
        cards,
        sms
    };
}
}),
"[project]/src/features/attendance/student-attendance.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildStudentAttendanceData",
    ()=>buildStudentAttendanceData,
    "getStudentAttendanceData",
    ()=>getStudentAttendanceData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/attendance/schema.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/attendance/status.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/school-time.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$student$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/attendance/student-dashboard.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$student$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/attendance/student-attendance.ts [app-rsc] (ecmascript)");
;
;
;
;
;
/** Present and Late both mean the student physically tapped in. */ function isAttended(status) {
    return status === "Present" || status === "Late";
}
function latestSmsByAttendance(sms) {
    // Rows arrive newest-first, so the first row per attendance wins.
    const byAttendance = new Map();
    for (const row of sms){
        if (!byAttendance.has(row.attendance_id)) {
            byAttendance.set(row.attendance_id, row);
        }
    }
    return byAttendance;
}
function buildStudentAttendanceData(snapshot, today) {
    const cardsById = new Map(snapshot.cards.map((card)=>[
            card.id,
            card
        ]));
    const smsByAttendance = latestSmsByAttendance(snapshot.sms);
    const rows = snapshot.records.map((record)=>{
        const card = cardsById.get(record.rfid_card_id);
        const smsRow = smsByAttendance.get(record.id);
        return {
            id: record.id,
            date: record.attendance_date,
            status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$status$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordStatus"])(record.attendance_status),
            timeIn: record.time_in,
            timeOut: record.time_out,
            campus: record.campus,
            rfidNumber: card?.rfid_number ?? null,
            rfidStatus: card?.card_status ?? "Unassigned",
            smsStatus: smsRow?.sms_status ?? null,
            smsSentAt: smsRow?.sent_at ?? null
        };
    });
    const totalPresent = rows.filter((row)=>isAttended(row.status)).length;
    const totalLate = rows.filter((row)=>row.status === "Late").length;
    const totalAbsent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$student$2d$dashboard$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["countPersonalAbsentDays"])(snapshot.records, today);
    const denominator = totalPresent + totalAbsent;
    return {
        today,
        kpis: {
            totalPresent,
            totalLate,
            totalAbsent,
            attendanceRate: denominator > 0 ? totalPresent / denominator * 100 : 0
        },
        rows
    };
}
async function getStudentAttendanceData(now = new Date()) {
    const account = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("student");
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$attendance$2f$student$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchStudentAttendanceSnapshot"])({
        authUserId: account.id
    });
    return buildStudentAttendanceData(snapshot, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["schoolDateKey"])(now));
}
}),
"[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttendanceHistoryTable",
    ()=>AttendanceHistoryTable
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AttendanceHistoryTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AttendanceHistoryTable() from the server but AttendanceHistoryTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx <module evaluation>", "AttendanceHistoryTable");
}),
"[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttendanceHistoryTable",
    ()=>AttendanceHistoryTable
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AttendanceHistoryTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AttendanceHistoryTable() from the server but AttendanceHistoryTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx", "AttendanceHistoryTable");
}),
"[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$attendance$2d$history$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$attendance$2d$history$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$attendance$2d$history$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$7_react$40$19$2e$2$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.7_react@19.2.3/node_modules/@radix-ui/react-slot/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$7_react$40$19$2e$2$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Slot"] : "span";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/src/components/motion-primitives/sliding-number.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlidingNumber",
    ()=>SlidingNumber
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SlidingNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SlidingNumber() from the server but SlidingNumber is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/motion-primitives/sliding-number.tsx <module evaluation>", "SlidingNumber");
}),
"[project]/src/components/motion-primitives/sliding-number.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlidingNumber",
    ()=>SlidingNumber
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const SlidingNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call SlidingNumber() from the server but SlidingNumber is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/motion-primitives/sliding-number.tsx", "SlidingNumber");
}),
"[project]/src/components/motion-primitives/sliding-number.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/motion-primitives/sliding-number.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/motion-primitives/sliding-number.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
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
"[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KpiCards",
    ()=>KpiCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2d$4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock4$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/clock-4.js [app-rsc] (ecmascript) <export default as Clock4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$percent$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Percent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/percent.js [app-rsc] (ecmascript) <export default as Percent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRoundCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/user-round-check.js [app-rsc] (ecmascript) <export default as UserRoundCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2d$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRoundX$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/user-round-x.js [app-rsc] (ecmascript) <export default as UserRoundX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/motion-primitives/sliding-number.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
function KpiCard({ label, value, icon: Icon, detail, share }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
        className: "@container/card gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                "aria-hidden": true,
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "text-2xl font-semibold tabular-nums @[16rem]/card:text-3xl",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    share ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardAction"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "outline",
                            className: "tabular-nums",
                            children: share
                        }, void 0, false, {
                            fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardFooter"], {
                className: "text-sm text-muted-foreground text-pretty",
                children: detail
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
function KpiCards({ kpis }) {
    const denominator = kpis.totalPresent + kpis.totalAbsent;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Personal attendance summary",
        className: "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                label: "Total Present",
                value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlidingNumber"], {
                    value: kpis.totalPresent
                }, void 0, false, {
                    fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                    lineNumber: 68,
                    columnNumber: 16
                }, void 0),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRoundCheck$3e$__["UserRoundCheck"],
                share: denominator > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatPercent"])(kpis.totalPresent / denominator * 100) : undefined,
                detail: "Days tapped in, late arrivals included."
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                label: "Total Late",
                value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlidingNumber"], {
                    value: kpis.totalLate
                }, void 0, false, {
                    fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                    lineNumber: 79,
                    columnNumber: 16
                }, void 0),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2d$4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock4$3e$__["Clock4"],
                share: kpis.totalPresent > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatPercent"])(kpis.totalLate / kpis.totalPresent * 100) : undefined,
                detail: "Days tapped in after the cutoff, already inside Total Present."
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                label: "Total Absent",
                value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlidingNumber"], {
                    value: kpis.totalAbsent
                }, void 0, false, {
                    fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                    lineNumber: 90,
                    columnNumber: 16
                }, void 0),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2d$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRoundX$3e$__["UserRoundX"],
                share: denominator > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatPercent"])(kpis.totalAbsent / denominator * 100) : undefined,
                detail: "Recorded absences; unrecorded days excluded."
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                label: "Attendance Rate",
                value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$motion$2d$primitives$2f$sliding$2d$number$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlidingNumber"], {
                    value: kpis.attendanceRate,
                    decimalPlaces: 1,
                    suffix: "%"
                }, void 0, false, {
                    fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                    lineNumber: 101,
                    columnNumber: 16
                }, void 0),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$percent$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Percent$3e$__["Percent"],
                detail: "Present days over present plus absent days."
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(portal)/student/my-attendance/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StudentAttendancePage,
    "dynamic",
    ()=>dynamic,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/attendance/schema.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$server$2d$panels$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/subject-attendance/server-panels.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$error$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-error-card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$live$2d$refresh$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/live-refresh.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$student$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/attendance/student-attendance.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$attendance$2d$history$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/components/attendance-history-table.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$kpi$2d$cards$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/components/kpi-cards.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$panel$2d$skeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/components/panel-skeleton.tsx [app-rsc] (ecmascript)");
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
const metadata = {
    title: "My Attendance"
};
const dynamic = "force-dynamic";
async function AttendanceContent({ status }) {
    let data;
    try {
        data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$student$2d$attendance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getStudentAttendanceData"])();
    } catch (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$error$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataErrorCard"], {
            title: "Attendance records could not be loaded",
            message: error instanceof Error ? error.message : "An unexpected error occurred while reading attendance records."
        }, void 0, false, {
            fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 md:gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-lg font-semibold",
                children: "Daily RFID history (separate from subject attendance)"
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$kpi$2d$cards$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KpiCards"], {
                kpis: data.kpis
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            status !== "all" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: [
                    "Showing: ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["attendanceStatusLabel"])(status),
                    ".",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/student/my-attendance",
                        className: "text-primary underline underline-offset-4",
                        children: "Show all records"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$attendance$2d$history$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AttendanceHistoryTable"], {
                filtered: status !== "all",
                rows: data.rows.filter((row)=>status === "all" || (status === "Attended" ? row.status === "Present" || row.status === "Late" : row.status === status))
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$subject$2d$attendance$2f$server$2d$panels$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SubjectHistoryPanel"], {}, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
async function StudentAttendancePage({ searchParams }) {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$attendance$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseAttendancePanelQuery"])(await searchParams);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$live$2d$refresh$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LiveRefresh"], {
                channel: "live-student-attendance"
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-end justify-between gap-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-semibold tracking-tight text-balance",
                            children: "My Attendance"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground text-pretty",
                            children: "Personal attendance history visible only to the signed-in student."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$portal$292f$student$2f$my$2d$attendance$2f$components$2f$panel$2d$skeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PanelSkeleton"], {}, void 0, false, {
                    fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                    lineNumber: 78,
                    columnNumber: 46
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(AttendanceContent, {
                    status: query.status
                }, void 0, false, {
                    fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, query.status, false, {
                fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(portal)/student/my-attendance/page.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(portal)/student/my-attendance/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(portal)/student/my-attendance/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b21d7406._.js.map