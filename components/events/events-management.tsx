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
import { EventWithRegistrations } from "@/lib/queries/events"
import { updateEventStatusAction, deleteEventAction } from "@/lib/actions/events"

// UI compatible event interface
export interface Event {
  id: string
  title: string
  description?: string | null
  date: string
  location: string | null
  capacity: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  registeredUsers: number
  createdAt: string
}

interface EventsManagementProps {
  initialEvents: EventWithRegistrations[]
}

// Helper function to convert Supabase event to UI event
function convertToUIEvent(event: EventWithRegistrations): Event {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    capacity: event.capacity,
    status: event.status,
    registeredUsers: event.registrationCount,
    createdAt: event.created_at.split('T')[0], // Format date
  }
}

export function EventsManagement({ initialEvents }: EventsManagementProps) {
  const [events, setEvents] = useState<Event[]>(
    initialEvents.map(convertToUIEvent)
  )
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

  const handleEventCreated = (newEvent: Event) => {
    // Add the new event to the state instead of reloading
    setEvents(prev => [newEvent, ...prev])
    setIsAddModalOpen(false)
  }

  const handleUpdateEventStatus = async (eventId: string, newStatus: Event["status"]) => {
    const result = await updateEventStatusAction(eventId, newStatus)
    
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }
    
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status: newStatus } : event)))

    toast({
      title: "Event Status Updated",
      description: `Event status has been changed to ${newStatus}.`,
    })
  }

  const handleDeleteEvent = async (eventId: string) => {
    const eventToDelete = events.find((e) => e.id === eventId)
    
    const result = await deleteEventAction(eventId)
    
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }
    
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
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <EventsTable events={filteredEvents} onUpdateStatus={handleUpdateEventStatus} onDeleteEvent={handleDeleteEvent} />

      {/* Add Event Modal */}
      <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onEventCreated={handleEventCreated} />
    </div>
  )
}
