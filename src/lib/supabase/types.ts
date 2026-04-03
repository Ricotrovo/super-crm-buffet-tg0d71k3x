// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          aiSummary: string | null
          businessPhone: string | null
          children: Json | null
          createdAt: string
          daysInStage: number | null
          email: string | null
          eventDate: string | null
          guestCount: number | null
          hasTasted: boolean | null
          hasVisited: boolean | null
          id: string
          instagramProfile: string | null
          mobilePhone: string | null
          name: string
          observations: string | null
          phone: string | null
          score: number | null
          selectedMenu: string | null
          source: string | null
          stage: string | null
          user_id: string | null
          visitDate: string | null
        }
        Insert: {
          aiSummary?: string | null
          businessPhone?: string | null
          children?: Json | null
          createdAt?: string
          daysInStage?: number | null
          email?: string | null
          eventDate?: string | null
          guestCount?: number | null
          hasTasted?: boolean | null
          hasVisited?: boolean | null
          id?: string
          instagramProfile?: string | null
          mobilePhone?: string | null
          name: string
          observations?: string | null
          phone?: string | null
          score?: number | null
          selectedMenu?: string | null
          source?: string | null
          stage?: string | null
          user_id?: string | null
          visitDate?: string | null
        }
        Update: {
          aiSummary?: string | null
          businessPhone?: string | null
          children?: Json | null
          createdAt?: string
          daysInStage?: number | null
          email?: string | null
          eventDate?: string | null
          guestCount?: number | null
          hasTasted?: boolean | null
          hasVisited?: boolean | null
          id?: string
          instagramProfile?: string | null
          mobilePhone?: string | null
          name?: string
          observations?: string | null
          phone?: string | null
          score?: number | null
          selectedMenu?: string | null
          source?: string | null
          stage?: string | null
          user_id?: string | null
          visitDate?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          current_stock: number
          id: string
          name: string
          supplier: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_stock?: number
          id?: string
          name: string
          supplier?: string | null
          type?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          current_stock?: number
          id?: string
          name?: string
          supplier?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          id: string
          linked_id: string | null
          linked_to: string
          observation: string | null
          product_id: string
          quantity: number
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          linked_id?: string | null
          linked_to?: string
          observation?: string | null
          product_id: string
          quantity: number
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          linked_id?: string | null
          linked_to?: string
          observation?: string | null
          product_id?: string
          quantity?: number
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: leads
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   source: text (nullable, default: 'WhatsApp'::text)
//   phone: text (nullable)
//   mobilePhone: text (nullable)
//   businessPhone: text (nullable)
//   email: text (nullable)
//   instagramProfile: text (nullable)
//   eventDate: date (nullable)
//   guestCount: integer (nullable)
//   selectedMenu: text (nullable)
//   hasVisited: boolean (nullable, default: false)
//   hasTasted: boolean (nullable, default: false)
//   visitDate: date (nullable)
//   observations: text (nullable)
//   score: integer (nullable, default: 5)
//   stage: text (nullable, default: 'Novo'::text)
//   daysInStage: integer (nullable, default: 0)
//   aiSummary: text (nullable)
//   children: jsonb (nullable, default: '[]'::jsonb)
//   createdAt: timestamp with time zone (not null, default: now())
//   user_id: uuid (nullable, default: auth.uid())
// Table: product_categories
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   user_id: uuid (nullable)
// Table: products
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   supplier: text (nullable)
//   category: text (nullable)
//   type: text (not null, default: 'Produto'::text)
//   current_stock: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   user_id: uuid (nullable)
// Table: stock_movements
//   id: uuid (not null, default: gen_random_uuid())
//   product_id: uuid (not null)
//   type: text (not null)
//   quantity: integer (not null)
//   linked_to: text (not null, default: 'Sporadic'::text)
//   linked_id: uuid (nullable)
//   observation: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   user_id: uuid (nullable)

// --- CONSTRAINTS ---
// Table: leads
//   PRIMARY KEY leads_pkey: PRIMARY KEY (id)
//   FOREIGN KEY leads_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: product_categories
//   PRIMARY KEY product_categories_pkey: PRIMARY KEY (id)
//   FOREIGN KEY product_categories_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: products
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
//   FOREIGN KEY products_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: stock_movements
//   PRIMARY KEY stock_movements_pkey: PRIMARY KEY (id)
//   FOREIGN KEY stock_movements_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
//   FOREIGN KEY stock_movements_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL

// --- ROW LEVEL SECURITY POLICIES ---
// Table: leads
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() IS NOT NULL)
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: product_categories
//   Policy "authenticated_all_categories" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: products
//   Policy "authenticated_all_products" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: stock_movements
//   Policy "authenticated_all_movements" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

