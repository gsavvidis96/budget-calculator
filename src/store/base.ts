import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum DialogComponents {
  NEW_BUDGET,
  DELETE_BUDGET,
  LOGOUT,
}

export interface Dialog {
  open: boolean;
  component: DialogComponents | null;
  props?: any;
}
export interface Base {
  prefersDarkMode: boolean;
  dialog: Dialog;
}

export interface BaseState {
  menu: boolean;
  prefersDarkMode: boolean;
  dialog: Dialog;
  setMenu: (menu: boolean) => void;
  togglePrefersDarkMode: (
    prefersDarkMode: boolean,
    saveToLocalStorage?: boolean
  ) => void;
  setDialog: (dialog: Dialog) => void;
}

const useBaseStore = create<BaseState>()(
  immer((set) => ({
    menu: false,
    prefersDarkMode: false,
    dialog: {
      open: false,
      component: null,
      props: undefined,
    },
    setMenu: (menu) =>
      set((state) => {
        state.menu = menu;
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
        state.dialog = {
          ...dialog,
          props: dialog.props || undefined,
        };
      }),
  }))
);

export default useBaseStore;
