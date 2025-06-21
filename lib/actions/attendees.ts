"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RegisterAttendeeData {
  eventId: string;
  attendeeName: string;
}

export async function registerAttendeeAction(data: RegisterAttendeeData) {
  const supabase = await createClient();

  try {
    // First check if event exists and get capacity
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, capacity")
      .eq("id", data.eventId)
      .single();

    if (eventError || !event) {
      return { error: "Event not found" };
    }

    // Check current registration count
    const { count, error: countError } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", data.eventId);

    if (countError) {
      return { error: "Failed to check event capacity" };
    }

    // Check if event is at capacity
    if (count !== null && count >= event.capacity) {
      return {
        error: `Event "${event.title}" is at full capacity (${event.capacity}/${event.capacity})`,
      };
    }

    // Check for duplicate name (optional)
    const { data: existing, error: duplicateError } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", data.eventId)
      .eq("attendee_name", data.attendeeName)
      .single();

    if (duplicateError && duplicateError.code !== "PGRST116") {
      return { error: "Failed to check for duplicate registration" };
    }

    if (existing) {
      return {
        error: `"${data.attendeeName}" is already registered for this event`,
      };
    }

    // Register the attendee
    const { data: registration, error: registrationError } = await supabase
      .from("event_registrations")
      .insert({
        event_id: data.eventId,
        attendee_name: data.attendeeName,
        registration_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (registrationError) {
      return { error: "Failed to register attendee" };
    }

    revalidatePath("/dashboard/events");
    return { success: true, data: registration };
  } catch (error) {
    console.error("Error registering attendee:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function removeAttendeeAction(registrationId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", registrationId);

    if (error) {
      return { error: "Failed to remove attendee registration" };
    }

    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Error removing attendee:", error);
    return { error: "An unexpected error occurred" };
  }
}
