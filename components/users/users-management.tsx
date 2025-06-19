"use client"

import { useState, useMemo } from "react"
import { UsersIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { UsersTable } from "./users-table"
import { UsersCards } from "./users-cards"
import { useMobile } from "@/hooks/use-mobile"
import { UserWithRegistration } from "@/lib/queries/users"

export interface User {
  id: string
  name: string
  email: string
  eventId: string
  eventName: string
  eventStatus: "upcoming" | "ongoing" | "completed" | "cancelled"
  registeredDate: string
  registrationStatus: "registered" | "attended" | "cancelled"
  avatar?: string
}

interface UsersManagementProps {
  initialUsers: UserWithRegistration[]
}

// Helper function to convert Supabase user to UI user
function convertToUIUser(user: UserWithRegistration): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    eventId: user.eventId,
    eventName: user.eventName,
    eventStatus: user.eventStatus,
    registeredDate: user.registeredDate,
    registrationStatus: user.registrationStatus,
  }
}

export function UsersManagement({ initialUsers }: UsersManagementProps) {
  const [users] = useState<User[]>(initialUsers.map(convertToUIUser))
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter] = useState("all")
  const [statusFilter] = useState("all")
  const [isLoading] = useState(false)
  const isMobile = useMobile()

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

  // Get summary statistics for filtered users
  const filteredStats = useMemo(() => {
    return {
      total: filteredUsers.length,
      upcoming: filteredUsers.filter((u) => u.eventStatus === "upcoming").length,
      ongoing: filteredUsers.filter((u) => u.eventStatus === "ongoing").length,
      completed: filteredUsers.filter((u) => u.eventStatus === "completed").length,
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
          totalCount={filteredStats.total}
        />
      )}
    </div>
  )
}
