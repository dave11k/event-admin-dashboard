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

// Define the shape of the Supabase response
// Note: profiles and events are arrays because of how Supabase joins work
interface RegistrationWithRelations {
  id: string;
  registration_status: string;
  registered_at: string;
  profiles: {
    id: string;
    email: string;
    full_name: string | null;
  }[];
  events: {
    id: string;
    title: string;
    status: string;
  }[];
}

export async function getUsersWithRegistrations(): Promise<
  UserWithRegistration[]
> {
  const supabase = await createClient();

  // Single optimized query with JOINs to get all data at once
  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      id,
      registration_status,
      registered_at,
      profiles!inner (
        id,
        email,
        full_name
      ),
      events!inner (
        id,
        title,
        status
      )
    `,
    )
    .order("registered_at", { ascending: false });

  if (error) {
    console.error("Error fetching user registrations:", error);
    return [];
  }

  if (!data) return [];

  // Type assertion to tell TS the actual structure
  const typedData = data as RegistrationWithRelations[];

  // Transform the joined data
  return typedData.map((registration) => {
    // Since we're using !inner joins, we expect exactly one profile and one event
    // But they come as arrays, so we take the first element
    const profile = registration.profiles[0];
    const event = registration.events[0];

    return {
      id: profile.id,
      name: profile.full_name || profile.email || "Unknown User",
      email: profile.email,
      eventId: event.id,
      eventName: event.title,
      eventStatus: event.status as
        | "upcoming"
        | "ongoing"
        | "completed"
        | "cancelled",
      registeredDate: registration.registered_at,
      registrationStatus: registration.registration_status as
        | "registered"
        | "attended"
        | "cancelled",
    };
  });
}

export async function getUserRegistrationStats(): Promise<UserRegistrationStats> {
  const supabase = await createClient();

  // Run all queries in parallel for better performance
  const [
    { count: totalUsers },
    { count: totalRegistrations },
    { count: upcomingRegistrations },
    { count: completedRegistrations },
  ] = await Promise.all([
    // Total unique users
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    // Total registrations
    supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true }),
    // Upcoming event registrations (using JOIN)
    supabase
      .from("event_registrations")
      .select("*, events!inner(status)", { count: "exact", head: true })
      .eq("events.status", "upcoming"),
    // Completed event registrations (using JOIN)
    supabase
      .from("event_registrations")
      .select("*, events!inner(status)", { count: "exact", head: true })
      .eq("events.status", "completed"),
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalRegistrations: totalRegistrations || 0,
    upcomingRegistrations: upcomingRegistrations || 0,
    completedRegistrations: completedRegistrations || 0,
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
