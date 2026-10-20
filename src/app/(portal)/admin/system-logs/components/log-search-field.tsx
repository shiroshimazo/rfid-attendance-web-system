"use client"

import { useState } from "react"

import { SearchTagInput } from "@/components/search-tag-input"

/**
 * The system log filters are a plain GET form, so each search term travels as
 * its own hidden field and the form posts them all.
 */
export function LogSearchField({ defaultTerms }: { defaultTerms: string[] }) {
  const [terms, setTerms] = useState(defaultTerms)

  return (
    <div className="sm:col-span-2">
      <SearchTagInput
        id="log-search"
        label="Search"
        value={terms}
        onValueChange={setTerms}
        placeholder="Actor, activity or record ID"
        size="lg"
        showIcon={false}
      />
      {terms.map((term) => (
        <input key={term} type="hidden" name="search" value={term} />
      ))}
    </div>
  )
}
