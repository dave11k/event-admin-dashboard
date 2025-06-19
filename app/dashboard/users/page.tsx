import { UsersManagement } from "@/components/users/users-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getUsersWithRegistrations, getUserRegistrationStats } from "@/lib/queries/users"

export default async function UsersPage() {
  const [users, stats] = await Promise.all([
    getUsersWithRegistrations(),
    getUserRegistrationStats()
  ])
  
  return (
    <DashboardLayout>
      <UsersManagement initialUsers={users} stats={stats} />
    </DashboardLayout>
  )
}
