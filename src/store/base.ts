import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum DialogComponents {
  NEW_BUDGET,
  DELETE_BUDGET,
  NEW_BUDGET_ITEM,
  LOGOUT,
}

export interface Dialog {
  open: boolean;
  component?: DialogComponents;
  props?: any;
}

export interface Snackbar {
  open: boolean;
  type?: "success" | "error" | "warning";
  message?: string;
}

export interface Base {
  prefersDarkMode: boolean;
  dialog: Dialog;
}

export interface BaseState {
  drawer: boolean;
  prefersDarkMode: boolean;
  dialog: Dialog;
  snackbar: Snackbar;
  setDrawer: (drawer: boolean) => void;
  togglePrefersDarkMode: (
    prefersDarkMode: boolean,
    saveToLocalStorage?: boolean
  ) => void;
  setDialog: (dialog: Dialog) => void;
  setSnackbar: (snackbar: Snackbar) => void;
}

const useBaseStore = create<BaseState>()(
  immer((set) => ({
    drawer: false,
    prefersDarkMode: false,
    dialog: {
      open: false,
      component: undefined,
      props: undefined,
    },
    snackbar: {
      open: false,
      type: undefined,
      message: undefined,
    },
    setDrawer: (drawer) =>
      set((state) => {
        state.drawer = drawer;
      }),
    togglePrefersDarkMode: (prefersDarkMode, saveToLocalStorage?) =>
      set((state) => {
        state.prefersDarkMode = prefersDarkMode;

        if (saveToLocalStorage) {
          localStorage.setItem(
            "prefersDarkMode",
            JSON.stringify(state.prefersDarkMode)
          );
        }
      }),
    setDialog: (dialog) =>
      set((state) => {
        state.dialog = dialog;
      }),
    setSnackbar: (snackbar) =>
      set((state) => {
        state.snackbar = { ...state.snackbar, ...snackbar };
      }),
  }))
);

export default useBaseStore;
