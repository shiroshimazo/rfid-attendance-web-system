"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { gooeyToast } from "@/components/ui/goey-toaster"

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
import { ProfileImageUpload } from "@/components/profile-image-upload"
import { PhoneInput } from "@/components/ui/phone-input"
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
  PILOT_PROGRAM_CODE,
  PILOT_YEAR_LEVEL,
} from "@/features/academic/pilot"
import {
  campusPickerOptions,
  isOfferedCampus,
  sectionPickerOptions,
  type ClassGroupingOption,
} from "@/features/academic/schema"
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
    label: "Personal",
    title: "Student details",
    description: "Enter the student's name, email and contact details.",
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
    title: "Parent or guardian",
    description: "Enter the parent or guardian who should receive attendance texts.",
    fields: ["parentName", "parentContactNumber"],
  },
  {
    id: "academic",
    label: "Academic",
    title: "Class details",
    description:
      "Choose the student's program, year level, section and campus.",
    fields: ["studentId", "programId", "yearLevel", "section", "campus", "status"],
  },
  {
    id: "account",
    label: "Account",
    title: "Sign-in details",
    description:
      "Review the student details. Set a password when adding a new student.",
    fields: ["password", "confirmPassword"],
  },
]

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
function Stepper({ current, onStepChange, disabled = false }: {
  current: number
  onStepChange?: (step: number) => void
  disabled?: boolean
}) {
  return (
    <ol className="flex items-start" aria-label={onStepChange ? "Edit student steps" : "Add student progress"}>
      {steps.map((step, index) => {
        const isDone = !onStepChange && index < current
        const isCurrent = index === current

        return (
          <li
            key={step.id}
            className="flex min-w-0 flex-1 flex-col items-center last:flex-none"
          >
            <button
              type="button"
              aria-label={`Step ${index + 1}: ${step.label}`}
              aria-current={isCurrent ? "step" : undefined}
              disabled={!onStepChange || disabled}
              onClick={() => onStepChange?.(index)}
              className="flex w-full flex-col items-center gap-1.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring enabled:cursor-pointer disabled:cursor-default"
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
            </button>
          </li>
        )
      })}
    </ol>
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
  groupings,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present when editing; absent when creating. */
  student?: StudentView | null
  programs: ProgramOption[]
  /** Academic Setup groupings behind the section and campus pickers. */
  groupings: ClassGroupingOption[]
}) {
  const mode = student ? "edit" : "create"
  const [stepIndex, setStepIndex] = React.useState(0)

  // Keep the existing program as the default; all active programs are selectable.
  const bsitProgram = programs.find(
    (program) => program.code === PILOT_PROGRAM_CODE
  )

  const form = useForm<StudentDialogValues>({
    resolver: zodResolver(studentDialogSchema),
    defaultValues: defaultValues(student),
    mode: "onTouched",
  })

  const initializedStudent = React.useRef<number | "create" | null>(null)

  // Initialize once per opening/student, not when a server refresh replaces
  // program or student objects. Those updates must not erase an active draft.
  React.useEffect(() => {
    if (!open) {
      initializedStudent.current = null
      return
    }
    const identity = student?.id ?? "create"
    if (initializedStudent.current === identity) return
    initializedStudent.current = identity

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
  const [isUploading, setIsUploading] = React.useState(false)
  const isSubmitting = form.formState.isSubmitting || isUploading
  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const summary = useWatch({ control: form.control })

  // Section and campus options come from the Academic Setup catalog.
  const groupingScope = {
    programId: summary.programId ? Number(summary.programId) : null,
    yearLevel: summary.yearLevel || PILOT_YEAR_LEVEL,
  }
  const sectionOptions = sectionPickerOptions(groupings, {
    ...groupingScope,
    current: summary.section ?? "",
  })
  const campusOptions = campusPickerOptions(groupings, {
    ...groupingScope,
    section: summary.section ?? "",
    current: summary.campus ?? "",
  })

  async function goNext() {
    if (isSubmitting) return
    const valid = await form.trigger(step.fields, { shouldFocus: true })

    if (valid) setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }

  function goBack() {
    // Going back never validates, so a half-filled step is not blocked.
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  async function handleStepChange(target: number) {
    if (target === stepIndex || isSubmitting) return
    if (target < stepIndex) {
      setStepIndex(target)
      return
    }
    // Forward jumps validate every step left behind. Never saves — only moves locally.
    for (let index = stepIndex; index < target; index += 1) {
      const valid = await form.trigger(steps[index].fields, {
        shouldFocus: true,
      })
      if (!valid) {
        setStepIndex(index)
        return
      }
    }
    setStepIndex(target)
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return
    const target = event.target as HTMLElement | null
    if (!target) return
    if (
      target.tagName === "TEXTAREA" ||
      target.tagName === "BUTTON" ||
      target.closest("[data-no-wizard-next]")
    ) {
      return
    }
    // Enter on an early step moves forward instead of auto-saving.
    event.preventDefault()
    if (!isLastStep) void goNext()
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Navigation and implicit Enter submissions never authorize a save.
    event.preventDefault()
  }

  function handleSave() {
    if (!isLastStep || isSubmitting) return
    void form.handleSubmit(onSubmit, (errors) => {
      const owning = steps.findIndex((entry) =>
        entry.fields.some((field) => field in errors)
      )
      if (owning >= 0) setStepIndex(owning)
    })()
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

      gooeyToast.error(result.message)
      return
    }

    gooeyToast.success(result.message)
    onOpenChange(false)
  }

  const selectedProgram = programs.find((program) => String(program.id) === summary.programId)
  const programLabel = selectedProgram ? `${selectedProgram.code} - ${selectedProgram.name}` : "Select program"

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

        <Stepper current={stepIndex} onStepChange={mode === "edit" ? handleStepChange : undefined} disabled={isSubmitting} />

        <Form {...form}>
          <form
            onSubmit={handleFormSubmit}
            onKeyDown={handleFormKeyDown}
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
                          The student uses this email address to sign in.
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
                              <SelectValue placeholder="Select gender" />
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
                          <PhoneInput
                            autoComplete="tel"
                            name={field.name}
                            ref={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter 10 digits without the leading 0. The +63 country code is included.
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
                          Profile picture{" "}
                          <span className="font-normal text-muted-foreground">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <ProfileImageUpload
                            key={`${student?.id ?? "new"}-${open}`}
                            onUploadingChange={setIsUploading}
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload a JPG, PNG or WebP up to 2 MB. Leave blank to use the student&apos;s initials.
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
                          <PhoneInput
                            name={field.name}
                            ref={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter 10 digits without the leading 0. The +63 country code is included.
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
                            placeholder="Enter student ID"
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
                        <FormLabel>Program</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                            form.setValue("yearLevel", "")
                            form.setValue("section", "")
                            form.setValue("campus", "")
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.id} value={String(program.id)}>
                                {program.code} - {program.name}
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
                    name="yearLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year level</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                            form.setValue("section", "")
                            form.setValue("campus", "")
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select year level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...new Set(
                              groupings
                                .filter((row) =>
                                  String(row.programId) === summary.programId &&
                                  row.status === "active" && row.assignable
                                )
                                .map((row) => row.yearLevel)
                                .concat(field.value ? [field.value] : [])
                            )].sort().map((year) => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {summary.programId && !groupings.some((row) =>
                          String(row.programId) === summary.programId && row.status === "active" && row.assignable
                         ) ? (
                          <FormDescription>
                            Add an active class grouping for this program in Academic Setup.
                          </FormDescription>
                        ) : null}
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
                          onValueChange={(value) => {
                            field.onChange(value)
                            // A campus the new section does not offer is cleared.
                            const campus = form.getValues("campus")
                            if (
                              campus &&
                              !isOfferedCampus(
                                groupings,
                                { ...groupingScope, section: value },
                                campus
                              )
                            ) {
                              form.setValue("campus", "")
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sectionOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {sectionOptions.length === 0 ? (
                          <FormDescription>
                            No sections are available for this program and year level.
                            Add class groupings in Academic Setup.
                          </FormDescription>
                        ) : null}
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
                              <SelectValue placeholder="Select campus" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campusOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                              >
                                {option.label}
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
                        <FormLabel>Account status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select account status" />
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
                                Use 8 to 72 characters.
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
                                Enter the same password again.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground text-pretty">
                        Ask the student to select “Forgot your password?” on the
                        sign-in page to reset their password.
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-semibold">Review student details</h4>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <SummaryRow
                        label="Full name"
                        value={summary.fullName || "(not set)"}
                      />
                      <SummaryRow
                        label="Email address"
                        value={summary.email || "(not set)"}
                      />
                      <SummaryRow
                        label="Student contact"
                        value={summary.contactNumber || "(not set)"}
                      />
                      <SummaryRow
                        label="Guardian"
                        value={summary.parentName || "(not set)"}
                      />
                      <SummaryRow
                        label="Guardian contact"
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
                        label="Account status"
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
                  Use Back or Edit details to review earlier steps before saving.
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
                    key="save"
                    type="button"
                    onClick={handleSave}
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
                    key="next"
                    type="button"
                    className={buttonMotion}
                    disabled={isSubmitting}
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
