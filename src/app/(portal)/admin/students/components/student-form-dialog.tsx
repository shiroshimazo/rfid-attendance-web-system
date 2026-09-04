"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, Lock } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import {
  PILOT_CAMPUSES,
  PILOT_PROGRAM_CODE,
  PILOT_PROGRAM_NAME,
  PILOT_SECTIONS,
  PILOT_YEAR_LEVEL,
} from "@/features/academic/pilot"
import {
  createStudentAction,
  updateStudentAction,
} from "@/features/students/actions"
import type { StudentView } from "@/features/students/directory"
import {
  accountStatuses,
  genderOptions,
  studentDialogSchema,
  type StudentDialogValues,
} from "@/features/students/schema"
import type { ProgramOption } from "@/features/teachers/directory"
import { cn } from "@/lib/utils"

type StepId = "personal" | "guardian" | "academic" | "account"

interface WizardStep {
  id: StepId
  label: string
  title: string
  description: string
  /** Only these fields are validated before the step may be left. */
  fields: (keyof StudentDialogValues)[]
}

const steps: WizardStep[] = [
  {
    id: "personal",
    label: "Personal Info",
    title: "Personal Information",
    description: "Identity and contact details for the student.",
    fields: [
      "fullName",
      "email",
      "gender",
      "dateOfBirth",
      "placeOfBirth",
      "contactNumber",
      "address",
      "profilePicture",
    ],
  },
  {
    id: "guardian",
    label: "Guardian",
    title: "Parent or Guardian",
    description: "Attendance SMS notifications are sent to this number.",
    fields: ["parentName", "parentContactNumber"],
  },
  {
    id: "academic",
    label: "Academic",
    title: "Academic Information",
    description:
      "BSIT 2nd Year pilot placement. Used by attendance, reports, and teacher access.",
    fields: ["studentId", "programId", "yearLevel", "section", "campus", "status"],
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

const sessionLabels = { morning: "Morning", afternoon: "Afternoon" } as const

const buttonMotion = "transition-transform active:scale-[0.96]"

function defaultValues(student?: StudentView | null): StudentDialogValues {
  if (!student) {
    return {
      mode: "create",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      placeOfBirth: "",
      address: "",
      contactNumber: "",
      email: "",
      profilePicture: "",
      parentName: "",
      parentContactNumber: "",
      studentId: "",
      programId: "",
      yearLevel: PILOT_YEAR_LEVEL,
      section: "",
      campus: "",
      status: "active",
      password: "",
      confirmPassword: "",
    }
  }

  return {
    mode: "edit",
    fullName: student.fullName,
    gender: (student.gender ?? "") as StudentDialogValues["gender"],
    dateOfBirth: student.dateOfBirth ?? "",
    placeOfBirth: student.placeOfBirth ?? "",
    address: student.address ?? "",
    contactNumber: student.contactNumber ?? "",
    email: student.email,
    profilePicture: student.profilePicture ?? "",
    parentName: student.parentName,
    parentContactNumber: student.parentContactNumber,
    studentId: student.studentId,
    programId: String(student.programId),
    yearLevel: student.yearLevel,
    section: student.section,
    campus: student.campus,
    status: student.status,
    password: "",
    confirmPassword: "",
  }
}

/** Numbered progress rail: done, current, and still-to-come steps. */
function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-start" aria-label="Add student progress">
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
        <span>{value}</span>
        <Lock aria-hidden className="size-3.5 text-muted-foreground" />
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

export function StudentFormDialog({
  open,
  onOpenChange,
  student,
  programs,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present when editing; absent when creating. */
  student?: StudentView | null
  programs: ProgramOption[]
}) {
  const mode = student ? "edit" : "create"
  const [stepIndex, setStepIndex] = React.useState(0)

  // Pilot scope: program is always BSIT. Resolve its id from the directory.
  const bsitProgram = programs.find(
    (program) => program.code === PILOT_PROGRAM_CODE
  )

  const form = useForm<StudentDialogValues>({
    resolver: zodResolver(studentDialogSchema),
    defaultValues: defaultValues(student),
    mode: "onTouched",
  })

  // Reopening the dialog for another student must not show stale values.
  // Create mode always starts locked to the BSIT pilot program, on step one.
  React.useEffect(() => {
    if (!open) return

    const values = defaultValues(student)

    form.reset({
      ...values,
      programId: student
        ? values.programId
        : bsitProgram
          ? String(bsitProgram.id)
          : "",
    })
    setStepIndex(0)
  }, [open, student, form, bsitProgram])

  // Dates are recorded, never scheduled, so tomorrow is out of range.
  const today = toDateKey(new Date())
  const isSubmitting = form.formState.isSubmitting
  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const summary = useWatch({ control: form.control })

  async function goNext() {
    const valid = await form.trigger(step.fields, { shouldFocus: true })

    if (valid) setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }

  function goBack() {
    // Going back never validates, so a half-filled step is not blocked.
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  async function onSubmit(values: StudentDialogValues) {
    const result =
      mode === "create"
        ? await createStudentAction(values)
        : await updateStudentAction({ ...values, id: student?.id ?? 0 })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof StudentDialogValues, { message })
      }

      // Send the administrator to the step that owns the first failed field.
      const failed = Object.keys(result.fieldErrors ?? {})[0]
      const owning = steps.findIndex((entry) =>
        entry.fields.includes(failed as keyof StudentDialogValues)
      )

      if (owning >= 0) setStepIndex(owning)

      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
  }

  const programLabel = bsitProgram
    ? `${bsitProgram.code} — ${bsitProgram.name}`
    : `${PILOT_PROGRAM_CODE} — ${PILOT_PROGRAM_NAME}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-balance">
            {mode === "create" ? "Add Student" : "Edit Student"}
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
                    name="placeOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of birth</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter place of birth" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            autoComplete="tel"
                            placeholder="Enter contact number"
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
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Enter address"
                            {...field}
                          />
                        </FormControl>
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

              {step.id === "guardian" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent or guardian name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter parent or guardian name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentContactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent or guardian contact number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter contact number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include country code (e.g., +639191234567).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}

              {step.id === "academic" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter student ID (e.g., 2026-001)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="programId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input type="hidden" {...field} />
                        </FormControl>
                        <LockedField
                          label="Program"
                          value={programLabel}
                          description={
                            bsitProgram
                              ? "Locked to the BSIT pilot."
                              : "Locked to the BSIT pilot. The BSIT program is missing; run the database migrations."
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input type="hidden" {...field} />
                        </FormControl>
                        <LockedField
                          label="Year level"
                          value={PILOT_YEAR_LEVEL}
                          description="Fixed to the 2nd Year pilot."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="section"
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
                            {PILOT_SECTIONS.map((section) => (
                              <SelectItem key={section.code} value={section.code}>
                                {section.code} — {sessionLabels[section.session]}
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
                    name="campus"
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
                            {PILOT_CAMPUSES.map((campus) => (
                              <SelectItem key={campus} value={campus}>
                                {campus}
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
                            {accountStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {accountStatusLabels[status]}
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
                        The login password is not editable here. Ask the student
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
                        label="Guardian"
                        value={summary.parentName || "(not set)"}
                      />
                      <SummaryRow
                        label="Contact"
                        value={summary.parentContactNumber || "(not set)"}
                      />
                      <SummaryRow label="Program" value={programLabel} />
                      <SummaryRow
                        label="Year level"
                        value={summary.yearLevel || PILOT_YEAR_LEVEL}
                      />
                      <SummaryRow
                        label="Section"
                        value={summary.section || "(not selected)"}
                      />
                      <SummaryRow
                        label="Campus"
                        value={summary.campus || "(not selected)"}
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
                  information before adding the student.
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
                    {mode === "create" ? "Add student" : "Save changes"}
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
