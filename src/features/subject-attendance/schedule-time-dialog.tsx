"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { editSubjectScheduleAction } from "@/features/subject-attendance/actions"
import {
  weekdayLabel,
  type SubjectSchedule,
} from "@/features/subject-attendance/model"
import {
  subjectScheduleTimesSchema,
  type SubjectScheduleTimesValues,
} from "@/features/subject-attendance/schema"

function defaultValues(schedule?: SubjectSchedule | null): SubjectScheduleTimesValues {
  return {
    start: schedule?.time_start.slice(0, 5) ?? "",
    end: schedule?.time_end.slice(0, 5) ?? "",
  }
}

/**
 * Moves an existing session's times only. The assignment and weekday are fixed
 * so confirmations already recorded against the row stay attributable.
 */
export function SubjectScheduleTimeDialog({
  open,
  onOpenChange,
  schedule,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule?: SubjectSchedule | null
  onSaved: () => void
}) {
  const form = useForm<SubjectScheduleTimesValues>({
    resolver: zodResolver(subjectScheduleTimesSchema),
    defaultValues: defaultValues(schedule),
    mode: "onBlur",
  })

  // Reopening the dialog for another row must not show stale times.
  React.useEffect(() => {
    if (!open) return

    form.reset(defaultValues(schedule))
  }, [open, schedule, form])

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: SubjectScheduleTimesValues) {
    if (!schedule) return

    const result = await editSubjectScheduleAction({
      scheduleId: schedule.id,
      start: values.start,
      end: values.end,
      expectedStart: schedule.time_start,
      expectedEnd: schedule.time_end,
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit schedule time</DialogTitle>
          <DialogDescription>
            {schedule
              ? `${schedule.course?.course_code ?? "—"} · ${schedule.section} · ${schedule.campus} · ${weekdayLabel(schedule.day_of_week)}. `
              : ""}
            Existing attendance confirmations keep their original times.
          </DialogDescription>
        </DialogHeader>

        {schedule ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          step={60}
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          step={60}
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 aria-hidden className="animate-spin" />
                  ) : null}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
