"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { removeAttendeeAction } from "@/lib/actions/attendees";
import { getEventRegistrationsAction } from "@/lib/actions/attendee-management";
import type { EventRegistration } from "@/lib/queries/attendees";
import type { Event } from "./events-management";
import { Users, Trash2, Search, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AttendeeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onAttendeeRemoved: () => void;
}

export function AttendeeListModal({
  isOpen,
  onClose,
  event,
  onAttendeeRemoved,
}: AttendeeListModalProps) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && event) {
      loadRegistrations();
    }
  }, [isOpen, event]);

  const loadRegistrations = async () => {
    if (!event) return;

    setIsLoading(true);
    try {
      const data = await getEventRegistrationsAction(event.id);
      setRegistrations(data);
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load event registrations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAttendee = async (registrationId: string, attendeeName: string) => {
    setRemovingIds((prev) => new Set(prev).add(registrationId));

    try {
      const result = await removeAttendeeAction(registrationId);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Attendee Removed",
          description: `${attendeeName} has been removed from the event`,
        });
        setRegistrations((prev) =>
          prev.filter((reg) => reg.id !== registrationId)
        );
        onAttendeeRemoved();
      }
    } catch (error) {
      console.error("Error removing attendee:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const filteredRegistrations = registrations.filter((registration) =>
    registration.attendee_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Event Registrations
          </DialogTitle>
          <DialogDescription>
            Manage attendees for &ldquo;{event.title}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Info */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Location:</span>
                  <span className="text-gray-600">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Capacity:</span>
                  <span className="text-gray-600">
                    {registrations.length} / {event.capacity}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredRegistrations.length} of {registrations.length} attendees
            </div>
          </div>

          {/* Registrations Table */}
          <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
                <span className="text-gray-600">Loading registrations...</span>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? "No matching attendees" : "No registrations yet"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Try adjusting your search criteria."
                    : "No one has registered for this event yet."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Attendee Name</TableHead>
                    <TableHead className="font-semibold">Registration Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        {registration.attendee_name}
                      </TableCell>
                      <TableCell>
                        {new Date(registration.registration_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            handleRemoveAttendee(registration.id, registration.attendee_name)
                          }
                          disabled={removingIds.has(registration.id)}
                        >
                          {removingIds.has(registration.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}