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
    created_at: string;
    id: string;
    is_pinned: boolean;
    title: string;
    user_id: string;
    total_income: number;
    total_expenses: number;
    balance: number;
  };
  Insert: {
    created_at?: string;
    id?: string;
    is_pinned?: boolean;
    title: string;
    user_id?: string;
  };
  Update: {
    created_at?: string;
    id?: string;
    is_pinned?: boolean;
    title?: string;
    user_id?: string;
  };
}

export interface BudgetItems {
  Row: {
    budget_id: string;
    created_at: string;
    description: string;
    id: string;
    percentage_to_income?: number;
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
  get_budget: {
    Args: {
      b_id: string;
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
      income_items: BudgetItems["Row"][];
      expense_items: BudgetItems["Row"][];
      expense_percentage: number;
    };
  };
}

export default supabase;
