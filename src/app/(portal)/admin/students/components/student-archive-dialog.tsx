"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

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
import { setStudentStatusAction } from "@/features/students/actions"
import type { StudentView } from "@/features/students/directory"

export function StudentArchiveDialog({
  student,
  onOpenChange,
}: {
  /** Null closes the dialog; a student opens the archive or restore prompt. */
  student: StudentView | null
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, startTransition] = React.useTransition()
  const archiving = student?.status !== "archived"

  function confirm(event: React.MouseEvent) {
    // The dialog stays open until the server has answered.
    event.preventDefault()

    if (!student) return

    startTransition(async () => {
      const result = await setStudentStatusAction(
        student.id,
        archiving ? "archived" : "active"
      )

      if (result.ok) {
        toast.success(result.message)
        onOpenChange(false)
        return
      }

      toast.error(result.message)
    })
  }

  return (
    <AlertDialog open={Boolean(student)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {archiving ? "Archive student" : "Restore student"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {archiving
              ? `${student?.fullName ?? "This student"} keeps their attendance history, but can no longer sign in, and their active RFID card is deactivated.`
              : `${student?.fullName ?? "This student"} can sign in again. Re-issue an RFID card to resume attendance tapping.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={archiving ? "destructive" : "default"}
            onClick={confirm}
            disabled={isPending}
          >
            {isPending ? <Loader2 aria-hidden className="animate-spin" /> : null}
            {archiving ? "Archive student" : "Restore student"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
