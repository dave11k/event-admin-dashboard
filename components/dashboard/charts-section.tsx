"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock data for charts
const usersPerEventData = [
  { eventTitle: "Tech Conference 2024", users: 245 },
  { eventTitle: "Music Festival", users: 189 },
  { eventTitle: "Food & Wine Expo", users: 167 },
  { eventTitle: "Art Gallery Opening", users: 134 },
  { eventTitle: "Business Summit", users: 98 },
  { eventTitle: "Charity Gala", users: 87 },
  { eventTitle: "Sports Tournament", users: 76 },
].sort((a, b) => b.users - a.users)

const eventStatusData = [
  { name: "Upcoming", value: 8, color: "#3B82F6" },
  { name: "Ongoing", value: 3, color: "#F59E0B" },
  { name: "Completed", value: 13, color: "#10B981" },
]

const COLORS = ["#3B82F6", "#F59E0B", "#10B981"]

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Bar Chart - Users per Event */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Users per Event</CardTitle>
          <p className="text-sm text-gray-600">Number of registered users for each event</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={usersPerEventData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="eventTitle" angle={-45} textAnchor="end" height={80} fontSize={12} stroke="#666" />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value, name) => [value, "Registered Users"]}
                  labelFormatter={(label) => `Event: ${label}`}
                />
                <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {usersPerEventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 30}, 70%, 60%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart - Event Status Breakdown */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Event Status Breakdown</CardTitle>
          <p className="text-sm text-gray-600">Distribution of events by current status</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value, name) => [value, "Events"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center mt-4 space-x-6">
            {eventStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-600">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
