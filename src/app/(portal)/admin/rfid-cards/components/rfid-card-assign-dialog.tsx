"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserRoundCheck } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { RfidStatusBadge } from "@/components/attendance-status-badge"
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
import { assignRfidCardAction } from "@/features/rfid/actions"
import type { RfidCardView, StudentCardOption } from "@/features/rfid/cards"
import {
  rfidCardAssignmentFormSchema,
  rfidCardStatuses,
  type RfidCardAssignmentValues,
} from "@/features/rfid/schema"
import { formatDateValue } from "@/lib/format"

function defaultValues(card: RfidCardView | null): RfidCardAssignmentValues {
  return {
    studentId: card?.student ? String(card.student.id) : "",
    cardStatus: card?.cardStatus ?? "Active",
    assignedDate: card?.assignedDate ?? new Date().toISOString().slice(0, 10),
  }
}

export function RfidCardAssignDialog({
  card,
  students,
  onOpenChange,
}: {
  /** Null closes the dialog; a card opens it for that record. */
  card: RfidCardView | null
  students: StudentCardOption[]
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<RfidCardAssignmentValues>({
    resolver: zodResolver(rfidCardAssignmentFormSchema),
    defaultValues: defaultValues(card),
    mode: "onBlur",
  })

  React.useEffect(() => {
    if (card) form.reset(defaultValues(card))
  }, [card, form])

  const isSubmitting = form.formState.isSubmitting
  const selectedId = useWatch({ control: form.control, name: "studentId" })
  const cardStatus = useWatch({ control: form.control, name: "cardStatus" })

  const holder = students.find((student) => String(student.id) === selectedId)
  const isMoving = Boolean(
    card?.student && holder && holder.id !== card.student.id
  )
  const replacesCard =
    cardStatus === "Active" &&
    holder?.activeCardNumber &&
    holder.activeCardNumber !== card?.rfidNumber
      ? holder.activeCardNumber
      : null

  async function onSubmit(values: RfidCardAssignmentValues) {
    if (!card) return

    const result = await assignRfidCardAction({
      id: card.id,
      studentId: Number(values.studentId),
      cardStatus: values.cardStatus,
      assignedDate: values.assignedDate,
    })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof RfidCardAssignmentValues, { message })
      }

      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
  }

  return (
    <Dialog open={Boolean(card)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign RFID card</DialogTitle>
          <DialogDescription className="text-pretty">
            Hand this card to another student, or re-issue it to the same one
            with a new date or status.
          </DialogDescription>
        </DialogHeader>

        {card ? (
          <div className="space-y-2 rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono tabular-nums">{card.rfidNumber}</span>
              <RfidStatusBadge status={card.cardStatus} />
            </div>
            <p className="text-muted-foreground text-pretty">
              Currently held by {card.student?.fullName ?? "an unknown student"}
              {card.student ? ` (${card.student.studentId})` : ""} since{" "}
              {formatDateValue(card.assignedDate)}.
            </p>
          </div>
        ) : null}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="studentId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="assign-card-student">Student</FormLabel>
                  <StudentCombobox
                    id="assign-card-student"
                    students={students}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(fieldState.error)}
                  />
                  <FormDescription>
                    A card that already has attendance records cannot change
                    hands. Register a new card for that student instead.
                  </FormDescription>
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
                  <UserRoundCheck aria-hidden />
                )}
                {isMoving ? "Reassign card" : "Save assignment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
