import { Suspense } from "react"
import { EventsManagement } from "@/components/events/events-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getEvents } from "@/lib/queries/events"
import { Card, CardContent } from "@/components/ui/card"

function EventsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-2 text-gray-600">Loading events...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function EventsContent() {
  const events = await getEvents()
  return <EventsManagement initialEvents={events} />
}

export default function EventsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<EventsLoadingSkeleton />}>
        <EventsContent />
      </Suspense>
    </DashboardLayout>
  )
}
