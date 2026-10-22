module.exports = [
"[project]/node_modules/.pnpm/goey-toast@0.5.0_framer-mot_afa72b40d517584ba6ac01cdf8ee38ee/node_modules/goey-toast/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GoeyToaster",
    ()=>GooeyToaster,
    "GooeyToaster",
    ()=>GooeyToaster,
    "animationPresets",
    ()=>animationPresets,
    "goeyToast",
    ()=>gooeyToast,
    "gooeyToast",
    ()=>gooeyToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/animation/animate/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@13.2.0_react-_69f75a21b55217b4a287640c5195e114/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
// src/components/GooeyToaster.tsx
// src/presets.ts
var animationPresets = {
    smooth: {
        bounce: 0.1,
        spring: true
    },
    bouncy: {
        bounce: 0.6,
        spring: true
    },
    subtle: {
        bounce: 0.05,
        spring: true
    },
    snappy: {
        bounce: 0.4,
        spring: true
    }
};
// src/context.ts
var _position = "bottom-right";
var _dir = "ltr";
var _spring = true;
var _bounce = void 0;
var _theme = "light";
function setGooeyTheme(theme) {
    _theme = theme;
}
function getGooeyTheme() {
    return _theme;
}
function setGooeyPosition(position) {
    _position = position;
}
function getGooeyPosition() {
    return _position;
}
function setGooeyDir(dir) {
    _dir = dir;
}
function getGooeyDir() {
    return _dir;
}
function setGooeySpring(spring) {
    _spring = spring;
}
function getGooeySpring() {
    return _spring;
}
function setGooeyBounce(bounce) {
    _bounce = bounce;
}
function getGooeyBounce() {
    return _bounce;
}
var _visibleToasts = 3;
function setGooeyVisibleToasts(n) {
    _visibleToasts = n;
}
function getGooeyVisibleToasts() {
    return _visibleToasts;
}
var _swipeToDismiss = true;
function setGooeySwipeToDismiss(enabled) {
    _swipeToDismiss = enabled;
}
function getGooeySwipeToDismiss() {
    return _swipeToDismiss;
}
var _maxQueue = Infinity;
function setGooeyMaxQueue(n) {
    _maxQueue = n;
}
function getGooeyMaxQueue() {
    return _maxQueue;
}
var _queueOverflow = "drop-oldest";
function setGooeyQueueOverflow(strategy) {
    _queueOverflow = strategy;
}
function getGooeyQueueOverflow() {
    return _queueOverflow;
}
var _showProgress = false;
function setGooeyShowProgress(show) {
    _showProgress = show;
}
function getGooeyShowProgress() {
    return _showProgress;
}
var _showTimestamp = true;
function setGooeyShowTimestamp(show) {
    _showTimestamp = show;
}
function getGooeyShowTimestamp() {
    return _showTimestamp;
}
var _closeButton = false;
function setGooeyCloseButton(value) {
    _closeButton = value;
}
function getGooeyCloseButton() {
    return _closeButton;
}
var _containerHovered = false;
var _hoverSubs = /* @__PURE__ */ new Set();
function setContainerHovered(hovered) {
    if (_containerHovered === hovered) return;
    _containerHovered = hovered;
    _hoverSubs.forEach((cb)=>cb(hovered));
}
function getContainerHovered() {
    return _containerHovered;
}
function subscribeContainerHovered(cb) {
    _hoverSubs.add(cb);
    return ()=>{
        _hoverSubs.delete(cb);
    };
}
var _announceSubs = /* @__PURE__ */ new Set();
function announce(message, politeness = "polite") {
    _announceSubs.forEach((cb)=>cb({
            message,
            politeness
        }));
}
function subscribeAnnouncements(cb) {
    _announceSubs.add(cb);
    return ()=>{
        _announceSubs.delete(cb);
    };
}
var DefaultIcon = ({ size = 20, className })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "M13.73 21a2 2 0 0 1-3.46 0"
            })
        ]
    });
var SuccessIcon = ({ size = 20, className })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "M9 12l2 2 4-4"
            })
        ]
    });
var ErrorIcon = ({ size = 20, className })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "M15 9l-6 6"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "M9 9l6 6"
            })
        ]
    });
var WarningIcon = ({ size = 20, className })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                x1: "12",
                y1: "8",
                x2: "12",
                y2: "12"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                x1: "12",
                y1: "16",
                x2: "12.01",
                y2: "16"
            })
        ]
    });
var InfoIcon = ({ size = 20, className })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                x1: "12",
                y1: "16",
                x2: "12",
                y2: "12"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                x1: "12",
                y1: "8",
                x2: "12.01",
                y2: "8"
            })
        ]
    });
var SpinnerIcon = ({ size = 20, className })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
            d: "M21 12a9 9 0 1 1-6.219-8.56"
        })
    });
var QUERY = "(prefers-reduced-motion: reduce)";
function getInitialState() {
    if ("TURBOPACK compile-time truthy", 1) {
        return false;
    }
    //TURBOPACK unreachable
    ;
}
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getInitialState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        const mql = undefined;
        const handler = undefined;
    }, []);
    return prefersReducedMotion;
}
// src/components/gooey-styles.ts
var styles = {
    spinnerSpin: "gooey-spinnerSpin",
    wrapper: "gooey-wrapper",
    blobSvg: "gooey-blobSvg",
    content: "gooey-content",
    contentCompact: "gooey-contentCompact",
    contentExpanded: "gooey-contentExpanded",
    header: "gooey-header",
    iconWrapper: "gooey-iconWrapper",
    title: "gooey-title",
    titleDefault: "gooey-titleDefault",
    titleSuccess: "gooey-titleSuccess",
    titleError: "gooey-titleError",
    titleWarning: "gooey-titleWarning",
    titleInfo: "gooey-titleInfo",
    titleLoading: "gooey-titleLoading",
    description: "gooey-description",
    actionWrapper: "gooey-actionWrapper",
    actionButton: "gooey-actionButton",
    actionDefault: "gooey-actionDefault",
    actionSuccess: "gooey-actionSuccess",
    actionError: "gooey-actionError",
    actionWarning: "gooey-actionWarning",
    actionInfo: "gooey-actionInfo",
    progressWrapper: "gooey-progressWrapper",
    progressBar: "gooey-progressBar",
    progressDefault: "gooey-progressDefault",
    progressSuccess: "gooey-progressSuccess",
    progressError: "gooey-progressError",
    progressWarning: "gooey-progressWarning",
    progressInfo: "gooey-progressInfo",
    progressPaused: "gooey-progressPaused",
    timestamp: "gooey-timestamp",
    closeButton: "gooey-closeButton",
    closeButtonRight: "gooey-closeButtonRight"
};
var useIsomorphicLayoutEffect = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"];
var phaseIconMap = {
    default: DefaultIcon,
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
};
var titleColorMap = {
    loading: styles.titleLoading,
    default: styles.titleDefault,
    success: styles.titleSuccess,
    error: styles.titleError,
    warning: styles.titleWarning,
    info: styles.titleInfo
};
var actionColorMap = {
    loading: styles.actionInfo,
    default: styles.actionDefault,
    success: styles.actionSuccess,
    error: styles.actionError,
    warning: styles.actionWarning,
    info: styles.actionInfo
};
var progressColorMap = {
    loading: styles.progressInfo,
    default: styles.progressDefault,
    success: styles.progressSuccess,
    error: styles.progressError,
    warning: styles.progressWarning,
    info: styles.progressInfo
};
var PH = 34;
var DEFAULT_DISPLAY_DURATION = 4e3;
var DEFAULT_EXPAND_DUR = 0.6;
var DEFAULT_COLLAPSE_DUR = 0.9;
function squishSpring(durationSec, defaultDur, bounce = 0.4) {
    const scale = durationSec / defaultDur;
    const stiffness = 200 + bounce * 437.5;
    const damping = 24 - bounce * 20;
    const mass = 0.7 * scale;
    return {
        type: "spring",
        stiffness,
        damping,
        mass
    };
}
var observerRegistry = /* @__PURE__ */ new Map();
function registerSonnerObserver(ol, callback) {
    let entry = observerRegistry.get(ol);
    if (!entry) {
        const callbacks = /* @__PURE__ */ new Set();
        const observeOptions = {
            attributes: true,
            attributeFilter: [
                "style",
                "data-visible"
            ],
            subtree: true,
            childList: true
        };
        const observer = new MutationObserver(()=>{
            observer.disconnect();
            try {
                for (const cb of callbacks){
                    cb();
                }
            } finally{
                observer.observe(ol, observeOptions);
            }
        });
        observer.observe(ol, observeOptions);
        entry = {
            observer,
            callbacks
        };
        observerRegistry.set(ol, entry);
    }
    entry.callbacks.add(callback);
    return ()=>{
        entry.callbacks.delete(callback);
        if (entry.callbacks.size === 0) {
            entry.observer.disconnect();
            observerRegistry.delete(ol);
        }
    };
}
function syncSonnerHeights(wrapperEl, includeOffsets = false) {
    if (!wrapperEl) return;
    const li = wrapperEl.closest("[data-sonner-toast]");
    if (!li?.parentElement) return;
    const ol = li.parentElement;
    const toasts = Array.from(ol.querySelectorAll(":scope > [data-sonner-toast]"));
    if (toasts.length === 0) return;
    const heights = toasts.map((t)=>{
        if (t.getAttribute("data-visible") === "false") return 0;
        const content = t.firstElementChild;
        const h = content ? content.getBoundingClientRect().height : 0;
        return h > 0 ? h : PH;
    });
    for(let i = 0; i < toasts.length; i++){
        toasts[i].style.setProperty("--initial-height", `${heights[i]}px`);
    }
    if (!includeOffsets) {
        return;
    }
    const gapStr = getComputedStyle(ol).getPropertyValue("--gap").trim();
    const gap = parseFloat(gapStr) || 14;
    let runningOffset = 0;
    for(let i = toasts.length - 1; i >= 0; i--){
        if (toasts[i].getAttribute("data-visible") === "false") {
            toasts[i].style.setProperty("--offset", "0px");
            continue;
        }
        toasts[i].style.setProperty("--offset", `${runningOffset}px`);
        if (i > 0) {
            runningOffset += heights[i] + gap;
        }
    }
}
function memoizePath(fn) {
    let lastArgs = null;
    let lastResult = "";
    return (pw, bw, th, t)=>{
        if (lastArgs && lastArgs[0] === pw && lastArgs[1] === bw && lastArgs[2] === th && lastArgs[3] === t) {
            return lastResult;
        }
        lastResult = fn(pw, bw, th, t);
        lastArgs = [
            pw,
            bw,
            th,
            t
        ];
        return lastResult;
    };
}
function morphPathRaw(pw, bw, th, t) {
    const pr = PH / 2;
    const pillW = Math.min(pw, bw);
    const bodyH = PH + (th - PH) * t;
    if (t <= 0 || bodyH - PH < 8) {
        return [
            `M 0,${pr}`,
            `A ${pr},${pr} 0 0 1 ${pr},0`,
            `H ${pillW - pr}`,
            `A ${pr},${pr} 0 0 1 ${pillW},${pr}`,
            `A ${pr},${pr} 0 0 1 ${pillW - pr},${PH}`,
            `H ${pr}`,
            `A ${pr},${pr} 0 0 1 0,${pr}`,
            `Z`
        ].join(" ");
    }
    const curve = 14 * t;
    const cr = Math.min(16, (bodyH - PH) * 0.45);
    const bodyW = pillW + (bw - pillW) * t;
    const bodyTop = PH - curve;
    const qEndX = Math.min(pillW + curve, bodyW - cr);
    return [
        `M 0,${pr}`,
        `A ${pr},${pr} 0 0 1 ${pr},0`,
        `H ${pillW - pr}`,
        `A ${pr},${pr} 0 0 1 ${pillW},${pr}`,
        `L ${pillW},${bodyTop}`,
        `Q ${pillW},${bodyTop + curve} ${qEndX},${bodyTop + curve}`,
        `H ${bodyW - cr}`,
        `A ${cr},${cr} 0 0 1 ${bodyW},${bodyTop + curve + cr}`,
        `L ${bodyW},${bodyH - cr}`,
        `A ${cr},${cr} 0 0 1 ${bodyW - cr},${bodyH}`,
        `H ${cr}`,
        `A ${cr},${cr} 0 0 1 0,${bodyH - cr}`,
        `Z`
    ].join(" ");
}
function morphPathCenterRaw(pw, bw, th, t) {
    const pr = PH / 2;
    const pillW = Math.min(pw, bw);
    const pillOffset = (bw - pillW) / 2;
    if (t <= 0 || PH + (th - PH) * t - PH < 8) {
        return [
            `M ${pillOffset},${pr}`,
            `A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
            `H ${pillOffset + pillW - pr}`,
            `A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
            `A ${pr},${pr} 0 0 1 ${pillOffset + pillW - pr},${PH}`,
            `H ${pillOffset + pr}`,
            `A ${pr},${pr} 0 0 1 ${pillOffset},${pr}`,
            `Z`
        ].join(" ");
    }
    const bodyH = PH + (th - PH) * t;
    const curve = 14 * t;
    const cr = Math.min(16, (bodyH - PH) * 0.45);
    const bodyTop = PH - curve;
    const bodyCenter = bw / 2;
    const halfBodyW = pillW / 2 + (bw - pillW) / 2 * t;
    const bodyLeft = bodyCenter - halfBodyW;
    const bodyRight = bodyCenter + halfBodyW;
    const qLeftX = Math.max(bodyLeft + cr, pillOffset - curve);
    const qRightX = Math.min(bodyRight - cr, pillOffset + pillW + curve);
    return [
        // Start at left side of pill
        `M ${pillOffset},${pr}`,
        // Pill top-left arc
        `A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
        // Top edge of pill
        `H ${pillOffset + pillW - pr}`,
        // Pill top-right arc
        `A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
        // Right side down to body junction
        `L ${pillOffset + pillW},${bodyTop}`,
        // Right organic curve from pill to body
        `Q ${pillOffset + pillW},${bodyTop + curve} ${qRightX},${bodyTop + curve}`,
        // Right side of body
        `H ${bodyRight - cr}`,
        // Body top-right corner
        `A ${cr},${cr} 0 0 1 ${bodyRight},${bodyTop + curve + cr}`,
        // Right edge down
        `L ${bodyRight},${bodyH - cr}`,
        // Body bottom-right corner
        `A ${cr},${cr} 0 0 1 ${bodyRight - cr},${bodyH}`,
        // Bottom edge
        `H ${bodyLeft + cr}`,
        // Body bottom-left corner
        `A ${cr},${cr} 0 0 1 ${bodyLeft},${bodyH - cr}`,
        // Left edge up
        `L ${bodyLeft},${bodyTop + curve + cr}`,
        // Body top-left corner
        `A ${cr},${cr} 0 0 1 ${bodyLeft + cr},${bodyTop + curve}`,
        // Left side of body
        `H ${qLeftX}`,
        // Left organic curve from body to pill
        `Q ${pillOffset},${bodyTop + curve} ${pillOffset},${bodyTop}`,
        // Close back to start
        `Z`
    ].join(" ");
}
var morphPath = memoizePath(morphPathRaw);
var morphPathCenter = memoizePath(morphPathCenterRaw);
var SMOOTH_EASE = [
    0.4,
    0,
    0.2,
    1
];
var GooeyToast = ({ title, description, action, icon, phase, classNames, fillColor: fillColorProp, borderColor, borderWidth, timing, preset, spring: springProp, bounce: bounceProp, showTimestamp: showTimestampProp, showProgress: showProgressProp, toastId })=>{
    const theme = getGooeyTheme();
    const closeButtonSetting = getGooeyCloseButton();
    const showCloseButton = closeButtonSetting !== false;
    const fillColor = fillColorProp ?? (theme === "dark" ? "#1a1a1a" : "#ffffff");
    const position = getGooeyPosition();
    const dir = getGooeyDir();
    const posIsRight = position?.includes("right") ?? false;
    const isCenter = position?.includes("center") ?? false;
    const isRight = dir === "rtl" ? isCenter ? false : !posIsRight : posIsRight;
    const prefersReducedMotion = usePrefersReducedMotion();
    const presetConfig = preset ? animationPresets[preset] : void 0;
    const useSpring = springProp ?? presetConfig?.spring ?? getGooeySpring();
    const bounceVal = bounceProp ?? presetConfig?.bounce ?? getGooeyBounce() ?? 0.4;
    const showProgress = showProgressProp ?? getGooeyShowProgress();
    const showTimestamp = showTimestampProp ?? getGooeyShowTimestamp();
    const [actionSuccess, setActionSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dismissing, setDismissing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progressKey, setProgressKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hoveredRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const containerHoveredRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(getContainerHovered());
    const [containerHovered, setContainerHoveredState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getContainerHovered());
    const collapsingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const preDismissRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const collapseEndTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const expandedDimsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        pw: 0,
        bw: 0,
        th: 0
    });
    const dismissTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const effectiveTitle = actionSuccess ?? title;
    const effectivePhase = actionSuccess ? "success" : phase;
    const effectiveDescription = actionSuccess ? void 0 : description;
    const effectiveAction = actionSuccess ? void 0 : action;
    const isLoading = effectivePhase === "loading";
    const hasDescription = Boolean(effectiveDescription);
    const hasAction = Boolean(effectiveAction);
    const isExpanded = (hasDescription || hasAction) && !dismissing;
    const [showBody, setShowBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pathRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const headerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const morphCtrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pillResizeCtrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const headerSquishCtrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const morphTRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const aDims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        pw: 0,
        bw: 0,
        th: 0
    });
    const dimsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        pw: 0,
        bw: 0,
        th: 0
    });
    const [dims, setDims] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        pw: 0,
        bw: 0,
        th: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        dimsRef.current = dims;
    }, [
        dims
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return subscribeContainerHovered((h)=>{
            containerHoveredRef.current = h;
            setContainerHoveredState(h);
        });
    }, []);
    const flush = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const { pw: p, bw: b, th: h } = aDims.current;
        if (p <= 0 || b <= 0 || h <= 0) return;
        const t = Math.max(0, Math.min(1, morphTRef.current));
        const pos = getGooeyPosition();
        const d = getGooeyDir();
        const centerPos = pos?.includes("center") ?? false;
        const posRight = pos?.includes("right") ?? false;
        const rightSide = d === "rtl" ? centerPos ? false : !posRight : posRight;
        if (centerPos) {
            const centerBw = Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p);
            pathRef.current?.setAttribute("d", morphPathCenter(p, centerBw, h, t));
        } else {
            pathRef.current?.setAttribute("d", morphPath(p, b, h, t));
        }
        if (t >= 1) {
            if (wrapperRef.current) {
                wrapperRef.current.style.width = "";
            }
            if (contentRef.current) {
                contentRef.current.style.width = "";
                contentRef.current.style.overflow = "";
                contentRef.current.style.maxHeight = "";
                contentRef.current.style.clipPath = "";
            }
        } else if (t > 0) {
            const targetBw = dimsRef.current.bw;
            const targetTh = dimsRef.current.th;
            const pillW = Math.min(p, b);
            const currentW = pillW + (b - pillW) * t;
            const currentH = PH + (targetTh - PH) * t;
            const centerFullW = centerPos ? Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p) : 0;
            if (wrapperRef.current) {
                wrapperRef.current.style.width = (centerPos ? centerFullW : currentW) + "px";
            }
            if (contentRef.current) {
                contentRef.current.style.width = (centerPos ? centerFullW : targetBw) + "px";
                contentRef.current.style.overflow = "hidden";
                contentRef.current.style.maxHeight = currentH + "px";
                if (centerPos) {
                    const clip = (centerFullW - currentW) / 2;
                    contentRef.current.style.clipPath = `inset(0 ${clip}px 0 ${clip}px)`;
                } else {
                    const clip = targetBw - currentW;
                    contentRef.current.style.clipPath = rightSide ? `inset(0 0 0 ${clip}px)` : `inset(0 ${clip}px 0 0)`;
                }
            }
        } else {
            const pillW = Math.min(p, b);
            if (wrapperRef.current) {
                const centerBw = centerPos ? Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p) : pillW;
                wrapperRef.current.style.width = centerBw + "px";
            }
            if (contentRef.current) {
                if (centerPos) {
                    const centerBwVal = Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p);
                    contentRef.current.style.width = centerBwVal + "px";
                    const clip = (centerBwVal - pillW) / 2;
                    contentRef.current.style.clipPath = `inset(0 ${clip}px 0 ${clip}px)`;
                } else {
                    contentRef.current.style.width = "";
                    contentRef.current.style.clipPath = "";
                }
                contentRef.current.style.overflow = "hidden";
                contentRef.current.style.maxHeight = PH + "px";
            }
        }
    }, []);
    const measure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!headerRef.current || !contentRef.current) return;
        const wr = wrapperRef.current;
        const savedW = wr?.style.width ?? "";
        const savedOv = contentRef.current.style.overflow;
        const savedMH = contentRef.current.style.maxHeight;
        const savedCW = contentRef.current.style.width;
        if (wr) {
            wr.style.width = "";
        }
        contentRef.current.style.overflow = "";
        contentRef.current.style.maxHeight = "";
        contentRef.current.style.width = "";
        const cs = getComputedStyle(contentRef.current);
        const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const pw2 = headerRef.current.offsetWidth + paddingX;
        const bw2 = contentRef.current.offsetWidth;
        const th2 = contentRef.current.offsetHeight;
        if (wr) {
            wr.style.width = savedW;
        }
        contentRef.current.style.overflow = savedOv;
        contentRef.current.style.maxHeight = savedMH;
        contentRef.current.style.width = savedCW;
        dimsRef.current = {
            pw: pw2,
            bw: bw2,
            th: th2
        };
        setDims({
            pw: pw2,
            bw: bw2,
            th: th2
        });
    }, []);
    useIsomorphicLayoutEffect(()=>{
        measure();
        const t = setTimeout(measure, 100);
        return ()=>clearTimeout(t);
    }, [
        effectiveTitle,
        effectivePhase,
        isExpanded,
        showBody,
        effectiveDescription,
        effectiveAction,
        measure
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!contentRef.current) return;
        const ro = new ResizeObserver(measure);
        ro.observe(contentRef.current);
        return ()=>ro.disconnect();
    }, [
        measure
    ]);
    const { pw, bw, th } = dims;
    const hasDims = pw > 0 && bw > 0 && th > 0;
    const blobSquishCtrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const expandDur = DEFAULT_EXPAND_DUR;
    const collapseDur = DEFAULT_COLLAPSE_DUR;
    const lastSquishTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const triggerLandingSquish = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((phase2 = "mount")=>{
        if (!wrapperRef.current || prefersReducedMotion) return;
        if (!useSpring) return;
        const now = Date.now();
        if (now - lastSquishTime.current < 300) return;
        lastSquishTime.current = now;
        blobSquishCtrl.current?.stop();
        const el = wrapperRef.current;
        const springConfig = phase2 === "collapse" ? squishSpring(collapseDur, DEFAULT_COLLAPSE_DUR, bounceVal) : squishSpring(expandDur, DEFAULT_EXPAND_DUR, bounceVal);
        const bScale = bounceVal / 0.4;
        const compressY = (phase2 === "collapse" ? 0.035 : 0.12) * bScale;
        const expandX = (phase2 === "collapse" ? 0.018 : 0.06) * bScale;
        blobSquishCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(0, 1, {
            ...springConfig,
            onUpdate: (v)=>{
                const intensity = Math.sin(v * Math.PI);
                const sy = 1 - compressY * intensity;
                const sx = 1 + expandX * intensity;
                const mirror = el.style.transform?.includes("scaleX(-1)") ? "scaleX(-1) " : "";
                el.style.transformOrigin = "center top";
                el.style.transform = mirror + `scaleX(${sx}) scaleY(${sy})`;
            },
            onComplete: ()=>{
                const right = el.style.transform?.includes("scaleX(-1)");
                el.style.transform = right ? "scaleX(-1)" : "";
                el.style.transformOrigin = "";
            }
        });
    }, [
        prefersReducedMotion,
        expandDur,
        collapseDur,
        useSpring,
        bounceVal
    ]);
    useIsomorphicLayoutEffect(()=>{
        if (!hasDims || collapsingRef.current) return;
        const prev = {
            ...aDims.current
        };
        const target = {
            pw,
            bw,
            th
        };
        if (prev.bw <= 0) {
            aDims.current = target;
            flush();
            return;
        }
        if (morphTRef.current > 0 && morphTRef.current < 1) {
            aDims.current = target;
            flush();
            return;
        }
        if (showBody) {
            aDims.current = target;
            flush();
            return;
        }
        if (prev.bw === target.bw && prev.pw === target.pw && prev.th === target.th) return;
        if (prefersReducedMotion) {
            aDims.current = target;
            flush();
            return;
        }
        pillResizeCtrl.current?.stop();
        if (Date.now() - collapseEndTime.current > 500 && !isExpanded) {
            triggerLandingSquish("expand");
        }
        const pillResizeTransition = useSpring ? {
            type: "spring",
            duration: 0.5,
            bounce: bounceVal * 0.875
        } : {
            duration: 0.4,
            ease: SMOOTH_EASE
        };
        pillResizeCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(0, 1, {
            ...pillResizeTransition,
            onUpdate: (t)=>{
                aDims.current = {
                    pw: prev.pw + (target.pw - prev.pw) * t,
                    bw: prev.bw + (target.bw - prev.bw) * t,
                    th: prev.th + (target.th - prev.th) * t
                };
                flush();
            }
        });
    }, [
        pw,
        bw,
        th,
        hasDims,
        showBody,
        flush,
        prefersReducedMotion,
        triggerLandingSquish,
        useSpring
    ]);
    const squishDelayMs = 45;
    const mountSquished = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (hasDims && !mountSquished.current && !isExpanded) {
            mountSquished.current = true;
            const t = setTimeout(triggerLandingSquish, squishDelayMs);
            return ()=>clearTimeout(t);
        }
    }, [
        hasDims,
        squishDelayMs,
        triggerLandingSquish
    ]);
    const prevShowBody = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    useIsomorphicLayoutEffect(()=>{
        if (!prevShowBody.current && showBody && !hoveredRef.current) {
            const t = setTimeout(()=>triggerLandingSquish("expand"), 80);
            return ()=>clearTimeout(t);
        }
        prevShowBody.current = showBody;
    }, [
        showBody,
        triggerLandingSquish
    ]);
    const shakeCtrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(phase);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (phase === "error" && prevPhase.current !== "error" && !dismissing && wrapperRef.current && !prefersReducedMotion) {
            shakeCtrl.current?.stop();
            const el = wrapperRef.current;
            const mirror = el.style.transform?.includes("scaleX(-1)") ? "scaleX(-1) " : "";
            shakeCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(0, 1, {
                duration: 0.4,
                ease: "easeOut",
                onUpdate: (v)=>{
                    const decay = 1 - v;
                    const shake = Math.sin(v * Math.PI * 6) * decay * 3;
                    el.style.transform = mirror + `translateX(${shake}px)`;
                },
                onComplete: ()=>{
                    el.style.transform = mirror.trim() || "";
                }
            });
        }
        prevPhase.current = phase;
        return ()=>{
            shakeCtrl.current?.stop();
        };
    }, [
        phase,
        dismissing,
        prefersReducedMotion
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isExpanded) {
            const delay = prefersReducedMotion ? 0 : 330;
            const t1 = setTimeout(()=>setShowBody(true), delay);
            return ()=>clearTimeout(t1);
        }
        morphCtrl.current?.stop();
        pillResizeCtrl.current?.stop();
        if (morphTRef.current > 0) {
            const csPad = contentRef.current ? getComputedStyle(contentRef.current) : null;
            const padX = csPad ? parseFloat(csPad.paddingLeft) + parseFloat(csPad.paddingRight) : 20;
            const targetPw = headerRef.current ? headerRef.current.offsetWidth + padX : aDims.current.pw;
            const targetDims = {
                pw: targetPw,
                bw: targetPw,
                th: PH
            };
            if (prefersReducedMotion) {
                morphTRef.current = 0;
                collapsingRef.current = false;
                preDismissRef.current = false;
                setShowBody(false);
                aDims.current = {
                    ...targetDims
                };
                flush();
                return;
            }
            const savedDims = expandedDimsRef.current.bw > 0 ? {
                ...expandedDimsRef.current
            } : {
                ...aDims.current
            };
            const isPreDismiss = preDismissRef.current;
            const collapseDur2 = 0.9;
            const collapseTransition = isPreDismiss || !useSpring ? {
                duration: collapseDur2,
                ease: SMOOTH_EASE
            } : {
                type: "spring",
                duration: collapseDur2,
                bounce: bounceVal * 0.875
            };
            triggerLandingSquish("collapse");
            morphCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(morphTRef.current, 0, {
                ...collapseTransition,
                onUpdate: (t)=>{
                    morphTRef.current = t;
                    aDims.current = {
                        pw: targetDims.pw + (savedDims.pw - targetDims.pw) * t,
                        bw: targetDims.bw + (savedDims.bw - targetDims.bw) * t,
                        th: targetDims.th + (savedDims.th - targetDims.th) * t
                    };
                    flush();
                    syncSonnerHeights(wrapperRef.current, true);
                },
                onComplete: ()=>{
                    morphTRef.current = 0;
                    collapsingRef.current = false;
                    preDismissRef.current = false;
                    collapseEndTime.current = Date.now();
                    aDims.current = {
                        ...targetDims
                    };
                    flush();
                    syncSonnerHeights(wrapperRef.current, true);
                    setShowBody(false);
                }
            });
            return ()=>{
                morphCtrl.current?.stop();
            };
        }
        setShowBody(false);
        morphTRef.current = 0;
        flush();
    }, [
        isExpanded,
        flush,
        prefersReducedMotion,
        useSpring,
        triggerLandingSquish
    ]);
    const remainingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timerStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const progressDelayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!showBody || actionSuccess || dismissing) return;
        const expandDelayMs = prefersReducedMotion ? 0 : 330;
        const collapseMs = prefersReducedMotion ? 10 : 0.9 * 1e3;
        const displayMs = timing?.displayDuration ?? DEFAULT_DISPLAY_DURATION;
        const fullDelay = displayMs - expandDelayMs - collapseMs;
        progressDelayRef.current = Math.max(fullDelay, 0);
        if (fullDelay <= 0) return;
        if (hoveredRef.current || containerHoveredRef.current) return;
        const delay = remainingRef.current ?? fullDelay;
        timerStartRef.current = Date.now();
        const timer = setTimeout(()=>{
            if (hoveredRef.current || containerHoveredRef.current) {
                const elapsed = Date.now() - timerStartRef.current;
                remainingRef.current = Math.max(0, delay - elapsed);
                return;
            }
            remainingRef.current = null;
            expandedDimsRef.current = {
                ...aDims.current
            };
            collapsingRef.current = true;
            preDismissRef.current = true;
            setDismissing(true);
        }, delay);
        dismissTimerRef.current = timer;
        return ()=>{
            clearTimeout(timer);
            const elapsed = Date.now() - timerStartRef.current;
            const remaining = delay - elapsed;
            if (remaining > 0 && (hoveredRef.current || containerHoveredRef.current)) {
                remainingRef.current = remaining;
            }
        };
    }, [
        showBody,
        actionSuccess,
        dismissing,
        prefersReducedMotion,
        hovered,
        containerHovered
    ]);
    const canExpand = hasDescription || hasAction;
    const reExpandingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hovered && !containerHovered || !canExpand || !dismissing) return;
        morphCtrl.current?.stop();
        collapsingRef.current = false;
        preDismissRef.current = false;
        remainingRef.current = null;
        reExpandingRef.current = true;
        setDismissing(false);
        setShowBody(true);
        if (showProgress) setProgressKey((k)=>k + 1);
        const currentT = morphTRef.current;
        const startDims = {
            ...aDims.current
        };
        const morphExpandTransition = useSpring ? {
            type: "spring",
            duration: 0.9,
            bounce: bounceVal
        } : {
            duration: 0.6,
            ease: SMOOTH_EASE
        };
        requestAnimationFrame(()=>{
            morphCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(currentT, 1, {
                ...morphExpandTransition,
                onUpdate: (t)=>{
                    morphTRef.current = t;
                    const target = dimsRef.current;
                    aDims.current = {
                        pw: startDims.pw + (target.pw - startDims.pw) * t,
                        bw: startDims.bw + (target.bw - startDims.bw) * t,
                        th: startDims.th + (target.th - startDims.th) * t
                    };
                    flush();
                    syncSonnerHeights(wrapperRef.current, true);
                },
                onComplete: ()=>{
                    morphTRef.current = 1;
                    aDims.current = {
                        ...dimsRef.current
                    };
                    reExpandingRef.current = false;
                    flush();
                    syncSonnerHeights(wrapperRef.current, true);
                }
            });
        });
        return ()=>{
            morphCtrl.current?.stop();
        };
    }, [
        hovered,
        containerHovered,
        dismissing,
        canExpand
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!toastId || !dismissing || showBody) return;
        const t = setTimeout(()=>{
            if (!hoveredRef.current && !containerHoveredRef.current) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(toastId);
            }
        }, 800);
        return ()=>clearTimeout(t);
    }, [
        dismissing,
        showBody,
        toastId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!toastId || !actionSuccess || showBody) return;
        const t = setTimeout(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(toastId), 1200);
        return ()=>clearTimeout(t);
    }, [
        toastId,
        actionSuccess,
        showBody
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (reExpandingRef.current) return;
        if (!showBody) {
            morphTRef.current = 0;
            morphCtrl.current?.stop();
            flush();
            return;
        }
        if (prefersReducedMotion) {
            pillResizeCtrl.current?.stop();
            morphCtrl.current?.stop();
            morphTRef.current = 1;
            aDims.current = {
                ...dimsRef.current
            };
            flush();
            syncSonnerHeights(wrapperRef.current, true);
            return;
        }
        const raf = requestAnimationFrame(()=>{
            pillResizeCtrl.current?.stop();
            morphCtrl.current?.stop();
            const startDims = {
                ...aDims.current
            };
            const morphExpandTransition = useSpring ? {
                type: "spring",
                duration: 0.9,
                bounce: bounceVal
            } : {
                duration: 0.6,
                ease: SMOOTH_EASE
            };
            morphCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(0, 1, {
                ...morphExpandTransition,
                onUpdate: (t)=>{
                    morphTRef.current = t;
                    const target = dimsRef.current;
                    aDims.current = {
                        pw: startDims.pw + (target.pw - startDims.pw) * t,
                        bw: startDims.bw + (target.bw - startDims.bw) * t,
                        th: startDims.th + (target.th - startDims.th) * t
                    };
                    flush();
                    syncSonnerHeights(wrapperRef.current, true);
                },
                onComplete: ()=>{
                    morphTRef.current = 1;
                    aDims.current = {
                        ...dimsRef.current
                    };
                    flush();
                    syncSonnerHeights(wrapperRef.current, true);
                }
            });
        });
        return ()=>{
            cancelAnimationFrame(raf);
            morphCtrl.current?.stop();
        };
    }, [
        showBody,
        flush,
        prefersReducedMotion,
        useSpring
    ]);
    const headerSquished = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!headerRef.current || prefersReducedMotion) return;
        headerSquishCtrl.current?.stop();
        const el = headerRef.current;
        if (showBody && !dismissing && !actionSuccess) {
            if (!useSpring) return;
            headerSquished.current = true;
            headerSquishCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(0, 1, {
                ...squishSpring(expandDur, DEFAULT_EXPAND_DUR, bounceVal),
                onUpdate: (v)=>{
                    const scale = 1 - 0.05 * v;
                    const pushY = v * 1;
                    el.style.transform = `scale(${scale}) translateY(${pushY}px)`;
                }
            });
        } else if (headerSquished.current) {
            headerSquished.current = false;
            const isSpringCollapse = !preDismissRef.current && useSpring;
            const transition = isSpringCollapse ? squishSpring(collapseDur, DEFAULT_COLLAPSE_DUR, bounceVal) : {
                duration: collapseDur * 0.5,
                ease: SMOOTH_EASE
            };
            headerSquishCtrl.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(1, 0, {
                ...transition,
                onUpdate: (v)=>{
                    const scale = 1 - 0.05 * v;
                    const pushY = v * 1;
                    el.style.transform = `scale(${scale}) translateY(${pushY}px)`;
                },
                onComplete: ()=>{
                    el.style.transform = "";
                }
            });
        }
        return ()=>{
            headerSquishCtrl.current?.stop();
        };
    }, [
        showBody,
        dismissing,
        actionSuccess,
        prefersReducedMotion,
        expandDur,
        collapseDur,
        useSpring
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const ol = wrapper.closest("[data-sonner-toast]")?.parentElement;
        if (!ol) return;
        const unregister = registerSonnerObserver(ol, ()=>{
            syncSonnerHeights(wrapper, true);
        });
        const expandObs = new MutationObserver((mutations)=>{
            for (const m of mutations){
                if (m.type === "attributes" && m.attributeName === "data-expanded" && m.target.getAttribute("data-expanded") === "true") {
                    syncSonnerHeights(wrapper, true);
                    break;
                }
            }
        });
        expandObs.observe(ol, {
            attributes: true,
            attributeFilter: [
                "data-expanded"
            ],
            subtree: true
        });
        return ()=>{
            unregister();
            expandObs.disconnect();
        };
    }, []);
    const handleActionClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!effectiveAction) return;
        if (effectiveAction.successLabel) {
            expandedDimsRef.current = {
                ...aDims.current
            };
            collapsingRef.current = true;
            setActionSuccess(effectiveAction.successLabel);
        }
        try {
            effectiveAction.onClick();
        } catch  {}
    }, [
        effectiveAction
    ]);
    const SWIPE_THRESHOLD = 100;
    const swipeStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [swipeOffsetX, setSwipeOffsetX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const isSwipingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!getGooeySwipeToDismiss()) return;
        const touch = e.touches[0];
        swipeStartRef.current = {
            x: touch.clientX,
            y: touch.clientY
        };
        isSwipingRef.current = false;
    }, []);
    const handleTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!swipeStartRef.current || !getGooeySwipeToDismiss()) return;
        const touch = e.touches[0];
        const dx = touch.clientX - swipeStartRef.current.x;
        const dy = touch.clientY - swipeStartRef.current.y;
        if (!isSwipingRef.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
            swipeStartRef.current = null;
            return;
        }
        if (!isSwipingRef.current && Math.abs(dx) > 10) {
            isSwipingRef.current = true;
        }
        if (isSwipingRef.current) {
            setSwipeOffsetX(dx);
        }
    }, []);
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!getGooeySwipeToDismiss()) {
            swipeStartRef.current = null;
            return;
        }
        if (isSwipingRef.current && Math.abs(swipeOffsetX) >= SWIPE_THRESHOLD && toastId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(toastId);
        }
        swipeStartRef.current = null;
        isSwipingRef.current = false;
        setSwipeOffsetX(0);
    }, [
        swipeOffsetX,
        toastId
    ]);
    const swipeOpacity = swipeOffsetX !== 0 ? Math.max(0, 1 - Math.abs(swipeOffsetX) / (SWIPE_THRESHOLD * 1.5)) : 1;
    const swipeTranslate = swipeOffsetX !== 0 ? `translateX(${swipeOffsetX}px)` : "";
    const renderIcon = ()=>{
        if (!actionSuccess && icon) return icon;
        if (isLoading) return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SpinnerIcon, {
            size: 18,
            className: styles.spinnerSpin
        });
        const IconComponent = phaseIconMap[effectivePhase];
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(IconComponent, {
            size: 18
        });
    };
    const iconTransition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>prefersReducedMotion ? {
            duration: 0.01
        } : {
            duration: 0.2
        }, [
        prefersReducedMotion
    ]);
    const iconEl = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: `${styles.iconWrapper}${classNames?.icon ? ` ${classNames.icon}` : ""}`,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            mode: "wait",
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: prefersReducedMotion ? false : {
                    opacity: 0,
                    scale: 0.5
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: 0.5
                },
                transition: iconTransition,
                children: renderIcon()
            }, isLoading ? "spinner" : effectivePhase)
        })
    });
    const titleEl = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
        className: `${styles.title}${classNames?.title ? ` ${classNames.title}` : ""}`,
        children: effectiveTitle
    });
    const createdAtRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(/* @__PURE__ */ new Date());
    const timestampStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>createdAtRef.current.toLocaleTimeString(void 0, {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        }), []);
    const iconAndTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            iconEl,
            titleEl
        ]
    });
    const basePositionStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>isCenter ? {
            margin: "0 auto"
        } : isRight ? {
            marginLeft: "auto",
            transform: "scaleX(-1)"
        } : {}, [
        isCenter,
        isRight
    ]);
    const wrapperStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (swipeTranslate) {
            return {
                ...basePositionStyle,
                transform: (basePositionStyle.transform ? basePositionStyle.transform + " " : "") + swipeTranslate,
                opacity: swipeOpacity,
                transition: "none"
            };
        }
        return Object.keys(basePositionStyle).length > 0 ? basePositionStyle : void 0;
    }, [
        basePositionStyle,
        swipeTranslate,
        swipeOpacity
    ]);
    const contentStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>isCenter ? {
            textAlign: "center"
        } : isRight ? {
            transform: "scaleX(-1)",
            textAlign: "right"
        } : {
            textAlign: "left"
        }, [
        isCenter,
        isRight
    ]);
    const handleMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        hoveredRef.current = true;
        setHovered(true);
    }, []);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        hoveredRef.current = false;
        setHovered(false);
    }, []);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        ref: wrapperRef,
        className: `${styles.wrapper}${classNames?.wrapper ? ` ${classNames.wrapper}` : ""}`,
        style: wrapperStyle,
        role: effectivePhase === "error" || effectivePhase === "warning" ? "alert" : "status",
        "aria-live": effectivePhase === "error" || effectivePhase === "warning" ? "assertive" : "polite",
        "aria-atomic": "true",
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        "data-center": isCenter || void 0,
        "data-theme": theme,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("svg", {
                className: styles.blobSvg,
                "aria-hidden": true,
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                    ref: pathRef,
                    fill: fillColor,
                    stroke: borderColor || "none",
                    strokeWidth: borderColor ? borderWidth ?? 1.5 : 0
                })
            }),
            showCloseButton && effectivePhase !== "loading" && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("button", {
                className: `${styles.closeButton}${(isRight ? closeButtonSetting !== "top-right" : closeButtonSetting === "top-right") ? ` ${styles.closeButtonRight}` : ""}`,
                "aria-label": "Close toast",
                type: "button",
                style: {
                    background: fillColor,
                    borderColor: borderColor || "transparent",
                    borderWidth: borderColor ? borderWidth ?? 1.5 : 0,
                    boxShadow: borderColor ? "none" : "0 1px 4px rgba(0, 0, 0, 0.2)",
                    ...isCenter && closeButtonSetting !== "top-right" ? {
                        top: 6,
                        left: -1
                    } : {}
                },
                onClick: (e)=>{
                    e.stopPropagation();
                    const id = toastId;
                    if (id != null) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(id);
                },
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "12",
                    height: "12",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                            x1: "18",
                            y1: "6",
                            x2: "6",
                            y2: "18"
                        }),
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                            x1: "6",
                            y1: "6",
                            x2: "18",
                            y2: "18"
                        })
                    ]
                })
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                ref: contentRef,
                className: `${styles.content} ${showBody ? styles.contentExpanded : styles.contentCompact}${classNames?.content ? ` ${classNames.content}` : ""}`,
                style: contentStyle,
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                        ref: headerRef,
                        className: `${styles.header} ${titleColorMap[effectivePhase]}${classNames?.header ? ` ${classNames.header}` : ""}`,
                        children: [
                            iconAndTitle,
                            !hasDescription && !hasAction && !actionSuccess && showTimestamp && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                                className: styles.timestamp,
                                children: timestampStr
                            })
                        ]
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showBody && hasDescription && !dismissing && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: `${styles.description}${classNames?.description ? ` ${classNames.description}` : ""}`,
                            style: {
                                textAlign: "left"
                            },
                            initial: prefersReducedMotion ? false : {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            transition: prefersReducedMotion ? {
                                duration: 0.01
                            } : {
                                duration: 0.35,
                                ease: [
                                    0.4,
                                    0,
                                    0.2,
                                    1
                                ]
                            },
                            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px"
                                },
                                children: [
                                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                                        style: {
                                            flex: 1,
                                            minWidth: 0
                                        },
                                        children: effectiveDescription
                                    }),
                                    showTimestamp && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                                        className: styles.timestamp,
                                        children: timestampStr
                                    })
                                ]
                            })
                        }, "description")
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showBody && !hasDescription && hasAction && !dismissing && showTimestamp && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: styles.timestamp,
                            style: {
                                textAlign: "right",
                                marginTop: 8,
                                paddingLeft: 0
                            },
                            initial: prefersReducedMotion ? false : {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            transition: prefersReducedMotion ? {
                                duration: 0.01
                            } : {
                                duration: 0.35,
                                ease: [
                                    0.4,
                                    0,
                                    0.2,
                                    1
                                ]
                            },
                            children: timestampStr
                        }, "timestamp-body")
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showBody && hasAction && effectiveAction && !dismissing && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$13$2e$2$2e$0_react$2d$_69f75a21b55217b4a287640c5195e114$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: `${styles.actionWrapper}${classNames?.actionWrapper ? ` ${classNames.actionWrapper}` : ""}`,
                            initial: prefersReducedMotion ? false : {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            transition: prefersReducedMotion ? {
                                duration: 0.01
                            } : {
                                duration: 0.35,
                                ease: [
                                    0.4,
                                    0,
                                    0.2,
                                    1
                                ],
                                delay: 0.1
                            },
                            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("button", {
                                className: `${styles.actionButton} ${actionColorMap[effectivePhase]}${classNames?.actionButton ? ` ${classNames.actionButton}` : ""}`,
                                onClick: handleActionClick,
                                type: "button",
                                "aria-label": effectiveAction.label,
                                children: effectiveAction.label
                            })
                        }, "action")
                    }),
                    showProgress && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: `${styles.progressWrapper}${hovered || containerHovered ? ` ${styles.progressPaused}` : ""}`,
                        style: {
                            opacity: showBody && !actionSuccess ? 1 : 0
                        },
                        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                            className: `${styles.progressBar} ${progressColorMap[effectivePhase]}`,
                            style: {
                                "--gooey-progress-duration": `${progressDelayRef.current || (timing?.displayDuration ?? DEFAULT_DISPLAY_DURATION)}ms`
                            }
                        })
                    }, progressKey)
                ]
            })
        ]
    });
};
var ToastErrorBoundary = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(){
        super(...arguments);
        this.state = {
            hasError: false
        };
    }
    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }
    componentDidCatch(error, errorInfo) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.error("[GooeyToast] Rendering error:", error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
};
var DEFAULT_EXPANDED_DURATION = 4e3;
function getAnnouncePoliteness(type) {
    return type === "error" || type === "warning" ? "assertive" : "polite";
}
function buildAnnouncementMessage(title, description) {
    if (!description || typeof description !== "string") return title;
    return `${title}: ${description}`;
}
var _activeIds = /* @__PURE__ */ new Map();
var _queue = [];
var _toastCallbacks = /* @__PURE__ */ new Map();
var _autoCloseFlags = /* @__PURE__ */ new Set();
var _manualDismissFlags = /* @__PURE__ */ new Set();
function _getMostRecentActiveId() {
    let last;
    for (const id of _activeIds.keys())last = id;
    return last;
}
function _processQueue() {
    const max = getGooeyVisibleToasts();
    while(_queue.length > 0 && _activeIds.size < max){
        const next = _queue.shift();
        _activeIds.set(next.id, next.type);
        next.create();
    }
}
function _enqueue(entry) {
    const maxQueue = getGooeyMaxQueue();
    const overflow = getGooeyQueueOverflow();
    if (_queue.length >= maxQueue) {
        if (overflow === "drop-newest") return false;
        _queue.shift();
    }
    _queue.push(entry);
    return true;
}
function _onToastDismissed(id) {
    if (!_activeIds.delete(id)) return;
    _toastUpdateListeners.delete(id);
    const cbs = _toastCallbacks.get(id);
    if (cbs) {
        const isAutoClose = _autoCloseFlags.has(id) || !_manualDismissFlags.has(id);
        if (isAutoClose && cbs.onAutoClose) {
            try {
                cbs.onAutoClose(id);
            } catch  {}
        }
        if (cbs.onDismiss) {
            try {
                cbs.onDismiss(id);
            } catch  {}
        }
        _toastCallbacks.delete(id);
    }
    _autoCloseFlags.delete(id);
    _manualDismissFlags.delete(id);
    _processQueue();
}
var _toastUpdateListeners = /* @__PURE__ */ new Map();
function updateGooeyToast(id, options) {
    const listener = _toastUpdateListeners.get(id);
    if (listener) {
        listener(options);
        if (options.type !== void 0 && _activeIds.has(id)) {
            _activeIds.set(id, options.type);
        }
        if (options.title !== void 0) {
            announce(buildAnnouncementMessage(options.title, options.description), options.type ? getAnnouncePoliteness(options.type) : "polite");
        }
    }
}
function GooeyToastWrapper({ initialPhase, title: initialTitle, type: initialType, description: initialDescription, action: initialAction, icon, classNames, fillColor, borderColor, borderWidth, timing, preset, spring, bounce, showProgress, showTimestamp: initialShowTimestamp, toastId, onDismiss, onAutoClose }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (onDismiss || onAutoClose) {
            _toastCallbacks.set(toastId, {
                onDismiss,
                onAutoClose
            });
        }
    }, [
        toastId,
        onDismiss,
        onAutoClose
    ]);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialTitle);
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialType);
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialPhase);
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialDescription);
    const [action, setAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialAction);
    const [currentIcon, setCurrentIcon] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(icon);
    const [showTimestamp, setShowTimestamp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialShowTimestamp ?? true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleUpdate = (opts)=>{
            if (opts.title !== void 0) setTitle(opts.title);
            if (opts.description !== void 0) setDescription(opts.description);
            if (opts.type !== void 0) {
                setType(opts.type);
                setPhase(opts.type);
            }
            if (opts.action !== void 0) setAction(opts.action);
            if ("icon" in opts) setCurrentIcon(opts.icon ?? void 0);
            if (opts.showTimestamp !== void 0) setShowTimestamp(opts.showTimestamp);
        };
        _toastUpdateListeners.set(toastId, handleUpdate);
        return ()=>{
            _toastUpdateListeners.delete(toastId);
        };
    }, [
        toastId
    ]);
    const mountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        mountedRef.current = true;
        return ()=>{
            mountedRef.current = false;
            setTimeout(()=>{
                if (!mountedRef.current) _onToastDismissed(toastId);
            }, 100);
        };
    }, [
        toastId
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ToastErrorBoundary, {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(GooeyToast, {
            title,
            description,
            type,
            action,
            icon: currentIcon,
            phase,
            classNames,
            fillColor,
            borderColor,
            borderWidth,
            timing,
            preset,
            spring,
            bounce,
            showProgress,
            showTimestamp,
            toastId
        })
    });
}
function PromiseToastWrapper({ promise, data, toastId }) {
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("loading");
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(data.loading);
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(data.description?.loading);
    const [action, setAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(void 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (data.onDismiss || data.onAutoClose) {
            _toastCallbacks.set(toastId, {
                onDismiss: data.onDismiss,
                onAutoClose: data.onAutoClose
            });
        }
    }, [
        toastId,
        data.onDismiss,
        data.onAutoClose
    ]);
    const mountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        mountedRef.current = true;
        return ()=>{
            mountedRef.current = false;
            setTimeout(()=>{
                if (!mountedRef.current) _onToastDismissed(toastId);
            }, 100);
        };
    }, [
        toastId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const resetDuration = (hasExpandedContent)=>{
            const baseDuration = data.timing?.displayDuration ?? (hasExpandedContent ? DEFAULT_EXPANDED_DURATION : void 0);
            const collapseDurMs = 0.9 * 1e3;
            const duration = baseDuration != null && hasExpandedContent ? baseDuration + collapseDurMs : baseDuration;
            if (duration != null) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].custom(()=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PromiseToastWrapper, {
                        promise,
                        data,
                        toastId
                    }), {
                    id: toastId,
                    duration
                });
            }
        };
        promise.then((result)=>{
            const desc = typeof data.description?.success === "function" ? data.description.success(result) : data.description?.success;
            const resolvedTitle = typeof data.success === "function" ? data.success(result) : data.success;
            setTitle(resolvedTitle);
            setDescription(desc);
            setAction(data.action?.success);
            setPhase("success");
            resetDuration(Boolean(desc || data.action?.success));
            announce(buildAnnouncementMessage(resolvedTitle, desc), "polite");
        }).catch((err)=>{
            const desc = typeof data.description?.error === "function" ? data.description.error(err) : data.description?.error;
            const resolvedTitle = typeof data.error === "function" ? data.error(err) : data.error;
            setTitle(resolvedTitle);
            setDescription(desc);
            setAction(data.action?.error);
            setPhase("error");
            resetDuration(Boolean(desc || data.action?.error));
            announce(buildAnnouncementMessage(resolvedTitle, desc), "assertive");
        });
    }, []);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ToastErrorBoundary, {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(GooeyToast, {
            title,
            description,
            type: phase === "loading" ? "info" : phase,
            action,
            phase,
            classNames: data.classNames,
            fillColor: data.fillColor,
            borderColor: data.borderColor,
            borderWidth: data.borderWidth,
            timing: data.timing,
            preset: data.preset,
            spring: data.spring,
            bounce: data.bounce,
            showTimestamp: data.showTimestamp ?? true,
            toastId
        })
    });
}
function createGooeyToast(title, type, options) {
    const hasExpandedContent = Boolean(options?.description || options?.action);
    const baseDuration = options?.timing?.displayDuration ?? options?.duration ?? (options?.description ? DEFAULT_EXPANDED_DURATION : void 0);
    const duration = hasExpandedContent ? Infinity : baseDuration;
    const toastId = options?.id ?? Math.random().toString(36).slice(2);
    const create = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].custom(()=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(GooeyToastWrapper, {
                initialPhase: type,
                title,
                type,
                description: options?.description,
                action: options?.action,
                icon: options?.icon,
                classNames: options?.classNames,
                fillColor: options?.fillColor,
                borderColor: options?.borderColor,
                borderWidth: options?.borderWidth,
                timing: options?.timing,
                preset: options?.preset,
                spring: options?.spring,
                bounce: options?.bounce,
                showProgress: options?.showProgress,
                showTimestamp: options?.showTimestamp,
                toastId,
                onDismiss: options?.onDismiss,
                onAutoClose: options?.onAutoClose
            }), {
            duration,
            id: toastId
        });
    };
    if (options?.onDismiss || options?.onAutoClose) {
        _toastCallbacks.set(toastId, {
            onDismiss: options.onDismiss,
            onAutoClose: options.onAutoClose
        });
    }
    announce(buildAnnouncementMessage(title, options?.description), getAnnouncePoliteness(type));
    if (_activeIds.size < getGooeyVisibleToasts()) {
        _activeIds.set(toastId, type);
        create();
    } else {
        _enqueue({
            id: toastId,
            type,
            create
        });
    }
    return toastId;
}
function dismissGooeyToast(idOrFilter) {
    if (idOrFilter != null && typeof idOrFilter === "object") {
        const filterTypes = Array.isArray(idOrFilter.type) ? idOrFilter.type : [
            idOrFilter.type
        ];
        const typesSet = new Set(filterTypes);
        for(let i = _queue.length - 1; i >= 0; i--){
            if (typesSet.has(_queue[i].type)) {
                _queue.splice(i, 1);
            }
        }
        for (const [id, toastType] of _activeIds){
            if (typesSet.has(toastType)) {
                _manualDismissFlags.add(id);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(id);
            }
        }
    } else if (idOrFilter != null) {
        const idx = _queue.findIndex((q)=>q.id === idOrFilter);
        if (idx !== -1) {
            _queue.splice(idx, 1);
            return;
        }
        _manualDismissFlags.add(idOrFilter);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(idOrFilter);
    } else {
        for (const id of _activeIds.keys()){
            _manualDismissFlags.add(id);
        }
        _queue.length = 0;
        _activeIds.clear();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss();
    }
}
var gooeyToast = Object.assign((title, options)=>createGooeyToast(title, "default", options), {
    success: (title, options)=>createGooeyToast(title, "success", options),
    error: (title, options)=>createGooeyToast(title, "error", options),
    warning: (title, options)=>createGooeyToast(title, "warning", options),
    info: (title, options)=>createGooeyToast(title, "info", options),
    promise: (promise, data)=>{
        const id = Math.random().toString(36).slice(2);
        announce(buildAnnouncementMessage(data.loading, data.description?.loading), "polite");
        if (data.onDismiss || data.onAutoClose) {
            _toastCallbacks.set(id, {
                onDismiss: data.onDismiss,
                onAutoClose: data.onAutoClose
            });
        }
        const create = ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].custom(()=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PromiseToastWrapper, {
                    promise,
                    data,
                    toastId: id
                }), {
                id,
                duration: data.timing?.displayDuration != null || data.description ? Infinity : void 0
            });
        };
        if (_activeIds.size < getGooeyVisibleToasts()) {
            _activeIds.set(id, "info");
            create();
        } else {
            _enqueue({
                id,
                type: "info",
                create
            });
        }
        return id;
    },
    dismiss: dismissGooeyToast,
    update: updateGooeyToast
});
function AriaLiveAnnouncer() {
    const [politeMessage, setPoliteMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [assertiveMessage, setAssertiveMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const handleAnnouncement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(({ message, politeness })=>{
        if (politeness === "assertive") {
            setAssertiveMessage("");
            requestAnimationFrame(()=>setAssertiveMessage(message));
        } else {
            setPoliteMessage("");
            requestAnimationFrame(()=>setPoliteMessage(message));
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return subscribeAnnouncements(handleAnnouncement);
    }, [
        handleAnnouncement
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!politeMessage) return;
        const t = setTimeout(()=>setPoliteMessage(""), 7e3);
        return ()=>clearTimeout(t);
    }, [
        politeMessage
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!assertiveMessage) return;
        const t = setTimeout(()=>setAssertiveMessage(""), 7e3);
        return ()=>clearTimeout(t);
    }, [
        assertiveMessage
    ]);
    const visuallyHidden = {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                role: "status",
                "aria-live": "polite",
                "aria-atomic": "true",
                style: visuallyHidden,
                children: politeMessage
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                role: "alert",
                "aria-live": "assertive",
                "aria-atomic": "true",
                style: visuallyHidden,
                children: assertiveMessage
            })
        ]
    });
}
function GooeyToaster({ position = "bottom-right", duration, gap = 14, offset = "24px", theme = "light", toastOptions, expand, closeButton, richColors, visibleToasts, dir, preset, spring, bounce, swipeToDismiss = true, closeOnEscape = true, maxQueue = Infinity, queueOverflow = "drop-oldest", showProgress = false, showTimestamp = true }) {
    const presetConfig = preset ? animationPresets[preset] : void 0;
    const resolvedSpring = spring ?? presetConfig?.spring ?? true;
    const resolvedBounce = bounce ?? presetConfig?.bounce;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyPosition(position);
    }, [
        position
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyDir(dir ?? "ltr");
    }, [
        dir
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyTheme(theme);
    }, [
        theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeySpring(resolvedSpring);
    }, [
        resolvedSpring
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyBounce(resolvedBounce);
    }, [
        resolvedBounce
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeySwipeToDismiss(swipeToDismiss);
    }, [
        swipeToDismiss
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{}, [
        closeOnEscape
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!closeOnEscape) return;
        const handleKeyDown = (e)=>{
            if (e.key === "Escape") {
                const recentId = _getMostRecentActiveId();
                if (recentId != null) {
                    gooeyToast.dismiss(recentId);
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return ()=>document.removeEventListener("keydown", handleKeyDown);
    }, [
        closeOnEscape
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyVisibleToasts(visibleToasts ?? 3);
    }, [
        visibleToasts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyMaxQueue(maxQueue);
    }, [
        maxQueue
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyQueueOverflow(queueOverflow);
    }, [
        queueOverflow
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyShowProgress(showProgress);
    }, [
        showProgress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyCloseButton(closeButton ?? false);
    }, [
        closeButton
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGooeyShowTimestamp(showTimestamp);
    }, [
        showTimestamp
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let expandObs = null;
        let currentOl = null;
        const syncFromExpanded = (ol)=>{
            const anyExpanded = ol.querySelector('[data-sonner-toast][data-expanded="true"]') !== null;
            setContainerHovered(anyExpanded);
        };
        const attach = (ol)=>{
            if (ol === currentOl) return;
            expandObs?.disconnect();
            currentOl = ol;
            expandObs = new MutationObserver(()=>syncFromExpanded(ol));
            expandObs.observe(ol, {
                attributes: true,
                attributeFilter: [
                    "data-expanded"
                ],
                subtree: true
            });
            syncFromExpanded(ol);
        };
        const el = document.querySelector("[data-sonner-toaster]");
        if (el) attach(el);
        let bodyRafId = 0;
        const bodyObs = new MutationObserver(()=>{
            if (bodyRafId) return;
            bodyRafId = requestAnimationFrame(()=>{
                bodyRafId = 0;
                const found = document.querySelector("[data-sonner-toaster]");
                if (found) {
                    attach(found);
                } else if (currentOl) {
                    expandObs?.disconnect();
                    currentOl = null;
                    setContainerHovered(false);
                }
            });
        });
        bodyObs.observe(document.body, {
            childList: true,
            subtree: true
        });
        return ()=>{
            if (bodyRafId) cancelAnimationFrame(bodyRafId);
            bodyObs.disconnect();
            expandObs?.disconnect();
            setContainerHovered(false);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const el = document.createElement("div");
        el.setAttribute("data-gooey-toast-css", "");
        el.style.position = "absolute";
        el.style.width = "0";
        el.style.height = "0";
        el.style.overflow = "hidden";
        el.style.pointerEvents = "none";
        document.body.appendChild(el);
        const value = getComputedStyle(el).getPropertyValue("--gooey-toast");
        document.body.removeChild(el);
        if (!value) {
            console.warn('[gooey-toast] Styles not found. Make sure to import the CSS:\n\n  import "goey-toast/styles.css";\n');
        }
    }, []);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
                position,
                duration,
                gap,
                offset,
                theme,
                toastOptions: {
                    unstyled: true,
                    ...toastOptions
                },
                expand,
                closeButton: false,
                richColors,
                visibleToasts: 99,
                dir
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(AriaLiveAnnouncer, {})
        ]
    });
}
;
 //# sourceMappingURL=index.js.map
 //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=0a7c9_goey-toast_dist_index_ce706b2b.js.map