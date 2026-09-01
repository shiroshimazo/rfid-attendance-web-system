export const userRoles = ["admin", "teacher", "student"] as const

export type UserRole = (typeof userRoles)[number]

export const dashboardPathByRole: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole)
}
