"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ScanLine } from "lucide-react"
import { useForm } from "react-hook-form"
import { gooeyToast } from "@/components/ui/goey-toaster"

import { RfidUidScanner } from "@/components/rfid-uid-scanner"
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
import { registerRfidCardAction } from "@/features/rfid/actions"
import {
  rfidCardFormSchema,
  rfidCardStatuses,
  type RfidCardFormValues,
} from "@/features/rfid/schema"

// A stored card has no holder yet, and only an assigned card can be active.
const storedStatuses = rfidCardStatuses.filter((option) => option !== "Active")

function emptyValues(): RfidCardFormValues {
  return {
    rfidNumber: "",
    cardStatus: "Inactive",
    assignedDate: new Date().toISOString().slice(0, 10),
  }
}

export function RfidCardRegisterDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<RfidCardFormValues>({
    resolver: zodResolver(rfidCardFormSchema),
    defaultValues: emptyValues(),
    mode: "onBlur",
  })

  // Dates are recorded, never scheduled, so tomorrow is out of range.
  const today = toDateKey(new Date())
  const [isScanning, setScanning] = React.useState(false)
  const isBusy = form.formState.isSubmitting || isScanning

  async function onSubmit(values: RfidCardFormValues) {
    const result = await registerRfidCardAction(values)

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof RfidCardFormValues, { message })
      }

      gooeyToast.error(result.message)
      return
    }

    gooeyToast.success(result.message)
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
            Record the UID reported by the reader. Hand the card to a student in
            Manage Students; the reader accepts it once it is assigned.
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
                    Enter the hexadecimal UID reported by your reader, or scan the
                    card over USB. Colons, hyphens, or spaces between bytes are
                    accepted. Keep leading zeros.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <RfidUidScanner
              onScan={(uid) =>
                form.setValue("rfidNumber", uid, { shouldValidate: true })
              }
              onBusyChange={setScanning}
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
                        {storedStatuses.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      A card becomes active when Manage Students assigns it.
                    </FormDescription>
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
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isBusy}>
                {form.formState.isSubmitting ? (
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
