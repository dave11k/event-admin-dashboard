import { createClient } from '@/lib/supabase/server'

export interface DashboardMetrics {
  totalEvents: number
  upcomingEvents: number
  totalUsers: number
  estimatedRevenue: number
}

export interface EventWithRegistrationCount {
  title: string
  users: number
}

export interface EventStatusCount {
  name: string
  value: number
  color: string
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()
  
  // Get total events count
  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
  
  // Get upcoming events count
  const { count: upcomingEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'upcoming')
  
  // Get total registered users count (unique users across all registrations)
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('user_id')
  
  const uniqueUsers = new Set(registrations?.map(r => r.user_id) || [])
  const totalUsers = uniqueUsers.size
  
  // Calculate estimated revenue (sum of prices for all events with registrations)
  const { data: events } = await supabase
    .from('events')
    .select('id, price')
  
  let estimatedRevenue = 0
  if (events) {
    for (const event of events) {
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
      
      estimatedRevenue += event.price * (count || 0)
    }
  }
  
  return {
    totalEvents: totalEvents || 0,
    upcomingEvents: upcomingEvents || 0,
    totalUsers,
    estimatedRevenue
  }
}

export async function getEventsWithRegistrationCounts(): Promise<EventWithRegistrationCount[]> {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title')
    .order('created_at', { ascending: false })
    .limit(7)
  
  if (!events) return []
  
  // Get registration counts for each event
  const eventsWithCounts = await Promise.all(
    events.map(async (event) => {
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
      
      return {
        title: event.title,
        users: count || 0
      }
    })
  )
  
  return eventsWithCounts.sort((a, b) => b.users - a.users)
}

export async function getEventStatusCounts(): Promise<EventStatusCount[]> {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('status')
  
  if (!events) return []
  
  const statusCounts = events.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const colorMap = {
    upcoming: '#3B82F6',
    ongoing: '#F59E0B', 
    completed: '#10B981',
    cancelled: '#EF4444'
  }
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: colorMap[status as keyof typeof colorMap] || '#6B7280'
  }))
}