"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { updateAdminProfileAction } from "@/features/profiles/actions"
import {
  adminProfileSchema,
  type AdminProfileValues,
} from "@/features/profiles/schema"
import { initialsOf } from "@/lib/format"

export function ProfileForm({
  profile,
  pendingEmail,
}: {
  profile: AdminProfileValues
  /** Shown while an email change is still waiting on its confirmation link. */
  pendingEmail: string | null
}) {
  const form = useForm<AdminProfileValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: profile,
  })

  const isSubmitting = form.formState.isSubmitting
  const [avatarUrl, fullName] = useWatch({
    control: form.control,
    name: ["avatarUrl", "fullName"],
  })

  async function onSubmit(values: AdminProfileValues) {
    const result = await updateAdminProfileAction(values)

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof AdminProfileValues, { message })
      }

      toast.error(result.message)
      return
    }

    // Reset to the saved values so the form is no longer marked as dirty.
    form.reset(values)
    toast.success(result.message)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Admin information</CardTitle>
            <CardDescription className="text-pretty">
              These details identify you across the portal and appear beside
              your account in the sidebar.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="size-16">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
                <AvatarFallback className="text-base">
                  {initialsOf(fullName || profile.email)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-56 flex-1 space-y-1">
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Change photo</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          autoComplete="photo"
                          placeholder="https://example.com/photo.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional. Your initials are shown when this is empty.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
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
                        placeholder="09XX XXX XXXX"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormDescription className="text-pretty">
                      This is also your sign-in address. Changing it sends a
                      confirmation link to the new address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {pendingEmail ? (
              <p
                aria-live="polite"
                className="rounded-md border border-amber-600/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 text-pretty dark:border-amber-400/25 dark:text-amber-300"
              >
                A change to {pendingEmail} is waiting for confirmation. Keep
                signing in with your current address until it is confirmed.
              </p>
            ) : null}
          </CardContent>

          <CardFooter className="justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
            >
              {isSubmitting ? (
                <Loader2 aria-hidden className="animate-spin" />
              ) : (
                <Save aria-hidden />
              )}
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
