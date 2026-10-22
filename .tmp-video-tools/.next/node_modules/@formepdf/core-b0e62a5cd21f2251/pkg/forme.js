/* @ts-self-types="./forme.d.ts" */

import * as wasm from "./forme_bg.wasm";
import { __wbg_set_wasm } from "./forme_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    certify_pdf, find_text_regions, init_panic_hook, merge_pdfs, redact_pdf, redact_text, render_pdf, render_pdf_with_layout, render_template_pdf, render_template_pdf_with_layout
} from "./forme_bg.js";
