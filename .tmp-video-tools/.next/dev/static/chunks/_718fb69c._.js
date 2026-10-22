(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/data-error-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataErrorCard",
    ()=>DataErrorCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function DataErrorCard({ title = "This data could not be loaded", message }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        role: "alert",
        className: "border-destructive/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            "aria-hidden": true,
                            className: "size-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/data-error-card.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-error-card.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-error-card.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        className: "text-pretty",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-error-card.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-error-card.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    disabled: isPending,
                    onClick: ()=>startTransition(()=>router.refresh()),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                            "aria-hidden": true,
                            className: isPending ? "animate-spin" : undefined
                        }, void 0, false, {
                            fileName: "[project]/src/components/data-error-card.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        isPending ? "Retrying" : "Try again"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/data-error-card.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/data-error-card.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-error-card.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(DataErrorCard, "LlaLhmiVD5EIEEo7IqYj5z+6Q14=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = DataErrorCard;
var _c;
__turbopack_context__.k.register(_c, "DataErrorCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/school-time.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/live-refresh.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveRefresh",
    ()=>LiveRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/school-time.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabase/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const DEFAULT_TABLES = [
    "attendance_records",
    "subject_attendance",
    "subject_schedules",
    "subject_enrollments",
    "rfid_cards",
    "sms_notifications",
    "students",
    "teachers",
    "teacher_assignments",
    "class_schedules",
    "programs",
    "courses"
];
function LiveRefresh({ tables = DEFAULT_TABLES, channel = "live-attendance", debounceMs = 800 }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Equal table lists must not reconnect on every server refresh.
    const tableKey = [
        ...new Set(tables)
    ].sort().join(",");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LiveRefresh.useEffect": ()=>{
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) return;
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserSupabaseClient"])();
            let timer = null;
            let connected = false;
            let disposed = false;
            let pending = false;
            let schoolDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["schoolDateKey"])(new Date());
            const schedule = {
                "LiveRefresh.useEffect.schedule": ()=>{
                    if (disposed) return;
                    pending = true;
                    if (timer !== null) return;
                    timer = setTimeout({
                        "LiveRefresh.useEffect.schedule": ()=>{
                            timer = null;
                            if (disposed) return;
                            // Keep drafts intact while minimized or editing a dialog. Retain the
                            // pending update so the recovery tick can apply it after editing ends.
                            if (document.visibilityState !== "visible" || document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]')) return;
                            pending = false;
                            schoolDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["schoolDateKey"])(new Date());
                            router.refresh();
                        }
                    }["LiveRefresh.useEffect.schedule"], debounceMs);
                }
            }["LiveRefresh.useEffect.schedule"];
            const builder = supabase.channel(channel);
            for (const table of tableKey.split(",").filter(Boolean)){
                builder.on("postgres_changes", {
                    event: "*",
                    schema: "public",
                    table
                }, schedule);
            }
            builder.subscribe({
                "LiveRefresh.useEffect": (status)=>{
                    if (disposed) return;
                    connected = status === "SUBSCRIBED";
                    if (connected) schedule(); // Includes changes missed before initial/reconnection subscription.
                }
            }["LiveRefresh.useEffect"]);
            const recover = {
                "LiveRefresh.useEffect.recover": ()=>{
                    if (document.visibilityState === "visible" && (pending || !connected || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$school$2d$time$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["schoolDateKey"])(new Date()) !== schoolDate)) schedule();
                }
            }["LiveRefresh.useEffect.recover"];
            window.addEventListener("online", schedule);
            document.addEventListener("visibilitychange", recover);
            // Recover missed changes while disconnected, and roll today's views over at
            // Manila midnight even when there are no database events.
            const recovery = setInterval(recover, 30_000);
            return ({
                "LiveRefresh.useEffect": ()=>{
                    disposed = true;
                    if (timer !== null) clearTimeout(timer);
                    clearInterval(recovery);
                    window.removeEventListener("online", schedule);
                    document.removeEventListener("visibilitychange", recover);
                    void supabase.removeChannel(builder);
                }
            })["LiveRefresh.useEffect"];
        }
    }["LiveRefresh.useEffect"], [
        router,
        channel,
        tableKey,
        debounceMs
    ]);
    return null;
}
_s(LiveRefresh, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LiveRefresh;
var _c;
__turbopack_context__.k.register(_c, "LiveRefresh");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
function Table({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "table-container",
        className: "relative w-full overflow-x-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            "data-slot": "table",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Table;
function TableHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        "data-slot": "table-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c1 = TableHeader;
function TableBody({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        "data-slot": "table-body",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c2 = TableBody;
function TableFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        "data-slot": "table-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c3 = TableFooter;
function TableRow({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        "data-slot": "table-row",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c4 = TableRow;
function TableHead({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        "data-slot": "table-head",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c5 = TableHead;
function TableCell({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        "data-slot": "table-cell",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c6 = TableCell;
function TableCaption({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        "data-slot": "table-caption",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground mt-4 text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c7 = TableCaption;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Table");
__turbopack_context__.k.register(_c1, "TableHeader");
__turbopack_context__.k.register(_c2, "TableBody");
__turbopack_context__.k.register(_c3, "TableFooter");
__turbopack_context__.k.register(_c4, "TableRow");
__turbopack_context__.k.register(_c5, "TableHead");
__turbopack_context__.k.register(_c6, "TableCell");
__turbopack_context__.k.register(_c7, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/arc/motion-tokens.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "motionTokens",
    ()=>motionTokens
]);
const motionTokens = {
    duration: {
        instant: 0.12,
        fast: 0.16,
        exit: 0.18,
        standard: 0.24,
        considered: 0.48
    },
    ease: {
        enter: [
            0.16,
            1,
            0.3,
            1
        ],
        exit: [
            0.7,
            0,
            0.84,
            0
        ],
        standard: [
            0.22,
            1,
            0.36,
            1
        ],
        /** For elements that move while already on screen. */ inOut: [
            0.65,
            0,
            0.35,
            1
        ]
    },
    spring: {
        responsive: {
            type: "spring",
            stiffness: 520,
            damping: 38
        },
        gentle: {
            type: "spring",
            stiffness: 340,
            damping: 34
        },
        /** Presses, toggles, thumbs, and small indicators. Settles fast with a hint of life. */ snappy: {
            type: "spring",
            visualDuration: 0.26,
            bounce: 0.12
        },
        /** Panels, height changes, and layout shifts. Critically damped, never overshoots. */ smooth: {
            type: "spring",
            visualDuration: 0.4,
            bounce: 0
        },
        /** Shape morphs, shared layout highlights, and width changes that follow new content. */ morph: {
            type: "spring",
            visualDuration: 0.42,
            bounce: 0.16
        }
    },
    /** Stagger steps in seconds. Keep total stagger under roughly 0.4s. */ stagger: {
        char: 0.016,
        word: 0.04,
        line: 0.08,
        item: 0.035
    },
    /** Blur radii in px for text and content crossfades. Keep blur small and brief. */ blur: {
        subtle: 2,
        soft: 4,
        text: 8
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/arc/lib/motion-tokens.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/arc/motion-tokens.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/arc/tag-input/tag-input.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "content": "tag-input-module__w5cg4W__content",
  "control": "tag-input-module__w5cg4W__control",
  "field": "tag-input-module__w5cg4W__field",
  "hint": "tag-input-module__w5cg4W__hint",
  "leading": "tag-input-module__w5cg4W__leading",
  "messageSlot": "tag-input-module__w5cg4W__messageSlot",
  "placeholder": "tag-input-module__w5cg4W__placeholder",
  "ring": "tag-input-module__w5cg4W__ring",
  "srOnly": "tag-input-module__w5cg4W__srOnly",
  "tag": "tag-input-module__w5cg4W__tag",
  "tagLabel": "tag-input-module__w5cg4W__tagLabel",
  "trailing": "tag-input-module__w5cg4W__trailing",
  "word": "tag-input-module__w5cg4W__word",
  "words": "tag-input-module__w5cg4W__words",
});
}),
"[project]/src/components/arc/tag-input/tag-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TagInput",
    ()=>TagInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion@13.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/motion/dist/es/react.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$hooks$2f$use$2d$animate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/animation/hooks/use-animate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$lib$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/arc/lib/motion-tokens.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/arc/motion-tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/arc/tag-input/tag-input.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
/** Changed words rise in and unblur while unchanged words hold still. Assistive tech reads the plain copy. */ function MotionText({ text }) {
    _s();
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const words = text.split(" ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].srOnly,
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 35,
                columnNumber: 12
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].words,
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    initial: false,
                    mode: "popLayout",
                    children: words.map((word, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].span, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].word,
                            initial: reduced ? {
                                opacity: 0
                            } : {
                                opacity: 0,
                                y: "0.35em",
                                filter: `blur(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].blur.soft}px)`
                            },
                            animate: {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)"
                            },
                            exit: reduced ? {
                                opacity: 0,
                                transition: {
                                    duration: 0
                                }
                            } : {
                                opacity: 0,
                                y: "-0.35em",
                                filter: `blur(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].blur.subtle}px)`,
                                transition: {
                                    duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant,
                                    ease: [
                                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.standard
                                    ]
                                }
                            },
                            transition: reduced ? {
                                duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant
                            } : {
                                duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.standard,
                                ease: [
                                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.enter
                                ]
                            },
                            children: index < words.length - 1 ? `${word} ` : word
                        }, `${index}:${word}`, false, {
                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                            lineNumber: 35,
                            columnNumber: 185
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                    lineNumber: 35,
                    columnNumber: 107
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 35,
                columnNumber: 57
            }, this)
        ]
    }, void 0, true);
}
_s(MotionText, "/JSVQSdN2dVjcj5yyuX/KnOybKE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = MotionText;
/** Helper copy: the row opens its height on a spring, then the words settle in. */ function FieldMessage({ id, text, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        initial: false,
        children: text ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageRow, {
            id: id,
            text: text,
            className: className
        }, "message", false, {
            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
            lineNumber: 43,
            columnNumber: 51
        }, this) : null
    }, void 0, false, {
        fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
        lineNumber: 43,
        columnNumber: 10
    }, this);
}
_c1 = FieldMessage;
/** The row tracks the measured copy, so a longer message that wraps opens its next line instead of snapping. */ function MessageRow({ id, text, className }) {
    _s1();
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const copyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [height, setHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("auto");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessageRow.useEffect": ()=>{
            const node = copyRef.current;
            if (!node || typeof ResizeObserver === "undefined") return;
            const observer = new ResizeObserver({
                "MessageRow.useEffect": ([entry])=>setHeight(entry?.borderBoxSize?.[0]?.blockSize ?? node.offsetHeight)
            }["MessageRow.useEffect"]);
            observer.observe(node);
            return ({
                "MessageRow.useEffect": ()=>observer.disconnect()
            })["MessageRow.useEffect"];
        }
    }["MessageRow.useEffect"], []);
    // Reduced motion mounts the row at full height: a zero-duration open would still paint one collapsed frame.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].span, {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].messageSlot,
        initial: reduced ? false : {
            height: 0,
            opacity: 0
        },
        animate: {
            height,
            opacity: 1
        },
        exit: {
            height: 0,
            opacity: 0,
            transition: reduced ? {
                duration: 0
            } : {
                height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].spring.smooth,
                opacity: {
                    duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant
                }
            }
        },
        transition: reduced ? {
            duration: 0
        } : {
            height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].spring.smooth,
            opacity: {
                duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.fast
            }
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].span, {
            ref: copyRef,
            id: id,
            className: className,
            initial: reduced ? false : {
                y: "0.35em",
                filter: `blur(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].blur.soft}px)`
            },
            animate: {
                y: 0,
                filter: "blur(0px)"
            },
            transition: {
                duration: reduced ? 0 : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.standard,
                ease: [
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.enter
                ]
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionText, {
                text: text
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 60,
                columnNumber: 299
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
            lineNumber: 60,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
        lineNumber: 59,
        columnNumber: 10
    }, this);
}
_s1(MessageRow, "l8N1mf9YykbBFrVJWj7yxEx2I7A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c2 = MessageRow;
function TagInput({ label, value, defaultValue = [], onValueChange, placeholder = "Add a tag", description, id, hideLabel = false, hideDescription = false, size = "md", leading, trailing, className }) {
    _s2();
    const generatedId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const inputId = id ?? generatedId;
    const hintId = description ? `${inputId}-description` : undefined;
    const [internal, setInternal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultValue);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [picked, setPicked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const [scope, animate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$hooks$2f$use$2d$animate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimate"])();
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ringRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ringAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    // The shell follows its wrapped rows on a spring instead of jumping when a tag starts or leaves a line.
    const [height, setHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("auto");
    const tags = value ?? internal;
    const active = picked !== null && tags.includes(picked) ? picked : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TagInput.useEffect": ()=>{
            const node = contentRef.current;
            if (!node || typeof ResizeObserver === "undefined") return;
            const observer = new ResizeObserver({
                "TagInput.useEffect": ()=>setHeight(node.offsetHeight)
            }["TagInput.useEffect"]);
            observer.observe(node);
            return ({
                "TagInput.useEffect": ()=>observer.disconnect()
            })["TagInput.useEffect"];
        }
    }["TagInput.useEffect"], []);
    // The ring measures the picked tag's resting box, glides between picks, and fades in place when the pick clears.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "TagInput.useLayoutEffect": ()=>{
            const ring = ringRef.current;
            const node = active === null ? null : contentRef.current?.querySelector(`[data-tag="${CSS.escape(active)}"]`);
            if (!ring) return;
            // It leaves on the same curve as a removed tag, so a picked tag and its ring fade out as one piece.
            if (!node) {
                if (ringAt.current) animate(ring, reduced ? {
                    opacity: 0
                } : {
                    opacity: 0,
                    scale: .9
                }, {
                    duration: reduced ? 0 : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant,
                    ease: [
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.standard
                    ]
                });
                ringAt.current = "";
                return;
            }
            const box = {
                x: node.offsetLeft,
                y: node.offsetTop,
                width: node.offsetWidth,
                height: node.offsetHeight
            };
            const at = Object.values(box).join(" ");
            if (at === ringAt.current) return;
            // A ring that is still fading from the last pick glides on to the next one, so quick Backspaces read as one motion.
            if (!reduced && (ringAt.current || Number(getComputedStyle(ring).opacity) > .02)) animate(ring, {
                ...box,
                opacity: 1,
                scale: 1
            }, {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].spring.morph,
                opacity: {
                    duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.fast
                }
            });
            else animate(ring, {
                ...box,
                opacity: [
                    0,
                    1
                ],
                scale: [
                    reduced ? 1 : .9,
                    1
                ]
            }, reduced ? {
                duration: 0,
                opacity: {
                    duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant
                }
            } : {
                duration: 0,
                opacity: {
                    duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.fast
                },
                scale: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].spring.snappy
            });
            ringAt.current = at;
        }
    }["TagInput.useLayoutEffect"]);
    function say(message) {
        setNotice((previous)=>previous === message ? `${message}\u00a0` : message);
    }
    function update(next) {
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
    }
    function pick(tag) {
        setPicked(tag);
        if (tag !== null) say(`${tag} selected. Press Backspace to remove it.`);
    }
    function add() {
        const tag = draft.trim();
        if (!tag) return;
        const existing = tags.find((item)=>item.toLowerCase() === tag.toLowerCase());
        // A duplicate pulses the tag that already exists, so the ignored Enter still gets an answer.
        if (existing) {
            const node = scope.current?.querySelector(`[data-tag="${CSS.escape(existing)}"]`);
            if (node && !reduced) animate(node, {
                scale: [
                    1,
                    1.06,
                    1
                ]
            }, {
                duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.standard + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant,
                ease: [
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.inOut
                ]
            });
            say(`${existing} is already added`);
            return;
        }
        update([
            ...tags,
            tag
        ]);
        setDraft("");
        setPicked(null);
        say(`Added ${tag}`);
    }
    function remove(tag) {
        update(tags.filter((item)=>item !== tag));
        setPicked(null);
        say(`Removed ${tag}`);
        inputRef.current?.focus();
    }
    function onKeyDown(event) {
        const { key, currentTarget: input } = event;
        const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
        const index = active === null ? tags.length : tags.indexOf(active);
        let handled = true;
        if (key === "Enter" || key === ",") add();
        else if ((key === "Backspace" || key === "Delete") && active !== null) remove(active);
        else if (key === "Backspace" && atStart && tags.length) pick(tags[tags.length - 1]);
        else if (key === "ArrowLeft" && (atStart || active !== null) && index > 0) pick(tags[index - 1]);
        else if (key === "ArrowRight" && active !== null) pick(tags[index + 1] ?? null);
        else if (key === "Escape" && active !== null) pick(null);
        else handled = false;
        if (handled) event.preventDefault();
    }
    // A click on a tag picks it without taking focus from the field. The remove button keeps its own press.
    function onTagPointer(event, tag) {
        if (event.target.closest("button")) return;
        if (!tag) {
            event.preventDefault();
            return;
        }
        pick(active === tag ? null : tag);
        inputRef.current?.focus();
    }
    const move = reduced ? {
        duration: 0
    } : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].spring.morph;
    const glide = reduced ? {
        duration: 0
    } : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].spring.smooth;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className ? `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].field} ${className}` : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].field,
        "data-size": size,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: inputId,
                className: hideLabel ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].srOnly : undefined,
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 143,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
                ref: scope,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].control,
                initial: false,
                animate: {
                    height
                },
                transition: glide,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: contentRef,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                    "data-leading": leading ? "true" : undefined,
                    "data-trailing": trailing ? "true" : undefined,
                    onClick: (event)=>{
                        if (event.target === event.currentTarget) inputRef.current?.focus();
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            ref: ringRef,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].ring,
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                            lineNumber: 146,
                            columnNumber: 9
                        }, this),
                        leading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].leading,
                            "aria-hidden": "true",
                            children: leading
                        }, void 0, false, {
                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                            lineNumber: 147,
                            columnNumber: 20
                        }, this) : null,
                        trailing && !draft && !tags.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].trailing,
                            "aria-hidden": "true",
                            children: trailing
                        }, void 0, false, {
                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                            lineNumber: 148,
                            columnNumber: 47
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            initial: false,
                            children: !draft && !tags.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].span, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].placeholder,
                                "aria-hidden": "true",
                                initial: reduced ? {
                                    opacity: 0
                                } : {
                                    opacity: 0,
                                    y: "0.3em",
                                    filter: `blur(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].blur.soft}px)`
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)"
                                },
                                exit: {
                                    opacity: 0,
                                    transition: {
                                        duration: 0
                                    }
                                },
                                transition: reduced ? {
                                    duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant
                                } : {
                                    duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.standard,
                                    ease: [
                                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.enter
                                    ]
                                },
                                children: placeholder
                            }, "placeholder", false, {
                                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                                lineNumber: 149,
                                columnNumber: 69
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                            lineNumber: 149,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            initial: false,
                            mode: "popLayout",
                            children: tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].span, {
                                    layout: reduced ? false : "position",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tag,
                                    "data-tag": tag,
                                    "data-picked": tag === active || undefined,
                                    onMouseDown: (event)=>onTagPointer(event),
                                    onClick: (event)=>onTagPointer(event, tag),
                                    initial: reduced ? {
                                        opacity: 0
                                    } : {
                                        opacity: 0,
                                        scale: .9,
                                        filter: `blur(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].blur.soft}px)`
                                    },
                                    animate: {
                                        opacity: 1,
                                        scale: 1,
                                        filter: "blur(0px)",
                                        transitionEnd: {
                                            filter: "none"
                                        }
                                    },
                                    exit: reduced ? {
                                        opacity: 0,
                                        transition: {
                                            duration: 0
                                        }
                                    } : {
                                        opacity: 0,
                                        scale: .9,
                                        filter: `blur(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].blur.subtle}px)`,
                                        transition: {
                                            duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant,
                                            ease: [
                                                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.standard
                                            ]
                                        }
                                    },
                                    transition: reduced ? {
                                        duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.instant
                                    } : {
                                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].spring.morph,
                                        layout: move,
                                        opacity: {
                                            duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.fast,
                                            ease: [
                                                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.enter
                                            ]
                                        },
                                        filter: {
                                            duration: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].duration.standard,
                                            ease: [
                                                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$motion$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motionTokens"].ease.enter
                                            ]
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tagLabel,
                                            children: tag
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                                            lineNumber: 156,
                                            columnNumber: 304
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>remove(tag),
                                            "aria-label": `Remove ${tag}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                width: 14,
                                                height: 14,
                                                "aria-hidden": "true"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                                                lineNumber: 156,
                                                columnNumber: 429
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                                            lineNumber: 156,
                                            columnNumber: 350
                                        }, this)
                                    ]
                                }, tag, true, {
                                    fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                                    lineNumber: 152,
                                    columnNumber: 76
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                            lineNumber: 152,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$13$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].input, {
                            layout: reduced ? false : "position",
                            transition: {
                                layout: move
                            },
                            ref: inputRef,
                            id: inputId,
                            value: draft,
                            onChange: (event)=>{
                                setDraft(event.currentTarget.value);
                                setPicked(null);
                            },
                            onKeyDown: onKeyDown,
                            onBlur: ()=>{
                                add();
                                setPicked(null);
                            },
                            placeholder: tags.length ? "" : placeholder,
                            "aria-describedby": hintId
                        }, void 0, false, {
                            fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                            lineNumber: 157,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                    lineNumber: 145,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 144,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].srOnly,
                "aria-live": "polite",
                children: notice
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 160,
                columnNumber: 5
            }, this),
            hideDescription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                id: hintId,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].srOnly,
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldMessage, {
                id: hintId,
                text: description,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hint
            }, void 0, false, {
                fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/arc/tag-input/tag-input.tsx",
        lineNumber: 142,
        columnNumber: 10
    }, this);
}
_s2(TagInput, "JPLiFs/X4hIrI8qXRn3+b8czn+o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$hooks$2f$use$2d$animate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimate"]
    ];
});
_c3 = TagInput;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "MotionText");
__turbopack_context__.k.register(_c1, "FieldMessage");
__turbopack_context__.k.register(_c2, "MessageRow");
__turbopack_context__.k.register(_c3, "TagInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/search-tags.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/search-tag-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchTagInput",
    ()=>SearchTagInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/arc/tag-input/tag-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2d$tags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/search-tags.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const searchHint = "Type a term and press Enter to add it. A row is kept when it matches at least one term.";
function SearchTagInput({ id, label, value, onValueChange, placeholder = "Search, then press Enter", description = searchHint, size = "md", className, showIcon = true }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$arc$2f$tag$2d$input$2f$tag$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TagInput"], {
        id: id,
        label: label,
        hideLabel: true,
        hideDescription: true,
        size: size,
        value: value,
        onValueChange: (next)=>onValueChange((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2d$tags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeSearchTags"])(next)),
        placeholder: placeholder,
        description: description,
        className: className,
        leading: showIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/src/components/search-tag-input.tsx",
            lineNumber: 55,
            columnNumber: 27
        }, void 0) : undefined,
        trailing: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
            className: "rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] leading-none text-muted-foreground",
            children: "Enter"
        }, void 0, false, {
            fileName: "[project]/src/components/search-tag-input.tsx",
            lineNumber: 57,
            columnNumber: 9
        }, void 0)
    }, void 0, false, {
        fileName: "[project]/src/components/search-tag-input.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c = SearchTagInput;
var _c;
__turbopack_context__.k.register(_c, "SearchTagInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(portal)/admin/system-logs/components/log-search-field.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogSearchField",
    ()=>LogSearchField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2d$tag$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search-tag-input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function LogSearchField({ defaultTerms }) {
    _s();
    const [terms, setTerms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultTerms);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "sm:col-span-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2d$tag$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchTagInput"], {
                id: "log-search",
                label: "Search",
                value: terms,
                onValueChange: setTerms,
                placeholder: "Actor, activity or record ID",
                size: "lg",
                showIcon: false
            }, void 0, false, {
                fileName: "[project]/src/app/(portal)/admin/system-logs/components/log-search-field.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            terms.map((term)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "hidden",
                    name: "search",
                    value: term
                }, term, false, {
                    fileName: "[project]/src/app/(portal)/admin/system-logs/components/log-search-field.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(portal)/admin/system-logs/components/log-search-field.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(LogSearchField, "rxDCiY45thFOQHfaR/GlQk2/HoI=");
_c = LogSearchField;
var _c;
__turbopack_context__.k.register(_c, "LogSearchField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>TriangleAlert
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
];
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("triangle-alert", __iconNode);
;
 //# sourceMappingURL=triangle-alert.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertTriangle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>RefreshCw
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
            key: "v9h5vc"
        }
    ],
    [
        "path",
        {
            d: "M21 3v5h-5",
            key: "1q7to0"
        }
    ],
    [
        "path",
        {
            d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
            key: "3uifl3"
        }
    ],
    [
        "path",
        {
            d: "M8 16H3v5",
            key: "1cv678"
        }
    ]
];
const RefreshCw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("refresh-cw", __iconNode);
;
 //# sourceMappingURL=refresh-cw.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RefreshCw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@radix-ui+react-label@2.1.8_beedc72a2764f9caff1514ef9155b3f3/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label,
    "Root",
    ()=>Root
]);
// src/label.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2_2890c4f0094b3fe96d52c22245e0b989$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2_2890c4f0094b3fe96d52c22245e0b989/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
;
var NAME = "Label";
var Label = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2_2890c4f0094b3fe96d52c22245e0b989$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].label, {
        ...props,
        ref: forwardedRef,
        onMouseDown: (event)=>{
            const target = event.target;
            if (target.closest("button, input, select, textarea")) return;
            props.onMouseDown?.(event);
            if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
        }
    });
});
Label.displayName = NAME;
var Root = Label;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Search
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21 21-4.34-4.34",
            key: "14j7rj"
        }
    ],
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ]
];
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("search", __iconNode);
;
 //# sourceMappingURL=search.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/render/components/m/proxy.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "m",
    ()=>m
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$create$2d$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/render/components/create-proxy.mjs [app-client] (ecmascript)");
;
const m = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$create$2d$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createMotionProxy"])();
;
 //# sourceMappingURL=proxy.mjs.map
}),
"[project]/node_modules/.pnpm/motion@13.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/motion/dist/es/react.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "m",
    ()=>m,
    "motion",
    ()=>motion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$m$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/render/components/m/proxy.mjs [app-client] (ecmascript)");
;
;
// Re-export everything from framer-motion.
//
// `motion` and `m` are aliased through local bindings so the module has
// explicit named exports for IDE auto-import (see #3432). The previous
// `export { motion, m } from "framer-motion"` line — sitting alongside
// `export * from "framer-motion"` — was a duplicate-source re-export pattern
// that caused Next.js Turbopack to OOM during module-graph analysis (#3741).
// Local declarations shadow the wildcard re-export per the ES spec, so
// `motion` and `m` come from the explicit bindings below and the rest from
// `export *`.
const motion = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"];
const m = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$m$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["m"];
;
}),
"[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/use-unmount-effect.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUnmountEffect",
    ()=>useUnmountEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
function useUnmountEffect(callback) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUnmountEffect.useEffect": ()=>({
                "useUnmountEffect.useEffect": ()=>callback()
            })["useUnmountEffect.useEffect"]
    }["useUnmountEffect.useEffect"], []);
}
;
 //# sourceMappingURL=use-unmount-effect.mjs.map
}),
"[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReducedMotion",
    ()=>useReducedMotion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$2d$dom$40$13$2e$2$2e$0$2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$render$2f$utils$2f$reduced$2d$motion$2f$state$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion-dom@13.2.0/node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$2d$dom$40$13$2e$2$2e$0$2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$render$2f$utils$2f$reduced$2d$motion$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion-dom@13.2.0/node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$2d$utils$40$13$2e$0$2e$0$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$warn$2d$once$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion-utils@13.0.0/node_modules/motion-utils/dist/es/warn-once.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
;
/**
 * A hook that returns `true` if we should be using reduced motion based on the current device's Reduced Motion setting.
 *
 * This can be used to implement changes to your UI based on Reduced Motion. For instance, replacing motion-sickness inducing
 * `x`/`y` animations with `opacity`, disabling the autoplay of background videos, or turning off parallax motion.
 *
 * It will actively respond to changes and re-render your components with the latest setting.
 *
 * ```jsx
 * export function Sidebar({ isOpen }) {
 *   const shouldReduceMotion = useReducedMotion()
 *   const closedX = shouldReduceMotion ? 0 : "-100%"
 *
 *   return (
 *     <motion.div animate={{
 *       opacity: isOpen ? 1 : 0,
 *       x: isOpen ? 0 : closedX
 *     }} />
 *   )
 * }
 * ```
 *
 * @return boolean
 *
 * @public
 */ function useReducedMotion() {
    /**
     * Lazy initialisation of prefersReducedMotion
     */ !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$2d$dom$40$13$2e$2$2e$0$2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$render$2f$utils$2f$reduced$2d$motion$2f$state$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasReducedMotionListener"].current && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$2d$dom$40$13$2e$2$2e$0$2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$render$2f$utils$2f$reduced$2d$motion$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initPrefersReducedMotion"])();
    const [shouldReduceMotion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$2d$dom$40$13$2e$2$2e$0$2f$node_modules$2f$motion$2d$dom$2f$dist$2f$es$2f$render$2f$utils$2f$reduced$2d$motion$2f$state$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prefersReducedMotion"].current);
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$2d$utils$40$13$2e$0$2e$0$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$warn$2d$once$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warnOnce"])(shouldReduceMotion !== true, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled");
    }
    /**
     * TODO See if people miss automatically updating shouldReduceMotion setting
     */ return shouldReduceMotion;
}
;
 //# sourceMappingURL=use-reduced-motion.mjs.map
}),
"[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion-config.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReducedMotionConfig",
    ()=>useReducedMotionConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$context$2f$MotionConfigContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-client] (ecmascript)");
"use client";
;
;
;
function useReducedMotionConfig() {
    const reducedMotionPreference = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const { reducedMotion } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$context$2f$MotionConfigContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MotionConfigContext"]);
    if (reducedMotion === "never") {
        return false;
    } else if (reducedMotion === "always") {
        return true;
    } else {
        return reducedMotionPreference;
    }
}
;
 //# sourceMappingURL=use-reduced-motion-config.mjs.map
}),
"[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/animation/hooks/use-animate.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnimate",
    ()=>useAnimate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/use-constant.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$unmount$2d$effect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/use-unmount-effect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2d$config$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion-config.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$context$2f$MotionConfigContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/animation/animate/index.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function useAnimate() {
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$constant$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConstant"])({
        "useAnimate.useConstant[scope]": ()=>({
                current: null,
                animations: []
            })
    }["useAnimate.useConstant[scope]"]);
    const reduceMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2d$config$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotionConfig"])() ?? undefined;
    const { skipAnimations } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$context$2f$MotionConfigContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MotionConfigContext"]);
    const animate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnimate.useMemo[animate]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createScopedAnimate"])({
                scope,
                reduceMotion,
                skipAnimations
            })
    }["useAnimate.useMemo[animate]"], [
        scope,
        reduceMotion,
        skipAnimations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$unmount$2d$effect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnmountEffect"])({
        "useAnimate.useUnmountEffect": ()=>{
            scope.animations.forEach({
                "useAnimate.useUnmountEffect": (animation)=>animation.stop()
            }["useAnimate.useUnmountEffect"]);
            scope.animations.length = 0;
        }
    }["useAnimate.useUnmountEffect"]);
    return [
        scope,
        animate
    ];
}
;
 //# sourceMappingURL=use-animate.mjs.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_718fb69c._.js.map