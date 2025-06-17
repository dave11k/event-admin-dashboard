import { EventsManagement } from "@/components/events/events-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function EventsPage() {
  return (
    <DashboardLayout>
      <EventsManagement />
    </DashboardLayout>
  )
}
