import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Budgets } from "../supabase";

export enum BudgetFilter {
  CREATION_DATE_ASC,
  CREATION_DATE_DESC,
  BALANCE_ASC,
  BALANCE_DESC,
}

export const filterMap: { [key in BudgetFilter]: string } = {
  [BudgetFilter.CREATION_DATE_ASC]: "created_at ASC",
  [BudgetFilter.CREATION_DATE_DESC]: "created_at DESC",
  [BudgetFilter.BALANCE_ASC]: "balance ASC",
  [BudgetFilter.BALANCE_DESC]: "balance DESC",
};

export interface BudgetState {
  budgets: Budgets["Row"][];
  filter: BudgetFilter;
  budgetsFetched: boolean;
  setBudgets: (budgets: Budgets["Row"][]) => void;
  setFilter: (filter: BudgetFilter) => void;
  setBudgetsFetched: (budgetsFetched: boolean) => void;
}

const useBudgetStore = create<BudgetState>()(
  immer((set, getState) => ({
    budgets: [],
    filter: BudgetFilter.CREATION_DATE_DESC,
    budgetsFetched: false,
    setBudgets: (budgets) =>
      set((state) => {
        state.budgets = budgets;
      }),
    setFilter: (filter) =>
      set((state) => {
        state.filter = filter;
      }),
    setBudgetsFetched: (budgetsFetched) =>
      set((state) => {
        state.budgetsFetched = budgetsFetched;
      }),
  }))
);

export default useBudgetStore;
