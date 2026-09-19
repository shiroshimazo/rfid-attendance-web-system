"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { gooeyToast } from "@/components/ui/goey-toaster"

import { accountStatusLabels } from "@/components/account-status-badge"
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
import {
  createCourseAction,
  updateCourseAction,
} from "@/features/academic/actions"
import {
  catalogFormStatuses,
  courseFormSchema,
  type CourseFormValues,
  type CourseView,
  type ProgramView,
} from "@/features/academic/schema"

import { LockedField } from "./catalog-parts"

function defaultValues(
  course: CourseView | null | undefined,
  defaultProgramId: string
): CourseFormValues {
  return {
    programId: course ? String(course.programId) : defaultProgramId,
    courseCode: course?.code ?? "",
    courseName: course?.name ?? "",
    status: course?.status === "inactive" ? "inactive" : "active",
  }
}

export function SubjectFormDialog({
  open,
  onOpenChange,
  course,
  programs,
  defaultProgramId = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present when editing; absent when adding. */
  course?: CourseView | null
  /** Programs a new subject may join: every program that is not archived. */
  programs: ProgramView[]
  defaultProgramId?: string
}) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: defaultValues(course, defaultProgramId),
    mode: "onTouched",
  })

  // Reopening the dialog for another subject must not show stale values.
  React.useEffect(() => {
    if (!open) return

    form.reset(defaultValues(course, defaultProgramId))
  }, [open, course, defaultProgramId, form])

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: CourseFormValues) {
    const result = course
      ? await updateCourseAction({
          id: course.id,
          courseCode: values.courseCode,
          courseName: values.courseName,
          status: values.status,
        })
      : await createCourseAction(values)

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof CourseFormValues, { message })
      }

      gooeyToast.error(result.message)
      return
    }

    gooeyToast.success(result.message)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {course ? `Edit Subject · ${course.code}` : "Add Subject"}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {course
              ? "Changes update the catalog only. Attendance already confirmed keeps the code and name it recorded."
              : "Add a subject to a program's catalog."}
          </DialogDescription>
        </DialogHeader>


        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {course ? (
              <LockedField
                label="Program"
                value={`${course.programCode} — ${course.programName}`}
                description="A subject cannot move to another program: its teaching assignments and schedules are tied to this pairing. Archive it and add a new subject under the other program instead."
              />
            ) : (
              <FormField
                control={form.control}
                name="programId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full min-w-0 [&_[data-slot=select-value]]:block [&_[data-slot=select-value]]:truncate">
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={String(program.id)}>
                            {program.code} — {program.name}

                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject code</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        autoCapitalize="characters"
                        placeholder="e.g., CCS2207"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Unique within the program.</FormDescription>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue>{accountStatusLabels[field.value]}</SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {catalogFormStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {accountStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Only active subjects are offered.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="e.g., Networking 1"
                      {...field}
                    />
                  </FormControl>
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
                {course ? "Save changes" : "Add subject"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
