import { StudentsSkeleton } from "./components/students-skeleton"

export default function AdminStudentsLoading() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <StudentsSkeleton />
    </div>
  )
}
