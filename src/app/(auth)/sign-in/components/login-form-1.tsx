"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  dashboardPathByRole,
  isUserRole,
} from "@/features/auth/roles"
import { createBrowserSupabaseClient } from "@/services/supabase/client"

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm1({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    form.clearErrors("root")

    try {
      const supabase = createBrowserSupabaseClient()
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword(values)

      if (authError || !authData.user) {
        form.setError("root", { message: "Invalid email or password." })
        return
      }

      const { data: account, error: accountError } = await supabase
        .from("users")
        .select("role, status")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (
        accountError ||
        !account ||
        !isUserRole(account.role) ||
        account.status !== "active"
      ) {
        await supabase.auth.signOut()
        form.setError("root", {
          message: "This account is inactive or does not have a valid system role.",
        })
        return
      }

      router.replace(dashboardPathByRole[account.role])
      router.refresh()
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Unable to sign in. Please try again.",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail
                            aria-hidden="true"
                            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                            strokeWidth={1.5}
                          />
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="name@school.edu"
                              className="h-10 pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <a
                            href="/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <div className="relative">
                          <LockKeyhole
                            aria-hidden="true"
                            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                            strokeWidth={1.5}
                          />
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              className="h-10 pr-11 pl-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword((visible) => !visible)}
                            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-0 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2"
                          >
                            <Eye
                              aria-hidden="true"
                              strokeWidth={1.5}
                              className={cn(
                                "absolute size-4 transition-[opacity,scale,filter] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)]",
                                showPassword
                                  ? "scale-25 opacity-0 blur-[4px]"
                                  : "scale-100 opacity-100 blur-none"
                              )}
                            />
                            <EyeOff
                              aria-hidden="true"
                              strokeWidth={1.5}
                              className={cn(
                                "absolute size-4 transition-[opacity,scale,filter] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)]",
                                showPassword
                                  ? "scale-100 opacity-100 blur-none"
                                  : "scale-25 opacity-0 blur-[4px]"
                              )}
                            />
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root?.message && (
                    <p role="alert" className="text-sm text-destructive text-pretty">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full cursor-pointer transition-transform active:scale-[0.96]"
                  >
                    {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground text-pretty">
                  Accounts are issued by the school administrator.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
