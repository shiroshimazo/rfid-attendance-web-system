"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ScanLine } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { StudentCombobox } from "@/components/student-combobox"
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
import { registerRfidCardAction } from "@/features/rfid/actions"
import type { StudentCardOption } from "@/features/rfid/cards"
import {
  rfidCardFormSchema,
  rfidCardStatuses,
  type RfidCardFormValues,
} from "@/features/rfid/schema"

function emptyValues(): RfidCardFormValues {
  return {
    rfidNumber: "",
    studentId: "",
    cardStatus: "Active",
    assignedDate: new Date().toISOString().slice(0, 10),
  }
}

export function RfidCardRegisterDialog({
  open,
  onOpenChange,
  students,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: StudentCardOption[]
}) {
  const form = useForm<RfidCardFormValues>({
    resolver: zodResolver(rfidCardFormSchema),
    defaultValues: emptyValues(),
    mode: "onBlur",
  })

  const isSubmitting = form.formState.isSubmitting
  const selectedId = useWatch({ control: form.control, name: "studentId" })
  const cardStatus = useWatch({ control: form.control, name: "cardStatus" })

  const holder = students.find((student) => String(student.id) === selectedId)
  const replacesCard =
    cardStatus === "Active" && holder?.activeCardNumber
      ? holder.activeCardNumber
      : null

  async function onSubmit(values: RfidCardFormValues) {
    const result = await registerRfidCardAction({
      ...values,
      studentId: Number(values.studentId),
    })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof RfidCardFormValues, { message })
      }

      toast.error(result.message)
      return
    }

    toast.success(result.message)
    form.reset(emptyValues())
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) form.reset(emptyValues())
        onOpenChange(next)
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register RFID card</DialogTitle>
          <DialogDescription className="text-pretty">
            Record the number printed on the card and hand it to the student who
            will tap it. Only one card can stay active per student.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="rfidNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RFID card number</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="04-A1-B2-C3-D4-E5-80"
                      className="font-mono tabular-nums"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tap the card on a connected reader, or type the printed
                    number. Numbers are stored in upper case and must be unique.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="register-card-student">Student</FormLabel>
                  <StudentCombobox
                    id="register-card-student"
                    students={students}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(fieldState.error)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="cardStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue>{field.value}</SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rfidCardStatuses.map((option) => (
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
                name="assignedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned on</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {replacesCard ? (
              <p
                aria-live="polite"
                className="rounded-md border border-amber-600/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:border-amber-400/25 dark:text-amber-300"
              >
                {holder?.fullName} already taps with{" "}
                <span className="font-mono">{replacesCard}</span>. Saving this
                card as active will deactivate the old one.
              </p>
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
                ) : (
                  <ScanLine aria-hidden />
                )}
                Register card
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
