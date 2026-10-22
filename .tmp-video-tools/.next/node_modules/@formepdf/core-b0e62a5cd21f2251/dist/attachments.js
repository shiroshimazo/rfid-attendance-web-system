/**
 * PDF attachments + Factur-X/ZUGFeRD e-invoice container options.
 *
 * Environment-neutral (Node, browser, workers): used by every entry
 * point so the option mapping cannot drift between them.
 *
 * Tier-1 container support only: the caller supplies the invoice XML;
 * Forme embeds it as a PDF/A-3 associated file with the Factur-X XMP
 * identification. Forme does NOT generate or validate EN 16931 semantic
 * content.
 */
function toBase64(data) {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    // Node fast path; browser/workers fall back to btoa over a binary string.
    const B = globalThis.Buffer;
    if (B)
        return B.from(bytes).toString('base64');
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
}
/**
 * Map `attachments` / `facturX` options onto the serialized document.
 * Shared by the Node, browser, and worker entries.
 */
export function applyAttachmentOptions(doc, options) {
    const attachments = [];
    for (const a of options?.attachments ?? []) {
        attachments.push({
            name: a.name,
            src: toBase64(a.data),
            mimeType: a.mimeType,
            relationship: a.relationship,
            description: a.description,
            modDate: a.modDate,
        });
    }
    const fx = options?.facturX;
    if (fx) {
        const filename = fx.filename ?? (fx.profile === 'XRECHNUNG' ? 'xrechnung.xml' : 'factur-x.xml');
        attachments.push({
            name: filename,
            src: toBase64(fx.xml),
            mimeType: 'text/xml',
            relationship: fx.relationship,
            modDate: fx.modDate,
        });
        doc.zugferd = {
            conformanceLevel: fx.profile,
            documentFileName: filename,
            version: fx.version,
        };
    }
    if (attachments.length > 0) {
        doc.attachments = attachments;
    }
}
