import { createClient } from '@/lib/supabase/server'

export interface UserWithRegistration {
  id: string
  name: string
  email: string
  eventId: string
  eventName: string
  eventStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  registeredDate: string
  registrationStatus: 'registered' | 'attended' | 'cancelled'
}

export interface UserRegistrationStats {
  totalUsers: number
  totalRegistrations: number
  upcomingRegistrations: number
  completedRegistrations: number
}

export async function getUsersWithRegistrations(): Promise<UserWithRegistration[]> {
  const supabase = await createClient()
  
  // Single optimized query with JOINs to get all data at once
  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
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
    `)
    .order('registered_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user registrations:', error)
    return []
  }

  if (!data) return []
  
  // Transform the joined data
  return data.map(registration => ({
    id: registration.profiles.id,
    name: registration.profiles.full_name || registration.profiles.email || 'Unknown User',
    email: registration.profiles.email,
    eventId: registration.events.id,
    eventName: registration.events.title,
    eventStatus: registration.events.status,
    registeredDate: registration.registered_at,
    registrationStatus: registration.registration_status
  }))
}

export async function getUserRegistrationStats(): Promise<UserRegistrationStats> {
  const supabase = await createClient()
  
  // Run all queries in parallel for better performance
  const [
    { count: totalUsers },
    { count: totalRegistrations },
    { count: upcomingRegistrations },
    { count: completedRegistrations }
  ] = await Promise.all([
    // Total unique users
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true }),
    // Total registrations
    supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true }),
    // Upcoming event registrations (using JOIN)
    supabase
      .from('event_registrations')
      .select('*, events!inner(status)', { count: 'exact', head: true })
      .eq('events.status', 'upcoming'),
    // Completed event registrations (using JOIN)
    supabase
      .from('event_registrations')
      .select('*, events!inner(status)', { count: 'exact', head: true })
      .eq('events.status', 'completed')
  ])
  
  return {
    totalUsers: totalUsers || 0,
    totalRegistrations: totalRegistrations || 0,
    upcomingRegistrations: upcomingRegistrations || 0,
    completedRegistrations: completedRegistrations || 0
  }
}