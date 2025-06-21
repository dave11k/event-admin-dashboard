import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "organiser";
  created_at: string;
}

export interface UserWithRegistration {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  eventStatus: "upcoming" | "ongoing" | "completed" | "cancelled";
  registeredDate: string;
  registrationStatus: "registered" | "attended" | "cancelled";
}

export interface UserRegistrationStats {
  totalUsers: number;
  totalRegistrations: number;
  upcomingRegistrations: number;
  completedRegistrations: number;
}

// This function is deprecated as we've moved to direct attendee storage
// instead of linking registrations to user profiles
export async function getUsersWithRegistrations(): Promise<
  UserWithRegistration[]
> {
  // Return empty array since this functionality is no longer needed
  // The new system stores attendee names directly in event_registrations
  return [];
}

export async function getUserRegistrationStats(): Promise<UserRegistrationStats> {
  const supabase = await createClient();

  // Run all queries in parallel for better performance
  const [{ count: totalUsers }, { count: totalRegistrations }] =
    await Promise.all([
      // Total dashboard users (profiles)
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      // Total event registrations (attendees)
      supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true }),
    ]);

  return {
    totalUsers: totalUsers || 0,
    totalRegistrations: totalRegistrations || 0,
    upcomingRegistrations: 0, // Deprecated - not applicable with new schema
    completedRegistrations: 0, // Deprecated - not applicable with new schema
  };
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function getAllDashboardUsers(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching dashboard users:", error);
    return [];
  }

  return data || [];
}
