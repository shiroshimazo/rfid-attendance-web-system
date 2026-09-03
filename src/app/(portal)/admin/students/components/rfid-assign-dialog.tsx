"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ScanLine } from "lucide-react"
import { useForm } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { assignRfidCardAction } from "@/features/students/actions"
import type { StudentView } from "@/features/students/directory"
import {
  rfidAssignmentFormSchema,
  rfidCardStatuses,
  type RfidAssignmentValues,
} from "@/features/students/schema"
import { formatDateValue } from "@/lib/format"

function defaultValues(student: StudentView | null): RfidAssignmentValues {
  const card = student?.activeCard ?? student?.cards[0] ?? null

  return {
    rfidNumber: card?.rfidNumber ?? "",
    cardStatus: card?.cardStatus ?? "Active",
    assignedDate:
      card?.assignedDate ?? new Date().toISOString().slice(0, 10),
  }
}

export function RfidAssignDialog({
  student,
  onOpenChange,
}: {
  /** Null closes the dialog; a student opens it for that record. */
  student: StudentView | null
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<RfidAssignmentValues>({
    resolver: zodResolver(rfidAssignmentFormSchema),
    defaultValues: defaultValues(student),
    mode: "onBlur",
  })

  React.useEffect(() => {
    if (student) form.reset(defaultValues(student))
  }, [student, form])

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: RfidAssignmentValues) {
    if (!student) return

    const result = await assignRfidCardAction({
      ...values,
      studentId: student.id,
    })

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof RfidAssignmentValues, { message })
      }

      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onOpenChange(false)
  }

  return (
    <Dialog open={Boolean(student)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign RFID card</DialogTitle>
          <DialogDescription className="text-pretty">
            {student
              ? `Register or re-issue the card ${student.fullName} taps at the reader. Only one card can stay active.`
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
                    number.
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
                Save card
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
