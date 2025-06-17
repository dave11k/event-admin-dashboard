"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventsTable } from "./events-table"
import { AddEventModal } from "./add-event-modal"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Event {
  id: string
  title: string
  description?: string
  date: string
  location: string
  capacity: number
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled"
  registeredUsers: number
  createdAt: string
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring the latest innovations",
    date: "2024-07-15",
    location: "San Francisco Convention Center",
    capacity: 500,
    status: "Upcoming",
    registeredUsers: 245,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Music Festival",
    description: "Three-day music festival with top artists",
    date: "2024-08-20",
    location: "Golden Gate Park",
    capacity: 1000,
    status: "Upcoming",
    registeredUsers: 189,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    title: "Food & Wine Expo",
    description: "Culinary experience with local chefs and wineries",
    date: "2024-06-10",
    location: "Napa Valley",
    capacity: 300,
    status: "Ongoing",
    registeredUsers: 167,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Art Gallery Opening",
    description: "Contemporary art exhibition opening night",
    date: "2024-05-25",
    location: "MOMA",
    capacity: 200,
    status: "Completed",
    registeredUsers: 134,
    createdAt: "2024-01-10",
  },
]

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || event.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [events, searchQuery, statusFilter])

  const handleAddEvent = (newEvent: Omit<Event, "id" | "registeredUsers" | "createdAt">) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
      registeredUsers: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setEvents((prev) => [event, ...prev])
    setIsAddModalOpen(false)

    toast({
      title: "Event Created Successfully",
      description: `${newEvent.title} has been added to your events.`,
    })
  }

  const handleUpdateEventStatus = (eventId: string, newStatus: Event["status"]) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status: newStatus } : event)))

    toast({
      title: "Event Status Updated",
      description: `Event status has been changed to ${newStatus}.`,
    })
  }

  const handleDeleteEvent = (eventId: string) => {
    const eventToDelete = events.find((e) => e.id === eventId)
    setEvents((prev) => prev.filter((event) => event.id !== eventId))

    toast({
      title: "Event Deleted",
      description: `${eventToDelete?.title} has been removed.`,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and track all your events</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Event
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </div>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{filteredEvents.length} Total Events</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <EventsTable events={filteredEvents} onUpdateStatus={handleUpdateEventStatus} onDeleteEvent={handleDeleteEvent} />

      {/* Add Event Modal */}
      <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddEvent} />
    </div>
  )
}
