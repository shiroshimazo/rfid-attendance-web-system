"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
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
import { accountStatusLabels } from "@/components/account-status-badge"

const emptyAssignment = {
  programId: "",
  courseId: "",
  yearLevel: "",
  section: "",
  campus: "",
}

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
            yearLevel: assignment.yearLevel ?? "",
            section: assignment.section ?? "",
            campus: assignment.campus ?? "",
          }))
        : [{ ...emptyAssignment }],
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

  const form = useForm<TeacherDialogValues>({
    resolver: zodResolver(teacherDialogSchema),
    defaultValues: defaultValues(teacher),
    mode: "onBlur",
  })

  const assignments = useFieldArray({
    control: form.control,
    name: "assignments",
  })

  // Reopening the dialog for another teacher must not show stale values.
  React.useEffect(() => {
    if (open) form.reset(defaultValues(teacher))
  }, [open, teacher, form])

  const watchedAssignments = useWatch({
    control: form.control,
    name: "assignments",
  })
  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: TeacherDialogValues) {
    const result =
      mode === "create"
        ? await createTeacherAction(values)
        : await updateTeacherAction({ ...values, id: teacher?.id ?? 0 })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof TeacherDialogValues, { message })
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
            {mode === "create" ? "Add Teacher" : "Edit Teacher"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create the login account, employment record, and teaching assignments."
              : "Update the employment record and teaching assignments."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <section
              aria-labelledby="teacher-personal"
              className="space-y-4"
            >
              <SectionHeading
                id="teacher-personal"
                title="Personal Information"
                description="Identity and contact details for the teacher."
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
                          placeholder="Maria Santos"
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
                          placeholder="teacher@school.edu"
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
                            <SelectValue placeholder="Select civil status" />
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
                        <Input type="date" {...field} />
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
                          placeholder="+639171234567"
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

            <section
              aria-labelledby="teacher-employment"
              className="space-y-4"
            >
              <SectionHeading
                id="teacher-employment"
                title="Employment Information"
                description="Institutional identifiers and account state."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher ID</FormLabel>
                      <FormControl>
                        <Input placeholder="T-001" {...field} />
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
                          placeholder="College of Computer Studies"
                          {...field}
                        />
                      </FormControl>
                      <datalist id={departmentListId}>
                        {departments.map((department) => (
                          <option key={department} value={department} />
                        ))}
                      </datalist>
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
                        <Input type="date" {...field} />
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
                            <SelectValue />
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

            <Separator />

            <section
              aria-labelledby="teacher-assignments"
              className="space-y-4"
            >
              <SectionHeading
                id="teacher-assignments"
                title="Teaching Assignments"
                description="A teacher can handle several classes without duplicating the profile."
              />

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
                              <FormLabel>Program</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  // Courses belong to one program, so the old
                                  // subject can no longer be valid.
                                  form.setValue(
                                    `assignments.${index}.courseId`,
                                    ""
                                  )
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select program" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {programs.map((program) => (
                                    <SelectItem
                                      key={program.id}
                                      value={String(program.id)}
                                    >
                                      {program.code} — {program.name}
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
                              {selectedProgram && programCourses.length === 0 ? (
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
                              <FormLabel>Year level</FormLabel>
                              <FormControl>
                                <Input placeholder="1st Year" {...field} />
                              </FormControl>
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
                              <FormControl>
                                <Input placeholder="BSIT-1A" {...field} />
                              </FormControl>
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
                              <FormControl>
                                <Input placeholder="Main Campus" {...field} />
                              </FormControl>
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
                onClick={() => assignments.append({ ...emptyAssignment })}
              >
                <Plus aria-hidden />
                Add assignment
              </Button>
            </section>

            {mode === "create" ? (
              <>
                <Separator />
                <section
                  aria-labelledby="teacher-account"
                  className="space-y-4"
                >
                  <SectionHeading
                    id="teacher-account"
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
                {mode === "create" ? "Add teacher" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
