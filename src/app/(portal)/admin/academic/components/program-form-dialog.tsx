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
  createProgramAction,
  updateProgramAction,
} from "@/features/academic/actions"
import { PILOT_PROGRAM_CODE } from "@/features/academic/pilot"
import {
  catalogFormStatuses,
  programFormSchema,
  type ProgramFormValues,
  type ProgramView,
} from "@/features/academic/schema"

import { LockedField, PilotNotice } from "./catalog-parts"

function defaultValues(program?: ProgramView | null): ProgramFormValues {
  return {
    programCode: program?.code ?? "",
    programName: program?.name ?? "",
    department: program?.department ?? "",
    status: program?.status === "inactive" ? "inactive" : "active",
  }
}

export function ProgramFormDialog({
  open,
  onOpenChange,
  program,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present when editing; absent when adding. */
  program?: ProgramView | null
}) {
  // The pilot lock and the schedule RPCs match BSIT by code and need it active.
  const locked = Boolean(program?.isPilot)

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: defaultValues(program),
    mode: "onTouched",
  })

  // Reopening the dialog for another program must not show stale values.
  React.useEffect(() => {
    if (!open) return

    form.reset(defaultValues(program))
  }, [open, program, form])

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: ProgramFormValues) {
    const result = program
      ? await updateProgramAction({ ...values, id: program.id })
      : await createProgramAction(values)

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof ProgramFormValues, { message })
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
            {program ? `Edit Program · ${program.code}` : "Add Program"}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {program
              ? "Changes update the catalog only. Attendance already confirmed keeps the program code it recorded."
              : "Add a degree program to the academic catalog."}
          </DialogDescription>
        </DialogHeader>

        {!locked ? (
          <PilotNotice>
            Active programs are available in student and teacher forms. Add class groupings for student placement and subjects for teaching assignments.
          </PilotNotice>
        ) : null}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="grid items-start gap-4 sm:grid-cols-2">
              {locked ? (
                <LockedField
                  label="Program code"
                  value={program?.code ?? PILOT_PROGRAM_CODE}
                  description="The pilot lock matches this code, so it cannot change while the pilot runs."
                />
              ) : (
                <FormField
                  control={form.control}
                  name="programCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program code</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          autoCapitalize="characters"
                          placeholder="e.g., BSHM"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Saved in uppercase.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {locked ? (
                <LockedField
                  label="Status"
                  value={accountStatusLabels.active}
                  description="The pilot program stays active."
                />
              ) : (
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
                          {catalogFormStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {accountStatusLabels[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Inactive programs stay in the catalog.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="programName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="e.g., BS Hospitality Management"
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
                  <FormLabel>
                    Department{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="e.g., College of Computer Studies"
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
                {program ? "Save changes" : "Add program"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
