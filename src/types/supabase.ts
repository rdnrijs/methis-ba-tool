export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      client: {
        Row: {
          id: string
          client_name: string
          client_context: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_name: string
          client_context?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          client_context?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sample_data: {
        Row: {
          id: string
          name: string
          client_request: string
          stakeholders: string | null
          systems: string | null
          processes_context: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client_request: string
          stakeholders?: string | null
          systems?: string | null
          processes_context?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client_request?: string
          stakeholders?: string | null
          systems?: string | null
          processes_context?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          id: string
          name: string
          content: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 