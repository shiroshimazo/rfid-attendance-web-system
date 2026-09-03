"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
import { changeStudentPasswordAction } from "@/features/profiles/actions"
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/features/profiles/schema"

const emptyPassword: ChangePasswordValues = {
  password: "",
  confirmPassword: "",
}

export function PasswordForm() {
  const [isVisible, setIsVisible] = React.useState(false)

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: emptyPassword,
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: ChangePasswordValues) {
    const result = await changeStudentPasswordAction(values)

    if (!result.ok) {
      for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(path as keyof ChangePasswordValues, { message })
      }

      toast.error(result.message)
      return
    }

    // The new credential never lingers in the browser once it is saved.
    form.reset(emptyPassword)
    setIsVisible(false)
    toast.success(result.message)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription className="text-pretty">
              Supabase Authentication stores the new password as a hash. Your
              other signed-in devices stay signed in.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type={isVisible ? "text" : "password"}
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={
                        isVisible ? "Hide password" : "Show password"
                      }
                      aria-pressed={isVisible}
                      onClick={() => setIsVisible((visible) => !visible)}
                    >
                      {isVisible ? (
                        <EyeOff aria-hidden />
                      ) : (
                        <Eye aria-hidden />
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Use 8 to 72 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type={isVisible ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 aria-hidden className="animate-spin" />
              ) : (
                <KeyRound aria-hidden />
              )}
              Update password
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
