import { Suspense } from "react"
import type { Metadata } from "next"

import { DataErrorCard } from "@/components/data-error-card"
import { LiveRefresh } from "@/components/live-refresh"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAcademicCatalog } from "@/features/academic/catalog"
import { parseAcademicTab, type AcademicTab } from "@/features/academic/schema"
import { formatNumber } from "@/lib/format"

import { KpiCards } from "./components/kpi-cards"
import { PanelSkeleton } from "./components/panel-skeleton"
import { ProgramsTable } from "./components/programs-table"
import { SectionsTable } from "./components/sections-table"
import { SubjectsTable } from "./components/subjects-table"

export const metadata: Metadata = {
  title: "Academic Setup",
}

// The catalog changes from this page itself, so nothing is cached.
export const dynamic = "force-dynamic"

// Usage counts come from placements too, so those tables refresh the page.
const liveTables = [
  "programs",
  "courses",
  "academic_sections",
  "students",
  "teacher_assignments",
  "subject_schedules",
] as const

function TabCount({ value }: { value: number }) {
  return (
    <span className="text-xs tabular-nums text-muted-foreground">
      {formatNumber(value)}
    </span>
  )
}

function liveCount(rows: { status: string }[]) {
  return rows.filter((row) => row.status !== "archived").length
}

async function AcademicContent({ tab }: { tab: AcademicTab }) {
  let catalog

  try {
    catalog = await getAcademicCatalog()
  } catch (error) {
    return (
      <DataErrorCard
        title="The academic catalog could not be loaded"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while reading the academic catalog."
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <KpiCards kpis={catalog.kpis} />

      <Tabs defaultValue={tab} className="gap-4">
        <div className="overflow-x-auto pb-1">
          <TabsList aria-label="Academic catalog" className="h-11">
            <TabsTrigger value="programs" className="min-h-10 px-3">
              Programs <TabCount value={liveCount(catalog.programs)} />
            </TabsTrigger>
            <TabsTrigger value="subjects" className="min-h-10 px-3">
              Subjects <TabCount value={liveCount(catalog.courses)} />
            </TabsTrigger>
            <TabsTrigger value="sections" className="min-h-10 px-3">
              Class Groupings <TabCount value={liveCount(catalog.sections)} />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="programs">
          <ProgramsTable programs={catalog.programs} />
        </TabsContent>
        <TabsContent value="subjects">
          <SubjectsTable courses={catalog.courses} programs={catalog.programs} />
        </TabsContent>
        <TabsContent value="sections">
          <SectionsTable
            sections={catalog.sections}
            programs={catalog.programs}
            yearLevels={catalog.yearLevels}
            campuses={catalog.campuses}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default async function AdminAcademicPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const tab = parseAcademicTab((await searchParams).tab)

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <LiveRefresh channel="live-admin-academic" tables={liveTables} />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Academic Setup
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Programs, subjects, and class groupings that feed every picker.
          Entries are archived, never deleted, so attendance history keeps the
          codes it recorded.
        </p>
      </div>

      <Suspense fallback={<PanelSkeleton />}>
        <AcademicContent tab={tab} />
      </Suspense>
    </div>
  )
}
