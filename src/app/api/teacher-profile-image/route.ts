import { auditRoute } from "@/services/audit/log"
import { getCurrentAccount } from "@/features/auth/server"
import { createAdminSupabaseClient } from "@/services/supabase/admin"

const bucket = "teacher-profile-images"
const maxSize = 2 * 1024 * 1024

export async function POST(request: Request) {
  return auditRoute("profile_image_upload", "teachers", async () => {
    const account = await getCurrentAccount()
    if (!account || account.role !== "admin" || account.status !== "active") {
      return Response.json({ error: "Administrator access is required." }, { status: 403 })
    }

    const origin = request.headers.get("origin")
    if (origin && origin !== new URL(request.url).origin) {
      return Response.json({ error: "Invalid request origin." }, { status: 403 })
    }

    try {
      const file = (await request.formData()).get("file")
      if (!(file instanceof File) || !file.size || file.size > maxSize) {
        return Response.json({ error: "Choose an image smaller than 2 MB." }, { status: 400 })
      }
      const bytes = new Uint8Array(await file.arrayBuffer())
      const png = [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte)
      const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
        String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
      const extension = png ? "png" : jpeg ? "jpg" : webp ? "webp" : null
      const contentType = png ? "image/png" : jpeg ? "image/jpeg" : "image/webp"
      if (!extension || file.type !== contentType) {
        return Response.json({ error: "Choose a JPG, PNG, or WebP image." }, { status: 400 })
      }

      const storage = createAdminSupabaseClient().storage
      const existing = await storage.getBucket(bucket)
      if (existing.error) {
        const created = await storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: maxSize,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        })
        if (created.error && (await storage.getBucket(bucket)).error) {
          throw new Error("Storage is unavailable.")
        }
      }
      const path = `${account.id}/${crypto.randomUUID()}.${extension}`
      const uploaded = await storage.from(bucket).upload(path, bytes, { contentType, upsert: false })
      if (uploaded.error) throw uploaded.error
      return Response.json({ url: storage.from(bucket).getPublicUrl(path).data.publicUrl })
    } catch {
      return Response.json({ error: "Image upload failed. Please try again." }, { status: 500 })
    }
  })
}
