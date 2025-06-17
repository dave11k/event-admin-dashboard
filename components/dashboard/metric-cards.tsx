"use client"

import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data - replace with real API calls
const mockData = {
  totalEvents: 24,
  upcomingEvents: 8,
  totalUsers: 1247,
  estimatedRevenue: 12470,
}

const metrics = [
  {
    title: "Total Events",
    value: mockData.totalEvents,
    icon: Calendar,
    color: "blue",
    bgGradient: "from-blue-50 to-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-blue-900",
  },
  {
    title: "Upcoming Events",
    value: mockData.upcomingEvents,
    icon: Clock,
    color: "purple",
    bgGradient: "from-purple-50 to-purple-100",
    iconColor: "text-purple-600",
    textColor: "text-purple-900",
  },
  {
    title: "Total Registered Users",
    value: mockData.totalUsers.toLocaleString(),
    icon: Users,
    color: "green",
    bgGradient: "from-green-50 to-green-100",
    iconColor: "text-green-600",
    textColor: "text-green-900",
  },
  {
    title: "Estimated Revenue",
    value: `$${mockData.estimatedRevenue.toLocaleString()}`,
    icon: DollarSign,
    color: "yellow",
    bgGradient: "from-yellow-50 to-yellow-100",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-900",
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${metric.bgGradient} border-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`text-3xl font-bold ${metric.textColor} mb-2`}>{metric.value}</div>
                <div className={`text-sm font-semibold ${metric.textColor} opacity-80`}>{metric.title}</div>
              </div>
              <div className={`p-3 rounded-full bg-white shadow-sm`}>
                <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
