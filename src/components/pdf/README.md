# pdfcn report component

`data-table.tsx` adapts the MIT-licensed [pdfcn Forme DataTable](https://www.pdfcn.dev/docs/components/forme/data-table), retrieved from https://www.pdfcn.dev/r/forme/data-table.json on 2026-09-06.

pdfcn distributes source components, not a runtime `pdfcn` package. This local copy retains its column definitions, cell rendering and data mapping. It uses Forme's native Table/Row/Cell instead of nested views so long reports paginate with repeated column headers. Only the compact report styling is included; optional themes/variants/footers are omitted. Renderer dependencies are `@formepdf/react` and `@formepdf/core`.

PDFs render locally on the application server. No student data is sent to pdfcn or an external PDF service. See LICENSE for the upstream notice.
