import { createClient } from "@/lib/supabase/server";

export interface EventRegistration {
  id: string;
  event_id: string;
  attendee_name: string;
  registration_date: string;
  created_at: string;
}

export async function getEventRegistrations(
  eventId: string,
): Promise<EventRegistration[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("event_id", eventId)
    .order("registration_date", { ascending: false });

  if (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }

  return data || [];
}

export async function getRegistrationCountForEvent(
  eventId: string,
): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (error) {
    console.error("Error fetching registration count:", error);
    return 0;
  }

  return count || 0;
}

export async function checkDuplicateRegistration(
  eventId: string,
  attendeeName: string,
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("attendee_name", attendeeName)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("Error checking duplicate registration:", error);
    return false;
  }

  return !!data;
}
