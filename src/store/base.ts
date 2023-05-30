import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Snackbar {
  open: boolean;
  type?: "success" | "error" | "warning";
  message?: string;
}

export interface BaseState {
  drawer: boolean;
  prefersDarkMode: boolean;
  snackbar: Snackbar;
  setDrawer: (drawer: boolean) => void;
  togglePrefersDarkMode: (
    prefersDarkMode: boolean,
    saveToLocalStorage?: boolean
  ) => void;
  setSnackbar: (snackbar: Snackbar) => void;
}

const useBaseStore = create<BaseState>()(
  immer((set) => ({
    drawer: false,
    prefersDarkMode: false,
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
    setSnackbar: (snackbar) =>
      set((state) => {
        state.snackbar = { ...state.snackbar, ...snackbar };
      }),
  }))
);

export default useBaseStore;
