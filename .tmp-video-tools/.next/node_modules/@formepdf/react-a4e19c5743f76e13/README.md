# @formepdf/react

React components for [Forme](https://github.com/formepdf/forme) PDF generation.

## Install

```bash
npm install @formepdf/react @formepdf/core
```

## Usage

```tsx
import { Document, Page, View, Text, StyleSheet } from '@formepdf/react';
import { renderDocument } from '@formepdf/core';

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
  body: { fontSize: 10, lineHeight: 1.6 },
});

const doc = (
  <Document>
    <Page size="Letter" margin={54}>
      <Text style={styles.title}>Hello Forme</Text>
      <Text style={styles.body}>Page breaks that actually work.</Text>
    </Page>
  </Document>
);

const pdfBytes = await renderDocument(doc);
```

## Components

### Layout
- `Document` - Root container (fonts, metadata, tagged PDF, PDF/A, signatures)
- `Page` - A page with size, margins, and orientation
- `View` - Flex container (like div)
- `Text` - Text content with font styling
- `Image` - JPEG, PNG, and WebP images
- `Fixed` - Fixed headers and footers
- `PageBreak` - Explicit page break

### Tables
- `Table`, `Row`, `Cell` - Tables with automatic header repetition across pages

### Graphics
- `Svg` - SVG rendering via `content` string or JSX children (rect, circle, line, path, arc, opacity)
- `QrCode` - Vector QR codes
- `Barcode` - 1D barcodes (Code 128, Code 39, EAN-13, EAN-8, Codabar)
- `Canvas` - Arbitrary vector drawing via callback API
- `Watermark` - Rotated text behind page content

### Charts
- `BarChart` - Vertical bar charts with grouped series
- `LineChart` - Line charts with multiple series
- `PieChart` - Pie and donut charts
- `AreaChart` - Filled area charts
- `DotPlot` - Dot plot with grouped data points

### Form Fields
- `TextField` - Text input field
- `Checkbox` - Checkbox with label
- `Dropdown` - Select dropdown with options
- `RadioButton` - Radio button with group support

## Docs

Full documentation at [docs.formepdf.com](https://docs.formepdf.com)
