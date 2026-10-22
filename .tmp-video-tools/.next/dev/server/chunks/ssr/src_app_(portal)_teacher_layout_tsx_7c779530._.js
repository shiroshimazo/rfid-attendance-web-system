module.exports = [
"[project]/src/app/(portal)/teacher/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TeacherLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/server.ts [app-rsc] (ecmascript)");
;
async function TeacherLayout({ children }) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireRole"])("teacher");
    return children;
}
}),
];

//# sourceMappingURL=src_app_%28portal%29_teacher_layout_tsx_7c779530._.js.map