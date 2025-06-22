"use server";

import { revalidatePath } from "next/cache";
import {
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent,
} from "@/lib/queries/events";
import { Database } from "@/lib/types/database";

type NewEvent = Database["public"]["Tables"]["events"]["Insert"];
type EventStatus = Database["public"]["Tables"]["events"]["Row"]["status"];

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const price = parseFloat(formData.get("price") as string);

  if (!title || !date || !capacity || price < 0 || isNaN(price)) {
    return { error: "Missing required fields" };
  }

  const eventData: NewEvent = {
    title,
    description: description || null,
    date,
    location: location || null,
    capacity,
    price,
    status: "upcoming",
  };

  const event = await createEvent(eventData);

  if (!event) {
    return { error: "Failed to create event" };
  }

  revalidatePath("/dashboard/events");
  return { success: true, data: event };
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const price = parseFloat(formData.get("price") as string);
  const status = formData.get("status") as EventStatus;

  if (!title || !date || !capacity || price < 0 || isNaN(price)) {
    return { error: "Missing required fields" };
  }

  const eventData: Partial<NewEvent> = {
    title,
    description: description || null,
    date,
    location: location || null,
    capacity,
    price,
    status,
  };

  const event = await updateEvent(eventId, eventData);

  if (!event) {
    return { error: "Failed to update event" };
  }

  revalidatePath("/dashboard/events");
  return { success: true, data: event };
}

export async function updateEventStatusAction(
  eventId: string,
  status: EventStatus,
) {
  const success = await updateEventStatus(eventId, status);

  if (!success) {
    return { error: "Failed to update event status" };
  }

  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function deleteEventAction(eventId: string) {
  const success = await deleteEvent(eventId);

  if (!success) {
    return { error: "Failed to delete event" };
  }

  revalidatePath("/dashboard/events");
  return { success: true };
}
