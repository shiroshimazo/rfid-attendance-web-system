import { UserRound } from "lucide-react"
import { createElement, type ComponentType } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Analytics01Icon,
  CalendarCheckIcon,
  CalendarClockIcon,
  Home04Icon,
  ScanLineIcon,
  Settings02Icon,
  TeachingIcon,
  UsersIcon,
} from "@hugeicons/core-free-icons"

import type { UserRole } from "@/features/auth/roles"

function makeIcon(icon: typeof Home04Icon) {
  return function NavIcon({ className }: { className?: string }) {
    return createElement(HugeiconsIcon, { icon, className, "aria-hidden": true })
  }
}

const DashboardIcon = makeIcon(Home04Icon)
const TeachersIcon = makeIcon(TeachingIcon)
const StudentsIcon = makeIcon(UsersIcon)
const RfidIcon = makeIcon(ScanLineIcon)
const AttendanceIcon = makeIcon(CalendarCheckIcon)
const SchedulesIcon = makeIcon(CalendarClockIcon)
const ReportsIcon = makeIcon(Analytics01Icon)
const SettingsIcon = makeIcon(Settings02Icon)

export interface NavigationItem {
  title: string
  url: string
  icon?: ComponentType<{ className?: string }>
  items?: Array<{ title: string; url: string }>
}

export interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

export const roleMeta: Record<
  UserRole,
  { label: string; home: string; profile: string }
> = {
  admin: {
    label: "Administrator",
    home: "/admin/dashboard",
    profile: "/admin/settings",
  },
  teacher: {
    label: "Teacher",
    home: "/teacher/dashboard",
    profile: "/teacher/settings",
  },
  student: {
    label: "Student",
    home: "/student/dashboard",
    profile: "/student/profile",
  },
}

export const navigationByRole: Record<UserRole, NavigationGroup[]> = {
  admin: [
    {
      label: "Administration",
      items: [
        { title: "Dashboard", url: "/admin/dashboard", icon: DashboardIcon },
        { title: "Manage Teachers", url: "/admin/teachers", icon: TeachersIcon },
        { title: "Manage Students", url: "/admin/students", icon: StudentsIcon },
        { title: "Manage RFID Cards", url: "/admin/rfid-cards", icon: RfidIcon },
        { title: "Attendance", url: "/admin/attendance", icon: AttendanceIcon },
        { title: "Schedules", url: "/admin/schedules", icon: SchedulesIcon },
        { title: "Reports", url: "/admin/reports", icon: ReportsIcon },
        { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
      ],
    },
  ],
  teacher: [
    {
      label: "Teaching",
      items: [
        { title: "Dashboard", url: "/teacher/dashboard", icon: DashboardIcon },
        { title: "Attendance", url: "/teacher/attendance", icon: AttendanceIcon },
        { title: "Students", url: "/teacher/students", icon: StudentsIcon },
        { title: "Reports", url: "/teacher/reports", icon: ReportsIcon },
        { title: "Settings", url: "/teacher/settings", icon: SettingsIcon },
      ],
    },
  ],
  student: [
    {
      label: "Student Portal",
      items: [
        { title: "Dashboard", url: "/student/dashboard", icon: DashboardIcon },
        { title: "My Attendance", url: "/student/my-attendance", icon: AttendanceIcon },
        { title: "Profile", url: "/student/profile", icon: UserRound },
      ],
    },
  ],
}
