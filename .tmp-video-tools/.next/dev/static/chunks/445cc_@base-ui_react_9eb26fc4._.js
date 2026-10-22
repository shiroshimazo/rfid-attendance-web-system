(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popups/popupTriggerMap.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PopupTriggerMap",
    ()=>PopupTriggerMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Development-only reverse index of element to registered id, keyed by the owning map.
 *
 * Registration would otherwise have to scan every entry to detect an element claimed by two ids,
 * making the mount of many triggers sharing one handle quadratic. Kept module-scoped, lazily
 * initialized, and read only from `process.env.NODE_ENV` guards so production builds drop it along
 * with the checks.
 */ let devElementIdsByMap;
function getDevElementIds(map) {
    devElementIdsByMap ??= new WeakMap();
    let elementIds = devElementIdsByMap.get(map);
    if (!elementIds) {
        elementIds = new WeakMap();
        devElementIdsByMap.set(map, elementIds);
    }
    return elementIds;
}
class PopupTriggerMap {
    constructor(){
        this.idMap = new Map();
    }
    /**
   * Adds a trigger element with the given ID.
   *
   * Note: The provided element is assumed to not be registered under multiple IDs.
   */ add(id, element) {
        if ("TURBOPACK compile-time truthy", 1) {
            const elementIds = getDevElementIds(this);
            const existingId = elementIds.get(element);
            if (existingId !== undefined && existingId !== id) {
                // TODO: fix mui/no-guarded-throw
                // eslint-disable-next-line mui/no-guarded-throw
                throw new Error('Base UI: A trigger element cannot be registered under multiple IDs in PopupTriggerMap.');
            }
            // Reusing an id for a different element evicts the previous one, so it must lose its claim
            // on the id or a later registration under a different id would be reported as a duplicate.
            const previousElement = this.idMap.get(id);
            if (previousElement !== undefined && previousElement !== element) {
                elementIds.delete(previousElement);
            }
            elementIds.set(element, id);
        }
        this.idMap.set(id, element);
    }
    /**
   * Removes the trigger element with the given ID.
   */ delete(id) {
        if ("TURBOPACK compile-time truthy", 1) {
            const element = this.idMap.get(id);
            if (element !== undefined) {
                devElementIdsByMap?.get(this)?.delete(element);
            }
        }
        this.idMap.delete(id);
    }
    /**
   * Whether the given element is registered as a trigger.
   */ hasElement(element) {
        for (const registered of this.idMap.values()){
            if (registered === element) {
                return true;
            }
        }
        return false;
    }
    /**
   * Whether there is a registered trigger element matching the given predicate.
   */ hasMatchingElement(predicate) {
        for (const element of this.idMap.values()){
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }
    /**
   * Returns the trigger element associated with the given ID, or undefined if no such element exists.
   */ getById(id) {
        return this.idMap.get(id);
    }
    /**
   * Returns an iterable of all registered trigger entries, where each entry is a tuple of [id, element].
   */ entries() {
        return this.idMap.entries();
    }
    /**
   * Returns an iterable of all registered trigger elements.
   */ elements() {
        return this.idMap.values();
    }
    /**
   * Returns the number of registered trigger elements.
   */ get size() {
        return this.idMap.size;
    }
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/resolveRef.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * If the provided argument is a ref object, returns its `current` value.
 * Otherwise, returns the argument itself.
 */ __turbopack_context__.s([
    "resolveRef",
    ()=>resolveRef
]);
function resolveRef(maybeRef) {
    if (maybeRef == null) {
        return maybeRef;
    }
    return 'current' in maybeRef ? maybeRef.current : maybeRef;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/stringifyLocale.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stringifyLocale",
    ()=>stringifyLocale
]);
function stringifyLocale(locale) {
    if (Array.isArray(locale)) {
        return locale.map((value)=>stringifyLocale(value)).join(',');
    }
    if (locale == null) {
        return '';
    }
    return String(locale);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/useOpenInteractionType.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOpenInteractionType",
    ()=>useOpenInteractionType,
    "useOpenMethodTriggerProps",
    ()=>useOpenMethodTriggerProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useEnhancedClickHandler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useEnhancedClickHandler.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useValueChanged.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function useOpenMethodTriggerProps(open, setOpenMethod) {
    const handleTriggerClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useOpenMethodTriggerProps.useStableCallback[handleTriggerClick]": (_, interactionType)=>{
            const isOpen = typeof open === 'function' ? open() : open;
            if (!isOpen) {
                setOpenMethod(interactionType || (// On iOS Safari, the hitslop around touch targets means tapping outside an element's
                // bounds does not fire `pointerdown` but does fire `mousedown`. The `interactionType`
                // will be "" in that case.
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].os.ios ? 'touch' : ''));
            }
        }
    }["useOpenMethodTriggerProps.useStableCallback[handleTriggerClick]"]);
    const { onClick, onPointerDown } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useEnhancedClickHandler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnhancedClickHandler"])(handleTriggerClick);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useOpenMethodTriggerProps.useMemo": ()=>({
                onClick,
                onPointerDown
            })
    }["useOpenMethodTriggerProps.useMemo"], [
        onClick,
        onPointerDown
    ]);
}
function useOpenInteractionType(open) {
    const [openMethod, setOpenMethod] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const triggerProps = useOpenMethodTriggerProps(open, setOpenMethod);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueChanged"])(open, {
        "useOpenInteractionType.useValueChanged": (previousOpen)=>{
            if (previousOpen && !open) {
                setOpenMethod(null);
            }
        }
    }["useOpenInteractionType.useValueChanged"]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useOpenInteractionType.useMemo": ()=>({
                openMethod,
                triggerProps
            })
    }["useOpenInteractionType.useMemo"], [
        openMethod,
        triggerProps
    ]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/scrollable.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findScrollableTouchTarget",
    ()=>findScrollableTouchTarget,
    "hasScrollableAncestor",
    ()=>hasScrollableAncestor,
    "isScrollable",
    ()=>isScrollable,
    "isScrollableX",
    ()=>isScrollableX,
    "isScrollableY",
    ()=>isScrollableY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
;
function isScrollableY(element, allowOverflowIntent = false) {
    const { overflowY } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element);
    if (overflowY !== 'auto' && overflowY !== 'scroll') {
        return false;
    }
    // When `allowOverflowIntent` is true, a container that overflows only once extra space is
    // added (e.g. drawer keyboard scroll slack) still counts, as long as it has layout size on
    // the axis.
    return allowOverflowIntent ? element.clientHeight > 0 : element.scrollHeight > element.clientHeight;
}
function isScrollableX(element, allowOverflowIntent = false) {
    const { overflowX } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element);
    if (overflowX !== 'auto' && overflowX !== 'scroll') {
        return false;
    }
    return allowOverflowIntent ? element.clientWidth > 0 : element.scrollWidth > element.clientWidth;
}
function isScrollable(element, axis, allowOverflowIntent = false) {
    return axis === 'vertical' ? isScrollableY(element, allowOverflowIntent) : isScrollableX(element, allowOverflowIntent);
}
function hasScrollableAncestor(target, root, axes) {
    // `getParentNode` crosses shadow boundaries (and slots), so a target inside a shadow root
    // still walks up to scrollable ancestors in the light DOM.
    let node = target;
    while((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(node) && node !== root && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastTraversableNode"])(node)){
        for (const axis of axes){
            if (isScrollable(node, axis)) {
                return true;
            }
        }
        node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(node);
    }
    return false;
}
function findScrollableTouchTarget(target, root, axis = 'vertical', allowOverflowIntent = false) {
    // `getParentNode` crosses shadow boundaries (and slots), so a target inside a shadow root
    // still reaches a scrollable ancestor in the light DOM.
    let node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(target) ? target : null;
    while((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(node) && node !== root && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastTraversableNode"])(node)){
        if (isScrollable(node, axis, allowOverflowIntent)) {
            return node;
        }
        node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(node);
    }
    return isScrollable(root, axis, allowOverflowIntent) ? root : null;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popups/popupStoreUtils.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FOCUSABLE_POPUP_PROPS",
    ()=>FOCUSABLE_POPUP_PROPS,
    "PopupHandleAttachment",
    ()=>PopupHandleAttachment,
    "applyPopupOpenChange",
    ()=>applyPopupOpenChange,
    "attachPreventUnmountOnClose",
    ()=>attachPreventUnmountOnClose,
    "createDefaultInitialFocus",
    ()=>createDefaultInitialFocus,
    "setPopupOpenState",
    ()=>setPopupOpenState,
    "useImplicitActiveTrigger",
    ()=>useImplicitActiveTrigger,
    "useOpenStateTransitions",
    ()=>useOpenStateTransitions,
    "usePopupInteractionProps",
    ()=>usePopupInteractionProps,
    "usePopupRootStore",
    ()=>usePopupRootStore,
    "usePopupRootSync",
    ()=>usePopupRootSync,
    "useTriggerDataForwarding",
    ()=>useTriggerDataForwarding,
    "useTriggerRegistration",
    ()=>useTriggerRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/utils/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingTree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/components/FloatingTree.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useSyncedFloatingRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/useSyncedFloatingRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useTransitionStatus.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
'use client';
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
;
;
const FOCUSABLE_POPUP_PROPS = {
    tabIndex: -1,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUSABLE_ATTRIBUTE"]]: ''
};
function createDefaultInitialFocus(popupRef) {
    return (interactionType)=>interactionType === 'touch' ? popupRef.current : true;
}
function usePopupRootStore(createStore, treatPopupAsFloatingElement = false) {
    const floatingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const nested = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingTree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFloatingParentNodeId"])() != null;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])({
        "usePopupRootStore.useRefWithInit": ()=>createStore(floatingId, nested)
    }["usePopupRootStore.useRefWithInit"]).current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useSyncedFloatingRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncedFloatingRootContext"])({
        popupStore: store,
        treatPopupAsFloatingElement,
        floatingRootContext: store.state.floatingRootContext,
        floatingId,
        nested,
        onOpenChange: store.setOpen
    });
    return store;
}
function PopupHandleAttachment({ handle, store }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "PopupHandleAttachment.useIsoLayoutEffect": ()=>{
            return handle.attachStore(store);
        }
    }["PopupHandleAttachment.useIsoLayoutEffect"], [
        handle,
        store
    ]);
    return null;
}
function useTriggerRegistration(id, store) {
    // Keep track of the currently registered element to unregister it on unmount or id change.
    const registeredElementIdRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const registeredElementRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useTriggerRegistration.useCallback": (element)=>{
            if (id === undefined) {
                return;
            }
            let shouldSyncTriggerCount = false;
            if (registeredElementIdRef.current !== null) {
                const registeredId = registeredElementIdRef.current;
                const registeredElement = registeredElementRef.current;
                const currentElement = store.context.triggerElements.getById(registeredId);
                if (registeredElement && currentElement === registeredElement) {
                    store.context.triggerElements.delete(registeredId);
                    shouldSyncTriggerCount = true;
                }
                registeredElementIdRef.current = null;
                registeredElementRef.current = null;
            }
            if (element !== null) {
                registeredElementIdRef.current = id;
                registeredElementRef.current = element;
                store.context.triggerElements.add(id, element);
                shouldSyncTriggerCount = true;
            }
            if (shouldSyncTriggerCount) {
                const triggerCount = store.context.triggerElements.size;
                if (store.select('open') && store.state.triggerCount !== triggerCount) {
                    store.set('triggerCount', triggerCount);
                }
            }
        }
    }["useTriggerRegistration.useCallback"], [
        store,
        id
    ]);
}
function setPopupOpenState(state, open, trigger, preventUnmountOnClose = false) {
    if (open) {
        // Opening starts a new close cycle, so clear any previous request to keep the popup mounted.
        state.preventUnmountingOnClose = false;
    } else if (preventUnmountOnClose) {
        state.preventUnmountingOnClose = true;
    }
    const triggerId = trigger?.id ?? null;
    // If a popup is closing, the `trigger` may be undefined.
    // We want to keep the previous value so that exit animations are played and focus is returned correctly.
    if (triggerId || open) {
        state.activeTriggerId = triggerId;
        state.activeTriggerElement = trigger ?? null;
    }
}
function attachPreventUnmountOnClose(eventDetails) {
    let preventUnmountOnClose = false;
    eventDetails.preventUnmountOnClose = ()=>{
        preventUnmountOnClose = true;
    };
    return ()=>preventUnmountOnClose;
}
function applyPopupOpenChange(store, nextOpen, eventDetails, options = {}) {
    const reason = eventDetails.reason;
    const isHover = reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].triggerHover;
    const isFocusOpen = nextOpen && reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].triggerFocus;
    const isDismissClose = !nextOpen && (reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].triggerPress || reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].escapeKey);
    const shouldPreventUnmountOnClose = attachPreventUnmountOnClose(eventDetails);
    store.context.onOpenChange?.(nextOpen, eventDetails);
    if (eventDetails.isCanceled) {
        return;
    }
    options.onBeforeDispatch?.();
    store.state.floatingRootContext.dispatchOpenChange(nextOpen, eventDetails);
    const changeState = ()=>{
        // Spread `extraState` first so `open` always reflects `nextOpen`, keeping it in
        // sync with the value already passed to `dispatchOpenChange`/`setPopupOpenState`.
        const updatedState = {
            ...options.extraState,
            open: nextOpen
        };
        if (isFocusOpen) {
            updatedState.instantType = 'focus';
        } else if (isDismissClose) {
            updatedState.instantType = 'dismiss';
        } else if (isHover) {
            updatedState.instantType = undefined;
        }
        setPopupOpenState(updatedState, nextOpen, eventDetails.trigger, shouldPreventUnmountOnClose());
        store.update(updatedState);
    };
    if (isHover) {
        // Flush synchronously for hover so `node.getAnimations()` sees the new state.
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"](changeState);
    } else {
        changeState();
    }
}
function useTriggerDataForwarding(triggerId, triggerElementRef, store, stateUpdates) {
    const isMountedByThisTrigger = store.useState('isMountedByTrigger', triggerId);
    const baseRegisterTrigger = useTriggerRegistration(triggerId, store);
    // Applies trigger-owned state (active-trigger ownership and payload) when the trigger registers.
    // Stable so payload/`stateUpdates` changes do not change the ref identity (which would needlessly
    // churn registration); it reads the latest closure values when invoked.
    const applyTriggerData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useTriggerDataForwarding.useStableCallback[applyTriggerData]": (element)=>{
            const open = store.select('open');
            const activeTriggerId = store.select('activeTriggerId');
            if (activeTriggerId === triggerId) {
                store.update({
                    activeTriggerElement: element,
                    ...open ? stateUpdates : null
                });
                return;
            }
            if (activeTriggerId == null && open) {
                // If a popup is already open, a detached trigger can mount before any active trigger
                // has been established. Claim the first registered trigger so trigger-owned focus
                // management and ARIA relationships work.
                store.update({
                    activeTriggerId: triggerId,
                    activeTriggerElement: element,
                    ...stateUpdates
                });
            }
        }
    }["useTriggerDataForwarding.useStableCallback[applyTriggerData]"]);
    // Intentionally NOT stable. Its identity is derived from `baseRegisterTrigger`, which is keyed on
    // `[store, id]`, so when a handle-backed trigger's store pointer swaps the merged ref re-fires —
    // unregistering from the previous store and registering into the new one. This lets a detached
    // trigger follow its handle's currently-attached store across attach/detach/remount. (A stable
    // callback would keep its identity and never re-fire on a store swap.)
    const registerTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useTriggerDataForwarding.useCallback[registerTrigger]": (element)=>{
            baseRegisterTrigger(element);
            if (element) {
                applyTriggerData(element);
            }
        }
    }["useTriggerDataForwarding.useCallback[registerTrigger]"], [
        baseRegisterTrigger,
        applyTriggerData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useTriggerDataForwarding.useIsoLayoutEffect": ()=>{
            if (isMountedByThisTrigger) {
                store.update({
                    activeTriggerElement: triggerElementRef.current,
                    ...stateUpdates
                });
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useTriggerDataForwarding.useIsoLayoutEffect"], [
        isMountedByThisTrigger,
        store,
        triggerElementRef,
        ...Object.values(stateUpdates)
    ]);
    return {
        registerTrigger,
        isMountedByThisTrigger
    };
}
function useImplicitActiveTrigger(store, options = {}) {
    const { closeOnActiveTriggerUnmount = false } = options;
    // Distinguishes a trigger that unmounted from a new active trigger that has not hydrated yet.
    const resolvedActiveTriggerIdRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const open = store.useState('open');
    const reactiveTriggerCount = store.useState('triggerCount');
    // Subscribe to the active trigger id so the reconciliation below reruns when ownership moves to
    // another trigger while the popup stays open (e.g. a focus/hover handoff between triggers).
    const activeTriggerId = store.useState('activeTriggerId');
    // Subscribe to the active trigger element so the reconciliation reruns when a pending active
    // trigger registers in a commit where the trigger count nets out unchanged (registration
    // forwards the element to the store when the registering trigger matches the active id).
    // Without this, the id would never be marked resolved and a later genuine unmount would be
    // misclassified as pending, disabling `closeOnActiveTriggerUnmount`.
    const reactiveActiveTriggerElement = store.useState('activeTriggerElement');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useImplicitActiveTrigger.useIsoLayoutEffect": ()=>{
            if (!open) {
                resolvedActiveTriggerIdRef.current = null;
                if (store.state.triggerCount !== 0) {
                    store.set('triggerCount', 0);
                }
                return;
            }
            const triggerCount = store.context.triggerElements.size;
            const stateUpdates = {};
            if (store.state.triggerCount !== triggerCount) {
                stateUpdates.triggerCount = triggerCount;
            }
            const currentActiveTriggerId = store.select('activeTriggerId');
            let lostActiveTriggerId = null;
            if (currentActiveTriggerId) {
                const activeTriggerElement = store.context.triggerElements.getById(currentActiveTriggerId);
                if (!activeTriggerElement) {
                    for (const [triggerId, triggerElement] of store.context.triggerElements.entries()){
                        if (triggerElement === store.state.activeTriggerElement) {
                            stateUpdates.activeTriggerId = triggerId;
                            stateUpdates.activeTriggerElement = triggerElement;
                            resolvedActiveTriggerIdRef.current = triggerId;
                            break;
                        }
                    }
                    if (stateUpdates.activeTriggerId === undefined) {
                        if (resolvedActiveTriggerIdRef.current === currentActiveTriggerId) {
                            lostActiveTriggerId = currentActiveTriggerId;
                        } else {
                            resolvedActiveTriggerIdRef.current = null;
                        }
                    }
                } else {
                    resolvedActiveTriggerIdRef.current = currentActiveTriggerId;
                    if (activeTriggerElement !== store.state.activeTriggerElement) {
                        stateUpdates.activeTriggerElement = activeTriggerElement;
                    }
                }
            } else {
                resolvedActiveTriggerIdRef.current = null;
            }
            if (!lostActiveTriggerId && !currentActiveTriggerId && triggerCount === 1) {
                const iteratorResult = store.context.triggerElements.entries().next();
                if (!iteratorResult.done) {
                    const [implicitTriggerId, implicitTriggerElement] = iteratorResult.value;
                    stateUpdates.activeTriggerId = implicitTriggerId;
                    stateUpdates.activeTriggerElement = implicitTriggerElement;
                    resolvedActiveTriggerIdRef.current = implicitTriggerId;
                }
            }
            if (stateUpdates.triggerCount !== undefined || stateUpdates.activeTriggerId !== undefined || stateUpdates.activeTriggerElement !== undefined) {
                store.update(stateUpdates);
            }
            if (lostActiveTriggerId) {
                if (closeOnActiveTriggerUnmount) {
                    // Defer so a same-tick replacement trigger with the same id can register first.
                    queueMicrotask({
                        "useImplicitActiveTrigger.useIsoLayoutEffect": ()=>{
                            if (store.select('open') && store.select('activeTriggerId') === lostActiveTriggerId && !store.context.triggerElements.getById(lostActiveTriggerId)) {
                                const eventDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none);
                                store.setOpen(false, eventDetails);
                                // If closing is canceled, keep the previous active trigger ownership for the
                                // still-open popup instead of claiming another trigger implicitly.
                                if (!eventDetails.isCanceled) {
                                    store.update({
                                        activeTriggerId: null,
                                        activeTriggerElement: null
                                    });
                                }
                            }
                        }
                    }["useImplicitActiveTrigger.useIsoLayoutEffect"]);
                }
            }
        }
    }["useImplicitActiveTrigger.useIsoLayoutEffect"], [
        open,
        store,
        reactiveTriggerCount,
        activeTriggerId,
        reactiveActiveTriggerElement,
        closeOnActiveTriggerUnmount
    ]);
}
function useOpenStateTransitions(open, store, onUnmount) {
    const { mounted, setMounted, transitionStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransitionStatus"])(open);
    const preventUnmountingOnClose = store.useState('preventUnmountingOnClose');
    // Opening starts a new close cycle. Clear during render so the close-completion hook below
    // reads the synchronized value on the same pass.
    const syncedPreventUnmountingOnClose = open ? false : preventUnmountingOnClose;
    store.useSyncedValues({
        mounted,
        transitionStatus,
        preventUnmountingOnClose: syncedPreventUnmountingOnClose
    });
    const forceUnmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useOpenStateTransitions.useStableCallback[forceUnmount]": ()=>{
            setMounted(false);
            store.update({
                activeTriggerId: null,
                activeTriggerElement: null,
                mounted: false,
                preventUnmountingOnClose: false
            });
            onUnmount?.();
            store.context.onOpenChangeComplete?.(false);
        }
    }["useOpenStateTransitions.useStableCallback[forceUnmount]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenChangeComplete"])({
        enabled: mounted && !open && !syncedPreventUnmountingOnClose,
        open,
        ref: store.context.popupRef,
        onComplete () {
            if (!open) {
                forceUnmount();
            }
        }
    });
    return {
        forceUnmount,
        transitionStatus
    };
}
function usePopupInteractionProps(store, statePart) {
    store.useSyncedValues(statePart);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupInteractionProps.useIsoLayoutEffect": ()=>({
                "usePopupInteractionProps.useIsoLayoutEffect": ()=>{
                    store.update({
                        activeTriggerProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
                        inactiveTriggerProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
                        popupProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"]
                    });
                }
            })["usePopupInteractionProps.useIsoLayoutEffect"]
    }["usePopupInteractionProps.useIsoLayoutEffect"], [
        store
    ]);
}
function usePopupRootSync(store, open) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupRootSync.useIsoLayoutEffect": ()=>{
            if (!open && store.state.openMethod !== null) {
                store.set('openMethod', null);
            }
        }
    }["usePopupRootSync.useIsoLayoutEffect"], [
        open,
        store
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupRootSync.useIsoLayoutEffect": ()=>({
                "usePopupRootSync.useIsoLayoutEffect": ()=>{
                    if (store.state.openMethod !== null) {
                        store.set('openMethod', null);
                    }
                }
            })["usePopupRootSync.useIsoLayoutEffect"]
    }["usePopupRootSync.useIsoLayoutEffect"], [
        store
    ]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/resolveClassName.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * If the provided className is a string, it will be returned as is.
 * Otherwise, the function will call the className function with the state as the first argument.
 *
 * @param className
 * @param state
 */ __turbopack_context__.s([
    "resolveClassName",
    ()=>resolveClassName
]);
function resolveClassName(className, state) {
    return typeof className === 'function' ? className(state) : className;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/resolveStyle.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * If the provided style is an object, it will be returned as is.
 * Otherwise, the function will call the style function with the state as the first argument.
 *
 * @param style
 * @param state
 */ __turbopack_context__.s([
    "resolveStyle",
    ()=>resolveStyle
]);
function resolveStyle(style, state) {
    return typeof style === 'function' ? style(state) : style;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/useRegisteredLabelId.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRegisteredLabelId",
    ()=>useRegisteredLabelId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useBaseUiId.mjs [app-client] (ecmascript)");
'use client';
;
;
function useRegisteredLabelId(idProp, setLabelId) {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBaseUiId"])(idProp);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useRegisteredLabelId.useIsoLayoutEffect": ()=>{
            setLabelId(id);
            return ({
                "useRegisteredLabelId.useIsoLayoutEffect": ()=>{
                    setLabelId({
                        "useRegisteredLabelId.useIsoLayoutEffect": (currentId)=>currentId === id ? undefined : currentId
                    }["useRegisteredLabelId.useIsoLayoutEffect"]);
                }
            })["useRegisteredLabelId.useIsoLayoutEffect"];
        }
    }["useRegisteredLabelId.useIsoLayoutEffect"], [
        id,
        setLabelId
    ]);
    return id;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/resolveAriaLabelledBy.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDefaultLabelId",
    ()=>getDefaultLabelId,
    "resolveAriaLabelledBy",
    ()=>resolveAriaLabelledBy
]);
'use client';
function getDefaultLabelId(id) {
    return id == null ? undefined : `${id}-label`;
}
function resolveAriaLabelledBy(fieldLabelId, localLabelId) {
    return fieldLabelId ?? localLabelId;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CommonPopupDataAttributes",
    ()=>CommonPopupDataAttributes,
    "CommonTriggerDataAttributes",
    ()=>CommonTriggerDataAttributes,
    "popupStateMapping",
    ()=>popupStateMapping,
    "popupTransitionStateMapping",
    ()=>popupTransitionStateMapping,
    "pressableTriggerOpenStateMapping",
    ()=>pressableTriggerOpenStateMapping,
    "triggerOpenStateMapping",
    ()=>triggerOpenStateMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs [app-client] (ecmascript)");
;
let CommonPopupDataAttributes = function(CommonPopupDataAttributes) {
    /**
   * Present when the popup is open.
   */ CommonPopupDataAttributes["open"] = "data-open";
    /**
   * Present when the popup is closed.
   */ CommonPopupDataAttributes["closed"] = "data-closed";
    /**
   * Present when the popup begins animating in.
   */ CommonPopupDataAttributes[CommonPopupDataAttributes["startingStyle"] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransitionStatusDataAttributes"].startingStyle] = "startingStyle";
    /**
   * Present when the popup is animating out.
   */ CommonPopupDataAttributes[CommonPopupDataAttributes["endingStyle"] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransitionStatusDataAttributes"].endingStyle] = "endingStyle";
    /**
   * Present when the anchor is hidden.
   */ CommonPopupDataAttributes["anchorHidden"] = "data-anchor-hidden";
    /**
   * Indicates which side the popup is positioned relative to the trigger.
   * @type { 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'}
   */ CommonPopupDataAttributes["side"] = "data-side";
    /**
   * Indicates how the popup is aligned relative to specified side.
   * @type {'start' | 'center' | 'end'}
   */ CommonPopupDataAttributes["align"] = "data-align";
    return CommonPopupDataAttributes;
}({});
let CommonTriggerDataAttributes = /*#__PURE__*/ function(CommonTriggerDataAttributes) {
    /**
   * Present when the popup is open.
   */ CommonTriggerDataAttributes["popupOpen"] = "data-popup-open";
    /**
   * Present when a pressable trigger is pressed.
   */ CommonTriggerDataAttributes["pressed"] = "data-pressed";
    return CommonTriggerDataAttributes;
}({});
// Literal keys (instead of enum member references) keep the docs-only enums above
// tree-shakeable: a runtime reference would retain the whole enum IIFE in every bundle.
const TRIGGER_HOOK = {
    'data-popup-open': ''
};
const PRESSABLE_TRIGGER_HOOK = {
    'data-popup-open': '',
    'data-pressed': ''
};
const POPUP_OPEN_HOOK = {
    'data-open': ''
};
const POPUP_CLOSED_HOOK = {
    'data-closed': ''
};
const ANCHOR_HIDDEN_HOOK = {
    'data-anchor-hidden': ''
};
const triggerOpenStateMapping = {
    open (value) {
        if (value) {
            return TRIGGER_HOOK;
        }
        return null;
    }
};
const pressableTriggerOpenStateMapping = {
    open (value) {
        if (value) {
            return PRESSABLE_TRIGGER_HOOK;
        }
        return null;
    }
};
const popupStateMapping = {
    open (value) {
        if (value) {
            return POPUP_OPEN_HOOK;
        }
        return POPUP_CLOSED_HOOK;
    },
    anchorHidden (value) {
        if (value) {
            return ANCHOR_HIDDEN_HOOK;
        }
        return null;
    }
};
const popupTransitionStateMapping = {
    ...popupStateMapping,
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transitionStatusMapping"]
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/useFocusableWhenDisabled.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFocusableWhenDisabled",
    ()=>useFocusableWhenDisabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
function useFocusableWhenDisabled(parameters) {
    const { focusableWhenDisabled, disabled, composite = false, tabIndex: tabIndexProp = 0, isNativeButton } = parameters;
    const isFocusableComposite = composite && focusableWhenDisabled !== false;
    const isNonFocusableComposite = composite && focusableWhenDisabled === false;
    // we can't explicitly assign `undefined` to any of these props because it
    // would otherwise prevent subsequently merged props from setting them
    const props = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useFocusableWhenDisabled.useMemo[props]": ()=>{
            const additionalProps = {
                // allow Tabbing away from focusableWhenDisabled elements
                onKeyDown (event) {
                    if (disabled && focusableWhenDisabled && event.key !== 'Tab') {
                        event.preventDefault();
                    }
                }
            };
            if (!composite) {
                additionalProps.tabIndex = tabIndexProp;
                if (!isNativeButton && disabled) {
                    additionalProps.tabIndex = focusableWhenDisabled ? tabIndexProp : -1;
                }
            }
            if (isNativeButton && (focusableWhenDisabled || isFocusableComposite) || !isNativeButton && disabled) {
                additionalProps['aria-disabled'] = disabled;
            }
            if (isNativeButton && (!focusableWhenDisabled || isNonFocusableComposite)) {
                additionalProps.disabled = disabled;
            }
            return additionalProps;
        }
    }["useFocusableWhenDisabled.useMemo[props]"], [
        composite,
        disabled,
        focusableWhenDisabled,
        isFocusableComposite,
        isNonFocusableComposite,
        isNativeButton,
        tabIndexProp
    ]);
    return {
        props
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/dispatchClickWithModifiers.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatchClickWithModifiers",
    ()=>dispatchClickWithModifiers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>");
;
function dispatchClickWithModifiers(target, sourceEvent, { detail = 0 } = {}) {
    target.dispatchEvent(new ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__["ownerWindow"])(target)).PointerEvent('click', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail,
        shiftKey: sourceEvent.shiftKey,
        ctrlKey: sourceEvent.ctrlKey,
        altKey: sourceEvent.altKey,
        metaKey: sourceEvent.metaKey
    }));
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/getPseudoElementBounds.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPseudoElementBounds",
    ()=>getPseudoElementBounds,
    "isMouseWithinBounds",
    ()=>isMouseWithinBounds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
;
;
// Tolerance around the element bounds so a fast click whose pointer drifts slightly
// during press-release isn't mistaken for a drag-off-and-release cancellation.
// Matches typical OS/browser drag-initiation thresholds.
const BOUNDARY_OFFSET = 5;
function isMouseWithinBounds(event, element) {
    const bounds = getPseudoElementBounds(element);
    return event.clientX >= bounds.left - BOUNDARY_OFFSET && event.clientX <= bounds.right + BOUNDARY_OFFSET && event.clientY >= bounds.top - BOUNDARY_OFFSET && event.clientY <= bounds.bottom + BOUNDARY_OFFSET;
}
function getPseudoElementBounds(element) {
    const elementRect = element.getBoundingClientRect();
    const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__["ownerWindow"])(element);
    // Avoid "Not implemented: window.getComputedStyle(elt, pseudoElt)" in jsdom.
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].env.jsdom) {
        return elementRect;
    }
    const beforeStyles = win.getComputedStyle(element, '::before');
    const afterStyles = win.getComputedStyle(element, '::after');
    const hasPseudoElements = beforeStyles.content !== 'none' || afterStyles.content !== 'none';
    if (!hasPseudoElements) {
        return elementRect;
    }
    // Get dimensions of pseudo-elements
    const beforeWidth = parseFloat(beforeStyles.width) || 0;
    const beforeHeight = parseFloat(beforeStyles.height) || 0;
    const afterWidth = parseFloat(afterStyles.width) || 0;
    const afterHeight = parseFloat(afterStyles.height) || 0;
    // Calculate max dimensions including pseudo-elements
    const totalWidth = Math.max(elementRect.width, beforeWidth, afterWidth);
    const totalHeight = Math.max(elementRect.height, beforeHeight, afterHeight);
    // Calculate the differences to extend the bounds
    const widthDiff = totalWidth - elementRect.width;
    const heightDiff = totalHeight - elementRect.height;
    return {
        left: elementRect.left - widthDiff / 2,
        right: elementRect.right + widthDiff / 2,
        top: elementRect.top - heightDiff / 2,
        bottom: elementRect.bottom + heightDiff / 2
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/FocusGuard.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusGuard",
    ()=>FocusGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/visuallyHidden.mjs [app-client] (ecmascript)");
/**
 * @internal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const FocusGuard = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function FocusGuard(props, ref) {
    const [role, setRole] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "FocusGuard.FocusGuard.useIsoLayoutEffect": ()=>{
            // Unlike NVDA and JAWS, VoiceOver's virtual cursor triggers `onFocus` as
            // it moves — but only on focusable/role-button elements through WebKit's
            // NSAccessibility path. Setting `role="button"` lets the focus trap catch
            // the cursor.
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].screenReader.voiceOver && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].engine.webkit) {
                setRole('button');
            }
        }
    }["FocusGuard.FocusGuard.useIsoLayoutEffect"], []);
    const restProps = {
        tabIndex: 0,
        // Role is only for VoiceOver
        role
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
        ...props,
        ref: ref,
        style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visuallyHidden"],
        "aria-hidden": role ? undefined : true,
        ...restProps,
        "data-base-ui-focus-guard": ""
    });
});
if ("TURBOPACK compile-time truthy", 1) FocusGuard.displayName = "FocusGuard";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/hideMiddleware.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hide",
    ()=>hide
]);
const hide = {
    name: 'hide',
    async fn (state) {
        const { width, height, x, y } = state.rects.reference;
        const anchorHidden = width === 0 && height === 0 && x === 0 && y === 0;
        // Mirrors Floating UI's `hide()` referenceHidden strategy. Floating UI injects
        // `detectOverflow` into the middleware platform before invoking middleware.
        const overflow = await state.platform.detectOverflow(state, {
            elementContext: 'reference'
        });
        const referenceHidden = overflow.top - height >= 0 || overflow.right - width >= 0 || overflow.bottom - height >= 0 || overflow.left - width >= 0;
        return {
            data: {
                referenceHidden: referenceHidden || anchorHidden
            }
        };
    }
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/adaptiveOriginConstants.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SIDES",
    ()=>DEFAULT_SIDES
]);
const DEFAULT_SIDES = {
    sideX: 'left',
    sideY: 'top'
}; // Self-contained stand-in for Floating UI's `Middleware` type. Referencing the real type in
 // store state makes `tsc` declaration emit reference `Platform`/`detectOverflow` from
 // `@floating-ui/core` internals, which fails as non-portable (TS2883) in consuming builds.
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/InternalBackdrop.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InternalBackdrop",
    ()=>InternalBackdrop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
/**
 * @internal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
const InternalBackdrop = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function InternalBackdrop(props, ref) {
    const { cutout, ...otherProps } = props;
    let clipPath;
    if (cutout) {
        const rect = cutout.getBoundingClientRect();
        clipPath = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${rect.left}px ${rect.top}px,${rect.left}px ${rect.bottom}px,${rect.right}px ${rect.bottom}px,${rect.right}px ${rect.top}px,${rect.left}px ${rect.top}px)`;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        ref: ref,
        role: "presentation",
        "data-base-ui-inert": "",
        ...otherProps,
        style: {
            position: 'fixed',
            inset: 0,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            clipPath
        }
    });
});
if ("TURBOPACK compile-time truthy", 1) InternalBackdrop.displayName = "InternalBackdrop";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/usePositioner.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePositioner",
    ()=>usePositioner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$getDisabledMountTransitionStyles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/getDisabledMountTransitionStyles.mjs [app-client] (ecmascript)");
'use client';
;
;
;
function usePositioner(componentProps, state, { styles, transitionStatus, props, refs, hidden, inert = false }) {
    const style = {
        ...styles
    };
    if (inert) {
        style.pointerEvents = 'none';
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: refs,
        props: [
            {
                role: 'presentation',
                hidden,
                style
            },
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$getDisabledMountTransitionStyles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDisabledMountTransitionStyles"])(transitionStatus),
            props
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["popupStateMapping"]
    });
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/useAnchoredPopupScrollLock.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnchoredPopupScrollLock",
    ()=>useAnchoredPopupScrollLock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useScrollLock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useScrollLock.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
// Touch-opened popups normally avoid scroll locking so users can still swipe outside to dismiss.
// This hook re-enables scroll lock only when the popup is effectively full-width.
// Treat popups with up to 20px of total horizontal gutter as full-width so common ~10px side
// padding still locks scroll, since that leaves too little outside space for a reliable swipe.
const VIEWPORT_WIDTH_TOLERANCE_PX = 20;
function useAnchoredPopupScrollLock(enabled, touchOpen, positionerElement, referenceElement) {
    const [touchOpenShouldLockScroll, setTouchOpenShouldLockScroll] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useAnchoredPopupScrollLock.useIsoLayoutEffect": ()=>{
            if (!enabled || !touchOpen || positionerElement == null) {
                setTouchOpenShouldLockScroll(false);
                return;
            }
            const viewportWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(positionerElement).documentElement.clientWidth;
            const popupWidth = positionerElement.offsetWidth;
            setTouchOpenShouldLockScroll(viewportWidth > 0 && popupWidth > 0 && popupWidth >= viewportWidth - VIEWPORT_WIDTH_TOLERANCE_PX);
        }
    }["useAnchoredPopupScrollLock.useIsoLayoutEffect"], [
        enabled,
        touchOpen,
        positionerElement
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useScrollLock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"])(enabled && (!touchOpen || touchOpenShouldLockScroll), referenceElement);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/listbox-separator/ListboxSeparator.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListboxSeparator",
    ()=>ListboxSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
'use client';
;
;
const ListboxSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ListboxSeparator(componentProps, forwardedRef) {
    const { className, render, orientation = 'horizontal', style, ...elementProps } = componentProps;
    const state = {
        orientation
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: forwardedRef,
        props: [
            {
                role: 'presentation'
            },
            elementProps
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) ListboxSeparator.displayName = "ListboxSeparator";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/merge-props/mergeProps.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeEventPreventable",
    ()=>makeEventPreventable,
    "mergeClassNames",
    ()=>mergeClassNames,
    "mergeProps",
    ()=>mergeProps,
    "mergePropsN",
    ()=>mergePropsN
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$mergeObjects$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/mergeObjects.mjs [app-client] (ecmascript)");
;
const EMPTY_PROPS = {};
function mergeProps(a, b, c, d, e) {
    if (!c && !d && !e && !a) {
        return createInitialMergedProps(b);
    }
    // We need to mutably own `merged`.
    let merged = createInitialMergedProps(a);
    if (b) {
        merged = mergeInto(merged, b);
    }
    if (c) {
        merged = mergeInto(merged, c);
    }
    if (d) {
        merged = mergeInto(merged, d);
    }
    if (e) {
        merged = mergeInto(merged, e);
    }
    return merged;
}
function mergePropsN(props) {
    if (props.length === 0) {
        return EMPTY_PROPS;
    }
    if (props.length === 1) {
        return createInitialMergedProps(props[0]);
    }
    // We need to mutably own `merged`.
    let merged = createInitialMergedProps(props[0]);
    for(let i = 1; i < props.length; i += 1){
        merged = mergeInto(merged, props[i]);
    }
    return merged;
}
function createInitialMergedProps(inputProps) {
    if (isPropsGetter(inputProps)) {
        // Getter-returned handlers intentionally keep their existing semantics.
        return {
            ...resolvePropsGetter(inputProps, EMPTY_PROPS)
        };
    }
    return copyInitialProps(inputProps);
}
function mergeInto(merged, inputProps) {
    if (isPropsGetter(inputProps)) {
        return resolvePropsGetter(inputProps, merged);
    }
    return mutablyMergeInto(merged, inputProps);
}
function copyInitialProps(inputProps) {
    const copiedProps = {
        ...inputProps
    };
    // `copiedProps` is our fresh own-object copy, so iterating with `for...in` is safe here.
    // eslint-disable-next-line guard-for-in
    for(const propName in copiedProps){
        const propValue = copiedProps[propName];
        if (isEventHandler(propName, propValue)) {
            copiedProps[propName] = wrapEventHandler(propValue);
        }
    }
    return copiedProps;
}
/**
 * Merges two sets of props. In case of conflicts, the external props take precedence.
 */ function mutablyMergeInto(mergedProps, externalProps) {
    if (!externalProps) {
        return mergedProps;
    }
    // eslint-disable-next-line guard-for-in
    for(const propName in externalProps){
        const externalPropValue = externalProps[propName];
        switch(propName){
            case 'style':
                {
                    mergedProps[propName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$mergeObjects$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeObjects"])(mergedProps.style, externalPropValue);
                    break;
                }
            case 'className':
                {
                    mergedProps[propName] = mergeClassNames(mergedProps.className, externalPropValue);
                    break;
                }
            default:
                {
                    if (isEventHandler(propName, externalPropValue)) {
                        mergedProps[propName] = mergeEventHandlers(mergedProps[propName], externalPropValue);
                    } else {
                        mergedProps[propName] = externalPropValue;
                    }
                }
        }
    }
    return mergedProps;
}
function isEventHandler(key, value) {
    // This approach is more efficient than using a regex.
    const code0 = key.charCodeAt(0);
    const code1 = key.charCodeAt(1);
    const code2 = key.charCodeAt(2);
    return code0 === 111 /* o */  && code1 === 110 /* n */  && code2 >= 65 /* A */  && code2 <= 90 /* Z */  && (typeof value === 'function' || typeof value === 'undefined');
}
function isPropsGetter(inputProps) {
    return typeof inputProps === 'function';
}
function resolvePropsGetter(inputProps, previousProps) {
    if (isPropsGetter(inputProps)) {
        return inputProps(previousProps);
    }
    return inputProps ?? EMPTY_PROPS;
}
function mergeEventHandlers(ourHandler, theirHandler) {
    if (!theirHandler) {
        return ourHandler;
    }
    if (!ourHandler) {
        return wrapEventHandler(theirHandler);
    }
    return (...args)=>{
        const event = args[0];
        if (isSyntheticEvent(event)) {
            const baseUIEvent = event;
            makeEventPreventable(baseUIEvent);
            const result = theirHandler(...args);
            if (!baseUIEvent.baseUIHandlerPrevented) {
                ourHandler?.(...args);
            }
            return result;
        }
        const result = theirHandler(...args);
        ourHandler?.(...args);
        return result;
    };
}
function wrapEventHandler(handler) {
    if (!handler) {
        return handler;
    }
    return (...args)=>{
        const event = args[0];
        if (isSyntheticEvent(event)) {
            makeEventPreventable(event);
        }
        return handler(...args);
    };
}
function makeEventPreventable(event) {
    event.preventBaseUIHandler = ()=>{
        event.baseUIHandlerPrevented = true;
    };
    return event;
}
function mergeClassNames(ourClassName, theirClassName) {
    if (theirClassName) {
        if (ourClassName) {
            // eslint-disable-next-line prefer-template
            return theirClassName + ' ' + ourClassName;
        }
        return theirClassName;
    }
    return ourClassName;
}
function isSyntheticEvent(event) {
    return event != null && typeof event === 'object' && 'nativeEvent' in event;
}
}),
]);

//# sourceMappingURL=445cc_%40base-ui_react_9eb26fc4._.js.map