"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ShieldCheck } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setRfidCardStatusAction } from "@/features/rfid/actions"
import type { RfidCardStatus, RfidCardView } from "@/features/rfid/cards"
import {
  rfidCardStatusFormSchema,
  rfidCardStatuses,
  type RfidCardStatusValues,
} from "@/features/rfid/schema"

const statusHelp: Record<RfidCardStatus, string> = {
  Active: "The reader accepts this card and records attendance.",
  Inactive: "The card is on hold and taps are rejected.",
  Lost: "The card is missing. Register a replacement for the student.",
  Deactivated: "The card is retired and kept only for history.",
}

export function RfidCardStatusDialog({
  card,
  onOpenChange,
}: {
  /** Null closes the dialog; a card opens it for that record. */
  card: RfidCardView | null
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<RfidCardStatusValues>({
    resolver: zodResolver(rfidCardStatusFormSchema),
    defaultValues: { cardStatus: card?.cardStatus ?? "Active" },
  })

  React.useEffect(() => {
    if (card) form.reset({ cardStatus: card.cardStatus })
  }, [card, form])

  const isSubmitting = form.formState.isSubmitting
  const nextStatus = useWatch({ control: form.control, name: "cardStatus" })

  async function onSubmit(values: RfidCardStatusValues) {
    if (!card) return

    const result = await setRfidCardStatusAction({
      id: card.id,
      cardStatus: values.cardStatus,
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
  }

  return (
    <Dialog open={Boolean(card)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update card status</DialogTitle>
          <DialogDescription className="text-pretty">
            {card
              ? `${card.rfidNumber} is held by ${card.student?.fullName ?? "an unknown student"}.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {card ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current status</span>
            <RfidStatusBadge status={card.cardStatus} />
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
              name="cardStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New status</FormLabel>
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
                  <FormDescription>{statusHelp[nextStatus]}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {nextStatus === "Active" ? (
              <p
                aria-live="polite"
                className="rounded-md border border-amber-600/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:border-amber-400/25 dark:text-amber-300"
              >
                Any other active card held by this student is deactivated, since
                only one card can stay active.
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
                  <ShieldCheck aria-hidden />
                )}
                Save status
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
