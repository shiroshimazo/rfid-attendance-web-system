import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { StudentProfile } from "@/features/profiles/student-profile"
import { initialsOf } from "@/lib/format"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-pretty break-all">{value}</dd>
    </div>
  )
}

/** Read-only identity card. Nothing here can be edited from this page. */
export function ProfileInfoCard({ profile }: { profile: StudentProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student information</CardTitle>
        <CardDescription className="text-pretty">
          Personal and academic record on file. Contact an administrator to
          correct any detail.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-16">
            {profile.profilePicture ? (
              <AvatarImage src={profile.profilePicture} alt="" />
            ) : null}
            <AvatarFallback className="text-base">
              {initialsOf(profile.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-balance">
              {profile.fullName}
            </p>
            <p className="font-mono text-sm text-muted-foreground tabular-nums">
              {profile.studentId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{profile.yearLevel}</Badge>
          <Badge variant="outline">{profile.section}</Badge>
          <Badge variant="outline">{profile.campus}</Badge>
        </div>

        <Separator />

        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Student ID" value={profile.studentId} />
          <DetailRow label="Email address" value={profile.email} />
          <DetailRow
            label="Contact number"
            value={profile.contactNumber ?? "—"}
          />
          <DetailRow label="Campus" value={profile.campus} />
        </dl>
      </CardContent>
    </Card>
  )
}
