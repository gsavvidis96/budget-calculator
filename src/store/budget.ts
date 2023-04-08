import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Budgets } from "../supabase";

export interface BudgetState {
  budgets: Budgets["Row"][];
  setBudgets: (budgets: Budgets["Row"][]) => void;
}

const useBudgetStore = create<BudgetState>()(
  immer((set) => ({
    budgets: [],
    setBudgets: (budgets) =>
      set((state) => {
        state.budgets = budgets;
      }),
  }))
);

export default useBudgetStore;
