"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm, useWatch, type UseFormReturn } from "react-hook-form"
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
  createSectionAction,
  updateSectionAction,
} from "@/features/academic/actions"
import { PILOT_YEAR_LEVEL } from "@/features/academic/pilot"
import {
  catalogFormStatuses,
  catalogSpelling,
  isAssignableGrouping,
  sectionStatusFormSchema,
  type ProgramView,
  type SectionStatusFormValues,
  type SectionView,
} from "@/features/academic/schema"
import { cn } from "@/lib/utils"

import { PilotNotice } from "./catalog-parts"

function StatusField({ form }: { form: UseFormReturn<SectionStatusFormValues> }) {
  return (
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
          <FormDescription>
            Inactive groupings stay in the catalog but leave the pickers.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SectionEditor({
  open,
  programs,
  yearLevels,
  campuses,
  defaultProgramId,
  section,
  onDone,
}: {
  open: boolean
  programs: ProgramView[]
  yearLevels: string[]
  campuses: string[]
  defaultProgramId: string
  section?: SectionView | null
  onDone: () => void
}) {
  const yearListId = React.useId()
  const campusListId = React.useId()

  const initial = React.useCallback((): SectionStatusFormValues => ({
    programId: section ? String(section.programId) : defaultProgramId,
    yearLevel: section?.yearLevel ?? "",
    sectionCode: section?.sectionCode ?? "",
    campus: section?.campus ?? "",
    status: section?.status === "inactive" ? "inactive" : "active",
  }), [section, defaultProgramId])
  const form = useForm<SectionStatusFormValues>({
    resolver: zodResolver(sectionStatusFormSchema),
    defaultValues: initial(),
    mode: "onTouched",
  })

  // Reopening the dialog after a save must not show the previous entry.
  React.useEffect(() => {
    if (!open) return

    form.reset(initial())
  }, [open, initial, form])

  const values = useWatch({ control: form.control })
  const program = programs.find((row) => String(row.id) === values.programId)
  const complete = Boolean(
    program &&
      values.yearLevel?.trim() &&
      values.sectionCode?.trim() &&
      values.campus?.trim()
  )
  // Mirrors the save: the catalog's spelling wins, codes are uppercase.
  const assignable =
    complete &&
    isAssignableGrouping({
      programCode: program?.code ?? "",
      yearLevel: catalogSpelling(values.yearLevel ?? "", yearLevels),
      sectionCode: (values.sectionCode ?? "").trim().toUpperCase(),
      campus: catalogSpelling(values.campus ?? "", campuses),
    })
  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(submitted: SectionStatusFormValues) {
    const result = section
      ? await updateSectionAction({ ...submitted, id: section.id })
      : await createSectionAction(submitted)

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof SectionStatusFormValues, { message })
      }

      gooeyToast.error(result.message)
      return
    }

    gooeyToast.success(result.message)
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{section ? `Edit Class Grouping - Section ${section.sectionCode}` : "Add Class Grouping"}</DialogTitle>
        <DialogDescription className="text-pretty">
          {section
            ? "Update the program, year level, section, campus, or status."
            : "One year level, section, and campus combination for the student and teacher pickers."}
        </DialogDescription>
      </DialogHeader>

      <PilotNotice>
        {section
          ? "Changes update current students, teaching assignments, and schedules together. Recorded attendance keeps its original details. Moving programs requires matching subject codes in the destination program."
          : "Active groupings under active programs are available to students and teachers."}
      </PilotNotice>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
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
                    {programs.map((row) => (
                      <SelectItem key={row.id} value={String(row.id)}>
                        {row.code} — {row.name}

                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid items-start gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="yearLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year level</FormLabel>
                  <FormControl>
                    <Input
                      list={yearListId}
                      autoComplete="off"
                      placeholder={`e.g., ${PILOT_YEAR_LEVEL}`}
                      {...field}
                    />
                  </FormControl>
                  <datalist id={yearListId}>
                    {yearLevels.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sectionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section code</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      autoCapitalize="characters"
                      placeholder="e.g., 21011"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="campus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campus</FormLabel>
                <FormControl>
                  <Input
                    list={campusListId}
                    autoComplete="off"
                    placeholder="e.g., Main Campus"
                    {...field}
                  />
                </FormControl>
                <datalist id={campusListId}>
                  {campuses.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <FormDescription>
                  Use the campus name offered to students and teachers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {section ? <StatusField form={form} /> : null}

          {complete ? (
            <p
              aria-live="polite"
              className={cn(
                "rounded-lg border px-3 py-2 text-sm text-pretty",
                assignable
                  ? "border-emerald-600/20 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/25 dark:text-emerald-200"
                  : "border-dashed text-muted-foreground"
              )}
            >
              {assignable
                ? "Students and teachers can use this grouping when its program is active."
                : "Complete all fields to make this grouping available."}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onDone}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {section ? "Save changes" : "Add class grouping"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export function SectionFormDialog({
  open,
  onOpenChange,
  section,
  programs,
  yearLevels,
  campuses,
  defaultProgramId = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present when editing; absent when adding. */
  section?: SectionView | null
  /** Programs a new grouping may join: every program that is not archived. */
  programs: ProgramView[]
  yearLevels: string[]
  campuses: string[]
  defaultProgramId?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <SectionEditor
          open={open}
          section={section}
          programs={programs}
          yearLevels={yearLevels}
          campuses={campuses}
          defaultProgramId={defaultProgramId}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
