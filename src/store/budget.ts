import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Database } from "../db_types";

export interface BudgetState {
  budgets: Database["public"]["Tables"]["budgets"]["Row"][];
  setBudgets: (
    budgets: Database["public"]["Tables"]["budgets"]["Row"][]
  ) => void;
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
