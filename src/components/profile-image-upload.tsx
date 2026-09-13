"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> & {
  value: string
  onChange: (url: string) => void
  onUploadingChange: (uploading: boolean) => void
}

export function ProfileImageUpload({ value, onChange, onUploadingChange, disabled, ...props }: Props) {
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState("")
  const controller = React.useRef<AbortController | null>(null)
  const errorId = React.useId()

  React.useEffect(() => () => {
    controller.current?.abort()
    onUploadingChange(false)
  }, [onUploadingChange])

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setError("")
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || !file.size || file.size > 2 * 1024 * 1024) {
      setError("Choose a JPG, PNG, or WebP image smaller than 2 MB.")
      return
    }
    const pending = new AbortController()
    controller.current = pending
    setUploading(true)
    onUploadingChange(true)
    try {
      const data = new FormData()
      data.set("file", file)
      const response = await fetch("/api/teacher-profile-image", { method: "POST", body: data, signal: pending.signal })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Image upload failed.")
      if (!pending.signal.aborted) onChange(result.url)
    } catch (failure) {
      if (!pending.signal.aborted) setError(failure instanceof Error ? failure.message : "Image upload failed. Please try again.")
    } finally {
      if (!pending.signal.aborted) {
        setUploading(false)
        onUploadingChange(false)
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Avatar className="size-14 shrink-0">
          <AvatarImage src={value || undefined} alt="Profile picture preview" />
          <AvatarFallback>Photo</AvatarFallback>
        </Avatar>
        <Input {...props} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled || uploading}
          onChange={upload} aria-invalid={!!error || props["aria-invalid"]}
          aria-describedby={[props["aria-describedby"], error ? errorId : ""].filter(Boolean).join(" ")} />
        {value && <Button type="button" variant="outline" disabled={disabled || uploading} onClick={() => { onChange(""); setError("") }}>Remove</Button>}
      </div>
      {uploading && <p role="status" className="text-sm text-muted-foreground">Uploading image…</p>}
      {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
