/**
 * Extract embedded JSON data from a Forme-generated PDF.
 *
 * Scans the PDF bytes for a `forme-data.json` EmbeddedFile attachment,
 * decompresses the stream, and parses the JSON. Returns `null` if the
 * PDF doesn't contain embedded data (e.g. non-Forme PDF).
 */
export declare function extractData(pdfBytes: Uint8Array): unknown | null;
