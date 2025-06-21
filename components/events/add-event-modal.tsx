"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createEventAction, updateEventAction } from "@/lib/actions/events";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "./events-management";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newEvent: Event) => void;
  editingEvent?: Event | null;
  onEventUpdated?: (updatedEvent: Event) => void;
}

interface FormData {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: string;
  price: string;
  status: Event["status"];
}

interface FormErrors {
  title?: string;
  date?: string;
  location?: string;
  capacity?: string;
  price?: string;
}

export function AddEventModal({
  isOpen,
  onClose,
  onEventCreated,
  editingEvent,
  onEventUpdated,
}: AddEventModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    price: "",
    status: "upcoming",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(editingEvent);

  // Initialize form data when editing
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description || "",
        date: editingEvent.date,
        location: editingEvent.location || "",
        capacity: editingEvent.capacity.toString(),
        price: "0", // We'll add price to Event interface later
        status: editingEvent.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: "",
        price: "",
        status: "upcoming",
      });
    }
  }, [editingEvent]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.date = "Date must be in the future";
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Capacity validation
    if (!formData.capacity) {
      newErrors.capacity = "Capacity is required";
    } else {
      const capacity = Number.parseInt(formData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.capacity = "Capacity must be greater than 0";
      }
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else {
      const price = Number.parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = "Price must be 0 or greater";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title.trim());
      formDataObj.append("description", formData.description.trim());
      formDataObj.append("date", formData.date);
      formDataObj.append("location", formData.location.trim());
      formDataObj.append("capacity", formData.capacity);
      formDataObj.append("price", formData.price);
      formDataObj.append("status", formData.status);

      let result;
      if (isEditMode && editingEvent) {
        result = await updateEventAction(editingEvent.id, formDataObj);
      } else {
        result = await createEventAction(formDataObj);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (isEditMode && editingEvent && onEventUpdated) {
        // Create the updated event object
        const updatedEvent: Event = {
          ...editingEvent,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          date: formData.date,
          location: formData.location.trim(),
          capacity: parseInt(formData.capacity),
          status: formData.status,
        };

        toast({
          title: "Event Updated Successfully",
          description: `${formData.title} has been updated.`,
        });

        onEventUpdated(updatedEvent);
      } else {
        // Create the new event object for optimistic update
        const newEvent: Event = {
          id: result.data?.id || Date.now().toString(),
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          date: formData.date,
          location: formData.location.trim(),
          capacity: parseInt(formData.capacity),
          status: formData.status,
          registeredUsers: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };

        toast({
          title: "Event Created Successfully",
          description: `${formData.title} has been added to your events.`,
        });

        onEventCreated(newEvent);
      }
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} event. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      capacity: "",
      price: "",
      status: "upcoming",
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            {isEditMode ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Event Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              className={
                errors.title ? "border-red-500 focus:border-red-500" : ""
              }
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter event description (optional)"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Date and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Event Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={
                  errors.date ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter event location"
                className={
                  errors.location ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Capacity, Price and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Capacity */}
            <div className="space-y-2">
              <Label
                htmlFor="capacity"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Capacity *
              </Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                placeholder="Enter maximum capacity"
                className={
                  errors.capacity ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.capacity && (
                <p className="text-sm text-red-600">{errors.capacity}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Price *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Enter ticket price"
                className={
                  errors.price ? "border-red-500 focus:border-red-500" : ""
                }
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Event["status"]) =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
