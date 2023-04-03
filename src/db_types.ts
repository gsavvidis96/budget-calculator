export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      budget_items: {
        Row: {
          budget_id: string;
          created_at: string;
          description: string;
          id: string;
          type: Database["public"]["Enums"]["budget_item_type"] | null;
          value: number;
        };
        Insert: {
          budget_id: string;
          created_at?: string;
          description: string;
          id?: string;
          type?: Database["public"]["Enums"]["budget_item_type"] | null;
          value: number;
        };
        Update: {
          budget_id?: string;
          created_at?: string;
          description?: string;
          id?: string;
          type?: Database["public"]["Enums"]["budget_item_type"] | null;
          value?: number;
        };
      };
      budgets: {
        Row: {
          created_at: string | null;
          id: string;
          is_pinned: boolean;
          title: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_pinned?: boolean;
          title?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_pinned?: boolean;
          title?: string | null;
          user_id?: string;
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
      budget_item_type: "EXPENSES" | "INCOME";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
