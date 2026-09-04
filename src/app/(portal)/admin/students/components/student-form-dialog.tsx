"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { ProgramOption } from "@/features/teachers/directory"
import {
  PILOT_CAMPUSES,
  PILOT_PROGRAM_CODE,
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

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description: string
}) {
  return (
    <div className="space-y-1">
      <h3 id={id} className="text-sm font-semibold">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground text-pretty">{description}</p>
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

  // Pilot scope: program is always BSIT. Resolve its id from the directory.
  const bsitProgram = programs.find(
    (program) => program.code === PILOT_PROGRAM_CODE
  )

  const form = useForm<StudentDialogValues>({
    resolver: zodResolver(studentDialogSchema),
    defaultValues: defaultValues(student),
    mode: "onBlur",
  })

  // Reopening the dialog for another student must not show stale values.
  // Create mode always starts locked to the BSIT pilot program.
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
  }, [open, student, form, bsitProgram])

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: StudentDialogValues) {
    const result =
      mode === "create"
        ? await createStudentAction(values)
        : await updateStudentAction({ ...values, id: student?.id ?? 0 })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof StudentDialogValues, { message })
      }

      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Student" : "Edit Student"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create the login account, personal record, and academic placement."
              : "Update the personal record and academic placement."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <section aria-labelledby="student-personal" className="space-y-4">
              <SectionHeading
                id="student-personal"
                title="Personal Information"
                description="Identity and contact details for the student."
              />
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
                          placeholder="Juan Dela Cruz"
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
                          placeholder="student@school.edu"
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
                      <Select value={field.value} onValueChange={field.onChange}>
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
                        <Input type="date" {...field} />
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
                        <Input placeholder="Quezon City" {...field} />
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
                          placeholder="+639181234567"
                          {...field}
                        />
                      </FormControl>
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
                          rows={2}
                          placeholder="Novaliches, Quezon City"
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
                      <FormLabel>Profile picture URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
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
            </section>

            <Separator />

            <section aria-labelledby="student-parent" className="space-y-4">
              <SectionHeading
                id="student-parent"
                title="Parent or Guardian"
                description="Attendance SMS notifications are sent to this number."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent or guardian name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ana Dela Cruz" {...field} />
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
                          placeholder="+639191234567"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <Separator />

            <section aria-labelledby="student-academic" className="space-y-4">
              <SectionHeading
                id="student-academic"
                title="Academic Information"
                description="BSIT 2nd Year pilot placement. Used by attendance, reports, and teacher access."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="2026-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programId"
                  render={({ field }) => {
                    const selected = programs.find(
                      (program) => String(program.id) === field.value
                    )
                    return (
                      <FormItem>
                        <FormLabel>Program</FormLabel>
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                        <p className="text-sm font-medium">
                          {selected
                            ? `${selected.code} — ${selected.name}`
                            : "BSIT — BS Information Technology"}
                        </p>
                        <FormDescription>
                          Locked to the BSIT pilot.
                          {bsitProgram
                            ? null
                            : " BSIT program missing; run the database migrations."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name="yearLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year level</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly aria-readonly />
                      </FormControl>
                      <FormDescription>
                        Fixed to the 2nd Year pilot.
                      </FormDescription>
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
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PILOT_SECTIONS.map((option) => (
                            <SelectItem key={option.code} value={option.code}>
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
                  name="campus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select campus" />
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
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
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
            </section>

            {mode === "create" ? (
              <>
                <Separator />
                <section aria-labelledby="student-account" className="space-y-4">
                  <SectionHeading
                    id="student-account"
                    title="Account Information"
                    description="The login account is created on the server; passwords are never stored in this database."
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
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
                              {...field}
                            />
                          </FormControl>
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
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              </>
            ) : null}

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
                {mode === "create" ? "Add student" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
