"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { registerAttendeeAction } from "@/lib/actions/attendees";
import type { Event } from "./events-management";

interface RegisterAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSuccess: () => void;
}

export function RegisterAttendeeModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: RegisterAttendeeModalProps) {
  const [attendeeName, setAttendeeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !attendeeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter the attendee's name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerAttendeeAction({
        eventId: event.id,
        attendeeName: attendeeName.trim(),
      });

      if (result.error) {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: `${attendeeName} has been registered for "${event.title}"`,
        });
        setAttendeeName("");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAttendeeName("");
    onClose();
  };

  if (!event) return null;

  const availableSpots = event.capacity - event.registeredUsers;
  const isEventFull = availableSpots <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Attendee</DialogTitle>
          <DialogDescription>
            Register a new attendee for "{event.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Event:</span>
              <p className="text-gray-600">{event.title}</p>
            </div>
            <div>
              <span className="font-medium">Date:</span>
              <p className="text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-medium">Capacity:</span>
              <p className="text-gray-600">
                {event.registeredUsers} / {event.capacity}
              </p>
            </div>
            <div>
              <span className="font-medium">Available:</span>
              <p
                className={`font-medium ${isEventFull ? "text-red-600" : "text-green-600"}`}
              >
                {isEventFull ? "Event Full" : `${availableSpots} spots`}
              </p>
            </div>
          </div>

          {isEventFull ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                This event is at full capacity. No additional registrations can
                be accepted.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attendeeName">Attendee Full Name *</Label>
                <Input
                  id="attendeeName"
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !attendeeName.trim()}
                >
                  {isLoading ? "Registering..." : "Register Attendee"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
