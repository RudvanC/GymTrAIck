export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      base_routine_exercises: {
        Row: {
          exercise_id: number
          id: string
          reps: number
          routine_id: string
          sets: number
          sort_order: number
        }
        Insert: {
          exercise_id: number
          id?: string
          reps?: number
          routine_id: string
          sets?: number
          sort_order?: number
        }
        Update: {
          exercise_id?: number
          id?: string
          reps?: number
          routine_id?: string
          sets?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "base_routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "base_routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "base_routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "base_routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routine_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      base_routines: {
        Row: {
          description: string | null
          goal: string | null
          id: string
          level: string | null
          name: string
          slug: string
          tags: string[] | null
        }
        Insert: {
          description?: string | null
          goal?: string | null
          id?: string
          level?: string | null
          name: string
          slug: string
          tags?: string[] | null
        }
        Update: {
          description?: string | null
          goal?: string | null
          id?: string
          level?: string | null
          name?: string
          slug?: string
          tags?: string[] | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          body_part: string | null
          created_at: string | null
          equipment: string | null
          gif_url: string | null
          id: number
          instructions: string[] | null
          name: string
          secondary_muscles: string[] | null
          target: string | null
          updated_at: string | null
        }
        Insert: {
          body_part?: string | null
          created_at?: string | null
          equipment?: string | null
          gif_url?: string | null
          id: number
          instructions?: string[] | null
          name: string
          secondary_muscles?: string[] | null
          target?: string | null
          updated_at?: string | null
        }
        Update: {
          body_part?: string | null
          created_at?: string | null
          equipment?: string | null
          gif_url?: string | null
          id?: number
          instructions?: string[] | null
          name?: string
          secondary_muscles?: string[] | null
          target?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      injury_areas: {
        Row: {
          forbidden_body_parts: string[]
          injury: string
        }
        Insert: {
          forbidden_body_parts: string[]
          injury: string
        }
        Update: {
          forbidden_body_parts?: string[]
          injury?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
          avatar_url: string | null
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
        }
        Update: {
          avatar_path?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          availability: string
          created_at: string | null
          equipment_access: boolean
          fitness_level: string
          goal: string
          id: string
          injuries: string | null
          session_duration: string | null
          training_experience: string
          user_id: string | null
        }
        Insert: {
          availability: string
          created_at?: string | null
          equipment_access: boolean
          fitness_level: string
          goal: string
          id?: string
          injuries?: string | null
          session_duration?: string | null
          training_experience: string
          user_id?: string | null
        }
        Update: {
          availability?: string
          created_at?: string | null
          equipment_access?: boolean
          fitness_level?: string
          goal?: string
          id?: string
          injuries?: string | null
          session_duration?: string | null
          training_experience?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_custom_routine_exercises: {
        Row: {
          created_at: string | null
          exercise_id: number | null
          id: string
          position: number
          reps: number
          routine_id: string | null
          sets: number
        }
        Insert: {
          created_at?: string | null
          exercise_id?: number | null
          id?: string
          position: number
          reps: number
          routine_id?: string | null
          sets: number
        }
        Update: {
          created_at?: string | null
          exercise_id?: number | null
          id?: string
          position?: number
          reps?: number
          routine_id?: string | null
          sets?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_custom_routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "user_custom_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      user_custom_routines: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_routines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_routine_plan: {
        Row: {
          answer_id: string
          generated_at: string | null
          routine_id: string | null
          sort_order: number
        }
        Insert: {
          answer_id: string
          generated_at?: string | null
          routine_id?: string | null
          sort_order: number
        }
        Update: {
          answer_id?: string
          generated_at?: string | null
          routine_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_routine_plan_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "user_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_routine_plan_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "base_routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_routine_plan_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routine_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      user_routine_results: {
        Row: {
          completed_at: string
          created_at: string
          id: number
          results: Json | null
          routine_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: number
          results?: Json | null
          routine_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: number
          results?: Json | null
          routine_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      routine_summary: {
        Row: {
          body_parts: string[] | null
          equipments: string[] | null
          goal: string | null
          id: string | null
          level: string | null
          name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_user_custom_routine: {
        Args: {
          p_user_id: string
          p_name: string
          p_description: string
          p_exercises: Json
        }
        Returns: string
      }
      recommend_routines: {
        Args:
          | {
              p_goal: string
              p_fitness_level: string
              p_equipment_access: boolean
              p_days_per_week: number
              p_injuries: string[]
            }
          | {
              p_goal: string
              p_fitness_level: string
              p_equipment_access: boolean
              p_session_minutes: number
              p_days_per_week: number
              p_injuries: string[]
            }
        Returns: {
          routine_id: string
          name: string
          level: string
          goal: string
        }[]
      }
      recommend_routines_by_answer: {
        Args: { p_answer_id: string }
        Returns: {
          routine_id: string
          name: string
          level: string
          goal: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
