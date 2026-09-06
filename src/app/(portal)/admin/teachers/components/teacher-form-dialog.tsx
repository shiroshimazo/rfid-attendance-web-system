"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, Lock, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { accountStatusLabels } from "@/components/account-status-badge"
import { Button } from "@/components/ui/button"
import { DatePicker, toDateKey } from "@/components/ui/date-picker"
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
import { Separator } from "@/components/ui/separator"
import {
  PILOT_CAMPUSES,
  PILOT_PROGRAM_CODE,
  PILOT_PROGRAM_NAME,
  PILOT_SECTIONS,
  PILOT_YEAR_LEVEL,
} from "@/features/academic/pilot"
import {
  createTeacherAction,
  updateTeacherAction,
} from "@/features/teachers/actions"
import type {
  CourseOption,
  ProgramOption,
  TeacherView,
} from "@/features/teachers/directory"
import {
  accountStatuses,
  civilStatusOptions,
  genderOptions,
  teacherDialogSchema,
  type TeacherDialogValues,
} from "@/features/teachers/schema"
import { cn } from "@/lib/utils"

type StepId = "personal" | "employment" | "assignments" | "account"

interface WizardStep {
  id: StepId
  label: string
  title: string
  description: string
  /** Only these fields are validated before the step may be left. */
  fields: (keyof TeacherDialogValues)[]
}

const steps: WizardStep[] = [
  {
    id: "personal",
    label: "Personal Info",
    title: "Personal Information",
    description: "Identity and contact details for the teacher.",
    fields: [
      "fullName",
      "email",
      "gender",
      "civilStatus",
      "dateOfBirth",
      "phoneNumber",
      "profilePicture",
    ],
  },
  {
    id: "employment",
    label: "Employment",
    title: "Employment Information",
    description: "Institutional identifiers and account state.",
    fields: ["teacherId", "department", "dateHired", "status"],
  },
  {
    id: "assignments",
    label: "Assignments",
    title: "Teaching Assignments",
    description:
      "BSIT 2nd Year pilot classes. A teacher can handle several without duplicating the profile.",
    fields: ["assignments"],
  },
  {
    id: "account",
    label: "Account",
    title: "Account Information",
    description:
      "The login account is created on the server; passwords are never stored in this database.",
    fields: ["password", "confirmPassword"],
  },
]

const emptyAssignment = {
  programId: "",
  courseId: "",
  yearLevel: PILOT_YEAR_LEVEL,
  section: "",
  campus: "",
}

const buttonMotion = "transition-transform active:scale-[0.96]"

function defaultValues(teacher?: TeacherView | null): TeacherDialogValues {
  if (!teacher) {
    return {
      mode: "create",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      civilStatus: "",
      email: "",
      phoneNumber: "",
      profilePicture: "",
      teacherId: "",
      department: "",
      dateHired: "",
      status: "active",
      assignments: [{ ...emptyAssignment }],
      password: "",
      confirmPassword: "",
    }
  }

  return {
    mode: "edit",
    fullName: teacher.fullName,
    gender: (teacher.gender ?? "") as TeacherDialogValues["gender"],
    dateOfBirth: teacher.dateOfBirth ?? "",
    civilStatus: (teacher.civilStatus ??
      "") as TeacherDialogValues["civilStatus"],
    email: teacher.email,
    phoneNumber: teacher.phoneNumber ?? "",
    profilePicture: teacher.profilePicture ?? "",
    teacherId: teacher.teacherId,
    department: teacher.department,
    dateHired: teacher.dateHired ?? "",
    status: teacher.status,
    assignments:
      teacher.assignments.length > 0
        ? teacher.assignments.map((assignment) => ({
            programId: String(assignment.programId),
            courseId: String(assignment.courseId),
            yearLevel: assignment.yearLevel || PILOT_YEAR_LEVEL,
            section: assignment.section ?? "",
            campus: assignment.campus ?? "",
          }))
        : [{ ...emptyAssignment }],
    password: "",
    confirmPassword: "",
  }
}

/** Numbered progress rail: done, current, and still-to-come steps. */
function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-start" aria-label="Add teacher progress">
      {steps.map((step, index) => {
        const isDone = index < current
        const isCurrent = index === current

        return (
          <li
            key={step.id}
            className="flex flex-1 flex-col items-center gap-1.5 last:flex-none"
          >
            <div className="flex w-full items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-2 border-primary font-semibold",
                  !isDone && !isCurrent && "text-muted-foreground"
                )}
              >
                {isDone ? <Check className="size-3.5" /> : index + 1}
              </span>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "h-px flex-1",
                    isDone ? "bg-primary" : "bg-border"
                  )}
                />
              ) : null}
            </div>
            <span
              className={cn(
                "text-xs",
                isCurrent ? "font-medium" : "text-muted-foreground"
              )}
            >
              {step.label}
              {isCurrent ? <span className="sr-only"> (current step)</span> : null}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Read-only pilot value, shown so the lock is visible rather than implied. */
function LockedField({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex h-9 items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 text-sm">
        <span className="truncate">{value}</span>
        <Lock aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 break-words">{value}</dd>
    </div>
  )
}

export function TeacherFormDialog({
  open,
  onOpenChange,
  teacher,
  programs,
  courses,
  departments,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present when editing; absent when adding. */
  teacher?: TeacherView | null
  programs: ProgramOption[]
  courses: CourseOption[]
  departments: string[]
}) {
  const mode = teacher ? "edit" : "create"
  const departmentListId = React.useId()
  const [stepIndex, setStepIndex] = React.useState(0)

  // Pilot scope: new assignments always start on BSIT 2nd Year.
  const bsitProgram = programs.find(
    (program) => program.code === PILOT_PROGRAM_CODE
  )
  const bsitProgramIdValue = bsitProgram ? String(bsitProgram.id) : ""

  const form = useForm<TeacherDialogValues>({
    resolver: zodResolver(teacherDialogSchema),
    defaultValues: defaultValues(teacher),
    mode: "onTouched",
  })

  const assignments = useFieldArray({
    control: form.control,
    name: "assignments",
  })

  // Reopening the dialog for another teacher must not show stale values.
  // Create mode always starts locked to the BSIT pilot, on step one.
  React.useEffect(() => {
    if (!open) return

    const values = defaultValues(teacher)

    if (!teacher && bsitProgramIdValue) {
      values.assignments = values.assignments.map((assignment) => ({
        ...assignment,
        programId: bsitProgramIdValue,
        yearLevel: PILOT_YEAR_LEVEL,
      }))
    }

    form.reset(values)
    setStepIndex(0)
  }, [open, teacher, form, bsitProgramIdValue])

  const watchedAssignments = useWatch({
    control: form.control,
    name: "assignments",
  })
  const summary = useWatch({ control: form.control })

  // Dates are recorded, never scheduled, so tomorrow is out of range.
  const today = toDateKey(new Date())
  const isSubmitting = form.formState.isSubmitting
  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const programLabel = bsitProgram
    ? `${bsitProgram.code} — ${bsitProgram.name}`
    : `${PILOT_PROGRAM_CODE} — ${PILOT_PROGRAM_NAME}`

  async function goNext() {
    const valid = await form.trigger(step.fields, { shouldFocus: true })

    if (valid) setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }

  function goBack() {
    // Going back never validates, so a half-filled step is not blocked.
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  async function onSubmit(values: TeacherDialogValues) {
    const result =
      mode === "create"
        ? await createTeacherAction(values)
        : await updateTeacherAction({ ...values, id: teacher?.id ?? 0 })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof TeacherDialogValues, { message })
      }

      // Send the administrator to the step that owns the first failed field.
      const failed = (Object.keys(result.fieldErrors ?? {})[0] ?? "").split(
        "."
      )[0]
      const owning = steps.findIndex((entry) =>
        entry.fields.includes(failed as keyof TeacherDialogValues)
      )

      if (owning >= 0) setStepIndex(owning)

      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
  }

  const assignmentCount = watchedAssignments?.length ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-balance">
            {mode === "create" ? "Add Teacher" : "Edit Teacher"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Step {stepIndex + 1} of {steps.length}: {step.title}
          </DialogDescription>
        </DialogHeader>

        <Stepper current={stepIndex} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-balance">
                Step {stepIndex + 1} of {steps.length}: {step.title}
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                {step.description}
              </p>
            </div>

            <div className="min-h-[20rem]">
              {step.id === "personal" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="name"
                            placeholder="Enter full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="Enter email address"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Also used as the login identifier.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender">
                                {field.value || undefined}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="civilStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Civil status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select civil status">
                                {field.value || undefined}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {civilStatusOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of birth</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            max={today}
                            placeholder="Select date of birth"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            autoComplete="tel"
                            placeholder="Enter phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include country code (e.g., +639181234567).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>
                          Profile picture URL{" "}
                          <span className="font-normal text-muted-foreground">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            inputMode="url"
                            placeholder="https://example.com/photo.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional. Initials are shown when this is empty.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}

              {step.id === "employment" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter teacher ID (e.g., T-001)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input
                            list={departmentListId}
                            placeholder="Enter department"
                            {...field}
                          />
                        </FormControl>
                        <datalist id={departmentListId}>
                          {departments.map((department) => (
                            <option key={department} value={department} />
                          ))}
                        </datalist>
                        <FormDescription>
                          Pick an existing department, or type a new one.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateHired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date hired</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            max={today}
                            placeholder="Select the hire date"
                          />
                        </FormControl>
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
                              <SelectValue placeholder="Select status (default: Active)">
                                {accountStatusLabels[field.value]}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountStatuses.map((option) => (
                              <SelectItem key={option} value={option}>
                                {accountStatusLabels[option]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}

              {step.id === "assignments" ? (
                <div className="space-y-4">
                  <ul className="space-y-3">
                    {assignments.fields.map((assignmentField, index) => {
                      const selectedProgram =
                        watchedAssignments?.[index]?.programId ?? ""
                      const programCourses = courses.filter(
                        (course) => String(course.programId) === selectedProgram
                      )

                      return (
                        <li
                          key={assignmentField.id}
                          className="rounded-lg border p-3"
                        >
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <p className="text-sm font-medium tabular-nums">
                              Assignment {index + 1}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={buttonMotion}
                              disabled={assignments.fields.length === 1}
                              aria-label={`Remove assignment ${index + 1}`}
                              onClick={() => assignments.remove(index)}
                            >
                              <Trash2 aria-hidden />
                              Remove
                            </Button>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <FormField
                              control={form.control}
                              name={`assignments.${index}.programId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <input type="hidden" {...field} />
                                  </FormControl>
                                  <LockedField
                                    label="Program"
                                    value={programLabel}
                                    description="Locked to the BSIT pilot."
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`assignments.${index}.courseId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Course/Subject</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!selectedProgram}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue
                                          placeholder={
                                            selectedProgram
                                              ? "Select course"
                                              : "Select a program first"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {programCourses.map((course) => (
                                        <SelectItem
                                          key={course.id}
                                          value={String(course.id)}
                                        >
                                          {course.code} — {course.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {selectedProgram &&
                                  programCourses.length === 0 ? (
                                    <FormDescription>
                                      This program has no courses yet.
                                    </FormDescription>
                                  ) : null}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`assignments.${index}.yearLevel`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <input type="hidden" {...field} />
                                  </FormControl>
                                  <LockedField
                                    label="Year level"
                                    value={field.value || PILOT_YEAR_LEVEL}
                                    description="Fixed to the 2nd Year pilot."
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`assignments.${index}.section`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Section</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select section">
                                          {field.value || undefined}
                                        </SelectValue>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {PILOT_SECTIONS.map((option) => (
                                        <SelectItem
                                          key={option.code}
                                          value={option.code}
                                        >
                                          {option.code} —{" "}
                                          {option.session === "morning"
                                            ? "Morning"
                                            : "Afternoon"}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`assignments.${index}.campus`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Campus</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select campus">
                                          {field.value || undefined}
                                        </SelectValue>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {PILOT_CAMPUSES.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  {form.formState.errors.assignments?.root ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.assignments.root.message}
                    </p>
                  ) : null}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={buttonMotion}
                    onClick={() =>
                      assignments.append({
                        ...emptyAssignment,
                        programId: bsitProgramIdValue,
                        yearLevel: PILOT_YEAR_LEVEL,
                      })
                    }
                  >
                    <Plus aria-hidden />
                    Add assignment
                  </Button>
                </div>
              ) : null}

              {step.id === "account" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    {mode === "create" ? (
                      <>
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  autoComplete="new-password"
                                  placeholder="Enter password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Use at least 8 characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  autoComplete="new-password"
                                  placeholder="Confirm password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Passwords must match.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground text-pretty">
                        The login password is not editable here. Ask the teacher
                        to reset it from the sign-in page.
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-semibold">Review Summary</h4>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <SummaryRow
                        label="Full name"
                        value={summary.fullName || "(not set)"}
                      />
                      <SummaryRow
                        label="Email"
                        value={summary.email || "(not set)"}
                      />
                      <SummaryRow
                        label="Teacher ID"
                        value={summary.teacherId || "(not set)"}
                      />
                      <SummaryRow
                        label="Department"
                        value={summary.department || "(not set)"}
                      />
                      <SummaryRow
                        label="Phone"
                        value={summary.phoneNumber || "(not set)"}
                      />
                      <SummaryRow label="Program" value={programLabel} />
                      <SummaryRow
                        label="Assignments"
                        value={
                          assignmentCount === 1
                            ? "1 class"
                            : `${assignmentCount} classes`
                        }
                      />
                      <SummaryRow
                        label="Sections"
                        value={
                          (watchedAssignments ?? [])
                            .map((assignment) => assignment?.section)
                            .filter(Boolean)
                            .join(", ") || "(not selected)"
                        }
                      />
                      <SummaryRow
                        label="Status"
                        value={
                          summary.status
                            ? accountStatusLabels[summary.status]
                            : "Active"
                        }
                      />
                    </dl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn("mt-4", buttonMotion)}
                      onClick={() => setStepIndex(0)}
                    >
                      Edit details
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <Separator />

            <DialogFooter className="sm:items-center sm:justify-between">
              {isLastStep ? (
                <p className="text-sm text-muted-foreground text-pretty sm:mr-auto">
                  Helper: You can navigate back to review or edit previous
                  information before adding the teacher.
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                {stepIndex === 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className={buttonMotion}
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className={buttonMotion}
                    onClick={goBack}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}

                {isLastStep ? (
                  <Button
                    type="submit"
                    className={buttonMotion}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 aria-hidden className="animate-spin" />
                    ) : null}
                    {mode === "create" ? "Add teacher" : "Save changes"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className={buttonMotion}
                    onClick={goNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
