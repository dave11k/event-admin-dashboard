"use client"

import { useState, useMemo } from "react"
import { UsersIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { UsersTable } from "./users-table"
import { UsersCards } from "./users-cards"
import { useMobile } from "@/hooks/use-mobile"

export interface User {
  id: string
  name: string
  email: string
  eventId: string
  eventName: string
  eventStatus: "Upcoming" | "Ongoing" | "Completed" | "Cancelled"
  registeredDate: string
  avatar?: string
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    eventId: "1",
    eventName: "Tech Conference 2024",
    eventStatus: "Upcoming",
    registeredDate: "2024-03-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    eventId: "1",
    eventName: "Tech Conference 2024",
    eventStatus: "Upcoming",
    registeredDate: "2024-03-14T14:20:00Z",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    eventId: "2",
    eventName: "Music Festival",
    eventStatus: "Upcoming",
    registeredDate: "2024-03-13T09:15:00Z",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    eventId: "3",
    eventName: "Food & Wine Expo",
    eventStatus: "Ongoing",
    registeredDate: "2024-03-12T16:45:00Z",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@email.com",
    eventId: "4",
    eventName: "Art Gallery Opening",
    eventStatus: "Completed",
    registeredDate: "2024-03-11T11:30:00Z",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    eventId: "1",
    eventName: "Tech Conference 2024",
    eventStatus: "Upcoming",
    registeredDate: "2024-03-10T13:20:00Z",
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    eventId: "2",
    eventName: "Music Festival",
    eventStatus: "Upcoming",
    registeredDate: "2024-03-09T08:45:00Z",
  },
  {
    id: "8",
    name: "Jennifer Brown",
    email: "jennifer.b@email.com",
    eventId: "3",
    eventName: "Food & Wine Expo",
    eventStatus: "Ongoing",
    registeredDate: "2024-03-08T15:10:00Z",
  },
  {
    id: "9",
    name: "Michael Garcia",
    email: "michael.garcia@email.com",
    eventId: "4",
    eventName: "Art Gallery Opening",
    eventStatus: "Completed",
    registeredDate: "2024-03-07T12:30:00Z",
  },
  {
    id: "10",
    name: "Amanda Martinez",
    email: "amanda.m@email.com",
    eventId: "1",
    eventName: "Tech Conference 2024",
    eventStatus: "Upcoming",
    registeredDate: "2024-03-06T17:20:00Z",
  },
  {
    id: "11",
    name: "Christopher Lee",
    email: "chris.lee@email.com",
    eventId: "2",
    eventName: "Music Festival",
    eventStatus: "Upcoming",
    registeredDate: "2024-03-05T10:15:00Z",
  },
  {
    id: "12",
    name: "Jessica White",
    email: "jessica.white@email.com",
    eventId: "3",
    eventName: "Food & Wine Expo",
    eventStatus: "Ongoing",
    registeredDate: "2024-03-04T14:40:00Z",
  },
]

export function UsersManagement() {
  const [users] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading] = useState(false)
  const isMobile = useMobile()

  // Get unique event names for filter dropdown
  const uniqueEvents = useMemo(() => {
    const events = Array.from(new Set(users.map((user) => user.eventName)))
    return events.sort()
  }, [users])

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesEvent = eventFilter === "all" || user.eventName === eventFilter

      const matchesStatus = statusFilter === "all" || user.eventStatus === statusFilter

      return matchesSearch && matchesEvent && matchesStatus
    })
  }, [users, searchQuery, eventFilter, statusFilter])

  // Get summary statistics
  const stats = useMemo(() => {
    return {
      total: filteredUsers.length,
      upcoming: filteredUsers.filter((u) => u.eventStatus === "Upcoming").length,
      ongoing: filteredUsers.filter((u) => u.eventStatus === "Ongoing").length,
      completed: filteredUsers.filter((u) => u.eventStatus === "Completed").length,
    }
  }, [filteredUsers])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">View and manage all registered users across events</p>
      </div>

      {/* Users Display */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchQuery || eventFilter !== "all" || statusFilter !== "all"
                  ? "No users match your current filters. Try adjusting your search criteria."
                  : "No users have registered for events yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : isMobile ? (
        <UsersCards users={filteredUsers} />
      ) : (
        <UsersTable
          users={filteredUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          eventFilter={eventFilter}
          setEventFilter={setEventFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          uniqueEvents={uniqueEvents}
          totalCount={stats.total}
        />
      )}
    </div>
  )
}
