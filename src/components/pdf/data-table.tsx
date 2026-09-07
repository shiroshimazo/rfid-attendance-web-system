// Adapted from pdfcn's Forme DataTable (MIT). See LICENSE and README.md.
import type { ReactNode } from "react"
import { Table, Row, Cell, Text } from "@formepdf/react"

export interface DataTableColumn<T> {
  key: keyof T & string
  header: string
  width?: number
  align?: "left" | "center" | "right"
  render?: (value: unknown, row: T) => ReactNode
}

/** pdfcn's column/data API, using native Forme rows for repeated page headers. */
export function DataTable<T extends Record<string, unknown>>({ columns, data }: {
  columns: DataTableColumn<T>[]
  data: T[]
}) {
  return (
    <Table columns={columns.map(col => ({ width: col.width ? { fixed: col.width } : { fraction: 1 / columns.length } }))}>
      <Row header style={{ backgroundColor: "#e9eef5" }}>
        {columns.map(col => (
          <Cell key={col.key} style={{ padding: 6 }}>
            <Text style={{ fontSize: 8, fontWeight: 700, textAlign: col.align ?? "left" }}>
              {col.header}
            </Text>
          </Cell>
        ))}
      </Row>
      {data.map((row, i) => (
        <Row key={i} style={{ backgroundColor: i % 2 ? "#f5f7fa" : "#ffffff" }}>
          {columns.map(col => {
            const value = row[col.key]
            const rendered = col.render ? col.render(value, row) : null
            const text = value === null || value === undefined ? "" : String(value)
            return (
              <Cell key={col.key} style={{ padding: 6, borderBottomWidth: 0.5, borderBottomColor: "#dce2ea" }}>
                {rendered ?? <Text style={{ fontSize: 8, lineHeight: 1.3, textAlign: col.align ?? "left" }}>{text}</Text>}
              </Cell>
            )
          })}
        </Row>
      ))}
    </Table>
  )
}
