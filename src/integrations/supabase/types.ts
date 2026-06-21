export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cfo_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          is_active: boolean
          location: string
          location_details: string | null
          max_participants: number | null
          registration_deadline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          is_active?: boolean
          location?: string
          location_details?: string | null
          max_participants?: number | null
          registration_deadline?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          is_active?: boolean
          location?: string
          location_details?: string | null
          max_participants?: number | null
          registration_deadline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          accommodation_type: string
          available_for_interview: string
          closest_mtr_station: string
          created_at: string
          digital_literacy: string
          english_proficiency: string
          holiday_location: string
          id: string
          interest_reason: string
          major: string
          name: string
          sleep_cycle_flexibility: string
          study_balance: string
          university: string
          updated_at: string
          whatsapp_number: string
          why_hire_you: string | null
          why_not_hire_you: string | null
          work_duration: string
          year_of_study: string
        }
        Insert: {
          accommodation_type: string
          available_for_interview?: string
          closest_mtr_station: string
          created_at?: string
          digital_literacy: string
          english_proficiency: string
          holiday_location: string
          id?: string
          interest_reason: string
          major: string
          name: string
          sleep_cycle_flexibility: string
          study_balance: string
          university: string
          updated_at?: string
          whatsapp_number: string
          why_hire_you?: string | null
          why_not_hire_you?: string | null
          work_duration: string
          year_of_study: string
        }
        Update: {
          accommodation_type?: string
          available_for_interview?: string
          closest_mtr_station?: string
          created_at?: string
          digital_literacy?: string
          english_proficiency?: string
          holiday_location?: string
          id?: string
          interest_reason?: string
          major?: string
          name?: string
          sleep_cycle_flexibility?: string
          study_balance?: string
          university?: string
          updated_at?: string
          whatsapp_number?: string
          why_hire_you?: string | null
          why_not_hire_you?: string | null
          work_duration?: string
          year_of_study?: string
        }
        Relationships: []
      }
      parent_student_pairs: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          parent_name: string
          student_age: number | null
          student_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          parent_name: string
          student_age?: number | null
          student_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          parent_name?: string
          student_age?: number | null
          student_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_student_pairs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "cfo_events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          parent_name: string | null
          responses: Json
          score: number | null
          teen_name: string | null
          updated_at: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          parent_name?: string | null
          responses: Json
          score?: number | null
          teen_name?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          parent_name?: string | null
          responses?: Json
          score?: number | null
          teen_name?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          notes: string | null
          parent_name: string
          stage: string | null
          teen_age: number
          updated_at: string | null
          user_id: string | null
          value: number | null
          whatsapp: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          notes?: string | null
          parent_name: string
          stage?: string | null
          teen_age: number
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
          whatsapp: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          notes?: string | null
          parent_name?: string
          stage?: string | null
          teen_age?: number
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
          whatsapp?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          attendance_confirmed: boolean
          cfo_future_answer: string | null
          cfo_motivation_answer: string | null
          created_at: string
          event_id: string | null
          event_info_acknowledged: boolean | null
          event_info_viewed: boolean
          id: string
          photo_uploaded: boolean
          quiz_completed: boolean
          quiz_result: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attendance_confirmed?: boolean
          cfo_future_answer?: string | null
          cfo_motivation_answer?: string | null
          created_at?: string
          event_id?: string | null
          event_info_acknowledged?: boolean | null
          event_info_viewed?: boolean
          id?: string
          photo_uploaded?: boolean
          quiz_completed?: boolean
          quiz_result?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attendance_confirmed?: boolean
          cfo_future_answer?: string | null
          cfo_motivation_answer?: string | null
          created_at?: string
          event_id?: string | null
          event_info_acknowledged?: boolean | null
          event_info_viewed?: boolean
          id?: string
          photo_uploaded?: boolean
          quiz_completed?: boolean
          quiz_result?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "cfo_events"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_leads: {
        Row: {
          company: string
          created_at: string
          email: string
          fleet_size: string
          form_name: string | null
          id: string
          name: string
          phone: string
          source_path: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          fleet_size: string
          form_name?: string | null
          id?: string
          name: string
          phone: string
          source_path?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          fleet_size?: string
          form_name?: string | null
          id?: string
          name?: string
          phone?: string
          source_path?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "parent" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "parent", "student"],
    },
  },
} as const
