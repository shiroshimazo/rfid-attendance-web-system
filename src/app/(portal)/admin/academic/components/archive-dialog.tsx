"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { gooeyToast } from "@/components/ui/goey-toaster"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { setCatalogStatusAction } from "@/features/academic/actions"
import type { CatalogKind } from "@/features/academic/schema"

export interface ArchiveTarget {
  kind: CatalogKind
  id: number
  /** How the entry reads in a sentence, e.g. `CCS2207` or `Section 21001 (Main Campus)`. */
  name: string
  /** Archived entries get the restore prompt instead. */
  archived: boolean
  /** Why the change is refused right now. The confirm button is withheld. */
  blocked: string | null
  /** What keeps using the entry afterwards. Shown, never blocking. */
  impact: string | null
}

const nouns: Record<CatalogKind, string> = {
  program: "program",
  course: "subject",
  section: "class grouping",
}

const archiveEffects: Record<CatalogKind, string> = {
  program:
    "moves behind the Archived filter and out of every picker. Attendance already confirmed keeps the program code it recorded.",
  course:
    "leaves the teacher assignment and subject schedule pickers. Attendance already confirmed keeps the code and name it recorded.",
  section:
    "leaves the student and teacher pickers. Records already placed in it keep their section, year level, and campus.",
}

/** Archive or restore one catalog entry. Nothing is ever deleted. */
export function ArchiveDialog({
  target,
  onOpenChange,
}: {
  /** Null closes the dialog. */
  target: ArchiveTarget | null
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState("")
  const archiving = !target?.archived
  const title = `${archiving ? "Archive" : "Restore"} ${target ? nouns[target.kind] : "entry"}`

  function close(open: boolean) {
    if (isPending || open) return
    setError("")
    onOpenChange(false)
  }

  function confirm(event: React.MouseEvent) {
    // The dialog stays open until the server has answered.
    event.preventDefault()

    if (!target || target.blocked) return

    const { kind, id } = target
    setError("")

    startTransition(async () => {
      const result = await setCatalogStatusAction({
        kind,
        id,
        status: archiving ? "archived" : "active",
      })

      if (result.ok) {
        gooeyToast.success(result.message)
        onOpenChange(false)
        return
      }

      setError(result.message)
      gooeyToast.error(result.message)
    })
  }

  const refusal = target?.blocked ?? error

  return (
    <AlertDialog open={Boolean(target)} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {target
              ? archiving
                ? `${target.name} ${archiveEffects[target.kind]}`
                : `${target.name} returns to the active catalog and to the pickers that offer it.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {archiving && target?.impact && !target.blocked ? (
          <p className="text-sm text-muted-foreground text-pretty">
            {target.impact}
          </p>
        ) : null}

        {refusal ? (
          <p role="alert" className="text-sm text-destructive text-pretty">
            {refusal}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {target?.blocked ? "Close" : "Cancel"}
          </AlertDialogCancel>
          {target && !target.blocked ? (
            <AlertDialogAction
              variant={archiving ? "destructive" : "default"}
              onClick={confirm}
              disabled={isPending}
            >
              {isPending ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {title}
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
