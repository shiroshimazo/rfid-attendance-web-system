(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/index.parts.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
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
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxDerivedItemsContext",
    ()=>ComboboxDerivedItemsContext,
    "ComboboxFloatingContext",
    ()=>ComboboxFloatingContext,
    "ComboboxHasItemsContext",
    ()=>ComboboxHasItemsContext,
    "ComboboxInputValueContext",
    ()=>ComboboxInputValueContext,
    "ComboboxRootContext",
    ()=>ComboboxRootContext,
    "useComboboxDerivedItemsContext",
    ()=>useComboboxDerivedItemsContext,
    "useComboboxFloatingContext",
    ()=>useComboboxFloatingContext,
    "useComboboxHasItemsContext",
    ()=>useComboboxHasItemsContext,
    "useComboboxInputValueContext",
    ()=>useComboboxInputValueContext,
    "useComboboxRootContext",
    ()=>useComboboxRootContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ComboboxRootContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxRootContext.displayName = "ComboboxRootContext";
const ComboboxFloatingContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxFloatingContext.displayName = "ComboboxFloatingContext";
const ComboboxDerivedItemsContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxDerivedItemsContext.displayName = "ComboboxDerivedItemsContext";
const ComboboxHasItemsContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](false);
// `inputValue` can't be placed in the store.
// https://github.com/mui/base-ui/issues/2703
if ("TURBOPACK compile-time truthy", 1) ComboboxHasItemsContext.displayName = "ComboboxHasItemsContext";
const ComboboxInputValueContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]('');
if ("TURBOPACK compile-time truthy", 1) ComboboxInputValueContext.displayName = "ComboboxInputValueContext";
function useComboboxRootContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxRootContext);
    if (!context) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: ComboboxRootContext is missing. Combobox parts must be placed within <Combobox.Root>.' : "TURBOPACK unreachable");
    }
    return context;
}
function useComboboxFloatingContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxFloatingContext);
    if (!context) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: ComboboxFloatingContext is missing. Combobox parts must be placed within <Combobox.Root>.' : "TURBOPACK unreachable");
    }
    return context;
}
function useComboboxDerivedItemsContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxDerivedItemsContext);
    if (!context) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: ComboboxItemsContext is missing. Combobox parts must be placed within <Combobox.Root>.' : "TURBOPACK unreachable");
    }
    return context;
}
function useComboboxInputValueContext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxInputValueContext);
}
function useComboboxHasItemsContext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxHasItemsContext);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectors",
    ()=>selectors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/itemEquality.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/resolveValueLabel.mjs [app-client] (ecmascript)");
;
;
const selectors = {
    id: (state)=>state.id,
    labelId: (state)=>state.labelId,
    items: (state)=>state.items,
    selectedValue: (state)=>state.selectedValue,
    hasSelectionChips: (state)=>{
        const selectedValue = state.selectedValue;
        return Array.isArray(selectedValue) && selectedValue.length > 0;
    },
    hasSelectedValue: (state)=>{
        const { selectedValue, selectionMode } = state;
        if (selectedValue == null) {
            return false;
        }
        if (selectionMode === 'multiple' && Array.isArray(selectedValue)) {
            return selectedValue.length > 0;
        }
        return true;
    },
    hasNullItemLabel: (state, enabled)=>{
        return enabled ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasNullItemLabel"])(state.items) : false;
    },
    open: (state)=>state.open,
    mounted: (state)=>state.mounted,
    forceMounted: (state)=>state.forceMounted,
    inline: (state)=>state.inline,
    activeIndex: (state)=>state.activeIndex,
    selectedIndex: (state)=>state.selectedIndex,
    isActive: (state, index)=>state.activeIndex === index,
    isSelected: (state, itemValue)=>{
        const comparer = state.isItemEqualToValue;
        const selectedValue = state.selectedValue;
        if (Array.isArray(selectedValue)) {
            return selectedValue.some((selectedItem)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareItemEquality"])(itemValue, selectedItem, comparer));
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareItemEquality"])(itemValue, selectedValue, comparer);
    },
    transitionStatus: (state)=>state.transitionStatus,
    popupProps: (state)=>state.popupProps,
    listProps: (state)=>state.listProps,
    inputProps: (state)=>state.inputProps,
    triggerProps: (state)=>state.triggerProps,
    itemProps: (state)=>state.itemProps,
    positionerElement: (state)=>state.positionerElement,
    listElement: (state)=>state.listElement,
    popupId: (state)=>state.popupId,
    triggerElement: (state)=>state.triggerElement,
    inputElement: (state)=>state.inputElement,
    inputGroupElement: (state)=>state.inputGroupElement,
    popupSide: (state)=>state.popupSide,
    openMethod: (state)=>state.openMethod,
    inputInsidePopup: (state)=>state.inputInsidePopup,
    inputOwnsFormValue: (state)=>state.inputOwnsFormValue,
    selectionMode: (state)=>state.selectionMode,
    name: (state)=>state.name,
    form: (state)=>state.form,
    disabled: (state)=>state.disabled,
    readOnly: (state)=>state.readOnly,
    required: (state)=>state.required,
    grid: (state)=>state.grid,
    virtualized: (state)=>state.virtualized,
    itemToStringLabel: (state)=>state.itemToStringLabel,
    isItemEqualToValue: (state)=>state.isItemEqualToValue,
    modal: (state)=>state.modal,
    autoHighlight: (state)=>state.autoHighlight
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCollatorItemFilter",
    ()=>createCollatorItemFilter,
    "createSingleSelectionCollatorFilter",
    ()=>createSingleSelectionCollatorFilter,
    "getComboboxPopupId",
    ()=>getComboboxPopupId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/resolveValueLabel.mjs [app-client] (ecmascript)");
;
function getComboboxPopupId(rootId) {
    return rootId == null ? undefined : `${rootId}-popup`;
}
function createCollatorItemFilter(collatorFilter, itemToStringLabel) {
    return (item, query)=>{
        if (item == null) {
            return false;
        }
        return collatorFilter.contains(item, query, itemToStringLabel);
    };
}
function createSingleSelectionCollatorFilter(collatorFilter, itemToStringLabel, selectedValue) {
    return (item, query)=>{
        if (item == null) {
            return false;
        }
        if (!query) {
            return true;
        }
        const selectedString = selectedValue != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(selectedValue, itemToStringLabel) : '';
        // Handle case-insensitive matching consistently
        if (selectedString && collatorFilter.contains(selectedString, query) && selectedString.length === query.length) {
            return true;
        }
        return collatorFilter.contains(item, query, itemToStringLabel);
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/useFilter.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useComboboxFilter",
    ()=>useComboboxFilter,
    "useCoreFilter",
    ()=>useCoreFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$filter$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/filter.mjs [app-client] (ecmascript)");
'use client';
;
;
;
const useCoreFilter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$filter$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilter"];
function useComboboxFilter(options = {}) {
    const { multiple = false, value, ...collatorOptions } = options;
    const coreFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$filter$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilter"])(collatorOptions);
    const contains = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useComboboxFilter.useCallback[contains]": (item, query, itemToString)=>{
            if (multiple) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollatorItemFilter"])(coreFilter, itemToString)(item, query);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSingleSelectionCollatorFilter"])(coreFilter, itemToString, value)(item, query);
        }
    }["useComboboxFilter.useCallback[contains]"], [
        coreFilter,
        value,
        multiple
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useComboboxFilter.useMemo": ()=>({
                ...coreFilter,
                contains
            })
    }["useComboboxFilter.useMemo"], [
        contains,
        coreFilter
    ]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/constants.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INITIAL_LAST_HIGHLIGHT",
    ()=>INITIAL_LAST_HIGHLIGHT,
    "NO_ACTIVE_VALUE",
    ()=>NO_ACTIVE_VALUE
]);
const NO_ACTIVE_VALUE = Symbol('none');
const INITIAL_LAST_HIGHLIGHT = {
    value: NO_ACTIVE_VALUE,
    index: -1
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/AriaCombobox.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AriaCombobox",
    ()=>AriaCombobox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useControlled.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useOnFirstRender$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useOnFirstRender.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useMergedRefs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useMergedRefs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useValueAsRef$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useValueAsRef.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/visuallyHidden.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$Store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/Store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useDismiss$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/useDismiss.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useFloatingRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/useFloatingRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useListNavigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/useListNavigation.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useClick$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/useClick.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$gridNavigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/gridNavigation.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/shadowDom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-root-context/FieldRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$register$2d$control$2f$useRegisterFieldControl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-register-control/useRegisterFieldControl.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$form$2d$context$2f$FormContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/form-context/FormContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$useLabelableId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/labelable-provider/useLabelableId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$useFilter$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/useFilter.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useTransitionStatus.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$useOpenInteractionType$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/useOpenInteractionType.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/scrollable.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useValueChanged.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popups$2f$popupStoreUtils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popups/popupStoreUtils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$merge$2d$props$2f$mergeProps$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/merge-props/mergeProps.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/resolveValueLabel.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/itemEquality.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$areArraysEqual$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/areArraysEqual.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/direction-context/DirectionContext.mjs [app-client] (ecmascript)");
/**
 * @internal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
function AriaCombobox(props) {
    const { id: idProp, onOpenChangeComplete: onOpenChangeCompleteProp, defaultSelectedValue = null, selectedValue: selectedValueProp, onSelectedValueChange, defaultInputValue: defaultInputValueProp, inputValue: inputValueProp, open: openProp, defaultOpen = false, selectionMode, onItemHighlighted: onItemHighlightedProp, name: nameProp, form, disabled: disabledProp = false, readOnly = false, required = false, inputRef: inputRefProp, grid = false, items, filteredItems: filteredItemsProp, filter: filterProp, openOnInputClick = true, autoHighlight = false, keepHighlight = false, highlightItemOnHover = true, loopFocus = true, itemToStringLabel, itemToStringValue, isItemEqualToValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultItemEquality"], virtualized = false, inline: inlineProp = false, fillInputOnItemPress = true, modal = false, limit = -1, autoComplete = 'list', formAutoComplete, locale, submitOnItemClick = false } = props;
    const { clearErrors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$form$2d$context$2f$FormContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormContext"])();
    const { setDirty, validityData, setFilled, name: fieldName, disabled: fieldDisabled, setTouched, setFocused, validationMode, validation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFieldRootContext"])();
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])();
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$useLabelableId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLabelableId"])({
        id: idProp
    });
    const collatorFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$useFilter$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCoreFilter"])({
        locale
    });
    const [queryChangedAfterOpen, setQueryChangedAfterOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [closeQuery, setCloseQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const listRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]([]);
    const labelsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]([]);
    const popupRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const inputRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const startDismissRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const endDismissRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const emptyRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const keyboardActiveRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](true);
    const hadInputClearRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const chipsContainerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const clearRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const selectionEventRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const lastHighlightRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_LAST_HIGHLIGHT"]);
    const pendingQueryHighlightRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    /**
   * Contains the currently visible list of item values post-filtering.
   */ const valuesRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]([]);
    /**
   * The item element that received the last `pointerdown`, used to detect whether a
   * `mouseup` on an item belongs to a drag-select gesture that started elsewhere.
   */ const pointerDownItemRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const disabled = fieldDisabled || disabledProp;
    const name = fieldName ?? nameProp;
    const multiple = selectionMode === 'multiple';
    const single = selectionMode === 'single';
    const hasInputValue = inputValueProp !== undefined || defaultInputValueProp !== undefined;
    const hasItems = items !== undefined;
    const hasFilteredItemsProp = filteredItemsProp !== undefined;
    let autoHighlightMode;
    if (autoHighlight === 'always') {
        autoHighlightMode = 'always';
    } else {
        autoHighlightMode = autoHighlight ? 'input-change' : false;
    }
    const [selectedValue, setSelectedValueUnwrapped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControlled"])({
        controlled: selectedValueProp,
        default: multiple ? defaultSelectedValue ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_ARRAY"] : defaultSelectedValue,
        name: 'Combobox',
        state: 'selectedValue'
    });
    const filter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[filter]": ()=>{
            if (filterProp === null) {
                return ({
                    "AriaCombobox.useMemo[filter]": ()=>true
                })["AriaCombobox.useMemo[filter]"];
            }
            if (filterProp !== undefined) {
                return filterProp;
            }
            // `shouldBypassFiltering` already empties the query whenever a single selection's label
            // matches it exactly, so the filter never needs a selection-aware variant here.
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCollatorItemFilter"])(collatorFilter, itemToStringLabel);
        }
    }["AriaCombobox.useMemo[filter]"], [
        filterProp,
        collatorFilter,
        itemToStringLabel
    ]);
    // If neither inputValue nor defaultInputValue are provided, derive it from the
    // selected value for single mode so the input reflects the selection on mount.
    const initialDefaultInputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])({
        "AriaCombobox.useRefWithInit": ()=>{
            if (hasInputValue) {
                return defaultInputValueProp ?? '';
            }
            if (single) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(selectedValue, itemToStringLabel);
            }
            return '';
        }
    }["AriaCombobox.useRefWithInit"]).current;
    const [inputValue, setInputValueUnwrapped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControlled"])({
        controlled: inputValueProp,
        default: initialDefaultInputValue,
        name: 'Combobox',
        state: 'inputValue'
    });
    const [open, setOpenUnwrapped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControlled"])({
        controlled: openProp,
        default: defaultOpen,
        name: 'Combobox',
        state: 'open'
    });
    const isGrouped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGroupedItems"])(items);
    const query = closeQuery ?? String(inputValue).trim();
    const selectedLabelString = single ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(selectedValue, itemToStringLabel) : '';
    const shouldBypassFiltering = single && !queryChangedAfterOpen && query !== '' && selectedLabelString.length === query.length && collatorFilter.contains(selectedLabelString, query);
    const filterQuery = shouldBypassFiltering ? '' : query;
    const shouldIgnoreExternalFiltering = hasItems && hasFilteredItemsProp && shouldBypassFiltering;
    const flatItems = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[flatItems]": ()=>{
            if (!items) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_ARRAY"];
            }
            if (isGrouped) {
                return items.flatMap({
                    "AriaCombobox.useMemo[flatItems]": (group)=>group.items
                }["AriaCombobox.useMemo[flatItems]"]);
            }
            return items;
        }
    }["AriaCombobox.useMemo[flatItems]"], [
        items,
        isGrouped
    ]);
    const filteredItems = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[filteredItems]": ()=>{
            if (filteredItemsProp && !shouldIgnoreExternalFiltering) {
                return filteredItemsProp;
            }
            if (!items) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_ARRAY"];
            }
            if (isGrouped) {
                const groupedItems = items;
                const resultingGroups = [];
                let currentCount = 0;
                for (const group of groupedItems){
                    if (limit > -1 && currentCount >= limit) {
                        break;
                    }
                    const remainingLimit = limit > -1 ? limit - currentCount : Infinity;
                    const itemsToTake = filterQuery === '' ? group.items.slice(0, remainingLimit) : [];
                    if (filterQuery !== '') {
                        for (const item of group.items){
                            if (itemsToTake.length >= remainingLimit) {
                                break;
                            }
                            if (filter(item, filterQuery, itemToStringLabel)) {
                                itemsToTake.push(item);
                            }
                        }
                    }
                    if (itemsToTake.length > 0) {
                        const newGroup = {
                            ...group,
                            items: itemsToTake
                        };
                        resultingGroups.push(newGroup);
                        currentCount += itemsToTake.length;
                    }
                }
                return resultingGroups;
            }
            if (filterQuery === '') {
                return limit > -1 ? flatItems.slice(0, limit) : // The cast here is done as `flatItems` is readonly.
                // valuesRef.current, a mutable ref, can be set to `flatFilteredItems`, which may
                // reference this exact readonly value, creating a mutation risk.
                // However, <Combobox.Item> can never mutate this value as the mutating effect
                // bails early when `items` is provided, and this is only ever returned
                // when `items` is provided due to the early return at the top of this hook.
                flatItems;
            }
            const limitedItems = [];
            for (const item of flatItems){
                if (limit > -1 && limitedItems.length >= limit) {
                    break;
                }
                if (filter(item, filterQuery, itemToStringLabel)) {
                    limitedItems.push(item);
                }
            }
            return limitedItems;
        }
    }["AriaCombobox.useMemo[filteredItems]"], [
        filteredItemsProp,
        shouldIgnoreExternalFiltering,
        items,
        isGrouped,
        filterQuery,
        limit,
        filter,
        itemToStringLabel,
        flatItems
    ]);
    const flatFilteredItems = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[flatFilteredItems]": ()=>{
            if (isGrouped) {
                const groups = filteredItems;
                return groups.flatMap({
                    "AriaCombobox.useMemo[flatFilteredItems]": (g)=>g.items
                }["AriaCombobox.useMemo[flatFilteredItems]"]);
            }
            return filteredItems;
        }
    }["AriaCombobox.useMemo[flatFilteredItems]"], [
        filteredItems,
        isGrouped
    ]);
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])({
        "AriaCombobox.useRefWithInit": ()=>{
            // An inline list open on the first render never gets a closed pass of the closed-state
            // sync effect below, and `items`-prop lists don't self-register their index the way
            // individually rendered `<Combobox.Item>`s do, so the selected item was never highlighted.
            // Seeding the index here lets list navigation highlight and scroll to the selection on
            // mount. Computed once by construction, so a selection or list that resolves after mount
            // doesn't move an existing highlight or scroll the list away.
            let initialSelectedIndex = null;
            if (inlineProp && open && hasItems && selectionMode !== 'none') {
                initialSelectedIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSelectionIndex"])(flatFilteredItems, selectedValue, isItemEqualToValue, multiple);
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$Store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Store"]({
                id,
                labelId: undefined,
                selectedValue,
                open,
                items,
                selectionMode,
                listRef,
                labelsRef,
                popupRef,
                emptyRef,
                inputRef,
                startDismissRef,
                endDismissRef,
                keyboardActiveRef,
                chipsContainerRef,
                clearRef,
                valuesRef,
                pointerDownItemRef,
                selectionEventRef,
                name,
                form,
                disabled,
                readOnly,
                required,
                grid,
                virtualized,
                openOnInputClick,
                itemToStringLabel,
                isItemEqualToValue,
                modal,
                autoHighlight: autoHighlightMode,
                submitOnItemClick,
                hasInputValue,
                mounted: false,
                forceMounted: false,
                transitionStatus: 'idle',
                inline: inlineProp,
                activeIndex: null,
                selectedIndex: initialSelectedIndex,
                popupProps: {},
                listProps: {},
                inputProps: {},
                triggerProps: {},
                itemProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
                positionerElement: null,
                listElement: null,
                popupId: undefined,
                triggerElement: null,
                inputElement: null,
                inputGroupElement: null,
                popupSide: null,
                openMethod: null,
                inputInsidePopup: true,
                // Avoid duplicate names in the server HTML. Popup inputs aren't rendered
                // until after hydration, so the hidden input takes over then if needed.
                inputOwnsFormValue: selectionMode === 'none',
                // Placeholder callbacks replaced on first render
                onOpenChangeComplete: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"],
                setOpen: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"],
                setInputValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"],
                setSelectedValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"],
                setIndices: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"],
                handleSelection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"],
                forceMount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"],
                requestSubmit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"]
            });
        }
    }["AriaCombobox.useRefWithInit"]).current;
    const fieldRawValue = selectionMode === 'none' ? inputValue : selectedValue;
    const fieldStringValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[fieldStringValue]": ()=>{
            if (selectionMode === 'none') {
                return fieldRawValue;
            }
            if (Array.isArray(selectedValue)) {
                return selectedValue.map({
                    "AriaCombobox.useMemo[fieldStringValue]": (value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsValue"])(value, itemToStringValue)
                }["AriaCombobox.useMemo[fieldStringValue]"]);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsValue"])(selectedValue, itemToStringValue);
        }
    }["AriaCombobox.useMemo[fieldStringValue]"], [
        fieldRawValue,
        itemToStringValue,
        selectionMode,
        selectedValue
    ]);
    const onItemHighlighted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])(onItemHighlightedProp);
    const onOpenChangeComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])(onOpenChangeCompleteProp);
    const activeIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].activeIndex);
    const selectedIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedIndex);
    const positionerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].positionerElement);
    const listElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].listElement);
    const triggerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].triggerElement);
    const inputElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputElement);
    const inputGroupElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputGroupElement);
    const inline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inline);
    const inputInsidePopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputInsidePopup);
    const inputOwnsFormValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputOwnsFormValue);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useValueAsRef$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueAsRef"])(triggerElement);
    const { mounted, setMounted, transitionStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransitionStatus"])(open);
    const { openMethod, triggerProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$useOpenInteractionType$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenInteractionType"])(open);
    const getStringifiedValueForForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[getStringifiedValueForForm]": ()=>fieldStringValue
    }["AriaCombobox.useStableCallback[getStringifiedValueForForm]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$register$2d$control$2f$useRegisterFieldControl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRegisterFieldControl"])(inputInsidePopup ? triggerRef : inputRef, id, fieldRawValue, getStringifiedValueForForm, !disabled, nameProp);
    const forceMount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[forceMount]": ()=>{
            if (items) {
                // Ensure typeahead works on a closed list.
                labelsRef.current = flatFilteredItems.map({
                    "AriaCombobox.useStableCallback[forceMount]": (item)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(item, itemToStringLabel)
                }["AriaCombobox.useStableCallback[forceMount]"]);
            } else {
                store.set('forceMounted', true);
            }
        }
    }["AriaCombobox.useStableCallback[forceMount]"]);
    /**
   * Emits `onItemHighlighted` for the item at `index`, or clears the highlight when `index` is `-1`
   * (a no-op if nothing was highlighted). Keeps `lastHighlightRef` in sync with what was emitted.
   */ const emitHighlight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[emitHighlight]": (value, index, type)=>{
            if (index === -1) {
                if (lastHighlightRef.current === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_LAST_HIGHLIGHT"]) {
                    return;
                }
                lastHighlightRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_LAST_HIGHLIGHT"];
            } else {
                lastHighlightRef.current = {
                    value,
                    index
                };
            }
            onItemHighlighted(value, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createGenericEventDetails"])(type, undefined, {
                index
            }));
        }
    }["AriaCombobox.useStableCallback[emitHighlight]"]);
    const setIndices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[setIndices]": (options)=>{
            store.update(options);
            const activeIndexOption = options.activeIndex;
            if (activeIndexOption === undefined) {
                return;
            }
            const type = options.type || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none;
            if (activeIndexOption === null) {
                emitHighlight(undefined, -1, type);
            } else {
                emitHighlight(valuesRef.current[activeIndexOption], activeIndexOption, type);
            }
        }
    }["AriaCombobox.useStableCallback[setIndices]"]);
    const setInputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[setInputValue]": (next, eventDetails)=>{
            hadInputClearRef.current = eventDetails.reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear;
            props.onInputValueChange?.(next, eventDetails);
            if (eventDetails.isCanceled) {
                return;
            }
            // If user is typing, ensure we don't auto-highlight on open due to a race
            // with the post-open effect that sets this flag.
            if (eventDetails.reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputChange) {
                // A controlled popup may ignore a close request. Resuming input proves the popup
                // is remaining open, so release the query captured for an exit animation.
                if (open && closeQuery !== null) {
                    setCloseQuery(null);
                }
                const event = eventDetails.event;
                const inputType = event.inputType;
                // Treat composition commits as typed input; autofill may omit `inputType` or
                // report `insertReplacementText`.
                const isTypedInput = event.type === 'compositionend' || inputType != null && inputType !== '' && inputType !== 'insertReplacementText';
                if (isTypedInput) {
                    const hasQuery = next.trim() !== '';
                    if (hasQuery) {
                        setQueryChangedAfterOpen(true);
                    }
                    // Defer index updates until after the filtered items have been derived to ensure
                    // `onItemHighlighted` receives the latest item.
                    pendingQueryHighlightRef.current = {
                        hasQuery
                    };
                    // Virtualized lists own their scroller. Reset regular lists directly so a stale
                    // composite registry cannot select a reordered item and scrolling cannot escape
                    // the popup.
                    const list = store.state.listElement;
                    if (!store.state.virtualized && list) {
                        const popup = popupRef.current;
                        for (const ancestor of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOverflowAncestors"])(list.firstElementChild ?? list)){
                            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(ancestor) || (popup ? !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(popup, ancestor) : ancestor.getAttribute('role') === 'dialog')) {
                                break;
                            }
                            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScrollableY"])(ancestor)) {
                                ancestor.scrollTop = 0;
                                break;
                            }
                        }
                    }
                    if (hasQuery && autoHighlightMode && store.state.activeIndex == null && (open || inline)) {
                        store.set('activeIndex', 0);
                    }
                }
            } else if (eventDetails.reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear && next === '' && store.state.inputInsidePopup) {
                // A programmatic clear of an active query (e.g. after selecting an item with the
                // input inside the popup): restore the highlight to the selected item.
                pendingQueryHighlightRef.current = {
                    hasQuery: false,
                    selection: true
                };
            }
            setInputValueUnwrapped(next);
        }
    }["AriaCombobox.useStableCallback[setInputValue]"]);
    const setOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[setOpen]": (nextOpen, eventDetails)=>{
            if (open === nextOpen) {
                return;
            }
            // If the `Empty` component is not used, the positioner or popup should be hidden
            // with CSS. In this case, allow the Escape key to bubble to close a parent popup
            // if there are no items to show.
            if (eventDetails.reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].escapeKey && hasItems && flatFilteredItems.length === 0 && !emptyRef.current) {
                eventDetails.allowPropagation();
            }
            props.onOpenChange?.(nextOpen, eventDetails);
            if (eventDetails.isCanceled) {
                return;
            }
            // If reopening interrupts the close animation, handleUnmount won't run to clear the
            // frozen closeQuery and pending popup input.
            if (nextOpen && inputInsidePopup && !inline && closeQuery !== null) {
                setQueryChangedAfterOpen(false);
                setCloseQuery(null);
                if (inputValue !== '' && eventDetails.reason !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputChange) {
                    setInputValue('', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear, eventDetails.event));
                }
            }
            if (!nextOpen && queryChangedAfterOpen) {
                if (single) {
                    if (!inline) {
                        setCloseQuery(query);
                    }
                    // Avoid a flicker when closing the popup with an empty query.
                    if (query === '') {
                        setQueryChangedAfterOpen(false);
                    }
                } else if (multiple) {
                    if (!inline) {
                        // Freeze the current query so filtering remains stable while exiting.
                        setCloseQuery(query);
                    }
                    if (inputInsidePopup) {
                        setIndices({
                            activeIndex: null
                        });
                    }
                    // Clear the input immediately on close while retaining filtering via closeQuery for exit animations
                    // if the input is outside the popup. When the input is inside the popup, defer the clear until
                    // unmount so the filtered list doesn't flash to unfiltered during the exit animation.
                    if (!inputInsidePopup || inline) {
                        setInputValue('', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear, eventDetails.event));
                    }
                }
            }
            setOpenUnwrapped(nextOpen);
            if (!nextOpen && inputInsidePopup && (eventDetails.reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].focusOut || eventDetails.reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].outsidePress)) {
                setTouched(true);
                setFocused(false);
                if (validationMode === 'onBlur') {
                    const valueToValidate = selectionMode === 'none' ? inputValue : selectedValue;
                    validation.commit(valueToValidate);
                }
            }
        }
    }["AriaCombobox.useStableCallback[setOpen]"]);
    const setSelectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[setSelectedValue]": (nextValue, eventDetails)=>{
            // Cast to `any` due to conditional value type (single vs. multiple).
            // The runtime implementation already ensures the correct value shape.
            onSelectedValueChange?.(nextValue, eventDetails);
            if (eventDetails.isCanceled) {
                return;
            }
            setSelectedValueUnwrapped(nextValue);
            const shouldFillInput = selectionMode === 'none' && popupRef.current && fillInputOnItemPress || single && !store.state.inputInsidePopup;
            if (shouldFillInput) {
                setInputValue((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(nextValue, itemToStringLabel), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(eventDetails.reason, eventDetails.event));
            }
        }
    }["AriaCombobox.useStableCallback[setSelectedValue]"]);
    const handleSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[handleSelection]": (event, itemValue)=>{
            const targetEl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTarget"])(event);
            const overrideEvent = selectionEventRef.current ?? event;
            selectionEventRef.current = null;
            const eventDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].itemPress, overrideEvent);
            // Let the link handle the click.
            const href = targetEl?.closest('a')?.getAttribute('href');
            if (href) {
                if (href.startsWith('#')) {
                    setOpen(false, eventDetails);
                }
                return;
            }
            if (multiple) {
                const currentSelectedValue = Array.isArray(selectedValue) ? selectedValue : [];
                const isCurrentlySelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedValueIncludes"])(currentSelectedValue, itemValue, isItemEqualToValue);
                const nextValue = isCurrentlySelected ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeItem"])(currentSelectedValue, itemValue, isItemEqualToValue) : [
                    ...currentSelectedValue,
                    itemValue
                ];
                setSelectedValue(nextValue, eventDetails);
                if (eventDetails.isCanceled) {
                    return;
                }
                const wasFiltering = inputRef.current ? inputRef.current.value.trim() !== '' : false;
                if (!wasFiltering) {
                    return;
                }
                if (store.state.inputInsidePopup) {
                    setInputValue('', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear, eventDetails.event));
                } else {
                    setOpen(false, eventDetails);
                }
            } else {
                setSelectedValue(itemValue, eventDetails);
                if (eventDetails.isCanceled) {
                    return;
                }
                setOpen(false, eventDetails);
            }
        }
    }["AriaCombobox.useStableCallback[handleSelection]"]);
    const requestSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[requestSubmit]": ()=>{
            const formElement = validation.inputRef.current?.form ?? store.state.inputElement?.form;
            if (formElement && typeof formElement.requestSubmit === 'function') {
                formElement.requestSubmit();
            }
        }
    }["AriaCombobox.useStableCallback[requestSubmit]"]);
    const handleUnmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AriaCombobox.useStableCallback[handleUnmount]": ()=>{
            setMounted(false);
            onOpenChangeComplete?.(false);
            setQueryChangedAfterOpen(false);
            setCloseQuery(null);
            if (selectionMode === 'none') {
                setIndices({
                    activeIndex: null,
                    selectedIndex: null
                });
            } else {
                setIndices({
                    activeIndex: null
                });
            }
            // Multiple selection mode:
            // If the user typed a filter and didn't select in multiple mode, clear the input
            // after close completes to avoid mid-exit flicker and start fresh on next open.
            if (multiple && inputRef.current && inputRef.current.value !== '' && !hadInputClearRef.current) {
                setInputValue('', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear));
            }
            // Single selection mode:
            // - If input is rendered inside the popup, clear it so the next open is blank
            // - If input is outside the popup, sync it to the selected value
            if (single) {
                if (store.state.inputInsidePopup) {
                    if (inputRef.current && inputRef.current.value !== '') {
                        setInputValue('', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear));
                    }
                } else {
                    const stringVal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(selectedValue, itemToStringLabel);
                    if (inputRef.current && inputRef.current.value !== stringVal) {
                        // If no selection was made, treat this as clearing the typed filter.
                        const reason = stringVal === '' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none;
                        setInputValue(stringVal, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(reason));
                    }
                }
            }
        }
    }["AriaCombobox.useStableCallback[handleUnmount]"]);
    // Support composing the Dialog component around an inline combobox.
    // `[role="dialog"]` is more interoperable than using a context, e.g. it can work
    // with third-party modal libraries, though the limitation is that the closest
    // `role=dialog` part must be the animated element.
    const resolvedPopupRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[resolvedPopupRef]": ()=>{
            if (inline && positionerElement) {
                return {
                    current: positionerElement.closest('[role="dialog"]')
                };
            }
            return popupRef;
        }
    }["AriaCombobox.useMemo[resolvedPopupRef]"], [
        inline,
        positionerElement
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenChangeComplete"])({
        enabled: !props.actionsRef,
        open,
        ref: resolvedPopupRef,
        onComplete () {
            if (!open) {
                handleUnmount();
            }
        }
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"](props.actionsRef, {
        "AriaCombobox.useImperativeHandle": ()=>({
                unmount: handleUnmount
            })
    }["AriaCombobox.useImperativeHandle"], [
        handleUnmount
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])(function syncClosedState() {
        if (open) {
            return;
        }
        // State-driven (not tied to the internal event path) so controlled closes
        // also clear a pointerdown that never received a matching item mouseup.
        pointerDownItemRef.current = null;
        if (selectionMode === 'none') {
            return;
        }
        // Without `items`, look the selection up in the live registry of mounted item
        // values (the list stays mounted while closed when closed-state features need
        // it — trigger interaction and rendered-label autofill force-mount it). Mounted
        // items re-assert the index themselves when their registration moves; when
        // nothing is mounted the lookup resolves to `null` and each item re-registers
        // the index on the next open.
        const registry = hasItems ? flatItems : valuesRef.current;
        setIndices({
            selectedIndex: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSelectionIndex"])(registry, selectedValue, isItemEqualToValue, multiple)
        });
    }, [
        open,
        selectedValue,
        selectionMode,
        multiple,
        hasItems,
        flatItems,
        isItemEqualToValue,
        setIndices
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "AriaCombobox.useIsoLayoutEffect": ()=>{
            if (items) {
                valuesRef.current = flatFilteredItems;
                listRef.current.length = flatFilteredItems.length;
            }
        }
    }["AriaCombobox.useIsoLayoutEffect"], [
        items,
        flatFilteredItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "AriaCombobox.useIsoLayoutEffect": ()=>{
            const pendingHighlight = pendingQueryHighlightRef.current;
            if (pendingHighlight) {
                // A directly rendered list remains visible when the popup state is closed, while a
                // kept-mounted Positioner is hidden and should stay inert.
                const listIsNavigable = open || inline || store.state.positionerElement?.hidden === false;
                if (pendingHighlight.hasQuery) {
                    if (autoHighlightMode && listIsNavigable) {
                        store.set('activeIndex', 0);
                    }
                    pendingQueryHighlightRef.current = null;
                } else if (String(inputValue).trim() === '') {
                    // Only handle the clear once it has committed (a controlled input may reject it),
                    // so a restore cannot fire while a query is still active.
                    pendingQueryHighlightRef.current = null;
                    if (listIsNavigable) {
                        const clearedBySelection = pendingHighlight.selection;
                        if (autoHighlightMode === 'always' && !clearedBySelection && store.state.selectionMode === 'none') {
                            // There is no selection to restore in Autocomplete. Keep the first-item reset
                            // synchronous so list navigation sees it before a directly rendered list closes.
                            store.set('activeIndex', 0);
                        }
                        // Items re-mounted by the clear publish their composite indices in a follow-up
                        // commit, so the item registries are mid-update here. Defer past React's cascade.
                        queueMicrotask({
                            "AriaCombobox.useIsoLayoutEffect": ()=>{
                                if (!store.state.open && !store.state.inline || inputRef.current && inputRef.current.value.trim() !== '') {
                                    return;
                                }
                                // Return the highlight to the selected item, the same anchor the popup uses
                                // when it first opens. Read the selection through the store so consumers can
                                // pass an inline `isItemEqualToValue` or a fresh `selectedValue` array without
                                // re-running this effect on every render.
                                const currentSelectedValue = store.state.selectedValue;
                                const isMultiple = store.state.selectionMode === 'multiple';
                                const lastSelectedValue = isMultiple && Array.isArray(currentSelectedValue) ? currentSelectedValue[currentSelectedValue.length - 1] : currentSelectedValue;
                                const hasSelection = store.state.selectionMode !== 'none' && lastSelectedValue != null;
                                if (hasSelection || clearedBySelection) {
                                    const registry = hasItems || hasFilteredItemsProp ? flatFilteredItems : valuesRef.current;
                                    // A selection that is no longer in the list drops the highlight rather than
                                    // leaving it on whichever item now occupies that index.
                                    store.set('activeIndex', hasSelection ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSelectionIndex"])(registry, currentSelectedValue, store.state.isItemEqualToValue, isMultiple) : null);
                                } else if (autoHighlightMode === 'always') {
                                    store.set('activeIndex', 0);
                                }
                            }
                        }["AriaCombobox.useIsoLayoutEffect"]);
                    }
                }
            }
            if (!open && !inline) {
                return;
            }
            const shouldUseFlatFilteredItems = hasItems || hasFilteredItemsProp;
            const candidateItems = shouldUseFlatFilteredItems ? flatFilteredItems : valuesRef.current;
            const storeActiveIndex = store.state.activeIndex;
            if (storeActiveIndex == null) {
                if (autoHighlightMode === 'always' && candidateItems.length > 0) {
                    store.set('activeIndex', 0);
                    return;
                }
                emitHighlight(undefined, -1, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none);
                return;
            }
            if (storeActiveIndex >= candidateItems.length) {
                emitHighlight(undefined, -1, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none);
                store.set('activeIndex', null);
                return;
            }
            const itemValue = candidateItems[storeActiveIndex];
            const previouslyHighlightedItemValue = lastHighlightRef.current.value;
            const isSameItem = previouslyHighlightedItemValue !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NO_ACTIVE_VALUE"] && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareItemEquality"])(itemValue, previouslyHighlightedItemValue, store.state.isItemEqualToValue);
            if (lastHighlightRef.current.index !== storeActiveIndex || !isSameItem) {
                emitHighlight(itemValue, storeActiveIndex, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none);
            }
        }
    }["AriaCombobox.useIsoLayoutEffect"], [
        activeIndex,
        autoHighlightMode,
        emitHighlight,
        hasFilteredItemsProp,
        hasItems,
        flatFilteredItems,
        inline,
        open,
        store,
        // Reruns the effect when the query changes without affecting the deps above, such as
        // clearing the input when no items are filtered out (individually rendered items).
        inputValue
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "AriaCombobox.useIsoLayoutEffect": ()=>{
            if (selectionMode === 'none') {
                setFilled(String(inputValue) !== '');
                return;
            }
            setFilled(multiple ? Array.isArray(selectedValue) && selectedValue.length > 0 : selectedValue != null);
        }
    }["AriaCombobox.useIsoLayoutEffect"], [
        setFilled,
        selectionMode,
        inputValue,
        selectedValue,
        multiple
    ]);
    // Ensures that the active index is not set to 0 when the list is empty.
    // This avoids needing to press ArrowDown twice under certain conditions.
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "AriaCombobox.useEffect": ()=>{
            if (hasItems && autoHighlightMode && flatFilteredItems.length === 0) {
                setIndices({
                    activeIndex: null
                });
            }
        }
    }["AriaCombobox.useEffect"], [
        hasItems,
        autoHighlightMode,
        flatFilteredItems.length,
        setIndices
    ]);
    function isSelectedValueDirty(value) {
        const initialValue = validityData.initialValue;
        if (Array.isArray(value) && Array.isArray(initialValue)) {
            return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$areArraysEqual$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["areArraysEqual"])(value, initialValue, (itemValue, initialItemValue)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareItemEquality"])(itemValue, initialItemValue, isItemEqualToValue));
        }
        return value !== initialValue;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueChanged"])(query, {
        "AriaCombobox.useValueChanged": ()=>{
            if (!open || query === '' || query === String(initialDefaultInputValue)) {
                return;
            }
            setQueryChangedAfterOpen(true);
        }
    }["AriaCombobox.useValueChanged"]);
    function syncInputToSelectedLabel() {
        const nextInputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(selectedValue, itemToStringLabel);
        if (inputValue !== nextInputValue) {
            setInputValue(nextInputValue, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none));
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueChanged"])(selectedValue, {
        "AriaCombobox.useValueChanged": ()=>{
            if (selectionMode === 'none') {
                return;
            }
            clearErrors(name);
            setDirty(isSelectedValueDirty(selectedValue));
            validation.change(selectedValue);
            if (single && !hasInputValue && !inputInsidePopup) {
                syncInputToSelectedLabel();
            }
        }
    }["AriaCombobox.useValueChanged"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueChanged"])(inputValue, {
        "AriaCombobox.useValueChanged": ()=>{
            if (selectionMode !== 'none') {
                return;
            }
            clearErrors(name);
            setDirty(inputValue !== validityData.initialValue);
            validation.change(inputValue);
        }
    }["AriaCombobox.useValueChanged"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueChanged"])(items, {
        "AriaCombobox.useValueChanged": ()=>{
            if (!single || hasInputValue || inputInsidePopup || queryChangedAfterOpen) {
                return;
            }
            syncInputToSelectedLabel();
        }
    }["AriaCombobox.useValueChanged"]);
    const floatingRootContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useFloatingRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFloatingRootContext"])({
        open: inline ? true : open,
        onOpenChange: setOpen,
        elements: {
            reference: inputInsidePopup ? triggerElement : inputElement,
            floating: positionerElement
        }
    });
    const ariaHasPopup = grid ? 'grid' : 'listbox';
    // An inline list isn't gated on `open`: it renders for as long as it's in the tree, so the
    // combobox is permanently expanded even while the internal open state is `false`.
    const expanded = open || inline;
    const ariaExpanded = expanded ? 'true' : 'false';
    const role = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[role]": ()=>{
            const isPlainInput = inputElement?.tagName === 'INPUT';
            // During SSR and initial hydration, the input ref is not available yet.
            // Assume an input-like control so combobox ARIA attributes are present.
            const shouldTreatAsInput = inputElement == null || isPlainInput;
            // A non-input control only takes on combobox semantics while the list is exposed, which for
            // an inline list is the whole time.
            const shouldApplyAria = shouldTreatAsInput || expanded;
            const reference = shouldTreatAsInput ? {
                autoComplete: 'off',
                spellCheck: 'false',
                autoCorrect: 'off',
                autoCapitalize: 'none'
            } : {};
            if (shouldApplyAria) {
                reference.role = 'combobox';
                reference['aria-expanded'] = ariaExpanded;
                reference['aria-haspopup'] = ariaHasPopup;
                reference['aria-controls'] = expanded ? listElement?.id : undefined;
                reference['aria-autocomplete'] = autoComplete;
            }
            return {
                reference,
                floating: {
                    role: 'presentation'
                }
            };
        }
    }["AriaCombobox.useMemo[role]"], [
        inputElement,
        expanded,
        ariaExpanded,
        ariaHasPopup,
        listElement?.id,
        autoComplete
    ]);
    const click = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useClick$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClick"])(floatingRootContext, {
        enabled: !readOnly && !disabled && openOnInputClick,
        event: 'mousedown-only',
        toggle: false,
        // Apply a small delay for touch to let mobile viewport/keyboard positioning settle.
        // This avoids top-bottom flip flickers if the preferred position is "top" when first tapping.
        touchOpenDelay: inputInsidePopup ? 0 : 100,
        reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputPress
    });
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useDismiss$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDismiss"])(floatingRootContext, {
        enabled: !readOnly && !disabled && !inline,
        outsidePressEvent: {
            mouse: 'sloppy',
            // The visual viewport (affected by the mobile software keyboard) can be
            // somewhat small. The user may want to scroll the screen to see more of
            // the popup.
            touch: 'intentional'
        },
        // Without a popup, let the Escape key bubble the event up to other popups' handlers.
        bubbles: inline ? true : undefined,
        outsidePress (event) {
            const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTarget"])(event);
            return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(triggerElement, target) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(clearRef.current, target) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(chipsContainerRef.current, target) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(inputGroupElement, target);
        }
    });
    const listNavigation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useListNavigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useListNavigation"])(floatingRootContext, {
        enabled: !readOnly && !disabled,
        id,
        listRef,
        activeIndex,
        selectedIndex,
        virtual: true,
        loopFocus,
        allowEscape: loopFocus && !autoHighlightMode,
        focusItemOnOpen: queryChangedAfterOpen || selectionMode === 'none' && !autoHighlightMode ? false : 'auto',
        focusItemOnHover: highlightItemOnHover,
        resetOnPointerLeave: !keepHighlight,
        orientation: grid ? 'horizontal' : undefined,
        rtl: direction === 'rtl',
        disabledIndices: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_ARRAY"],
        grid: grid ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$gridNavigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gridNavigation"] : undefined,
        onNavigate (nextActiveIndex, event) {
            // Retain the highlight only while actually transitioning out or closed.
            if (!event && !open || transitionStatus === 'ending') {
                return;
            }
            if (!event) {
                setIndices({
                    activeIndex: nextActiveIndex
                });
            } else {
                setIndices({
                    activeIndex: nextActiveIndex,
                    type: keyboardActiveRef.current ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].keyboard : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].pointer
                });
            }
        }
    });
    const inputProps = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[inputProps]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$merge$2d$props$2f$mergeProps$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])(listNavigation.reference, {
                onKeyDown (event) {
                    // In grid mode the navigation hook treats ArrowLeft/ArrowRight as horizontal
                    // grid movement. When the input has focus and no item is highlighted the user
                    // is still editing the query, so let the input keep its native caret behavior.
                    if (grid && store.state.activeIndex == null && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                        event.preventBaseUIHandler();
                    }
                }
            }, dismiss.reference, click.reference, role.reference)
    }["AriaCombobox.useMemo[inputProps]"], [
        listNavigation.reference,
        dismiss.reference,
        click.reference,
        role.reference,
        grid,
        store
    ]);
    const popupProps = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[popupProps]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$merge$2d$props$2f$mergeProps$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popups$2f$popupStoreUtils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUSABLE_POPUP_PROPS"], dismiss.floating)
    }["AriaCombobox.useMemo[popupProps]"], [
        dismiss.floating
    ]);
    const listProps = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[listProps]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$merge$2d$props$2f$mergeProps$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeProps"])(listNavigation.floating, role.floating)
    }["AriaCombobox.useMemo[listProps]"], [
        listNavigation.floating,
        role.floating
    ]);
    const itemProps = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[itemProps]": ()=>{
            const listNavigationItemProps = listNavigation.item;
            if (!listNavigationItemProps) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"];
            }
            // Combobox keeps focus on the input; item focus would incorrectly sync
            // list navigation state from DOM focus.
            return {
                ...listNavigationItemProps,
                onFocus: undefined
            };
        }
    }["AriaCombobox.useMemo[itemProps]"], [
        listNavigation.item
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useOnFirstRender$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnFirstRender"])({
        "AriaCombobox.useOnFirstRender": ()=>{
            store.update({
                inline: inlineProp,
                popupProps,
                listProps,
                inputProps,
                triggerProps,
                itemProps,
                setOpen,
                setInputValue,
                setSelectedValue,
                setIndices,
                handleSelection,
                forceMount,
                requestSubmit,
                onOpenChangeComplete
            });
        }
    }["AriaCombobox.useOnFirstRender"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "AriaCombobox.useIsoLayoutEffect": ()=>{
            store.update({
                id,
                selectedValue,
                open,
                mounted,
                transitionStatus,
                items,
                inline: inlineProp,
                popupProps,
                listProps,
                inputProps,
                triggerProps,
                openMethod,
                itemProps,
                selectionMode,
                name,
                form,
                disabled,
                readOnly,
                required,
                grid,
                virtualized,
                openOnInputClick,
                itemToStringLabel,
                modal,
                autoHighlight: autoHighlightMode,
                isItemEqualToValue,
                submitOnItemClick,
                hasInputValue,
                inputOwnsFormValue: selectionMode === 'none' && (inlineProp || !store.state.inputInsidePopup)
            });
        }
    }["AriaCombobox.useIsoLayoutEffect"], [
        store,
        id,
        selectedValue,
        open,
        mounted,
        transitionStatus,
        items,
        popupProps,
        listProps,
        inputProps,
        itemProps,
        openMethod,
        triggerProps,
        selectionMode,
        name,
        disabled,
        readOnly,
        required,
        grid,
        virtualized,
        openOnInputClick,
        itemToStringLabel,
        modal,
        isItemEqualToValue,
        submitOnItemClick,
        hasInputValue,
        inlineProp,
        autoHighlightMode,
        form
    ]);
    const hiddenInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useMergedRefs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMergedRefs"])(inputRefProp, validation.inputRef);
    const itemsContextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[itemsContextValue]": ()=>({
                query,
                hasItems,
                filteredItems,
                flatFilteredItems
            })
    }["AriaCombobox.useMemo[itemsContextValue]"], [
        query,
        hasItems,
        filteredItems,
        flatFilteredItems
    ]);
    const serializedValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[serializedValue]": ()=>{
            if (Array.isArray(fieldRawValue)) {
                return '';
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsValue"])(fieldRawValue, itemToStringValue);
        }
    }["AriaCombobox.useMemo[serializedValue]"], [
        fieldRawValue,
        itemToStringValue
    ]);
    const hasMultipleSelection = multiple && Array.isArray(selectedValue) && selectedValue.length > 0;
    const hiddenInputName = multiple || selectionMode === 'none' && inputOwnsFormValue ? undefined : name;
    const hiddenInputs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AriaCombobox.useMemo[hiddenInputs]": ()=>{
            if (!multiple || !Array.isArray(selectedValue) || !name) {
                return null;
            }
            return selectedValue.map({
                "AriaCombobox.useMemo[hiddenInputs]": (value)=>{
                    const currentSerializedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsValue"])(value, itemToStringValue);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("input", {
                        type: "hidden",
                        form: form,
                        name: name,
                        value: currentSerializedValue,
                        disabled: disabled
                    }, currentSerializedValue);
                }
            }["AriaCombobox.useMemo[hiddenInputs]"]);
        }
    }["AriaCombobox.useMemo[hiddenInputs]"], [
        multiple,
        selectedValue,
        form,
        name,
        itemToStringValue,
        disabled
    ]);
    const children = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            props.children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("input", {
                ...validation.getValidationProps(disabled, {
                    // Move focus when the hidden input is focused.
                    onFocus () {
                        if (inputInsidePopup) {
                            triggerElement?.focus();
                            return;
                        }
                        (inputRef.current || triggerElement)?.focus();
                    },
                    // Handle browser autofill.
                    onChange (event) {
                        // Workaround for https://github.com/react/react/issues/9023
                        if (event.nativeEvent.defaultPrevented || disabled || readOnly) {
                            return;
                        }
                        const nextValue = event.currentTarget.value;
                        const nextValueLower = nextValue.toLowerCase();
                        const details = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none, event.nativeEvent);
                        const findSerializedMatchIndex = ()=>valuesRef.current.findIndex((candidate)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsValue"])(candidate, itemToStringValue).toLowerCase() === nextValueLower || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyAsLabel"])(candidate, itemToStringLabel).toLowerCase() === nextValueLower);
                        function handleChange() {
                            // Browser autofill only writes a single scalar value.
                            if (multiple) {
                                return;
                            }
                            if (selectionMode === 'none') {
                                setInputValue(nextValue, details);
                                return;
                            }
                            // Preserve the original serialized matching, then fall back to rendered text,
                            // which browsers can autofill for primitive values like `value="US">United States`.
                            let matchingIndex = findSerializedMatchIndex();
                            if (matchingIndex === -1) {
                                matchingIndex = valuesRef.current.findIndex((_, index)=>{
                                    const renderedLabel = labelsRef.current[index];
                                    return renderedLabel != null && renderedLabel.toLowerCase() === nextValueLower;
                                });
                            }
                            const matchingValue = matchingIndex === -1 ? undefined : valuesRef.current[matchingIndex];
                            if (matchingValue != null) {
                                // `setSelectedValue` may be canceled by `onValueChange`; rely on
                                // `useValueChanged` to mark the field dirty and run validation only
                                // when the value actually changes.
                                setSelectedValue?.(matchingValue, details);
                            }
                        }
                        // Only single-selection autofill matches against the registered values/labels.
                        // `multiple` ignores autofill and `none` just writes the input value, so avoid the
                        // sticky `forceMounted` mount (which never resets) for those modes.
                        if (single) {
                            forceMount();
                            if (items && findSerializedMatchIndex() === -1) {
                                // `forceMount` only refreshes the derived labels for the `items` prop. When
                                // serialized matching misses, also mount the list so rendered labels (which can
                                // differ from the serialized values) are registered for autofill matching.
                                store.set('forceMounted', true);
                            }
                        }
                        queueMicrotask(handleChange);
                    }
                }),
                id: id && hiddenInputName == null ? `${id}-hidden-input` : undefined,
                form: form,
                name: hiddenInputName,
                autoComplete: formAutoComplete,
                disabled: disabled,
                required: required && !hasMultipleSelection,
                readOnly: readOnly,
                value: serializedValue,
                ref: hiddenInputRef,
                style: hiddenInputName ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visuallyHiddenInput"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visuallyHidden"],
                tabIndex: -1,
                "aria-hidden": true,
                suppressHydrationWarning: true
            }),
            hiddenInputs
        ]
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxRootContext"].Provider, {
        value: store,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxFloatingContext"].Provider, {
            value: floatingRootContext,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxHasItemsContext"].Provider, {
                value: hasItems,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxDerivedItemsContext"].Provider, {
                    value: itemsContextValue,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxInputValueContext"].Provider, {
                        value: inputValue,
                        children: children
                    })
                })
            })
        })
    });
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRoot.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxRoot",
    ()=>ComboboxRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$AriaCombobox$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/AriaCombobox.mjs [app-client] (ecmascript)");
/**
 * Groups all parts of the combobox.
 * Doesn't render its own HTML element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
function ComboboxRoot(props) {
    const { multiple = false, defaultValue, value, onValueChange, autoComplete, ...other } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$AriaCombobox$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AriaCombobox"], {
        ...other,
        selectionMode: multiple ? 'multiple' : 'single',
        selectedValue: value,
        defaultSelectedValue: defaultValue,
        onSelectedValueChange: onValueChange,
        formAutoComplete: autoComplete
    });
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/label/ComboboxLabel.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxLabel",
    ()=>ComboboxLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$error$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/error.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$safeReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/safeReact.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-root-context/FieldRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$constants$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-constants/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$useLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/labelable-provider/useLabel.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$resolveAriaLabelledBy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/resolveAriaLabelledBy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
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
const ComboboxLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxLabel(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    // Keep label id derived from the root and ignore runtime `id` overrides from untyped consumers.
    const elementPropsWithoutId = elementProps;
    delete elementPropsWithoutId.id;
    const fieldRootContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFieldRootContext"])();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const inputInsidePopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputInsidePopup);
    const triggerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].triggerElement);
    const inputElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputElement);
    const rootId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].id);
    const defaultLabelId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$resolveAriaLabelledBy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultLabelId"])(rootId);
    const localControlId = triggerElement?.id ?? (inputInsidePopup ? rootId : undefined);
    if ("TURBOPACK compile-time truthy", 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "ComboboxLabel.ComboboxLabel.useEffect": ()=>{
                if (!inputElement || inputInsidePopup) {
                    return;
                }
                const ownerStackMessage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$safeReact$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SafeReact"].captureOwnerStack?.() || '';
                const message = '<Combobox.Label> labels <Combobox.Trigger> only. ' + 'When <Combobox.Input> is the form control, use a native <label> or <Field.Label> instead.';
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$error$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])(`${message}${ownerStackMessage}`);
            }
        }["ComboboxLabel.ComboboxLabel.useEffect"], [
            inputElement,
            inputInsidePopup
        ]);
    }
    const labelProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$useLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLabel"])({
        id: defaultLabelId,
        fallbackControlId: localControlId,
        setLabelId (nextLabelId) {
            const resolvedLabelId = typeof nextLabelId === 'function' ? nextLabelId(store.state.labelId) : nextLabelId;
            store.set('labelId', resolvedLabelId);
        }
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: forwardedRef,
        state: fieldRootContext.state,
        props: [
            labelProps,
            elementProps
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$constants$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldValidityMapping"]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxLabel.displayName = "ComboboxLabel";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/value/ComboboxValue.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxValue",
    ()=>ComboboxValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/resolveValueLabel.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
/**
 * The current value of the combobox.
 * Doesn't render its own HTML element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function ComboboxValue(props) {
    const { children: childrenProp, placeholder } = props;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const itemToStringLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].itemToStringLabel);
    const selectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedValue);
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].items);
    const multiple = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectionMode) === 'multiple';
    const hasSelectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].hasSelectedValue);
    const shouldCheckNullItemLabel = !hasSelectedValue && placeholder != null && childrenProp == null;
    const hasNullLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].hasNullItemLabel, shouldCheckNullItemLabel);
    let children = null;
    if (typeof childrenProp === 'function') {
        children = childrenProp(selectedValue);
    } else if (childrenProp != null) {
        children = childrenProp;
    } else if (!hasSelectedValue && placeholder != null && !hasNullLabel) {
        children = placeholder;
    } else if (multiple && Array.isArray(selectedValue)) {
        children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveMultipleLabels"])(selectedValue, items, itemToStringLabel);
    } else {
        children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$resolveValueLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSelectedLabel"])(selectedValue, items, itemToStringLabel);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    });
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/stateAttributesMapping.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "triggerStateAttributesMapping",
    ()=>triggerStateAttributesMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$constants$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-constants/constants.mjs [app-client] (ecmascript)");
;
;
const triggerStateAttributesMapping = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pressableTriggerOpenStateMapping"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$constants$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldValidityMapping"],
    popupSide: (side)=>side ? {
            'data-popup-side': side
        } : null,
    listEmpty: (empty)=>empty ? {
            'data-list-empty': ''
        } : null
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chips/ComboboxChipsContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxChipsContext",
    ()=>ComboboxChipsContext,
    "useComboboxChipsContext",
    ()=>useComboboxChipsContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
const ComboboxChipsContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxChipsContext.displayName = "ComboboxChipsContext";
function useComboboxChipsContext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxChipsContext);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositionerContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxPositionerContext",
    ()=>ComboboxPositionerContext,
    "useComboboxPositionerContext",
    ()=>useComboboxPositionerContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ComboboxPositionerContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxPositionerContext.displayName = "ComboboxPositionerContext";
function useComboboxPositionerContext(optional) {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxPositionerContext);
    if (context === undefined && !optional) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: <Combobox.Popup> and <Combobox.Arrow> must be used within the <Combobox.Positioner> component' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/ComboboxInternalDismissButton.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxInternalDismissButton",
    ()=>ComboboxInternalDismissButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useMergedRefs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useMergedRefs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/visuallyHidden.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/use-button/useButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const ComboboxInternalDismissButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxInternalDismissButton(_, forwardedRef) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const { buttonRef, getButtonProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useButton"])({
        native: false
    });
    const mergedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useMergedRefs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMergedRefs"])(forwardedRef, buttonRef);
    function handleDismiss(event) {
        store.state.setOpen(false, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].closePress, event.nativeEvent, event.currentTarget));
    }
    const dismissProps = getButtonProps({
        onClick: handleDismiss
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
        ref: mergedRef,
        ...dismissProps,
        "aria-label": "Dismiss",
        tabIndex: undefined,
        style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visuallyHiddenInput"]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxInternalDismissButton.displayName = "ComboboxInternalDismissButton";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clickHighlightedItem",
    ()=>clickHighlightedItem,
    "getChipNavigationKeys",
    ()=>getChipNavigationKeys,
    "getIndexAfterChipRemoval",
    ()=>getIndexAfterChipRemoval,
    "useListEmpty",
    ()=>useListEmpty,
    "usePopupSide",
    ()=>usePopupSide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
'use client';
;
;
;
function usePopupSide(store) {
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].mounted);
    const popupSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].popupSide);
    const positionerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].positionerElement);
    return mounted && positionerElement ? popupSide : null;
}
function useListEmpty() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxDerivedItemsContext"])().filteredItems.length === 0;
}
function getChipNavigationKeys(direction) {
    return direction === 'rtl' ? [
        'ArrowRight',
        'ArrowLeft'
    ] : [
        'ArrowLeft',
        'ArrowRight'
    ];
}
function getIndexAfterChipRemoval(index, chipCount) {
    const nextIndex = index >= chipCount - 1 ? chipCount - 2 : index;
    return nextIndex >= 0 ? nextIndex : undefined;
}
function clickHighlightedItem(store, activeIndex, nativeEvent) {
    const listItem = store.state.listRef.current[activeIndex];
    if (listItem) {
        store.state.selectionEventRef.current = nativeEvent;
        listItem.click();
        store.state.selectionEventRef.current = null;
    }
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/input/ComboboxInput.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxInput",
    ()=>ComboboxInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useBaseUiId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-root-context/FieldRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$constants$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-constants/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$LabelableContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/labelable-provider/LabelableContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChipsContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chips/ComboboxChipsContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/utils/event.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositionerContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/direction-context/DirectionContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$ComboboxInternalDismissButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/ComboboxInternalDismissButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)");
/**
 * A text input to search for items in the list.
 * Renders an `<input>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
const ComboboxInput = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxInput(componentProps, forwardedRef) {
    const { render, className, disabled: disabledProp = false, id: idProp, style, ...elementProps } = componentProps;
    const { state: fieldState, disabled: fieldDisabled, setTouched, setFocused, validationMode, validation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFieldRootContext"])();
    const { labelId: fieldLabelId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$LabelableContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLabelableContext"])();
    const comboboxChipsContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChipsContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxChipsContext"])();
    const positioning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxPositionerContext"])(true);
    const hasPositionerParent = Boolean(positioning);
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    // `inputValue` can't be placed in the store.
    // https://github.com/mui/base-ui/issues/2703
    const inputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxInputValueContext"])();
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])();
    const required = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].required);
    const comboboxDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].disabled);
    const readOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].readOnly);
    const name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].name);
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].form);
    const selectionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectionMode);
    const autoHighlightMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].autoHighlight);
    const inputProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputProps);
    const triggerProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].triggerProps);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].mounted);
    const selectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedValue);
    const rootId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].id);
    const inline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inline);
    const modal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].modal);
    const autoHighlightEnabled = Boolean(autoHighlightMode);
    const popupSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePopupSide"])(store);
    const disabled = fieldDisabled || comboboxDisabled || disabledProp;
    const listEmpty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useListEmpty"])();
    const isInsidePopup = hasPositionerParent || inline;
    const focusManagerModal = !isInsidePopup || modal;
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBaseUiId"])(idProp ?? (!isInsidePopup ? rootId : undefined));
    const fieldStateForInput = hasPositionerParent ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$constants$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FIELD_STATE_ATTRIBUTES"] : fieldState;
    const [composingValue, setComposingValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const isComposingRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const lastActiveIndexRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const shouldRestoreActiveIndexRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const inputOwnsFormValue = selectionMode === 'none' && !hasPositionerParent;
    const setInputElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "ComboboxInput.ComboboxInput.useStableCallback[setInputElement]": (element)=>{
            const nextIsInsidePopup = hasPositionerParent || store.state.inline;
            if (nextIsInsidePopup && !store.state.hasInputValue) {
                store.state.setInputValue('', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none));
            }
            store.update({
                inputElement: element,
                inputInsidePopup: nextIsInsidePopup,
                inputOwnsFormValue
            });
        }
    }["ComboboxInput.ComboboxInput.useStableCallback[setInputElement]"]);
    const validationProps = hasPositionerParent ? elementProps : validation.getValidationProps(disabled, elementProps);
    function clearHighlight() {
        store.state.setIndices({
            activeIndex: null,
            selectedIndex: null,
            type: store.state.keyboardActiveRef.current ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].keyboard : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].pointer
        });
    }
    function markPointerActive() {
        store.state.keyboardActiveRef.current = false;
    }
    const state = {
        ...fieldStateForInput,
        open,
        disabled,
        readOnly,
        popupSide,
        listEmpty
    };
    function handleKeyDown(event) {
        if (!comboboxChipsContext) {
            return undefined;
        }
        let nextIndex;
        const { highlightedChipIndex } = comboboxChipsContext;
        const renderedChipsCount = comboboxChipsContext.chipsRef.current.length;
        const [previousChipKey, nextChipKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChipNavigationKeys"])(direction);
        if (highlightedChipIndex !== undefined) {
            if (event.key === previousChipKey) {
                event.preventDefault();
                if (highlightedChipIndex > 0) {
                    nextIndex = highlightedChipIndex - 1;
                } else {
                    nextIndex = undefined;
                }
            } else if (event.key === nextChipKey) {
                event.preventDefault();
                if (highlightedChipIndex < renderedChipsCount - 1) {
                    nextIndex = highlightedChipIndex + 1;
                } else {
                    nextIndex = undefined;
                }
            } else if (event.key === 'Backspace' || event.key === 'Delete') {
                event.preventDefault();
                // Move highlight appropriately after removal.
                nextIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIndexAfterChipRemoval"])(highlightedChipIndex, selectedValue.length);
                clearHighlight();
            }
            return nextIndex;
        }
        // Handle navigation when no chip is highlighted
        if (event.key === previousChipKey && (event.currentTarget.selectionStart ?? 0) === 0 && selectedValue.length > 0) {
            event.preventDefault();
            nextIndex = renderedChipsCount > 0 ? renderedChipsCount - 1 : undefined;
        }
        return nextIndex;
    }
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('input', componentProps, {
        state,
        ref: [
            forwardedRef,
            store.state.inputRef,
            setInputElement
        ],
        props: [
            inputProps,
            triggerProps,
            {
                value: composingValue ?? inputValue,
                'aria-readonly': readOnly || undefined,
                'aria-required': required || undefined,
                'aria-labelledby': fieldLabelId,
                disabled,
                readOnly,
                required: selectionMode === 'none' ? required : undefined,
                form,
                ...inputOwnsFormValue && name && {
                    name
                },
                id,
                onFocus () {
                    setFocused(true);
                    if (!inline || !shouldRestoreActiveIndexRef.current) {
                        return;
                    }
                    shouldRestoreActiveIndexRef.current = false;
                    const nextActiveIndex = lastActiveIndexRef.current;
                    if (nextActiveIndex == null || // `valuesRef` can be sparse, so guard against restoring a removed slot.
                    !Object.hasOwn(store.state.valuesRef.current, nextActiveIndex)) {
                        return;
                    }
                    store.state.setIndices({
                        activeIndex: nextActiveIndex
                    });
                },
                onBlur () {
                    setTouched(true);
                    setFocused(false);
                    const activeIndex = store.state.activeIndex;
                    if (inline && activeIndex !== null && autoHighlightMode !== 'always') {
                        lastActiveIndexRef.current = activeIndex;
                        shouldRestoreActiveIndexRef.current = true;
                        store.state.setIndices({
                            activeIndex: null
                        });
                    }
                    if (validationMode === 'onBlur') {
                        const valueToValidate = selectionMode === 'none' ? inputValue : selectedValue;
                        validation.commit(valueToValidate);
                    }
                },
                onCompositionStart (event) {
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].os.android) {
                        return;
                    }
                    isComposingRef.current = true;
                    setComposingValue(event.currentTarget.value);
                },
                onCompositionEnd (event) {
                    isComposingRef.current = false;
                    const next = event.currentTarget.value;
                    setComposingValue(null);
                    store.state.setInputValue(next, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputChange, event.nativeEvent));
                },
                onChange (event) {
                    const nativeEvent = event.nativeEvent;
                    // Autofill may not provide `inputType` (Chrome) or may report
                    // `insertReplacementText` (Firefox).
                    const inputType = nativeEvent.inputType;
                    const autofillLikeInput = !inputType || inputType === 'insertReplacementText';
                    // During composition the input is always considered typed into.
                    const shouldOpenOnInput = isComposingRef.current || !autofillLikeInput;
                    function maybeOpenOnInput(trimmed) {
                        if (readOnly || disabled || !trimmed || !shouldOpenOnInput) {
                            return;
                        }
                        store.state.setOpen(true, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputChange, nativeEvent));
                        // When autoHighlight is enabled, keep the highlight (will be set to 0 in root).
                        if (!autoHighlightEnabled) {
                            clearHighlight();
                        }
                    }
                    // During IME composition, avoid propagating controlled updates to prevent
                    // filtering the options prematurely so `Empty` won't show incorrectly.
                    // We can't rely on this check for Android due to how it handles composition
                    // events with some keyboards (e.g. Samsung keyboard with predictive text on
                    // treats all text as always-composing).
                    // https://github.com/mui/base-ui/issues/2942
                    if (isComposingRef.current) {
                        const nextVal = event.currentTarget.value;
                        setComposingValue(nextVal);
                        if (nextVal === '' && !store.state.openOnInputClick && !store.state.inputInsidePopup) {
                            store.state.setOpen(false, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear, nativeEvent));
                        }
                        const trimmed = nextVal.trim();
                        const shouldMaintainHighlight = autoHighlightEnabled && trimmed !== '';
                        maybeOpenOnInput(trimmed);
                        if (open && store.state.activeIndex !== null && !shouldMaintainHighlight) {
                            clearHighlight();
                        }
                        return;
                    }
                    const inputChangeDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputChange, nativeEvent);
                    store.state.setInputValue(event.currentTarget.value, inputChangeDetails);
                    if (inputChangeDetails.isCanceled) {
                        return;
                    }
                    const empty = event.currentTarget.value === '';
                    const clearDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputClear, nativeEvent);
                    if (empty && !store.state.inputInsidePopup) {
                        if (selectionMode === 'single') {
                            store.state.setSelectedValue(null, clearDetails);
                        }
                        if (!store.state.openOnInputClick) {
                            store.state.setOpen(false, clearDetails);
                        }
                    }
                    maybeOpenOnInput(event.currentTarget.value.trim());
                    // When the user types, ensure the list resets its highlight so that
                    // virtual focus returns to the input (aria-activedescendant is
                    // cleared).
                    if (open && store.state.activeIndex !== null && !autoHighlightEnabled) {
                        clearHighlight();
                    }
                },
                onKeyDown (event) {
                    if (disabled || readOnly) {
                        return;
                    }
                    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
                        return;
                    }
                    store.state.keyboardActiveRef.current = true;
                    const input = event.currentTarget;
                    const scrollAmount = input.scrollWidth - input.clientWidth;
                    const isRTL = direction === 'rtl';
                    if (event.key === 'Home') {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
                        const cursor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].engine.gecko && isRTL ? input.value.length : 0;
                        input.setSelectionRange(cursor, cursor);
                        input.scrollLeft = 0;
                        return;
                    }
                    if (event.key === 'End') {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
                        const cursor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].engine.gecko && isRTL ? 0 : input.value.length;
                        input.setSelectionRange(cursor, cursor);
                        input.scrollLeft = isRTL ? -scrollAmount : scrollAmount;
                        return;
                    }
                    if (!mounted && event.key === 'Escape') {
                        const isClear = selectionMode === 'multiple' && Array.isArray(selectedValue) ? selectedValue.length === 0 : selectedValue === null;
                        const details = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].escapeKey, event.nativeEvent);
                        const value = selectionMode === 'multiple' ? [] : null;
                        store.state.setInputValue('', details);
                        store.state.setSelectedValue(value, details);
                        if (!isClear && !store.state.inline && !details.isPropagationAllowed) {
                            event.stopPropagation();
                        }
                        return;
                    }
                    // Handle deletion when no chip is highlighted and the input is empty.
                    if (comboboxChipsContext && event.key === 'Backspace' && input.value === '' && comboboxChipsContext.highlightedChipIndex === undefined && Array.isArray(selectedValue) && selectedValue.length > 0) {
                        const renderedChipsCount = comboboxChipsContext.chipsRef.current.length;
                        const removalIndex = renderedChipsCount > 0 ? renderedChipsCount - 1 : selectedValue.length - 1;
                        const newValue = selectedValue.filter({
                            "ComboboxInput.ComboboxInput.useRenderElement[element].newValue": (_, index)=>index !== removalIndex
                        }["ComboboxInput.ComboboxInput.useRenderElement[element].newValue"]);
                        // If the removed item was also the active (highlighted) item, clear highlight
                        clearHighlight();
                        store.state.setSelectedValue(newValue, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none, event.nativeEvent));
                        return;
                    }
                    const hadHighlightedChip = comboboxChipsContext?.highlightedChipIndex !== undefined;
                    const nextIndex = handleKeyDown(event);
                    comboboxChipsContext?.setHighlightedChipIndex(nextIndex);
                    if (nextIndex !== undefined) {
                        comboboxChipsContext?.chipsRef.current[nextIndex]?.focus();
                    } else if (hadHighlightedChip) {
                        store.state.inputRef.current?.focus();
                    }
                    // event.isComposing
                    if (event.which === 229) {
                        return;
                    }
                    if (event.key === 'Enter' && open) {
                        const activeIndex = store.state.activeIndex;
                        const nativeEvent = event.nativeEvent;
                        if (activeIndex === null) {
                            if (inline) {
                                return;
                            }
                            // Allow form submission when no item is highlighted.
                            store.state.setOpen(false, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none, nativeEvent));
                            return;
                        }
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clickHighlightedItem"])(store, activeIndex, nativeEvent);
                    }
                },
                onPointerMove: markPointerActive,
                onPointerDown: markPointerActive
            },
            validationProps
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerStateAttributesMapping"]
    });
    const renderedInput = hasPositionerParent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldRootContext"].Provider, {
        value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FIELD_ROOT_CONTEXT"],
        children: element
    }) : element;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            open && focusManagerModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$ComboboxInternalDismissButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxInternalDismissButton"], {
                ref: store.state.startDismissRef
            }),
            renderedInput
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxInput.displayName = "ComboboxInput";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/handleInputPress.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleInputPress",
    ()=>handleInputPress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/shadowDom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$element$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/utils/element.mjs [app-client] (ecmascript) <locals>");
;
;
;
;
function handleInputPress(event, store, disabled, readOnly, shouldIgnoreTarget) {
    if (event.baseUIHandlerPrevented || readOnly) {
        return;
    }
    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTarget"])(event.nativeEvent);
    const targetElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(target) ? target : null;
    if (targetElement !== event.currentTarget && (shouldIgnoreTarget?.(targetElement) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$element$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isInteractiveElement"])(targetElement))) {
        return;
    }
    event.preventDefault();
    if (disabled) {
        return;
    }
    store.state.inputRef.current?.focus();
    if (store.state.openOnInputClick) {
        store.state.setOpen(true, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].inputPress, event.nativeEvent));
    }
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/input-group/ComboboxInputGroup.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxInputGroup",
    ()=>ComboboxInputGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-root-context/FieldRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$handleInputPress$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/handleInputPress.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/shadowDom.mjs [app-client] (ecmascript)");
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
const ComboboxInputGroup = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxInputGroup(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const { state: fieldState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFieldRootContext"])();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const comboboxDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].disabled);
    const readOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].readOnly);
    const hasSelectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].hasSelectedValue);
    const selectionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectionMode);
    const popupSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePopupSide"])(store);
    const disabled = comboboxDisabled;
    const listEmpty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useListEmpty"])();
    const placeholder = selectionMode === 'none' ? false : !hasSelectedValue;
    const state = {
        ...fieldState,
        open,
        disabled,
        readOnly,
        popupSide,
        listEmpty,
        placeholder
    };
    const setInputGroupElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "ComboboxInputGroup.ComboboxInputGroup.useStableCallback[setInputGroupElement]": (element)=>{
            store.set('inputGroupElement', element);
        }
    }["ComboboxInputGroup.ComboboxInputGroup.useStableCallback[setInputGroupElement]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: [
            forwardedRef,
            setInputGroupElement
        ],
        props: [
            {
                role: 'group',
                onMouseDown (event) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$handleInputPress$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleInputPress"])(event, store, disabled, readOnly, {
                        "ComboboxInputGroup.ComboboxInputGroup.useRenderElement": (target)=>{
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(store.state.chipsContainerRef.current, target);
                        }
                    }["ComboboxInputGroup.ComboboxInputGroup.useRenderElement"]);
                }
            },
            elementProps
        ],
        state,
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerStateAttributesMapping"]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxInputGroup.displayName = "ComboboxInputGroup";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/trigger/ComboboxTrigger.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxTrigger",
    ()=>ComboboxTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useTimeout$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useTimeout.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/use-button/useButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-root-context/FieldRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$LabelableContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/labelable-provider/LabelableContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/utils/event.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/shadowDom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$getPseudoElementBounds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/getPseudoElementBounds.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useClick$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/useClick.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useTypeahead$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/hooks/useTypeahead.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$useLabelableId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/labelable-provider/useLabelableId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$resolveAriaLabelledBy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/resolveAriaLabelledBy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
const ComboboxTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxTrigger(componentProps, forwardedRef) {
    const { render, className, nativeButton = true, disabled: disabledProp = false, id: idProp, style, ...elementProps } = componentProps;
    const { state: fieldState, disabled: fieldDisabled, setTouched, setFocused, validationMode, validation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFieldRootContext"])();
    const { labelId: fieldLabelId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$LabelableContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLabelableContext"])();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const selectionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectionMode);
    const comboboxDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].disabled);
    const readOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].readOnly);
    const required = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].required);
    const positionerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].positionerElement);
    const listElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].listElement);
    const storedPopupId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].popupId);
    const triggerProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].triggerProps);
    const inputInsidePopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputInsidePopup);
    const rootId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].id);
    const comboboxLabelId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].labelId);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const selectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedValue);
    const activeIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].activeIndex);
    const selectedIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedIndex);
    const hasSelectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].hasSelectedValue);
    const floatingRootContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxFloatingContext"])();
    const inputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxInputValueContext"])();
    const focusTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useTimeout$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTimeout"])();
    const disabled = fieldDisabled || comboboxDisabled || disabledProp;
    const listEmpty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useListEmpty"])();
    const popupSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePopupSide"])(store);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$labelable$2d$provider$2f$useLabelableId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLabelableId"])({
        id: inputInsidePopup ? idProp : undefined
    });
    const id = inputInsidePopup ? idProp ?? rootId : idProp;
    const ariaLabelledBy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$resolveAriaLabelledBy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveAriaLabelledBy"])(fieldLabelId, comboboxLabelId);
    let ariaControls;
    if (open && inputInsidePopup) {
        // Fall back to the default id while the popup registers its own (custom ids are stored once the
        // popup mounts), so `aria-controls` is set on the same commit `open` becomes `true`.
        ariaControls = storedPopupId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComboboxPopupId"])(rootId);
    } else if (open) {
        ariaControls = listElement?.id;
    }
    const currentPointerTypeRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]('');
    function trackPointerType(event) {
        currentPointerTypeRef.current = event.pointerType;
    }
    const { reference: triggerTypeaheadProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useTypeahead$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTypeahead"])(floatingRootContext, {
        enabled: !open && !readOnly && !comboboxDisabled && selectionMode === 'single',
        listRef: store.state.labelsRef,
        activeIndex,
        selectedIndex,
        onMatch (index) {
            const nextSelectedValue = store.state.valuesRef.current[index];
            if (nextSelectedValue !== undefined) {
                store.state.setSelectedValue(nextSelectedValue, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none));
            }
        }
    });
    const { reference: triggerClickProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useClick$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClick"])(floatingRootContext, {
        enabled: !readOnly && !comboboxDisabled,
        event: 'mousedown'
    });
    const { buttonRef, getButtonProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useButton"])({
        native: nativeButton,
        disabled
    });
    const state = {
        ...fieldState,
        open,
        disabled,
        popupSide,
        listEmpty,
        placeholder: selectionMode === 'none' ? false : !hasSelectedValue
    };
    const setTriggerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "ComboboxTrigger.ComboboxTrigger.useStableCallback[setTriggerElement]": (element)=>{
            store.set('triggerElement', element);
        }
    }["ComboboxTrigger.ComboboxTrigger.useStableCallback[setTriggerElement]"]);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('button', componentProps, {
        ref: [
            forwardedRef,
            buttonRef,
            setTriggerElement
        ],
        state,
        props: [
            triggerProps,
            triggerClickProps,
            triggerTypeaheadProps,
            {
                id,
                tabIndex: inputInsidePopup ? 0 : -1,
                role: inputInsidePopup ? 'combobox' : undefined,
                'aria-expanded': open,
                'aria-haspopup': inputInsidePopup ? 'dialog' : 'listbox',
                'aria-controls': ariaControls,
                'aria-required': inputInsidePopup ? required || undefined : undefined,
                'aria-labelledby': ariaLabelledBy,
                onPointerDown: trackPointerType,
                onPointerEnter: trackPointerType,
                onFocus () {
                    setFocused(true);
                    if (disabled || readOnly) {
                        return;
                    }
                    focusTimeout.start(0, store.state.forceMount);
                },
                onBlur (event) {
                    // If focus is moving into the popup, don't count it as a blur.
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(positionerElement, event.relatedTarget)) {
                        return;
                    }
                    setTouched(true);
                    setFocused(false);
                    if (validationMode === 'onBlur') {
                        const valueToValidate = selectionMode === 'none' ? inputValue : selectedValue;
                        validation.commit(valueToValidate);
                    }
                },
                onMouseDown (event) {
                    if (disabled || readOnly) {
                        return;
                    }
                    if (!inputInsidePopup) {
                        floatingRootContext.set('domReferenceElement', event.currentTarget);
                    }
                    // Ensure items are registered for initial selection highlight.
                    store.state.forceMount();
                    if (currentPointerTypeRef.current !== 'touch') {
                        store.state.inputRef.current?.focus();
                        if (!inputInsidePopup) {
                            event.preventDefault();
                        }
                    }
                    if (open) {
                        return;
                    }
                    const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(event.currentTarget);
                    function handleMouseUp(mouseEvent) {
                        const currentTriggerElement = store.state.triggerElement;
                        if (!currentTriggerElement) {
                            return;
                        }
                        const mouseUpTarget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTarget"])(mouseEvent);
                        const positioner = store.state.positionerElement;
                        const list = store.state.listElement;
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(currentTriggerElement, mouseUpTarget) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(positioner, mouseUpTarget) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(list, mouseUpTarget)) {
                            return;
                        }
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$getPseudoElementBounds$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isMouseWithinBounds"])(mouseEvent, currentTriggerElement)) {
                            return;
                        }
                        store.state.setOpen(false, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].cancelOpen, mouseEvent));
                    }
                    if (inputInsidePopup) {
                        doc.addEventListener('mouseup', handleMouseUp, {
                            once: true
                        });
                    }
                },
                onKeyDown (event) {
                    if (readOnly) {
                        return;
                    }
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
                        store.state.setOpen(true, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].listNavigation, event.nativeEvent));
                        store.state.inputRef.current?.focus();
                    }
                }
            },
            validation.getValidationProps(disabled, elementProps),
            getButtonProps
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerStateAttributesMapping"]
    });
    return element;
});
if ("TURBOPACK compile-time truthy", 1) ComboboxTrigger.displayName = "ComboboxTrigger";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/collection/GroupCollectionContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GroupCollectionProvider",
    ()=>GroupCollectionProvider,
    "useGroupCollectionContext",
    ()=>useGroupCollectionContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
const GroupCollectionContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
if ("TURBOPACK compile-time truthy", 1) GroupCollectionContext.displayName = "GroupCollectionContext";
function useGroupCollectionContext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](GroupCollectionContext);
}
function GroupCollectionProvider(props) {
    const { children, items } = props;
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GroupCollectionProvider.useMemo[contextValue]": ()=>({
                items
            })
    }["GroupCollectionProvider.useMemo[contextValue]"], [
        items
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(GroupCollectionContext.Provider, {
        value: contextValue,
        children: children
    });
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/collection/ComboboxCollection.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxCollection",
    ()=>ComboboxCollection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$GroupCollectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/collection/GroupCollectionContext.mjs [app-client] (ecmascript)");
/**
 * Renders filtered list items.
 * Doesn't render its own HTML element.
 *
 * If rendering a flat list, pass a function child to the `List` component instead, which implicitly wraps it.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
function ComboboxCollection(props) {
    const { children } = props;
    const { filteredItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxDerivedItemsContext"])();
    const groupContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$GroupCollectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGroupCollectionContext"])();
    const itemsToRender = groupContext ? groupContext.items : filteredItems;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: itemsToRender.map(children)
    });
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/list/ComboboxList.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxList",
    ()=>ComboboxList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositionerContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$ComboboxCollection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/collection/ComboboxCollection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$CompositeList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/composite/list/CompositeList.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/utils/event.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)");
/**
 * A list container for the items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
const ComboboxList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxList(componentProps, forwardedRef) {
    var _ComboboxCollection;
    const { render, className, style, children, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const floatingRootContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxFloatingContext"])();
    const hasPositionerContext = Boolean((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxPositionerContext"])(true));
    const { filteredItems, hasItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxDerivedItemsContext"])();
    const selectionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectionMode);
    const grid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].grid);
    const listProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].listProps);
    const virtualized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].virtualized);
    const forceMounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].forceMounted);
    const multiple = selectionMode === 'multiple';
    const empty = filteredItems.length === 0;
    const setPositionerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "ComboboxList.ComboboxList.useStableCallback[setPositionerElement]": (element)=>{
            store.set('positionerElement', element);
        }
    }["ComboboxList.ComboboxList.useStableCallback[setPositionerElement]"]);
    const setListElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "ComboboxList.ComboboxList.useStableCallback[setListElement]": (element)=>{
            store.set('listElement', element);
        }
    }["ComboboxList.ComboboxList.useStableCallback[setListElement]"]);
    // Support "closed template" API: if children is a function, implicitly wrap it
    // with a Combobox.Collection that reads items from context/root.
    // Ensures this component's `listProps` subscription does not cause <Combobox.Item>
    // to re-render on every active index change.
    const resolvedChildren = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ComboboxList.ComboboxList.useMemo[resolvedChildren]": ()=>{
            if (typeof children === 'function') {
                return _ComboboxCollection || (_ComboboxCollection = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$ComboboxCollection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxCollection"], {
                    children: children
                }));
            }
            return children;
        }
    }["ComboboxList.ComboboxList.useMemo[resolvedChildren]"], [
        children
    ]);
    const state = {
        empty
    };
    const floatingId = floatingRootContext.useState('floatingId');
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: [
            forwardedRef,
            setListElement,
            hasPositionerContext ? null : setPositionerElement
        ],
        props: [
            listProps,
            {
                children: resolvedChildren,
                tabIndex: -1,
                id: floatingId,
                role: grid ? 'grid' : 'listbox',
                'aria-multiselectable': multiple ? 'true' : undefined,
                onKeyDown (event) {
                    if (store.state.disabled || store.state.readOnly) {
                        return;
                    }
                    if (event.key === 'Enter') {
                        const activeIndex = store.state.activeIndex;
                        if (activeIndex == null) {
                            // Allow form submission when no item is highlighted.
                            return;
                        }
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clickHighlightedItem"])(store, activeIndex, event.nativeEvent);
                    }
                },
                onKeyDownCapture () {
                    store.state.keyboardActiveRef.current = true;
                },
                onPointerMoveCapture () {
                    store.state.keyboardActiveRef.current = false;
                }
            },
            elementProps
        ]
    });
    if (virtualized) {
        return element;
    }
    // With the `items` prop, typeahead labels are derived from the items so they survive the list
    // unmounting (unmounting clears the registered labels). Rendered labels only need to be
    // registered when the list is force-mounted to match browser autofill against rendered text.
    const labelsRef = hasItems && !forceMounted ? undefined : store.state.labelsRef;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$CompositeList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompositeList"], {
        elementsRef: store.state.listRef,
        labelsRef: labelsRef,
        children: element
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxList.displayName = "ComboboxList";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/useInitialLiveRegionTextMutation.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INITIAL_LIVE_REGION_TEXT_MUTATION_RESET_DELAY",
    ()=>INITIAL_LIVE_REGION_TEXT_MUTATION_RESET_DELAY,
    "useInitialLiveRegionTextMutation",
    ()=>useInitialLiveRegionTextMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useTimeout$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useTimeout.mjs [app-client] (ecmascript)");
'use client';
;
;
;
// Word Joiner is invisible and zero-width, so it forces a text mutation without shifting layout.
const LIVE_REGION_MARKER = '\u2060';
const INITIAL_LIVE_REGION_TEXT_MUTATION_RESET_DELAY = 200;
function findLastTextNode(root) {
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let lastTextNode = null;
    while(walker.nextNode()){
        const textNode = walker.currentNode;
        if (textNode.nodeValue !== '') {
            lastTextNode = textNode;
        }
    }
    return lastTextNode;
}
function useInitialLiveRegionTextMutation() {
    const timeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useTimeout$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTimeout"])();
    const rootRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    // Only the initial mounted announcement needs the marker; later text updates announce naturally.
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useInitialLiveRegionTextMutation.useEffect": ()=>{
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].os.ios) {
                return undefined;
            }
            const root = rootRef.current;
            if (root == null) {
                return undefined;
            }
            const textNode = findLastTextNode(root);
            if (textNode == null) {
                return undefined;
            }
            const originalValue = textNode.data;
            const markedValue = `${originalValue}${LIVE_REGION_MARKER}`;
            textNode.nodeValue = markedValue;
            timeout.start(INITIAL_LIVE_REGION_TEXT_MUTATION_RESET_DELAY, {
                "useInitialLiveRegionTextMutation.useEffect": ()=>{
                    if (textNode.nodeValue === markedValue) {
                        textNode.nodeValue = originalValue;
                    }
                }
            }["useInitialLiveRegionTextMutation.useEffect"]);
            return ({
                "useInitialLiveRegionTextMutation.useEffect": ()=>{
                    timeout.clear();
                    if (textNode.nodeValue === markedValue) {
                        textNode.nodeValue = originalValue;
                    }
                }
            })["useInitialLiveRegionTextMutation.useEffect"];
        }
    }["useInitialLiveRegionTextMutation.useEffect"], [
        rootRef,
        timeout
    ]);
    return rootRef;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/status/ComboboxStatus.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxStatus",
    ()=>ComboboxStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$useInitialLiveRegionTextMutation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/useInitialLiveRegionTextMutation.mjs [app-client] (ecmascript)");
'use client';
;
;
;
const ComboboxStatus = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxStatus(componentProps, forwardedRef) {
    const { render, className, style, children: childrenProp, ...elementProps } = componentProps;
    const statusRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$useInitialLiveRegionTextMutation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInitialLiveRegionTextMutation"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: [
            forwardedRef,
            statusRef
        ],
        props: [
            {
                children: childrenProp,
                role: 'status',
                'aria-live': 'polite',
                'aria-atomic': true
            },
            elementProps
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxStatus.displayName = "ComboboxStatus";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/portal/ComboboxPortalContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxPortalContext",
    ()=>ComboboxPortalContext,
    "useComboboxPortalContext",
    ()=>useComboboxPortalContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ComboboxPortalContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxPortalContext.displayName = "ComboboxPortalContext";
function useComboboxPortalContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxPortalContext);
    if (context === undefined) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: <Combobox.Portal> is missing.' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/portal/ComboboxPortal.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxPortal",
    ()=>ComboboxPortal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingPortal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/components/FloatingPortal.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$portal$2f$ComboboxPortalContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/portal/ComboboxPortalContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const ComboboxPortal = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxPortal(props, forwardedRef) {
    const { keepMounted = false, ...portalProps } = props;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].mounted);
    const forceMounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].forceMounted);
    const shouldRender = mounted || keepMounted || forceMounted;
    if (!shouldRender) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$portal$2f$ComboboxPortalContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxPortalContext"].Provider, {
        value: keepMounted,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingPortal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingPortal"], {
            ref: forwardedRef,
            ...portalProps
        })
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxPortal.displayName = "ComboboxPortal";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/backdrop/ComboboxBackdrop.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxBackdrop",
    ()=>ComboboxBackdrop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const stateAttributesMapping = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["popupStateMapping"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transitionStatusMapping"]
};
const ComboboxBackdrop = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxBackdrop(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].mounted);
    const transitionStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].transitionStatus);
    const state = {
        open,
        transitionStatus
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: forwardedRef,
        stateAttributesMapping,
        props: [
            {
                role: 'presentation',
                hidden: !mounted,
                style: {
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                }
            },
            elementProps
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxBackdrop.displayName = "ComboboxBackdrop";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositioner.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxPositioner",
    ()=>ComboboxPositioner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$inertValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/inertValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositionerContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnchorPositioning$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useAnchorPositioning.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$portal$2f$ComboboxPortalContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/portal/ComboboxPortalContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$InternalBackdrop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/InternalBackdrop.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$usePositioner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/usePositioner.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$useAnchoredPopupScrollLock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/useAnchoredPopupScrollLock.mjs [app-client] (ecmascript)");
/**
 * Positions the popup against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
;
;
const ComboboxPositioner = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxPositioner(componentProps, forwardedRef) {
    const { render, className, anchor, // `useAnchorPositioning` applies the same defaults to the undefined values; the names
    // remain destructured to exclude the props from `elementProps`.
    positionMethod, side, align, sideOffset, alignOffset, collisionBoundary = 'clipping-ancestors', collisionPadding, arrowPadding, sticky, disableAnchorTracking = false, collisionAvoidance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DROPDOWN_COLLISION_AVOIDANCE"], style: styleProp, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const floatingRootContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxFloatingContext"])();
    const keepMounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$portal$2f$ComboboxPortalContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxPortalContext"])();
    const modal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].modal);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].mounted);
    const openMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].openMethod);
    const positionerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].positionerElement);
    const triggerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].triggerElement);
    const inputElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputElement);
    const inputGroupElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputGroupElement);
    const inputInsidePopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputInsidePopup);
    const transitionStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].transitionStatus);
    const empty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useListEmpty"])();
    const resolvedAnchor = anchor ?? (inputInsidePopup ? triggerElement : inputGroupElement ?? inputElement);
    const positioning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnchorPositioning$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnchorPositioning"])({
        anchor: resolvedAnchor,
        floatingRootContext,
        positionMethod,
        mounted,
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        collisionBoundary,
        collisionPadding,
        sticky,
        disableAnchorTracking,
        keepMounted,
        collisionAvoidance,
        lazyFlip: true
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$useAnchoredPopupScrollLock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnchoredPopupScrollLock"])(open && modal, openMethod === 'touch', positionerElement, triggerElement);
    const state = {
        open,
        side: positioning.side,
        align: positioning.align,
        anchorHidden: positioning.anchorHidden,
        empty
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "ComboboxPositioner.ComboboxPositioner.useIsoLayoutEffect": ()=>{
            store.set('popupSide', positioning.side);
        }
    }["ComboboxPositioner.ComboboxPositioner.useIsoLayoutEffect"], [
        store,
        positioning.side
    ]);
    const setPositionerElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "ComboboxPositioner.ComboboxPositioner.useStableCallback[setPositionerElement]": (element)=>{
            store.set('positionerElement', element);
        }
    }["ComboboxPositioner.ComboboxPositioner.useStableCallback[setPositionerElement]"]);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$usePositioner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePositioner"])(componentProps, state, {
        styles: positioning.positionerStyles,
        transitionStatus,
        props: elementProps,
        refs: [
            forwardedRef,
            setPositionerElement
        ],
        hidden: !mounted,
        inert: !open
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxPositionerContext"].Provider, {
        value: positioning,
        children: [
            mounted && modal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$InternalBackdrop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InternalBackdrop"], {
                inert: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$inertValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inertValue"])(!open),
                cutout: inputGroupElement ?? inputElement ?? triggerElement
            }),
            element
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxPositioner.displayName = "ComboboxPositioner";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/popup/ComboboxPopup.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxPopup",
    ()=>ComboboxPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingFocusManager$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/components/FloatingFocusManager.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositionerContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/shadowDom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$getDisabledMountTransitionStyles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/getDisabledMountTransitionStyles.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$ComboboxInternalDismissButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/ComboboxInternalDismissButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
;
;
;
const stateAttributesMapping = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["popupStateMapping"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transitionStatusMapping"]
};
const ComboboxPopup = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxPopup(componentProps, forwardedRef) {
    const { render, className, style, initialFocus, finalFocus, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const positioning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxPositionerContext"])();
    const floatingRootContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxFloatingContext"])();
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].mounted);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const openMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].openMethod);
    const popupProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].popupProps);
    const transitionStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].transitionStatus);
    const inputInsidePopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputInsidePopup);
    const inputElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].inputElement);
    const modal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].modal);
    const rootId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].id);
    const empty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useListEmpty"])();
    const popupId = elementProps.id ?? (inputInsidePopup ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComboboxPopupId"])(rootId) : undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "ComboboxPopup.ComboboxPopup.useIsoLayoutEffect": ()=>{
            // Prefer the rendered DOM id, which a `render` prop element or function may override.
            store.set('popupId', store.state.popupRef.current?.id || popupId);
            return ({
                "ComboboxPopup.ComboboxPopup.useIsoLayoutEffect": ()=>{
                    store.set('popupId', undefined);
                }
            })["ComboboxPopup.ComboboxPopup.useIsoLayoutEffect"];
        }
    }["ComboboxPopup.ComboboxPopup.useIsoLayoutEffect"], [
        store,
        popupId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenChangeComplete"])({
        open,
        ref: store.state.popupRef,
        onComplete () {
            if (open) {
                store.state.onOpenChangeComplete(true);
            }
        }
    });
    const state = {
        open,
        side: positioning.side,
        align: positioning.align,
        anchorHidden: positioning.anchorHidden,
        transitionStatus,
        empty
    };
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: [
            forwardedRef,
            store.state.popupRef
        ],
        props: [
            popupProps,
            {
                id: popupId,
                role: inputInsidePopup ? 'dialog' : 'presentation',
                onFocus (event) {
                    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTarget"])(event.nativeEvent);
                    if (openMethod !== 'touch' && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(store.state.listElement, target) || target === event.currentTarget)) {
                        store.state.inputRef.current?.focus();
                    }
                }
            },
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$getDisabledMountTransitionStyles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDisabledMountTransitionStyles"])(transitionStatus),
            elementProps
        ],
        stateAttributesMapping
    });
    // Default initial focus logic:
    // If opened by touch, focus the popup element to prevent the virtual keyboard from opening
    // (this is required for Android specifically as iOS handles this automatically).
    const computedDefaultInitialFocus = inputInsidePopup ? (interactionType)=>interactionType === 'touch' ? store.state.popupRef.current : inputElement : false;
    const resolvedInitialFocus = initialFocus === undefined ? computedDefaultInitialFocus : initialFocus;
    let resolvedFinalFocus;
    if (finalFocus != null) {
        resolvedFinalFocus = finalFocus;
    } else {
        resolvedFinalFocus = inputInsidePopup ? undefined : false;
    }
    const focusManagerModal = !inputInsidePopup || modal;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingFocusManager$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingFocusManager"], {
        context: floatingRootContext,
        disabled: !mounted,
        modal: focusManagerModal,
        openInteractionType: openMethod,
        initialFocus: resolvedInitialFocus,
        returnFocus: resolvedFinalFocus,
        getInsideElements: ()=>[
                store.state.startDismissRef.current,
                store.state.endDismissRef.current
            ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                element,
                focusManagerModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$ComboboxInternalDismissButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxInternalDismissButton"], {
                    ref: store.state.endDismissRef
                })
            ]
        })
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxPopup.displayName = "ComboboxPopup";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/arrow/ComboboxArrow.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxArrow",
    ()=>ComboboxArrow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositionerContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const ComboboxArrow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxArrow(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const { arrowRef, side, align, arrowUncentered, arrowStyles } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositionerContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxPositionerContext"])();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const state = {
        open,
        side,
        align,
        uncentered: arrowUncentered
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: [
            arrowRef,
            forwardedRef
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["popupStateMapping"],
        state,
        props: {
            style: arrowStyles,
            'aria-hidden': true,
            ...elementProps
        }
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxArrow.displayName = "ComboboxArrow";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/icon/ComboboxIcon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxIcon",
    ()=>ComboboxIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
'use client';
;
;
const ComboboxIcon = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxIcon(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('span', componentProps, {
        ref: forwardedRef,
        props: [
            {
                'aria-hidden': true,
                children: '▼'
            },
            elementProps
        ]
    });
    return element;
});
if ("TURBOPACK compile-time truthy", 1) ComboboxIcon.displayName = "ComboboxIcon";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/group/ComboboxGroupContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxGroupContext",
    ()=>ComboboxGroupContext,
    "useComboboxGroupContext",
    ()=>useComboboxGroupContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ComboboxGroupContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxGroupContext.displayName = "ComboboxGroupContext";
function useComboboxGroupContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxGroupContext);
    if (context === undefined) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: ComboboxGroupContext is missing. ComboboxGroup parts must be placed within <Combobox.Group>.' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/group/ComboboxGroup.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxGroup",
    ()=>ComboboxGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2f$ComboboxGroupContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/group/ComboboxGroupContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$GroupCollectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/collection/GroupCollectionContext.mjs [app-client] (ecmascript)");
/**
 * Groups related items with the corresponding label.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const ComboboxGroup = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxGroup(componentProps, forwardedRef) {
    const { render, className, style, items, ...elementProps } = componentProps;
    const [labelId, setLabelId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]();
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ComboboxGroup.ComboboxGroup.useMemo[contextValue]": ()=>({
                labelId,
                setLabelId,
                items
            })
    }["ComboboxGroup.ComboboxGroup.useMemo[contextValue]"], [
        labelId,
        setLabelId,
        items
    ]);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: forwardedRef,
        props: [
            {
                role: 'group',
                'aria-labelledby': labelId
            },
            elementProps
        ]
    });
    const wrappedElement = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2f$ComboboxGroupContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxGroupContext"].Provider, {
        value: contextValue,
        children: element
    });
    if (items) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$GroupCollectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GroupCollectionProvider"], {
            items: items,
            children: wrappedElement
        });
    }
    return wrappedElement;
});
if ("TURBOPACK compile-time truthy", 1) ComboboxGroup.displayName = "ComboboxGroup";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/group-label/ComboboxGroupLabel.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxGroupLabel",
    ()=>ComboboxGroupLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useBaseUiId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2f$ComboboxGroupContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/group/ComboboxGroupContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const ComboboxGroupLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxGroupLabel(componentProps, forwardedRef) {
    const { render, className, style, id: idProp, ...elementProps } = componentProps;
    const { setLabelId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2f$ComboboxGroupContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxGroupContext"])();
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBaseUiId"])(idProp);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "ComboboxGroupLabel.ComboboxGroupLabel.useIsoLayoutEffect": ()=>{
            setLabelId(id);
            return ({
                "ComboboxGroupLabel.ComboboxGroupLabel.useIsoLayoutEffect": ()=>{
                    setLabelId({
                        "ComboboxGroupLabel.ComboboxGroupLabel.useIsoLayoutEffect": (currentId)=>currentId === id ? undefined : currentId
                    }["ComboboxGroupLabel.ComboboxGroupLabel.useIsoLayoutEffect"]);
                }
            })["ComboboxGroupLabel.ComboboxGroupLabel.useIsoLayoutEffect"];
        }
    }["ComboboxGroupLabel.ComboboxGroupLabel.useIsoLayoutEffect"], [
        id,
        setLabelId
    ]);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: forwardedRef,
        props: [
            {
                id
            },
            elementProps
        ]
    });
    return element;
});
if ("TURBOPACK compile-time truthy", 1) ComboboxGroupLabel.displayName = "ComboboxGroupLabel";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/item/ComboboxItemContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxItemContext",
    ()=>ComboboxItemContext,
    "useComboboxItemContext",
    ()=>useComboboxItemContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ComboboxItemContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxItemContext.displayName = "ComboboxItemContext";
function useComboboxItemContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxItemContext);
    if (!context) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: ComboboxItemContext is missing. ComboboxItem parts must be placed within <Combobox.Item>.' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/row/ComboboxRowContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxRowContext",
    ()=>ComboboxRowContext,
    "useComboboxRowContext",
    ()=>useComboboxRowContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
const ComboboxRowContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](false);
if ("TURBOPACK compile-time truthy", 1) ComboboxRowContext.displayName = "ComboboxRowContext";
function useComboboxRowContext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxRowContext);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/item/ComboboxItem.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxItem",
    ()=>ComboboxItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$useCompositeListItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/composite/list/useCompositeListItem.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2f$ComboboxItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/item/ComboboxItemContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/use-button/useButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$row$2f$ComboboxRowContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/row/ComboboxRowContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/itemEquality.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
function ComboboxItemInner(props) {
    const { componentProps, forwardedRef, virtualized, indexFromFilter } = props;
    const { render, className, style, value: itemValue = null, index: indexProp, disabled: disabledProp = false, nativeButton = false, ...elementProps } = componentProps;
    const textRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const listItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$useCompositeListItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCompositeListItem"])({
        guess: true,
        index: indexProp,
        textRef
    });
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const isRow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$row$2f$ComboboxRowContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRowContext"])();
    const hasItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxHasItemsContext"])();
    const selectionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectionMode);
    const rootDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].disabled);
    const readOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].readOnly);
    const isItemEqualToValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].isItemEqualToValue);
    const disabled = rootDisabled || disabledProp;
    const selectable = selectionMode !== 'none';
    const index = indexProp ?? indexFromFilter ?? listItem.index;
    const hasRegistered = index !== -1;
    const rootId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].id);
    const highlighted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].isActive, index);
    const matchesSelectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].isSelected, itemValue);
    const itemProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].itemProps);
    const itemRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const id = rootId != null && hasRegistered ? `${rootId}-${index}` : undefined;
    const selected = matchesSelectedValue && selectable;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "ComboboxItemInner.useIsoLayoutEffect": ()=>{
            const shouldRun = hasRegistered && (virtualized || indexProp != null);
            if (!shouldRun) {
                return undefined;
            }
            const list = store.state.listRef.current;
            list[index] = itemRef.current;
            return ({
                "ComboboxItemInner.useIsoLayoutEffect": ()=>{
                    delete list[index];
                }
            })["ComboboxItemInner.useIsoLayoutEffect"];
        }
    }["ComboboxItemInner.useIsoLayoutEffect"], [
        hasRegistered,
        virtualized,
        index,
        indexProp,
        store
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "ComboboxItemInner.useIsoLayoutEffect": ()=>{
            if (!hasRegistered || hasItems) {
                return undefined;
            }
            const visibleMap = store.state.valuesRef.current;
            visibleMap[index] = itemValue;
            return ({
                "ComboboxItemInner.useIsoLayoutEffect": ()=>{
                    delete visibleMap[index];
                }
            })["ComboboxItemInner.useIsoLayoutEffect"];
        }
    }["ComboboxItemInner.useIsoLayoutEffect"], [
        hasRegistered,
        hasItems,
        index,
        itemValue,
        store
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "ComboboxItemInner.useIsoLayoutEffect": ()=>{
            if (!hasRegistered || hasItems) {
                return;
            }
            // Runs while closed as well (the list can stay mounted via `keepMounted` or a
            // force-mount) so the index tracks the item's composite position, keeping features
            // like closed-trigger typeahead in sync when the rendered order changes.
            const selectedValue = store.state.selectedValue;
            const lastSelectedValue = Array.isArray(selectedValue) ? selectedValue[selectedValue.length - 1] : selectedValue;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareItemEquality"])(itemValue, lastSelectedValue, isItemEqualToValue)) {
                store.set('selectedIndex', index);
            }
        }
    }["ComboboxItemInner.useIsoLayoutEffect"], [
        hasRegistered,
        hasItems,
        store,
        index,
        itemValue,
        isItemEqualToValue
    ]);
    const { getButtonProps, buttonRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useButton"])({
        disabled,
        focusableWhenDisabled: true,
        native: nativeButton,
        composite: true
    });
    const state = {
        disabled,
        selected,
        highlighted
    };
    function commitSelection(nativeEvent) {
        function selectItem() {
            store.state.handleSelection(nativeEvent, itemValue);
        }
        if (store.state.submitOnItemClick) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"](selectItem);
            store.state.requestSubmit();
        } else {
            selectItem();
        }
    }
    const defaultProps = {
        id,
        role: isRow ? 'gridcell' : 'option',
        'aria-selected': selectable ? selected : undefined,
        // Focusable items steal focus from the input upon mouseup.
        // Warn if the user renders a natively focusable element like `<button>`,
        // as it should be a `<div>` instead.
        tabIndex: undefined,
        onPointerDownCapture (event) {
            // The compat `mouseup` only fires for the primary pointer, so a non-primary
            // touch must not overwrite the shared ref — a mismatch would make the primary
            // pointer's release read as a drag-select and commit a second time after `click`.
            if (event.isPrimary) {
                store.state.pointerDownItemRef.current = event.currentTarget;
            }
            event.preventDefault();
        },
        onMouseDown (event) {
            // iOS Safari can emit a synthetic mousedown for touch taps without a preceding
            // pointerdown. Prevent default here too so tapping an item does not blur the input.
            event.preventDefault();
        },
        onClick (event) {
            if (disabled || readOnly) {
                return;
            }
            commitSelection(event.nativeEvent);
        },
        onMouseUp (event) {
            const pointerStartedOnItem = store.state.pointerDownItemRef.current === event.currentTarget;
            store.state.pointerDownItemRef.current = null;
            if (disabled || readOnly || event.button !== 0 || pointerStartedOnItem || !highlighted) {
                return;
            }
            commitSelection(event.nativeEvent);
        }
    };
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: [
            buttonRef,
            forwardedRef,
            listItem.ref,
            itemRef
        ],
        state,
        props: [
            itemProps,
            defaultProps,
            elementProps,
            getButtonProps
        ]
    });
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ComboboxItemInner.useMemo[contextValue]": ()=>({
                selected,
                textRef
            })
    }["ComboboxItemInner.useMemo[contextValue]"], [
        selected,
        textRef
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2f$ComboboxItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxItemContext"].Provider, {
        value: contextValue,
        children: element
    });
}
/**
 * Resolves the index from the filtered items for the virtualized fallback (no `index` prop).
 * Isolated here so that this per-keystroke subscription to the derived-items context is only
 * paid by virtualized items. Those re-render on every input change anyway — the parent
 * virtualizer re-windows the list as the filtered set changes — so the extra subscription costs
 * them nothing, while it keeps every non-virtualized item off that context.
 */ function ComboboxItemVirtualizedIndex(props) {
    const { componentProps, forwardedRef } = props;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const isItemEqualToValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].isItemEqualToValue);
    const { flatFilteredItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxDerivedItemsContext"])();
    const indexFromFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findItemIndex"])(flatFilteredItems, componentProps.value ?? null, isItemEqualToValue);
    // Only reached when `virtualized` is true (see the wrapper below).
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ComboboxItemInner, {
        componentProps: componentProps,
        forwardedRef: forwardedRef,
        virtualized: true,
        indexFromFilter: indexFromFilter
    });
}
const ComboboxItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxItem(componentProps, forwardedRef) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const virtualized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].virtualized);
    // `virtualized` (and whether an item provides an explicit `index`) must be stable for an
    // item's lifetime: the two branches return different component types, so flipping it at
    // runtime remounts the item and resets its refs and effects.
    if (virtualized && componentProps.index == null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ComboboxItemVirtualizedIndex, {
            componentProps: componentProps,
            forwardedRef: forwardedRef
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ComboboxItemInner, {
        componentProps: componentProps,
        forwardedRef: forwardedRef,
        virtualized: virtualized,
        indexFromFilter: undefined
    });
}));
if ("TURBOPACK compile-time truthy", 1) ComboboxItem.displayName = "ComboboxItem";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/item-indicator/ComboboxItemIndicator.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxItemIndicator",
    ()=>ComboboxItemIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2f$ComboboxItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/item/ComboboxItemContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useTransitionStatus.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs [app-client] (ecmascript)");
/**
 * Indicates whether the item is selected.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const ComboboxItemIndicator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxItemIndicator(componentProps, forwardedRef) {
    const { selected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2f$ComboboxItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxItemContext"])();
    const shouldRender = componentProps.keepMounted || selected;
    if (!shouldRender) {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Inner, {
        ...componentProps,
        ref: forwardedRef
    });
});
// Split the core implementation to avoid paying the hook costs unless the element needs to mount.
if ("TURBOPACK compile-time truthy", 1) ComboboxItemIndicator.displayName = "ComboboxItemIndicator";
const Inner = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((componentProps, forwardedRef)=>{
    const { render, className, style, keepMounted, ...elementProps } = componentProps;
    const { selected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2f$ComboboxItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxItemContext"])();
    const indicatorRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const { transitionStatus, setMounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransitionStatus"])(selected);
    const state = {
        selected,
        transitionStatus
    };
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('span', componentProps, {
        ref: [
            forwardedRef,
            indicatorRef
        ],
        state,
        props: [
            {
                'aria-hidden': true,
                children: '✔️'
            },
            elementProps
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transitionStatusMapping"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenChangeComplete"])({
        open: selected,
        ref: indicatorRef,
        onComplete () {
            if (!selected) {
                setMounted(false);
            }
        }
    });
    return element;
}));
if ("TURBOPACK compile-time truthy", 1) Inner.displayName = "Inner";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chips/ComboboxChips.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxChips",
    ()=>ComboboxChips
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChipsContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chips/ComboboxChipsContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$CompositeList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/composite/list/CompositeList.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$handleInputPress$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/handleInputPress.mjs [app-client] (ecmascript)");
/**
 * A container for the chips in a multiselectable input.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
const ComboboxChips = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxChips(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const hasSelectionChips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].hasSelectionChips);
    const [highlightedChipIndex, setHighlightedChipIndex] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](undefined);
    if (open && highlightedChipIndex !== undefined) {
        setHighlightedChipIndex(undefined);
    }
    const chipsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]([]);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: [
            forwardedRef,
            store.state.chipsContainerRef
        ],
        // NVDA enters browse mode instead of staying in focus mode when navigating with
        // arrow keys inside a container unless it has a toolbar role.
        props: [
            hasSelectionChips ? {
                role: 'toolbar'
            } : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
            {
                onMouseDown (event) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$handleInputPress$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleInputPress"])(event, store, store.state.disabled, store.state.readOnly);
                }
            },
            elementProps
        ]
    });
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ComboboxChips.ComboboxChips.useMemo[contextValue]": ()=>({
                highlightedChipIndex,
                setHighlightedChipIndex,
                chipsRef
            })
    }["ComboboxChips.ComboboxChips.useMemo[contextValue]"], [
        highlightedChipIndex,
        setHighlightedChipIndex,
        chipsRef
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChipsContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxChipsContext"].Provider, {
        value: contextValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$CompositeList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompositeList"], {
            elementsRef: chipsRef,
            children: element
        })
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxChips.displayName = "ComboboxChips";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chip/ComboboxChipContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxChipContext",
    ()=>ComboboxChipContext,
    "useComboboxChipContext",
    ()=>useComboboxChipContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ComboboxChipContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ComboboxChipContext.displayName = "ComboboxChipContext";
function useComboboxChipContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ComboboxChipContext);
    if (!context) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: ComboboxChipContext is missing. ComboboxChip parts must be placed within <Combobox.Chip>.' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chip/ComboboxChip.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxChip",
    ()=>ComboboxChip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChipsContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chips/ComboboxChipsContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$useCompositeListItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/composite/list/useCompositeListItem.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2f$ComboboxChipContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chip/ComboboxChipContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/utils/event.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/direction-context/DirectionContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/parts.mjs [app-client] (ecmascript)");
/**
 * An individual chip that represents a value in a multiselectable input.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
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
;
const ComboboxChip = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxChip(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const { setHighlightedChipIndex, chipsRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChipsContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxChipsContext"])();
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].disabled);
    const readOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].readOnly);
    const selectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedValue);
    const { ref, index } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$useCompositeListItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCompositeListItem"])();
    function handleKeyDown(event) {
        let nextIndex = index;
        const [previousChipKey, nextChipKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChipNavigationKeys"])(direction);
        if (event.key === previousChipKey) {
            event.preventDefault();
            if (index > 0) {
                nextIndex = index - 1;
            } else {
                nextIndex = undefined;
            }
        } else if (event.key === nextChipKey) {
            event.preventDefault();
            if (index < chipsRef.current.length - 1) {
                nextIndex = index + 1;
            } else {
                nextIndex = undefined;
            }
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            nextIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIndexAfterChipRemoval"])(index, selectedValue.length);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
            store.state.setIndices({
                activeIndex: null,
                selectedIndex: null,
                type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].keyboard
            });
            store.state.setSelectedValue(selectedValue.filter((_, i)=>i !== index), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none, event.nativeEvent));
        } else if (event.key === 'Enter' || event.key === ' ') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
            nextIndex = undefined;
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
            store.state.setOpen(true, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].listNavigation, event.nativeEvent));
            nextIndex = undefined;
        } else if (// Check for printable characters (letters, numbers, symbols)
        event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            nextIndex = undefined;
        }
        return nextIndex;
    }
    const state = {
        disabled
    };
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: [
            forwardedRef,
            ref
        ],
        state,
        props: [
            {
                tabIndex: -1,
                'aria-disabled': disabled || undefined,
                'aria-readonly': readOnly || undefined,
                onKeyDown (event) {
                    if (disabled || readOnly) {
                        return;
                    }
                    const nextIndex = handleKeyDown(event);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"]({
                        "ComboboxChip.ComboboxChip.useRenderElement[element]": ()=>{
                            setHighlightedChipIndex(nextIndex);
                        }
                    }["ComboboxChip.ComboboxChip.useRenderElement[element]"]);
                    if (nextIndex === undefined) {
                        store.state.inputRef.current?.focus();
                    } else {
                        chipsRef.current[nextIndex]?.focus();
                    }
                }
            },
            elementProps
        ]
    });
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ComboboxChip.ComboboxChip.useMemo[contextValue]": ()=>({
                index
            })
    }["ComboboxChip.ComboboxChip.useMemo[contextValue]"], [
        index
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2f$ComboboxChipContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxChipContext"].Provider, {
        value: contextValue,
        children: element
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxChip.displayName = "ComboboxChip";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chip-remove/ComboboxChipRemove.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxChipRemove",
    ()=>ComboboxChipRemove
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2f$ComboboxChipContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chip/ComboboxChipContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/use-button/useButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/floating-ui-react/utils/event.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/itemEquality.mjs [app-client] (ecmascript)");
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
const ComboboxChipRemove = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxChipRemove(componentProps, forwardedRef) {
    const { render, className, disabled: disabledProp = false, nativeButton = true, style, ...elementProps } = componentProps;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const { index } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2f$ComboboxChipContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxChipContext"])();
    const comboboxDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].disabled);
    const readOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].readOnly);
    const selectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedValue);
    const isItemEqualToValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].isItemEqualToValue);
    const disabled = comboboxDisabled || disabledProp;
    const { buttonRef, getButtonProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useButton"])({
        native: nativeButton,
        disabled: disabled || readOnly,
        focusableWhenDisabled: true
    });
    const state = {
        disabled
    };
    function clearActiveIndexForRemovedItem(removedItem) {
        const activeIndex = store.state.activeIndex;
        if (activeIndex == null) {
            return;
        }
        // Try current visible list first; if not found, it's filtered out.
        // No need to clear highlight in that case since it can't equal activeIndex.
        const removedIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$itemEquality$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findItemIndex"])(store.state.valuesRef.current, removedItem, isItemEqualToValue);
        if (removedIndex !== -1 && activeIndex === removedIndex) {
            store.state.setIndices({
                activeIndex: null,
                type: store.state.keyboardActiveRef.current ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].keyboard : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].pointer
            });
        }
    }
    function removeChip(event) {
        const eventDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].chipRemovePress, event.nativeEvent);
        const removedItem = selectedValue[index];
        clearActiveIndexForRemovedItem(removedItem);
        store.state.setSelectedValue(selectedValue.filter((_, i)=>i !== index), eventDetails);
        store.state.inputRef.current?.focus();
        return eventDetails;
    }
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('button', componentProps, {
        ref: [
            forwardedRef,
            buttonRef
        ],
        state,
        props: [
            {
                tabIndex: -1,
                onMouseDown (event) {
                    event.preventDefault();
                },
                onClick (event) {
                    const eventDetails = removeChip(event);
                    if (!eventDetails.isPropagationAllowed) {
                        event.stopPropagation();
                    }
                },
                onKeyDown (event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        const eventDetails = removeChip(event);
                        if (!eventDetails.isPropagationAllowed) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$event$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopEvent"])(event);
                        }
                    }
                }
            },
            elementProps,
            getButtonProps
        ]
    });
    return element;
});
if ("TURBOPACK compile-time truthy", 1) ComboboxChipRemove.displayName = "ComboboxChipRemove";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/row/ComboboxRow.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxRow",
    ()=>ComboboxRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$row$2f$ComboboxRowContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/row/ComboboxRowContext.mjs [app-client] (ecmascript)");
/**
 * Displays a single row of items in a grid list.
 * Enable `grid` on the root component to turn the listbox into a grid.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
const ComboboxRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxRow(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: forwardedRef,
        props: [
            {
                role: 'row'
            },
            elementProps
        ]
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$row$2f$ComboboxRowContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxRowContext"].Provider, {
        value: true,
        children: element
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxRow.displayName = "ComboboxRow";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/empty/ComboboxEmpty.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxEmpty",
    ()=>ComboboxEmpty
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$useInitialLiveRegionTextMutation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/utils/useInitialLiveRegionTextMutation.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
const ComboboxEmpty = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxEmpty(componentProps, forwardedRef) {
    const { render, className, style, children: childrenProp, ...elementProps } = componentProps;
    const { filteredItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxDerivedItemsContext"])();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const emptyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$utils$2f$useInitialLiveRegionTextMutation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInitialLiveRegionTextMutation"])();
    const children = filteredItems.length === 0 ? childrenProp : null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        ref: [
            forwardedRef,
            store.state.emptyRef,
            emptyRef
        ],
        props: [
            {
                children,
                role: 'status',
                'aria-live': 'polite',
                'aria-atomic': true
            },
            elementProps
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) ComboboxEmpty.displayName = "ComboboxEmpty";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/clear/ComboboxClear.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxClear",
    ()=>ComboboxClear
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.2_ae7822e8c058bc095c44df49cc7a35cf/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types_a468c3faa7144d1dbfbe5c758e39ecfb/node_modules/@base-ui/utils/store/useStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/store.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/use-button/useButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/field-root-context/FieldRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useTransitionStatus.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)");
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
const stateAttributesMapping = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transitionStatusMapping"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerOpenStateMapping"]
};
const ComboboxClear = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$2_ae7822e8c058bc095c44df49cc7a35cf$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ComboboxClear(componentProps, forwardedRef) {
    const { render, className, disabled: disabledProp = false, nativeButton = true, keepMounted = false, style, ...elementProps } = componentProps;
    const { disabled: fieldDisabled } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$field$2d$root$2d$context$2f$FieldRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFieldRootContext"])();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxRootContext"])();
    const selectionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectionMode);
    const comboboxDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].disabled);
    const readOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].readOnly);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].open);
    const selectedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].selectedValue);
    const hasSelectionChips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types_a468c3faa7144d1dbfbe5c758e39ecfb$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$useStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])(store, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectors"].hasSelectionChips);
    const inputValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxInputValueContext"])();
    let visible = false;
    if (selectionMode === 'none') {
        visible = inputValue !== '';
    } else if (selectionMode === 'single') {
        visible = selectedValue != null;
    } else {
        visible = hasSelectionChips;
    }
    const disabled = fieldDisabled || comboboxDisabled || disabledProp;
    const { buttonRef, getButtonProps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useButton"])({
        native: nativeButton,
        disabled
    });
    const { mounted, transitionStatus, setMounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransitionStatus"])(visible);
    const state = {
        disabled,
        visible,
        open,
        transitionStatus
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenChangeComplete"])({
        open: visible,
        ref: store.state.clearRef,
        onComplete () {
            if (!visible) {
                setMounted(false);
            }
        }
    });
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('button', componentProps, {
        state,
        ref: [
            forwardedRef,
            buttonRef,
            store.state.clearRef
        ],
        props: [
            {
                tabIndex: -1,
                children: 'x',
                // Avoid stealing focus from the input.
                onMouseDown (event) {
                    event.preventDefault();
                },
                onClick (event) {
                    if (disabled || readOnly) {
                        return;
                    }
                    const type = store.state.keyboardActiveRef.current ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].keyboard : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].pointer;
                    store.state.setInputValue('', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].clearPress, event.nativeEvent));
                    if (selectionMode !== 'none') {
                        store.state.setSelectedValue(Array.isArray(selectedValue) ? [] : null, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].clearPress, event.nativeEvent));
                        // A distinct object shape: `Store.update` iterates own keys, so passing an explicit
                        // `selectedIndex: undefined` would overwrite the state instead of leaving it alone.
                        store.state.setIndices({
                            activeIndex: null,
                            selectedIndex: null,
                            type
                        });
                    } else {
                        store.state.setIndices({
                            activeIndex: null,
                            type
                        });
                    }
                    store.state.inputRef.current?.focus();
                }
            },
            elementProps,
            getButtonProps
        ],
        stateAttributesMapping
    });
    const shouldRender = keepMounted || mounted;
    if (!shouldRender) {
        return null;
    }
    return element;
});
if ("TURBOPACK compile-time truthy", 1) ComboboxClear.displayName = "ComboboxClear";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/separator/ComboboxSeparator.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComboboxSeparator",
    ()=>ComboboxSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$listbox$2d$separator$2f$ListboxSeparator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/utils/listbox-separator/ListboxSeparator.mjs [app-client] (ecmascript)");
'use client';
;
const ComboboxSeparator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$listbox$2d$separator$2f$ListboxSeparator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListboxSeparator"];
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/useFilteredItems.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFilteredItems",
    ()=>useFilteredItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRootContext.mjs [app-client] (ecmascript)");
;
function useFilteredItems() {
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxDerivedItemsContext"])();
    return items.filteredItems;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/index.parts.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Arrow",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$arrow$2f$ComboboxArrow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxArrow"],
    "Backdrop",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$backdrop$2f$ComboboxBackdrop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxBackdrop"],
    "Chip",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2f$ComboboxChip$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxChip"],
    "ChipRemove",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2d$remove$2f$ComboboxChipRemove$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxChipRemove"],
    "Chips",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChips$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxChips"],
    "Clear",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$clear$2f$ComboboxClear$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxClear"],
    "Collection",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$ComboboxCollection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxCollection"],
    "Empty",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$empty$2f$ComboboxEmpty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxEmpty"],
    "Group",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2f$ComboboxGroup$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxGroup"],
    "GroupLabel",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2d$label$2f$ComboboxGroupLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxGroupLabel"],
    "Icon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$icon$2f$ComboboxIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxIcon"],
    "Input",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$input$2f$ComboboxInput$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxInput"],
    "InputGroup",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$input$2d$group$2f$ComboboxInputGroup$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxInputGroup"],
    "Item",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2f$ComboboxItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxItem"],
    "ItemIndicator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2d$indicator$2f$ComboboxItemIndicator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxItemIndicator"],
    "Label",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$label$2f$ComboboxLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxLabel"],
    "List",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$list$2f$ComboboxList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxList"],
    "Popup",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$popup$2f$ComboboxPopup$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxPopup"],
    "Portal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$portal$2f$ComboboxPortal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxPortal"],
    "Positioner",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositioner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxPositioner"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRoot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxRoot"],
    "Row",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$row$2f$ComboboxRow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxRow"],
    "Separator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$separator$2f$ComboboxSeparator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxSeparator"],
    "Status",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$status$2f$ComboboxStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxStatus"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$trigger$2f$ComboboxTrigger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxTrigger"],
    "Value",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$value$2f$ComboboxValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComboboxValue"],
    "useFilter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$useFilter$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComboboxFilter"],
    "useFilteredItems",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$useFilteredItems$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFilteredItems"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/index.parts.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$ComboboxRoot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/ComboboxRoot.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$label$2f$ComboboxLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/label/ComboboxLabel.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$value$2f$ComboboxValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/value/ComboboxValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$input$2f$ComboboxInput$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/input/ComboboxInput.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$input$2d$group$2f$ComboboxInputGroup$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/input-group/ComboboxInputGroup.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$trigger$2f$ComboboxTrigger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/trigger/ComboboxTrigger.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$list$2f$ComboboxList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/list/ComboboxList.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$status$2f$ComboboxStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/status/ComboboxStatus.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$portal$2f$ComboboxPortal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/portal/ComboboxPortal.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$backdrop$2f$ComboboxBackdrop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/backdrop/ComboboxBackdrop.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$positioner$2f$ComboboxPositioner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/positioner/ComboboxPositioner.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$popup$2f$ComboboxPopup$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/popup/ComboboxPopup.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$arrow$2f$ComboboxArrow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/arrow/ComboboxArrow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$icon$2f$ComboboxIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/icon/ComboboxIcon.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2f$ComboboxGroup$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/group/ComboboxGroup.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$group$2d$label$2f$ComboboxGroupLabel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/group-label/ComboboxGroupLabel.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2f$ComboboxItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/item/ComboboxItem.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$item$2d$indicator$2f$ComboboxItemIndicator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/item-indicator/ComboboxItemIndicator.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chips$2f$ComboboxChips$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chips/ComboboxChips.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2f$ComboboxChip$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chip/ComboboxChip.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$chip$2d$remove$2f$ComboboxChipRemove$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/chip-remove/ComboboxChipRemove.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$row$2f$ComboboxRow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/row/ComboboxRow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$collection$2f$ComboboxCollection$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/collection/ComboboxCollection.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$empty$2f$ComboboxEmpty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/empty/ComboboxEmpty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$clear$2f$ComboboxClear$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/clear/ComboboxClear.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$separator$2f$ComboboxSeparator$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/separator/ComboboxSeparator.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$useFilter$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/useFilter.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$root$2f$utils$2f$useFilteredItems$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/root/utils/useFilteredItems.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/index.parts.mjs [app-client] (ecmascript) <export * as Combobox>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Combobox",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$_fcc21e1f3b302fb232e8e816604bbf6e$2f$node_modules$2f40$base$2d$ui$2f$react$2f$combobox$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-_fcc21e1f3b302fb232e8e816604bbf6e/node_modules/@base-ui/react/combobox/index.parts.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=445cc_%40base-ui_react_combobox_6fd1540c._.js.map