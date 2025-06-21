export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "organiser";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "organiser";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "organiser";
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          location: string | null;
          capacity: number;
          status: "upcoming" | "ongoing" | "completed" | "cancelled";
          price: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          location?: string | null;
          capacity?: number;
          status?: "upcoming" | "ongoing" | "completed" | "cancelled";
          price?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          location?: string | null;
          capacity?: number;
          status?: "upcoming" | "ongoing" | "completed" | "cancelled";
          price?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          attendee_name: string;
          registration_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          attendee_name: string;
          registration_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          attendee_name?: string;
          registration_date?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventRegistration =
  Database["public"]["Tables"]["event_registrations"]["Row"];

export type NewProfile = Database["public"]["Tables"]["profiles"]["Insert"];
export type NewEvent = Database["public"]["Tables"]["events"]["Insert"];
export type NewEventRegistration =
  Database["public"]["Tables"]["event_registrations"]["Insert"];

export type EventWithRegistrations = Event & {
  registrations?: EventRegistration[];
  registrationCount?: number;
};

export type UserRole = "admin" | "organiser";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
