"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, PencilLine } from "lucide-react"
import { useForm } from "react-hook-form"
import { gooeyToast } from "@/components/ui/goey-toaster"

import { RfidStatusBadge } from "@/components/attendance-status-badge"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { editRfidCardAction } from "@/features/rfid/actions"
import type { RfidCardView } from "@/features/rfid/cards"
import {
  rfidCardFormSchema,
  rfidCardStatuses,
  type RfidCardFormValues,
} from "@/features/rfid/schema"
import { formatDateValue } from "@/lib/format"

function defaultValues(card: RfidCardView | null): RfidCardFormValues {
  return {
    rfidNumber: card?.rfidNumber ?? "",
    cardStatus: card?.cardStatus ?? "Inactive",
    assignedDate: card?.assignedDate ?? new Date().toISOString().slice(0, 10),
  }
}

export function RfidCardEditDialog({
  card,
  onOpenChange,
}: {
  /** Null closes the dialog; a card opens it for that record. */
  card: RfidCardView | null
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<RfidCardFormValues>({
    resolver: zodResolver(rfidCardFormSchema),
    defaultValues: defaultValues(card),
    mode: "onBlur",
  })

  React.useEffect(() => {
    if (card) form.reset(defaultValues(card))
  }, [card, form])

  // Dates are recorded, never scheduled, so tomorrow is out of range.
  const today = toDateKey(new Date())
  const isSubmitting = form.formState.isSubmitting
  // Only a card that already has a holder can stay active.
  const statusOptions = card?.student
    ? rfidCardStatuses
    : rfidCardStatuses.filter((option) => option !== "Active")

  async function onSubmit(values: RfidCardFormValues) {
    if (!card) return

    const result = await editRfidCardAction({ ...values, id: card.id })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof RfidCardFormValues, { message })
      }

      gooeyToast.error(result.message)
      return
    }

    gooeyToast.success(result.message)
    onOpenChange(false)
  }

  return (
    <Dialog open={Boolean(card)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit RFID card</DialogTitle>
          <DialogDescription className="text-pretty">
            Correct the stored UID, status, or date. The holder is changed in
            Manage Students.
          </DialogDescription>
        </DialogHeader>

        {card ? (
          <div className="space-y-2 rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono tabular-nums">{card.rfidNumber}</span>
              <RfidStatusBadge status={card.cardStatus} />
            </div>
            <p className="text-muted-foreground text-pretty">
              {card.student
                ? `Held by ${card.student.fullName} (${card.student.studentId}) since ${formatDateValue(card.assignedDate)}.`
                : `Stored on ${formatDateValue(card.assignedDate)} and not assigned to a student yet.`}
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
              name="rfidNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RFID card UID</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="00:00:00:11"
                      className="font-mono tabular-nums"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the hexadecimal UID reported by your reader. A card
                    that already has attendance records keeps its UID.
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
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {card?.student ? null : (
                      <FormDescription>
                        Assign this card in Manage Students before activating it.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recorded on</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        max={today}
                        clearable={false}
                        placeholder="Select the date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  <PencilLine aria-hidden />
                )}
                Save card
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
