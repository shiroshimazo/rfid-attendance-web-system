import { z } from "zod"
const id = z.number().int().positive().safe()
const date = z.iso.date()
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)

export const confirmSubjectSchema = z.object({
  scheduleId: id, studentId: id, date,
  status: z.enum(["Present", "Late", "Absent"]),
  expectedConfirmedAt: z.iso.datetime({ offset: true }).nullable(),
})
export const createSubjectScheduleSchema = z.object({
  assignmentId: id, day: z.number().int().min(0).max(6), start: time, end: time,
}).refine(value => value.end > value.start, "End time must be after start time")
export const subjectScheduleIdSchema = id

const requiredTime = (message: string) =>
  z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, message)

const endAfterStart = {
  path: ["end"],
  message: "End time must be after start time",
}

/** Browser shape: every control holds a string, so ids and the day arrive as text. */
export const subjectScheduleDialogSchema = z.object({
  assignmentId: z.string().min(1, "Select a teaching assignment"),
  day: z.string().min(1, "Select a weekday"),
  start: requiredTime("Choose a start time"),
  end: requiredTime("Choose an end time"),
}).refine(value => value.end > value.start, endAfterStart)
export type SubjectScheduleDialogValues = z.infer<typeof subjectScheduleDialogSchema>

/** The edit dialog only moves the times; the assignment and weekday are fixed. */
export const subjectScheduleTimesSchema = z.object({
  start: requiredTime("Choose a start time"),
  end: requiredTime("Choose an end time"),
}).refine(value => value.end > value.start, endAfterStart)
export type SubjectScheduleTimesValues = z.infer<typeof subjectScheduleTimesSchema>

export const editSubjectScheduleSchema = z.object({
  scheduleId: id, start: time, end: time,
  expectedStart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,6})?)?$/),
  expectedEnd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,6})?)?$/),
}).refine(value => value.end > value.start, "End time must be after start time")
