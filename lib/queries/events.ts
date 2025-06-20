import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database'

type Event = Database['public']['Tables']['events']['Row']
type NewEvent = Database['public']['Tables']['events']['Insert']

export interface EventWithRegistrations extends Event {
  registrationCount: number
}

export async function getEvents(): Promise<EventWithRegistrations[]> {
  const supabase = await createClient()
  
  // Single optimized query with LEFT JOIN to get events and registration counts
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_registrations(count)
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  if (!data) return []
  
  // Transform the data to include registration count
  return data.map(event => ({
    ...event,
    registrationCount: event.event_registrations?.length || 0
  }))
}

export async function createEvent(eventData: NewEvent): Promise<Event | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .insert([eventData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating event:', error)
    return null
  }
  
  return data
}

export async function updateEvent(eventId: string, eventData: Partial<NewEvent>): Promise<Event | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .update({ ...eventData, updated_at: new Date().toISOString() })
    .eq('id', eventId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating event:', error)
    return null
  }
  
  return data
}

export async function updateEventStatus(eventId: string, status: Event['status']): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('events')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', eventId)
  
  if (error) {
    console.error('Error updating event status:', error)
    return false
  }
  
  return true
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const supabase = await createClient()
  
  // First delete all registrations for this event
  const { error: registrationError } = await supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', eventId)
  
  if (registrationError) {
    console.error('Error deleting event registrations:', registrationError)
    return false
  }
  
  // Then delete the event
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
  
  if (error) {
    console.error('Error deleting event:', error)
    return false
  }
  
  return true
}