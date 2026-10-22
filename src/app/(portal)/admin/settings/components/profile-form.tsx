"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { gooeyToast } from "@/components/ui/goey-toaster"

import { ProfileImageUpload } from "@/components/profile-image-upload"
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

  const [isUploading, setIsUploading] = React.useState(false)
  const isSubmitting = form.formState.isSubmitting || isUploading
  const avatarUrl = useWatch({
    control: form.control,
    name: "avatarUrl",
  })
  const [email, phoneNumber] = useWatch({
    control: form.control,
    name: ["email", "phoneNumber"],
  })

  // The server is the only authority on the stored details. When it asks for
  // the password on a form that saw no change, the field is forced open.
  const [serverRequiresReauth, setServerRequiresReauth] = React.useState(false)

  // Email, phone, and photo are protected details. Changing one of them
  // needs the current password, so the field appears only when it matters.
  const requiresReauth =
    (email ?? profile.email) !== profile.email ||
    (phoneNumber ?? profile.phoneNumber) !== profile.phoneNumber ||
    (avatarUrl ?? profile.avatarUrl) !== profile.avatarUrl

  const needsPassword = requiresReauth || serverRequiresReauth

  async function onSubmit(values: AdminProfileValues) {
    if (isUploading) return
    if (needsPassword && !values.currentPassword) {
      form.setError("currentPassword", {
        message: "Enter your current password to confirm this change",
      })
      return
    }

    const result = await updateAdminProfileAction(values)

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof AdminProfileValues, { message })
      }

      if (result.fieldErrors?.currentPassword) {
        setServerRequiresReauth(true)
      }

      gooeyToast.error(result.message)
      return
    }

    // Reset to the saved values so the form is no longer marked as dirty.
    // The confirmation password is dropped from the form state.
    form.reset({ ...values, currentPassword: "" })
    setServerRequiresReauth(false)
    gooeyToast.success(result.message)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Card>
          <CardHeader>
            <CardTitle className="text-balance">Admin information</CardTitle>
            <CardDescription className="text-pretty">
              These details identify you across the portal and appear beside
              your account in the sidebar.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change photo</FormLabel>
                  <FormControl>
                    <ProfileImageUpload
                      onUploadingChange={setIsUploading}
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    JPG, PNG, or WebP, up to 2 MB. Your initials are shown when no image is selected.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {needsPassword ? (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Your sign-in password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-pretty">
                      Required because you are changing protected details. It
                      checks your account, and it is never stored.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

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
              className="transition-transform active:scale-[0.96]"
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
