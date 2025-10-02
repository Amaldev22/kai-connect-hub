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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      orders: {
        Row: {
          booking_code: string
          created_at: string | null
          id: string
          passenger_count: number
          schedule_id: string
          status: string
          total_price: number
          user_id: string
        }
        Insert: {
          booking_code: string
          created_at?: string | null
          id?: string
          passenger_count?: number
          schedule_id: string
          status?: string
          total_price: number
          user_id: string
        }
        Update: {
          booking_code?: string
          created_at?: string | null
          id?: string
          passenger_count?: number
          schedule_id?: string
          status?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "train_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_replies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          like_count: number | null
          reply_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          reply_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          reply_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          trip_count: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          trip_count?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          trip_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      refund_logs: {
        Row: {
          admin_id: string | null
          created_at: string | null
          from_status: string
          id: string
          note: string | null
          refund_id: string
          to_status: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          from_status: string
          id?: string
          note?: string | null
          refund_id: string
          to_status: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          from_status?: string
          id?: string
          note?: string | null
          refund_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "refund_logs_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refunds"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string | null
          id: string
          order_id: string
          reason: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          reason?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          reason?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      route_notifications: {
        Row: {
          created_at: string | null
          created_by: string
          delay_minutes: number | null
          id: string
          message: string
          route: string
          title: string
          train_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          delay_minutes?: number | null
          id?: string
          message: string
          route: string
          title: string
          train_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          delay_minutes?: number | null
          id?: string
          message?: string
          route?: string
          title?: string
          train_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_notifications_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          city: string | null
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          city?: string | null
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          city?: string | null
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      train_schedules: {
        Row: {
          arrival_time: string
          available_seats: number | null
          created_at: string | null
          departure_time: string
          from_station_id: string
          id: string
          price: number
          to_station_id: string
          train_id: string
        }
        Insert: {
          arrival_time: string
          available_seats?: number | null
          created_at?: string | null
          departure_time: string
          from_station_id: string
          id?: string
          price: number
          to_station_id: string
          train_id: string
        }
        Update: {
          arrival_time?: string
          available_seats?: number | null
          created_at?: string | null
          departure_time?: string
          from_station_id?: string
          id?: string
          price?: number
          to_station_id?: string
          train_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "train_schedules_from_station_id_fkey"
            columns: ["from_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "train_schedules_to_station_id_fkey"
            columns: ["to_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "train_schedules_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          },
        ]
      }
      trains: {
        Row: {
          class: string | null
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          class?: string | null
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          class?: string | null
          code?: string
          created_at?: string | null
          id?: string
          name?: string
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
      app_role: "user" | "admin"
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
      app_role: ["user", "admin"],
    },
  },
} as const
