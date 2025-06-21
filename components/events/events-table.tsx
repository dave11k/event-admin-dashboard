"use client";
import {
  MoreHorizontal,
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Event } from "./events-management";

interface EventsTableProps {
  events: Event[];
  onUpdateStatus: (eventId: string, status: Event["status"]) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: Event) => void;
  onRegisterUser: (event: Event) => void;
  userRole: "admin" | "organiser";
}

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800 border-blue-200",
  ongoing: "bg-orange-100 text-orange-800 border-orange-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
} as const;

export function EventsTable({
  events,
  onUpdateStatus,
  onDeleteEvent,
  onEditEvent,
  onRegisterUser,
  userRole,
}: EventsTableProps) {
  const filteredEvents = events; // Remove filtering here since it's now done at parent level

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCapacityPercentage = (registered: number, capacity: number) => {
    return Math.round((registered / capacity) * 100);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          All Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Event Details</TableHead>
                <TableHead className="font-semibold">Date & Location</TableHead>
                <TableHead className="font-semibold">Capacity</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No events found matching the selected filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-[150px]">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {event.registeredUsers} / {event.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(getCapacityPercentage(event.registeredUsers, event.capacity), 100)}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {getCapacityPercentage(
                            event.registeredUsers,
                            event.capacity,
                          )}
                          % filled
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[event.status]}
                        variant="outline"
                      >
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => onRegisterUser(event)}
                          >
                            <Users className="h-4 w-4" />
                            Register User
                          </DropdownMenuItem>
                          {userRole === "admin" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => onEditEvent(event)}
                              >
                                <Edit className="h-4 w-4" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() =>
                                  onUpdateStatus(event.id, "upcoming")
                                }
                              >
                                Set as Upcoming
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() =>
                                  onUpdateStatus(event.id, "ongoing")
                                }
                              >
                                Set as Ongoing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() =>
                                  onUpdateStatus(event.id, "completed")
                                }
                              >
                                Set as Completed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={() => onDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Event
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
