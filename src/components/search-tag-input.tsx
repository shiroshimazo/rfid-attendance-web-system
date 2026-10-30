"use client"

import type { ReactNode } from "react"
import { Search } from "lucide-react"

import { TagInput } from "@/components/arc/tag-input/tag-input"
import { normalizeSearchTags } from "@/lib/search-tags"

export interface SearchTagInputProps {
  id?: string
  /** Screen-reader name for the field. */
  label: string
  /** The terms currently applied. */
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  /** Screen-reader explanation of how the field works. */
  description?: string
  /** Matches the height of the other fields it sits beside. */
  size?: "sm" | "md" | "lg"
  className?: string
  /** Draws the magnifier glyph the other search fields carry. */
  showIcon?: boolean
  /** Overrides the default magnifier glyph. */
  leading?: ReactNode
}

const searchHint =
  "Type a term and press Enter to add it. A row is kept when it matches at least one term."

/**
 * A search field that takes several terms. Each term is typed and confirmed
 * with Enter, and a row is kept when it matches at least one of them.
 */
export function SearchTagInput({
  id,
  label,
  value,
  onValueChange,
  placeholder = "Search, then press Enter",
  description = searchHint,
  size = "md",
  className,
  showIcon = true,
  leading,
}: SearchTagInputProps) {
  return (
    <TagInput
      id={id}
      label={label}
      hideLabel
      hideDescription
      size={size}
      value={value}
      onValueChange={(next) => onValueChange(normalizeSearchTags(next))}
      placeholder={placeholder}
      description={description}
      className={className}
      leading={leading ?? (showIcon ? <Search className="size-4" /> : undefined)}
    />
  )
}
