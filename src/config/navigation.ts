import {
  ClipboardCheck,
  FileChartColumn,
  GraduationCap,
  LayoutDashboard,
  ScanLine,
  Settings,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

export type UserRole = "admin" | "teacher" | "student"

export interface NavigationItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: Array<{ title: string; url: string }>
}

export interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

export const roleMeta: Record<
  UserRole,
  { label: string; home: string; profile: string; placeholderEmail: string }
> = {
  admin: {
    label: "Administrator",
    home: "/admin/dashboard",
    profile: "/admin/settings",
    placeholderEmail: "admin@school.edu",
  },
  teacher: {
    label: "Teacher",
    home: "/teacher/dashboard",
    profile: "/teacher/settings",
    placeholderEmail: "teacher@school.edu",
  },
  student: {
    label: "Student",
    home: "/student/dashboard",
    profile: "/student/profile",
    placeholderEmail: "student@school.edu",
  },
}

export const navigationByRole: Record<UserRole, NavigationGroup[]> = {
  admin: [
    {
      label: "Administration",
      items: [
        { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Manage Teachers", url: "/admin/teachers", icon: GraduationCap },
        { title: "Manage Students", url: "/admin/students", icon: UsersRound },
        { title: "Manage RFID Cards", url: "/admin/rfid-cards", icon: ScanLine },
        { title: "Attendance", url: "/admin/attendance", icon: ClipboardCheck },
        { title: "Reports", url: "/admin/reports", icon: FileChartColumn },
        { title: "Settings", url: "/admin/settings", icon: Settings },
      ],
    },
  ],
  teacher: [
    {
      label: "Teaching",
      items: [
        { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboard },
        { title: "Attendance", url: "/teacher/attendance", icon: ClipboardCheck },
        { title: "Students", url: "/teacher/students", icon: UsersRound },
        { title: "Reports", url: "/teacher/reports", icon: FileChartColumn },
        { title: "Settings", url: "/teacher/settings", icon: Settings },
      ],
    },
  ],
  student: [
    {
      label: "Student Portal",
      items: [
        { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
        { title: "My Attendance", url: "/student/my-attendance", icon: ClipboardCheck },
        { title: "Profile", url: "/student/profile", icon: UserRound },
      ],
    },
  ],
}

export function getRoleFromPathname(pathname: string): UserRole {
  if (pathname.startsWith("/teacher")) return "teacher"
  if (pathname.startsWith("/student")) return "student"
  return "admin"
}
