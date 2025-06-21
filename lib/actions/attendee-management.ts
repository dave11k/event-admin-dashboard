"use server";

import { getEventRegistrations } from "@/lib/queries/attendees";
import type { EventRegistration } from "@/lib/queries/attendees";

export async function getEventRegistrationsAction(eventId: string): Promise<EventRegistration[]> {
  try {
    return await getEventRegistrations(eventId);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }
}