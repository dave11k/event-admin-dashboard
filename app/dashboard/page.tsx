import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { ChartsSection } from "@/components/dashboard/charts-section";
import {
  getDashboardMetrics,
  getEventsWithRegistrationCounts,
  getEventStatusCounts,
} from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const [metrics, eventsWithCounts, eventStatusCounts] = await Promise.all([
    getDashboardMetrics(),
    getEventsWithRegistrationCounts(),
    getEventStatusCounts(),
  ]);
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Monitor your events, attendees, and platform performance
          </p>
        </div>

        {/* Metric Cards */}
        <MetricCards metrics={metrics} />

        {/* Charts Section */}
        <ChartsSection
          eventsWithCounts={eventsWithCounts}
          eventStatusCounts={eventStatusCounts}
        />
      </div>
    </DashboardLayout>
  );
}
