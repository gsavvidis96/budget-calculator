import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase, { Budgets, Functions } from "../supabase";

export enum BudgetFilter {
  CREATION_DATE_ASC,
  CREATION_DATE_DESC,
  BALANCE_ASC,
  BALANCE_DESC,
}

const filterMap: { [key in BudgetFilter]: string } = {
  [BudgetFilter.CREATION_DATE_ASC]: "created_at ASC",
  [BudgetFilter.CREATION_DATE_DESC]: "created_at DESC",
  [BudgetFilter.BALANCE_ASC]: "balance ASC",
  [BudgetFilter.BALANCE_DESC]: "balance DESC",
};

interface BudgetState {
  budgets: Budgets["Row"][];
  filter: BudgetFilter;
  budgetsFetched: boolean;
  search: string;
  currentBudget: Functions["get_budget"]["Returns"] | null;
}

interface BudgetActions {
  setBudgets: (budgets: Budgets["Row"][]) => void;
  setFilter: (filter: BudgetFilter) => void;
  setBudgetsFetched: (budgetsFetched: boolean) => void;
  setSearch: (search: string) => void;
  fetchBudgets: (options?: { refresh?: boolean }) => Promise<Budgets["Row"][]>;
  setCurrentBudget: (budget: Functions["get_budget"]["Returns"] | null) => void;
  fetchCurrentBudget: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  budgets: [],
  filter: BudgetFilter.CREATION_DATE_DESC,
  budgetsFetched: false,
  search: "",
  currentBudget: null,
};

const useBudgetStore = create<BudgetState & BudgetActions>()(
  immer((set, getState) => ({
    ...initialState,
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
      const {
        budgetsFetched,
        filter,
        search,
        setBudgets,
        setBudgetsFetched,
        budgets,
      } = getState();

      if (budgetsFetched && !refresh) return budgets;

      const { data } = await supabase.rpc<
        "get_budgets_with_balance",
        Functions["get_budgets_with_balance"]
      >("get_budgets_with_balance", {
        sort_by: filterMap[filter],
        search_query: search,
      });

      if (data) setBudgets(data);

      setBudgetsFetched(true);

      return data || [];
    },
    setCurrentBudget: (budget) =>
      set((state) => {
        state.currentBudget = budget;
      }),
    fetchCurrentBudget: async (id) => {
      const { setCurrentBudget } = getState();

      const { data } = await supabase
        .rpc<"get_budget", Functions["get_budget"]>("get_budget", { b_id: id })
        .single<Functions["get_budget"]["Returns"]>();

      setCurrentBudget(data);
    },
    reset: () => set(initialState),
  }))
);

export default useBudgetStore;
