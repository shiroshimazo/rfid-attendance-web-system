"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateScheduleAction } from "@/features/schedules/actions"
import {
  addMinutesToTime,
  scheduleDays,
  scheduleDialogSchema,
  scheduleStatuses,
  type ScheduleDialogValues,
  type ScheduleView,
} from "@/features/schedules/schema"
import { formatClockTime } from "@/lib/format"

const statusLabels: Record<(typeof scheduleStatuses)[number], string> = {
  active: "Active",
  inactive: "Inactive",
}

function defaultValues(schedule?: ScheduleView | null): ScheduleDialogValues {
  return {
    timeStart: schedule?.timeStart ?? "06:00",
    graceMinutes: String(schedule?.graceMinutes ?? 15),
    status: schedule?.status ?? "active",
    days: schedule ? [...schedule.days] : [],
  }
}

/** Read-only pilot facts, shown so the lock is visible rather than implied. */
function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">
        {value}
      </div>
    </div>
  )
}

export function ScheduleFormDialog({
  open,
  onOpenChange,
  schedule,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule?: ScheduleView | null
}) {
  const form = useForm<ScheduleDialogValues>({
    resolver: zodResolver(scheduleDialogSchema),
    defaultValues: defaultValues(schedule),
    mode: "onBlur",
  })

  // Reopening the dialog for another section must not show stale values.
  React.useEffect(() => {
    if (!open) return

    form.reset(defaultValues(schedule))
  }, [open, schedule, form])

  const timeStart = useWatch({ control: form.control, name: "timeStart" })
  const graceMinutes = useWatch({ control: form.control, name: "graceMinutes" })
  const isSubmitting = form.formState.isSubmitting

  const cutoffPreview = React.useMemo(() => {
    const grace = Number(graceMinutes)

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(timeStart)) return "—"
    if (!Number.isInteger(grace) || grace < 0) return "—"

    return formatClockTime(addMinutesToTime(timeStart, grace))
  }, [timeStart, graceMinutes])

  async function onSubmit(values: ScheduleDialogValues) {
    if (!schedule) return

    const result = await updateScheduleAction({
      programId: schedule.programId,
      yearLevel: schedule.yearLevel,
      section: schedule.section,
      campus: schedule.campus,
      ...values,
    })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof ScheduleDialogValues, { message })
      }

      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Schedule{schedule ? ` · Section ${schedule.section}` : ""}
          </DialogTitle>
          <DialogDescription>
            A tap is Late only after the class start plus the grace window.
            Program and year level are fixed by the pilot scope.
          </DialogDescription>
        </DialogHeader>

        {schedule ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <LockedField label="Program" value={schedule.programCode} />
                <LockedField label="Year level" value={schedule.yearLevel} />
                <LockedField label="Section" value={schedule.section} />
                <LockedField
                  label="Campus"
                  value={schedule.campus ?? "All campuses"}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="timeStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time start</FormLabel>
                      <FormControl>
                        <Input type="time" step={60} {...field} />
                      </FormControl>
                      <FormDescription>
                        Philippines Time. Class end (
                        {formatClockTime(schedule.timeEnd)}) is informational
                        only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="graceMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grace (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={240}
                          step={1}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The pilot default is 15 minutes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {statusLabels[field.value]}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {scheduleStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {statusLabels[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Inactive schedules stop flagging Late. Rows are never
                        deleted.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Late cutoff</Label>
                  <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm tabular-nums">
                    <Badge variant="outline">{cutoffPreview}</Badge>
                    <span className="text-muted-foreground">
                      time start + grace
                    </span>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class days</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {scheduleDays.map((day) => {
                        const checked = field.value.includes(day.value)

                        return (
                          <label
                            key={day.value}
                            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(next) =>
                                field.onChange(
                                  next === true
                                    ? [...field.value, day.value].sort(
                                        (a, b) => a - b
                                      )
                                    : field.value.filter(
                                        (value) => value !== day.value
                                      )
                                )
                              }
                            />
                            {day.label}
                          </label>
                        )
                      })}
                    </div>
                    <FormDescription>
                      Unchecking a day retires that row instead of deleting it,
                      so the section stays on record.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
