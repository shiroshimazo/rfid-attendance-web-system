"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { setTeacherStatusAction } from "@/features/teachers/actions"
import type { TeacherView } from "@/features/teachers/directory"

export function TeacherStatusDialog({
  teacher,
  onOpenChange,
}: {
  /** Null closes the dialog; a teacher opens the archive or restore prompt. */
  teacher: TeacherView | null
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, startTransition] = React.useTransition()
  const archiving = teacher?.status !== "archived"

  function confirm() {
    if (!teacher) return

    startTransition(async () => {
      const result = await setTeacherStatusAction(
        teacher.id,
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
    <Dialog open={Boolean(teacher)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {archiving ? "Archive teacher" : "Restore teacher"}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {archiving
              ? `${teacher?.fullName ?? "This teacher"} keeps their record and assignments, but can no longer sign in or reach assigned students until restored.`
              : `${teacher?.fullName ?? "This teacher"} regains access to their assigned classes and can sign in again.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant={archiving ? "destructive" : "default"}
            onClick={confirm}
            disabled={isPending}
          >
            {isPending ? <Loader2 aria-hidden className="animate-spin" /> : null}
            {archiving ? "Archive teacher" : "Restore teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
