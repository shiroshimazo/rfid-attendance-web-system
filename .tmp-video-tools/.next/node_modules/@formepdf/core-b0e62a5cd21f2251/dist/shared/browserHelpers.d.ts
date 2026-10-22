/**
 * Helpers shared between the browser entry (`src/browser.ts`, backed by
 * the wasm-pack `--target bundler` build) and the worker entry
 * (`src/worker.ts`, backed by `--target web`). The two entries differ
 * only in how the WASM module gets instantiated; everything from
 * font/image URL resolution through embedded-JSON extraction is the
 * same and lives here.
 *
 * Strictly browser/edge primitives: `fetch`, `btoa`, `TextDecoder`,
 * `DecompressionStream`. No Node-only APIs.
 */
export declare function uint8ArrayToBase64(bytes: Uint8Array): string;
export declare function resolveFonts(doc: Record<string, unknown>): Promise<void>;
export declare function resolveImages(doc: Record<string, unknown>): Promise<void>;
/**
 * Extract embedded JSON data from a Forme-generated PDF using browser-
 * native DecompressionStream (no node:zlib needed).
 */
export declare function extractDataFromPdf(pdfBytes: Uint8Array): Promise<unknown | null>;
