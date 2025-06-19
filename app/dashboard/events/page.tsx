import { EventsManagement } from "@/components/events/events-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getEvents } from "@/lib/queries/events"

export default async function EventsPage() {
  const events = await getEvents()
  
  return (
    <DashboardLayout>
      <EventsManagement initialEvents={events} />
    </DashboardLayout>
  )
}
