import { z } from "zod"
const id = z.number().int().positive().safe()
const date = z.iso.date()
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)

export const confirmSubjectSchema = z.object({
  scheduleId: id, studentId: id, date,
  status: z.enum(["Present", "Absent"]),
  expectedConfirmedAt: z.iso.datetime({ offset: true }).nullable(),
})
export const createSubjectScheduleSchema = z.object({
  assignmentId: id, day: z.number().int().min(0).max(6), start: time, end: time,
}).refine(value => value.end > value.start, "End time must be after start time")
export const subjectScheduleIdSchema = id
