/**
 * Stable accessor helpers for the layout tree returned by
 * `renderDocumentWithLayout()`.
 *
 * These helpers exist for one specific reason: the raw `ElementInfo` /
 * `LayoutInfo` shape is documented but the documentation is not a
 * contract, and it has drifted from runtime twice now. Consumers that
 * hard-code invariants like "the text lives on `TextLine` children,
 * not the parent `Text`" break silently every time an internal refactor
 * shifts them.
 *
 * The helpers in this module encapsulate those invariants once, in a
 * narrow, deliberately-maintained surface. Each helper corresponds to
 * one of the layout-time transforms documented on `ElementInfo`. When
 * an invariant changes in the engine, this file is where you update it
 * — the runtime-conformance test (`tests/layout-shape.test.ts`) catches
 * engine drift; helper tests (`tests/layout-helpers.test.ts`) catch
 * drift in the helpers themselves.
 *
 * **Prefer these helpers to raw tree walking unless you specifically
 * need raw shape access** (e.g. custom snapshot comparison, structural
 * analysis the helpers don't cover).
 */
import type { LayoutInfo, PageInfo, ElementInfo, ElementNodeType } from './index.js';
/**
 * Any of the layout-tree root shapes a helper might reasonably accept.
 * All helpers that traverse the tree accept this union so consumers
 * don't have to unwrap `layout.pages[0].elements` themselves.
 */
export type LayoutRoot = LayoutInfo | PageInfo | PageInfo[] | ElementInfo | ElementInfo[];
/**
 * Depth-first walk of every node in `root`, calling `cb` for each.
 *
 * `path` is a human-readable string identifying where in the tree the
 * node lives (e.g. `"[0].children[2]"` for the third child of the first
 * root element). Useful for building error messages; ignore if you
 * don't need it.
 *
 * Callbacks that return `false` skip descent into that node's children.
 * Any other return (including `void`) descends normally.
 */
export declare function walkElements(root: LayoutRoot, cb: (node: ElementInfo, path: string) => void | boolean): void;
/**
 * Every node in `root` for which `predicate` returns truthy. Order is
 * depth-first, source-order.
 */
export declare function findElements(root: LayoutRoot, predicate: (node: ElementInfo, path: string) => boolean): ElementInfo[];
/**
 * First node in `root` for which `predicate` returns truthy, or `null`
 * if none. Order is depth-first, source-order. Stops as soon as a match
 * is found (does not descend into the match's children).
 */
export declare function findFirstElement(root: LayoutRoot, predicate: (node: ElementInfo, path: string) => boolean): ElementInfo | null;
/**
 * Every `TextLine` leaf descendant of `node`, in source order. If
 * `node` is itself a `TextLine`, returns `[node]`.
 *
 * This is the load-bearing helper: it encapsulates the invariant that
 * text lives on `TextLine` children, never on the parent `Text` block.
 */
export declare function getTextLines(node: ElementInfo): ElementInfo[];
/**
 * Concatenated text of every `TextLine` descendant of `node`, joined
 * with `"\n"`. If `node` is itself a `TextLine`, returns its own text.
 *
 * Lines are joined with newlines rather than spaces because the layout
 * engine may have wrapped a single JSX string across multiple lines,
 * and preserving that structure is more useful than silently smushing
 * or space-joining. If you want a flat string, `.replace(/\n/g, ' ')`
 * the result.
 *
 * Returns `""` if no `TextLine` descendants exist.
 */
export declare function getNodeText(node: ElementInfo): string;
/**
 * If `node` is a heading (`H1`–`H6`), returns the numeric level (1–6).
 * Returns `null` otherwise.
 *
 * Encapsulates the invariant that headings render as six discriminated
 * nodeTypes (`H1`, `H2`, …) rather than a generic `Heading` node with a
 * separate `level` field.
 */
export declare function getHeadingLevel(node: ElementInfo): 1 | 2 | 3 | 4 | 5 | 6 | null;
/**
 * Every `TableRow` under `parent`, looking through `Table` wrapper nodes.
 *
 * Since engine 0.14, `<Table>` emits a `Table` container element per page
 * fragment with the rows nested inside it. Pass the containing `page`
 * (or the parent `View` that held the `<Table>` in JSX) as `parent` —
 * or a `Table` element directly. Loose sibling rows (the pre-0.14 shape)
 * are still returned for compatibility with stored layouts.
 *
 * Returns rows in source order.
 */
export declare function getTableRows(parent: PageInfo | ElementInfo): ElementInfo[];
/**
 * The `FixedHeader` and `FixedFooter` nodes on `page`. Encapsulates the
 * invariant that `<Fixed position="header">` and `<Fixed position="footer">`
 * produce two distinct nodeTypes rather than a shared `Fixed` node with
 * a `position` field.
 *
 * Both arrays may be empty. Multiple entries in either array indicate
 * repeating fixed regions (e.g. when the same `<Fixed>` repeats across
 * page breaks — the layout may emit one node per occurrence).
 */
export declare function getFixedRegions(page: PageInfo): {
    header: ElementInfo[];
    footer: ElementInfo[];
};
/**
 * Every `ListItem` child of a `List` node. Returns `[]` if `list` is
 * not a `List` (silently — no throw, so this composes cleanly with
 * `.flatMap`).
 */
export declare function getListItems(list: ElementInfo): ElementInfo[];
/**
 * Rendered text of the marker (`Lbl`) child of a `ListItem` — e.g.
 * `"1."` for the first item of an `<OrderedList>`, `"•"` for an
 * `<UnorderedList>` item. Returns `null` if `item` is not a `ListItem`
 * or has no `Lbl` child.
 *
 * Encapsulates the invariant that list markers are separate `Lbl`
 * children of each `ListItem` rather than a field on `ListItem` itself.
 */
export declare function getListItemMarker(item: ElementInfo): string | null;
/**
 * Type-guard for narrowing to a specific `ElementNodeType`. Useful for
 * `.filter(isNodeType('TableRow'))` chains.
 */
export declare function isNodeType<T extends ElementNodeType>(nodeType: T): (node: ElementInfo) => node is ElementInfo & {
    nodeType: T;
};
