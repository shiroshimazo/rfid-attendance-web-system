module.exports = [
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.4.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/components/ui/code-input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CODE_LENGTH",
    ()=>CODE_LENGTH,
    "CodeInput",
    ()=>CodeInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
/** Verification codes carry six digits, one box per digit. */ const CODE_LENGTH = 6;
/**
 * Verification code field split into one box per digit. Typing advances to the
 * next box, backspace walks back, and a pasted or autofilled code lands across
 * the boxes. The parent keeps the single joined string.
 */ function CodeInput({ className, value, onChange, length = CODE_LENGTH, id = "code", label = "Verification code", disabled, autoFocus, "aria-invalid": ariaInvalid, ...props }) {
    const digits = value.replace(/\D/g, "").slice(0, length);
    const boxes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"]([]);
    const isInvalid = ariaInvalid === true || ariaInvalid === "true";
    const cells = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const next = [];
        for(let index = 0; index < length; index++)next.push(digits[index] ?? "");
        return next;
    }, [
        digits,
        length
    ]);
    const focusBox = (index)=>{
        const box = boxes.current[index];
        if (!box) return;
        box.focus();
        box.select();
    };
    /** Writes the boxes back to the parent, keeping the digits contiguous. */ const commit = (next)=>{
        onChange(next.join(""));
    };
    const clearFrom = (index)=>{
        const next = cells.slice();
        for(let i = index; i < length; i++)next[i] = "";
        commit(next);
    };
    const handleChange = (index, event)=>{
        const typed = event.target.value.replace(/\D/g, "");
        if (!typed) {
            // Emptied box clears its own digits; a rejected non-digit is ignored.
            if (event.target.value === "") clearFrom(index);
            return;
        }
        if (typed.length > 1) {
            // A pasted or autofilled code arrives whole; spread it over the boxes.
            if (typed.length === 2 && typed[0] === cells[index]) {
                const next = cells.slice();
                next[index] = typed[1];
                commit(next);
                if (index < length - 1) focusBox(index + 1);
                return;
            }
            const next = cells.slice();
            let last = index;
            for(let i = 0; i < typed.length && index + i < length; i++){
                next[index + i] = typed[i];
                last = index + i;
            }
            commit(next);
            focusBox(last);
            return;
        }
        const next = cells.slice();
        next[index] = typed;
        commit(next);
        if (index < length - 1) focusBox(index + 1);
    };
    const handleKeyDown = (index, event)=>{
        if (event.key === "Backspace") {
            event.preventDefault();
            if (cells[index]) {
                clearFrom(index);
            } else if (index > 0) {
                focusBox(index - 1);
                clearFrom(index - 1);
            }
            return;
        }
        if (event.key === "Delete") {
            event.preventDefault();
            clearFrom(index);
            return;
        }
        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            focusBox(index - 1);
            return;
        }
        if (event.key === "ArrowRight" && index < length - 1) {
            event.preventDefault();
            focusBox(index + 1);
        }
    };
    const handlePaste = (index, event)=>{
        event.preventDefault();
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
        if (!pasted) return;
        const start = pasted.length >= length ? 0 : index;
        const next = cells.slice();
        let last = start;
        for(let i = 0; i < pasted.length && start + i < length; i++){
            next[start + i] = pasted[i];
            last = start + i;
        }
        commit(next);
        focusBox(last);
    };
    const handleFocus = (index, event)=>{
        const firstEmpty = cells.findIndex((cell)=>cell === "");
        if (firstEmpty !== -1 && firstEmpty < index) {
            // Digits stay contiguous, so typing continues in the first empty box.
            focusBox(firstEmpty);
            return;
        }
        event.target.select();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "code-input",
        role: "group",
        "aria-label": label,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center gap-2", className),
        ...props,
        children: Array.from({
            length
        }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: (element)=>{
                    boxes.current[index] = element;
                },
                id: `${id}-${index}`,
                type: "text",
                inputMode: "numeric",
                autoComplete: index === 0 ? "one-time-code" : "off",
                value: cells[index],
                disabled: disabled,
                autoFocus: autoFocus && index === 0,
                "aria-label": `Digit ${index + 1} of ${length}`,
                "aria-invalid": ariaInvalid,
                onChange: (event)=>handleChange(index, event),
                onKeyDown: (event)=>handleKeyDown(index, event),
                onPaste: (event)=>handlePaste(index, event),
                onFocus: (event)=>handleFocus(index, event),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-11 w-9 rounded-md border border-input bg-transparent text-center text-lg font-semibold tabular-nums shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground sm:h-12 sm:w-11", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", isInvalid && "border-destructive ring-destructive/20 dark:ring-destructive/40", "dark:bg-input/30")
            }, index, false, {
                fileName: "[project]/src/components/ui/code-input.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/code-input.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
;
}),
];

//# sourceMappingURL=src_f88b95c3._.js.map