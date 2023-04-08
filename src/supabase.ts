import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://icdaesacokskotjodojf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZGFlc2Fjb2tza290am9kb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY0Mjg2MDMsImV4cCI6MTk4MjAwNDYwM30.tpvafDkBKS7ZBNH43NergCIBBeHExbolMOkzjo2kxDE"
);

export interface Enums {
  budget_item_type: "EXPENSES" | "INCOME";
}

export interface Budgets {
  Row: {
    created_at: string | null;
    id: string;
    is_pinned: boolean;
    title: string | null;
    user_id: string;
    total_income: number;
    total_expenses: number;
    balance: number;
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
}

export interface Functions {
  get_budgets_with_balance: {
    Args: Record<PropertyKey, never>;
    Returns: {
      id: string;
      created_at: string;
      title: string;
      is_pinned: boolean;
      user_id: string;
      total_income: number;
      total_expenses: number;
      balance: number;
    }[];
  };
}

export default supabase;
