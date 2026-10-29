import type { ReactNode } from "react"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ReportsHeaderSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading report controls" className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <Skeleton aria-hidden="true" className="h-8 w-24" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div aria-hidden="true" className="flex w-full max-w-full flex-wrap items-end gap-2 sm:w-auto">
        <Skeleton className="h-11 w-full rounded-lg sm:w-[19rem]" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  )
}

export function KpiCardSkeleton() {
  return (
    <Card className="@container/card min-w-0 gap-4">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-5 w-36 max-w-full" />
        </CardDescription>
        <Skeleton className="h-8 w-20 @[16rem]/card:h-9" />
      </CardHeader>
      <CardFooter>
        <div className="w-full space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardFooter>
    </Card>
  )
}

function PaginationSkeleton() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <Skeleton className="h-5 w-48 max-w-full" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-8" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="size-8" />
      </div>
    </div>
  )
}

export function TableSkeleton({ columns, multiline = false }: { columns: string[]; multiline?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table aria-hidden="true">
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((className, index) => (
              <TableHead key={index} className={className}><Skeleton className="h-4 w-full min-w-10" /></TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }, (_, row) => (
            <TableRow key={row}>
              {columns.map((className, column) => (
                <TableCell key={column} className={className}>
                  <Skeleton className="my-1 h-5 w-full min-w-10" />
                  {multiline && <Skeleton className="mt-1 h-4 w-3/4" />}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function TableCardSkeleton({ title, columns, multiline, children }: {
  title: string; columns: string[]; multiline?: boolean; children?: ReactNode
}) {
  return (
    <Card aria-label={`Loading ${title}`} className="min-w-0">
      <CardHeader>
        <Skeleton aria-hidden="true" className="h-4 w-52 max-w-full" />
        <div className="space-y-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <TableSkeleton columns={columns} multiline={multiline} />
      </CardContent>
      <CardFooter><PaginationSkeleton /></CardFooter>
    </Card>
  )
}

export function ChartCardSkeleton({ status = false, breakdown = false }: { status?: boolean; breakdown?: boolean }) {
  return (
    <Card aria-label={`Loading ${status ? "Attendance Status" : breakdown ? "Attendance by Program" : "Attendance Summary"}`} className="min-w-0">
      <CardHeader className="has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]">
        <Skeleton aria-hidden="true" className="h-4 w-44 max-w-full" />
        <Skeleton className="h-5 w-full" />
        {breakdown && <CardAction><Skeleton className="h-9 w-40 rounded-lg" /></CardAction>}
      </CardHeader>
      <CardContent className={status ? "flex flex-col gap-4" : undefined}>
        <Skeleton className={status ? "mx-auto aspect-square w-full max-w-[300px] rounded-full" : "h-64 w-full"} />
        {status && <div className="mx-auto grid w-full max-w-sm gap-2.5">
          {Array.from({ length: 3 }, (_, index) => <div key={index} className="flex items-center gap-2">
            <Skeleton className="size-2.5 shrink-0 rounded-full" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-4 w-14" />
          </div>)}
        </div>}
      </CardContent>
    </Card>
  )
}

export function SubjectSummarySkeleton({ teacher = false }: { teacher?: boolean }) {
  return teacher ? <>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => <div key={index} className="rounded-lg border p-4">
        <Skeleton className="h-5 w-20 max-w-full" /><Skeleton className="mt-1 h-7 w-16 max-w-full" />
      </div>)}
    </div>
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_auto_160px_150px_auto]">
      {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-10 w-full min-w-24" />)}
    </div>
  </> : <Skeleton className="h-6 w-full max-w-2xl" />
}

export function ReportsPanelSkeleton({ role }: { role: "admin" | "teacher" }) {
  const admin = role === "admin"
  const subjectColumns = Array<string>(6).fill("")
  const sectionColumns = ["px-3", "px-3", "px-3", "px-3", "hidden px-3 md:table-cell", "hidden px-3 lg:table-cell", "hidden px-3 lg:table-cell", ...(admin ? ["hidden px-3 lg:table-cell"] : []), "px-3"]

  return (
    <div aria-busy="true" aria-label="Loading reports" className="flex min-w-0 flex-col gap-4 md:gap-6">
      <div aria-hidden="true" className="space-y-1">
        <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 md:hidden" />
      </div>
      {admin && <TableCardSkeleton title="Subject Attendance" columns={subjectColumns} multiline><SubjectSummarySkeleton /></TableCardSkeleton>}
      <Skeleton aria-hidden="true" className="h-7 w-full max-w-xl" />
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <KpiCardSkeleton key={index} />)}
      </div>
      <CalendarExceptionsSkeleton />
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2"><ChartCardSkeleton /></div>
        <ChartCardSkeleton status />
      </div>
      {admin && <ChartCardSkeleton breakdown />}
      <TableCardSkeleton title="Attendance by Section" columns={sectionColumns} />
      {!admin && <TableCardSkeleton title="Subject Attendance" columns={subjectColumns} multiline><SubjectSummarySkeleton teacher /></TableCardSkeleton>}
      <TableCardSkeleton title="Recent Attendance Logs" columns={["px-3", "px-3", "hidden px-3 md:table-cell", "hidden px-3 lg:table-cell", "hidden px-3 lg:table-cell", "px-3", "hidden px-3 sm:table-cell"]} multiline />
      {admin && <SmsRecordsSkeleton />}
    </div>
  )
}

export function CalendarExceptionsSkeleton() {
  return (
<Card aria-label="Loading Calendar exceptions" className="min-w-0">
        <CardHeader>
          <Skeleton aria-hidden="true" className="h-4 w-40 max-w-full" />
          <div className="space-y-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
        </CardHeader>
        <CardContent><TableSkeleton columns={Array<string>(4).fill("")} /></CardContent>
      </Card>
  )
}

export function SmsRecordsSkeleton() {
  return (
<Card aria-label="Loading SMS Notification Records" className="min-w-0">
        <CardHeader><Skeleton aria-hidden="true" className="h-4 w-52 max-w-full" /><div className="space-y-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => <div key={index} className="space-y-1 rounded-lg border p-3">
            <Skeleton className="h-5 w-2/3" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-4/5" /><Skeleton className="h-5 w-full" />
          </div>)}
        </CardContent>
      </Card>
  )
}
