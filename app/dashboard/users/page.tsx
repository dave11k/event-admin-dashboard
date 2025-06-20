import { Suspense } from "react"
import { UsersManagement } from "@/components/users/users-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getUsersWithRegistrations, getUserRegistrationStats } from "@/lib/queries/users"
import { Card, CardContent } from "@/components/ui/card"

function UsersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
      </div>
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function UsersContent() {
  const [users, stats] = await Promise.all([
    getUsersWithRegistrations(),
    getUserRegistrationStats()
  ])
  
  return <UsersManagement initialUsers={users} stats={stats} />
}

export default function UsersPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<UsersLoadingSkeleton />}>
        <UsersContent />
      </Suspense>
    </DashboardLayout>
  )
}
