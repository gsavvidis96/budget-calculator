import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase, { Budgets, Functions } from "../supabase";

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
  search: string;
  setBudgets: (budgets: Budgets["Row"][]) => void;
  setFilter: (filter: BudgetFilter) => void;
  setBudgetsFetched: (budgetsFetched: boolean) => void;
  setSearch: (search: string) => void;
  fetchBudgets: ({
    refresh,
  }: {
    refresh?: boolean | undefined;
  }) => Promise<void>;
}

const useBudgetStore = create<BudgetState>()(
  immer((set, getState) => ({
    budgets: [],
    filter: BudgetFilter.CREATION_DATE_DESC,
    budgetsFetched: false,
    search: "",
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
    setSearch: (search) =>
      set((state) => {
        state.search = search;
      }),
    fetchBudgets: async ({ refresh = false } = {}) => {
      const { budgetsFetched, filter, search, setBudgets, setBudgetsFetched } =
        getState();

      if (budgetsFetched && !refresh) return;

      const { data } = await supabase.rpc<
        "get_budgets_with_balance",
        Functions["get_budgets_with_balance"]
      >("get_budgets_with_balance", {
        sort_by: filterMap[filter],
        search_query: search,
      });

      if (data) setBudgets(data);

      setBudgetsFetched(true);
    },
  }))
);

export default useBudgetStore;
