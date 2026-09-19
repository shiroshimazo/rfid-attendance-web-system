"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ScanLine, Undo2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { gooeyToast } from "@/components/ui/goey-toaster"

import { RfidStatusBadge } from "@/components/attendance-status-badge"
import { CardCombobox } from "@/components/card-combobox"
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
import { DatePicker, toDateKey } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  assignRfidCardAction,
  releaseRfidCardAction,
} from "@/features/students/actions"
import type { StoredCardView, StudentView } from "@/features/students/directory"
import {
  cardAssignmentFormSchema,
  rfidCardStatuses,
  type CardAssignmentValues,
} from "@/features/students/schema"
import { formatDateValue } from "@/lib/format"

function defaultValues(student: StudentView | null): CardAssignmentValues {
  const card = student?.activeCard ?? null

  return {
    cardId: card ? String(card.id) : "",
    cardStatus: card?.cardStatus ?? "Active",
    assignedDate: card?.assignedDate ?? new Date().toISOString().slice(0, 10),
  }
}

export function RfidAssignDialog({
  student,
  cards,
  onOpenChange,
}: {
  /** Null closes the dialog; a student opens it for that record. */
  student: StudentView | null
  /** Every stored card, filtered here to the ones this student may receive. */
  cards: StoredCardView[]
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<CardAssignmentValues>({
    resolver: zodResolver(cardAssignmentFormSchema),
    defaultValues: defaultValues(student),
    mode: "onBlur",
  })
  const [isReleasing, setReleasing] = React.useState(false)

  React.useEffect(() => {
    if (student) form.reset(defaultValues(student))
  }, [student, form])

  // Dates are recorded, never scheduled, so tomorrow is out of range.
  const today = toDateKey(new Date())
  const isSubmitting = form.formState.isSubmitting
  const selectedId = useWatch({ control: form.control, name: "cardId" })
  const cardStatus = useWatch({ control: form.control, name: "cardStatus" })

  // A student can receive a card no one holds, or keep one already theirs.
  const available = React.useMemo(
    () =>
      cards.filter(
        (card) => card.studentId === null || card.studentId === student?.id
      ),
    [cards, student]
  )
  const held = student?.activeCard ?? null
  const replacesCard =
    cardStatus === "Active" && held && String(held.id) !== selectedId
      ? held.rfidNumber
      : null

  async function onSubmit(values: CardAssignmentValues) {
    if (!student) return

    const result = await assignRfidCardAction({
      studentId: student.id,
      cardId: Number(values.cardId),
      cardStatus: values.cardStatus,
      assignedDate: values.assignedDate,
    })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof CardAssignmentValues, { message })
      }

      gooeyToast.error(result.message)
      return
    }

    gooeyToast.success(result.message)
    onOpenChange(false)
  }

  async function onRelease() {
    if (!held) return
    setReleasing(true)
    const result = await releaseRfidCardAction({ cardId: held.id })
    setReleasing(false)

    if (!result.ok) {
      gooeyToast.error(result.message)
      return
    }

    gooeyToast.success(result.message)
    onOpenChange(false)
  }

  const isBusy = isSubmitting || isReleasing

  return (
    <Dialog open={Boolean(student)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign RFID card</DialogTitle>
          <DialogDescription className="text-pretty">
            {student
              ? `Give ${student.fullName} a card registered in Manage RFID Cards. Only one card can stay active.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {student && student.cards.length > 0 ? (
          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Card history</p>
            <ul className="space-y-1.5">
              {student.cards.map((card) => (
                <li
                  key={card.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <span className="font-mono tabular-nums">
                    {card.rfidNumber}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {formatDateValue(card.assignedDate)}
                    </span>
                    <RfidStatusBadge status={card.cardStatus} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="cardId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="assign-student-card">
                    Registered card
                  </FormLabel>
                  <CardCombobox
                    id="assign-student-card"
                    cards={available}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isBusy || available.length === 0}
                    aria-invalid={Boolean(fieldState.error)}
                  />
                  <FormDescription>
                    {available.length === 0
                      ? "No stored card is free. Register one in Manage RFID Cards first."
                      : "Only cards no other student holds are listed. A card with attendance records stays with its student."}
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
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        max={today}
                        clearable={false}
                        placeholder="Select the issue date"
                      />
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
                {student?.fullName} already taps with{" "}
                <span className="font-mono">{replacesCard}</span>. Saving this
                card as active will deactivate the old one.
              </p>
            ) : null}

            <DialogFooter className="sm:justify-between">
              {held ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRelease}
                  disabled={isBusy}
                >
                  {isReleasing ? (
                    <Loader2 aria-hidden className="animate-spin" />
                  ) : (
                    <Undo2 aria-hidden />
                  )}
                  Release card
                </Button>
              ) : (
                <span />
              )}

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isBusy}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isBusy || available.length === 0}
                >
                  {isSubmitting ? (
                    <Loader2 aria-hidden className="animate-spin" />
                  ) : (
                    <ScanLine aria-hidden />
                  )}
                  Save card
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
