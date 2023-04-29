import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
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

export interface BudgetItems {
  Row: {
    budget_id: string;
    created_at: string;
    description: string;
    id: string;
    type: Enums["budget_item_type"];
    value: number;
  };
  Insert: {
    budget_id: string;
    created_at?: string;
    description: string;
    id?: string;
    type: Enums["budget_item_type"];
    value: number;
  };
  Update: {
    budget_id?: string;
    created_at?: string;
    description?: string;
    id?: string;
    type?: Enums["budget_item_type"];
    value?: number;
  };
}

export interface Functions {
  get_budgets_with_balance: {
    Args: {
      sort_by?: string;
      search_query?: string;
    };
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
