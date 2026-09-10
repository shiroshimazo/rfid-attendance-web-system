"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createSubjectScheduleAction } from "@/features/subject-attendance/actions"
import { weekdays } from "@/features/subject-attendance/model"
import {
  subjectScheduleDialogSchema,
  type SubjectScheduleDialogValues,
} from "@/features/subject-attendance/schema"
import type { SubjectAssignment } from "@/services/attendance/subject-attendance"

interface AssignmentItem {
  value: string
  label: string
  teacher: string
  detail: string
}

const emptyValues: SubjectScheduleDialogValues = {
  assignmentId: "",
  day: "1",
  start: "",
  end: "",
}

/**
 * Only assignments with an active teacher and an explicit class placement can
 * be scheduled; the server rejects the rest anyway.
 */
export function schedulableAssignments(assignments: SubjectAssignment[]) {
  return assignments.filter(
    (row) =>
      row.teacher?.status === "active" &&
      row.year_level &&
      row.section &&
      row.campus
  )
}

export function SubjectScheduleFormDialog({
  open,
  onOpenChange,
  assignments,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignments: SubjectAssignment[]
  onCreated: () => void
}) {
  const form = useForm<SubjectScheduleDialogValues>({
    resolver: zodResolver(subjectScheduleDialogSchema),
    defaultValues: emptyValues,
    mode: "onBlur",
  })

  // Reopening the dialog after a save must not show the previous entry.
  React.useEffect(() => {
    if (!open) return

    form.reset(emptyValues)
  }, [open, form])

  // Keep the popup inside the dialog's pointer/focus boundary, or its options
  // sit outside the modal and never receive the click.
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  const attachInput = React.useCallback((node: HTMLInputElement | null) => {
    setContainer(
      node?.closest<HTMLElement>('[data-slot="dialog-content"]') ?? null
    )
  }, [])

  const items = React.useMemo<AssignmentItem[]>(
    () =>
      schedulableAssignments(assignments).map((row) => ({
        value: String(row.id),
        label: `${row.teacher?.full_name ?? "Unassigned"} · ${row.course?.course_code ?? "—"} · ${row.section} · ${row.campus}`,
        teacher: row.teacher?.full_name ?? "Unassigned",
        detail: `${row.course?.course_code ?? "—"} · ${row.section} · ${row.campus}`,
      })),
    [assignments]
  )

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: SubjectScheduleDialogValues) {
    const result = await createSubjectScheduleAction({
      assignmentId: Number(values.assignmentId),
      day: Number(values.day),
      start: values.start,
      end: values.end,
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
    onCreated()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add subject schedule</DialogTitle>
          <DialogDescription>
            Pick an existing teaching assignment, then set the weekday and time
            in Philippines Time. These times are separate from RFID
            arrival/departure.
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground text-pretty">
            No schedulable assignments. Add an active teacher assignment with an
            explicit section and campus first.
          </p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="assignmentId"
                render={({ field, fieldState }) => {
                  const selected =
                    items.find((item) => item.value === field.value) ?? null

                  return (
                    <FormItem>
                      <FormLabel htmlFor="subject-schedule-assignment">
                        Teaching assignment
                      </FormLabel>
                      <Combobox
                        items={items}
                        value={selected}
                        onValueChange={(item: AssignmentItem | null) =>
                          field.onChange(item?.value ?? "")
                        }
                        disabled={isSubmitting}
                      >
                        <ComboboxInput
                          ref={attachInput}
                          id="subject-schedule-assignment"
                          placeholder="Search teacher, subject, section or campus"
                          disabled={isSubmitting}
                          aria-invalid={Boolean(fieldState.error)}
                          showClear={Boolean(selected)}
                        />
                        <ComboboxContent container={container}>
                          <ComboboxEmpty>
                            No matching assignment.
                          </ComboboxEmpty>
                          <ComboboxList>
                            {(item: AssignmentItem) => (
                              <ComboboxItem key={item.value} value={item}>
                                <span className="flex min-w-0 flex-col">
                                  <span className="truncate">
                                    {item.teacher}
                                  </span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {item.detail}
                                  </span>
                                </span>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FormDescription>
                        Teacher, subject, section and campus come from the
                        assignment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekday</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {weekdays[Number(field.value)] ?? "Select a weekday"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekdays.map((day, index) => (
                          <SelectItem key={day} value={String(index)}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
