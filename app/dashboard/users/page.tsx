import { UsersManagement } from "@/components/users/users-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersManagement />
    </DashboardLayout>
  )
}
