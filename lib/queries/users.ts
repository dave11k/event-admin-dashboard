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
  
  // Get registrations first
  const { data: registrations, error: regError } = await supabase
    .from('event_registrations')
    .select('id, user_id, event_id, registration_status, registered_at')
    .order('registered_at', { ascending: false })
  
  if (regError) {
    console.error('Error fetching registrations:', regError)
    return []
  }

  if (!registrations) return []
  
  // Get unique user IDs and event IDs
  const userIds = [...new Set(registrations.map(r => r.user_id))]
  const eventIds = [...new Set(registrations.map(r => r.event_id))]
  
  // Fetch users and events separately
  const [usersResult, eventsResult] = await Promise.all([
    supabase.from('profiles').select('id, email, full_name').in('id', userIds),
    supabase.from('events').select('id, title, status').in('id', eventIds)
  ])
  
  if (usersResult.error) {
    console.error('Error fetching users:', usersResult.error)
    return []
  }
  
  if (eventsResult.error) {
    console.error('Error fetching events:', eventsResult.error)
    return []
  }
  
  const users = usersResult.data || []
  const events = eventsResult.data || []
  
  // Create lookup maps
  const userMap = new Map(users.map(u => [u.id, u]))
  const eventMap = new Map(events.map(e => [e.id, e]))
  
  // Combine the data
  return registrations
    .map(registration => {
      const user = userMap.get(registration.user_id)
      const event = eventMap.get(registration.event_id)
      
      if (!user || !event) return null
      
      return {
        id: user.id,
        name: user.full_name || user.email || 'Unknown User',
        email: user.email,
        eventId: event.id,
        eventName: event.title,
        eventStatus: event.status,
        registeredDate: registration.registered_at,
        registrationStatus: registration.registration_status
      }
    })
    .filter((item): item is UserWithRegistration => item !== null)
}

export async function getUserRegistrationStats(): Promise<UserRegistrationStats> {
  const supabase = await createClient()
  
  // Get total unique users (profiles)
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  
  // Get total registrations
  const { count: totalRegistrations } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
  
  // Get upcoming events
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('id')
    .eq('status', 'upcoming')
  
  // Get completed events  
  const { data: completedEvents } = await supabase
    .from('events')
    .select('id')
    .eq('status', 'completed')
  
  const upcomingEventIds = upcomingEvents?.map(e => e.id) || []
  const completedEventIds = completedEvents?.map(e => e.id) || []
  
  // Get registration counts for upcoming and completed events
  let upcomingRegistrations = 0
  let completedRegistrations = 0
  
  if (upcomingEventIds.length > 0) {
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .in('event_id', upcomingEventIds)
    upcomingRegistrations = count || 0
  }
  
  if (completedEventIds.length > 0) {
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .in('event_id', completedEventIds)
    completedRegistrations = count || 0
  }
  
  return {
    totalUsers: totalUsers || 0,
    totalRegistrations: totalRegistrations || 0,
    upcomingRegistrations,
    completedRegistrations
  }
}