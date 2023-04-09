import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum DialogComponents {
  NEW_BUDGET,
  DELETE_BUDGET,
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
  prefersDarkMode: boolean;
  togglePrefersDarkMode: (
    prefersDarkMode: boolean,
    saveToLocalStorage?: boolean
  ) => void;
  dialog: Dialog;
  setDialog: (dialog: Dialog) => void;
}

const useBaseStore = create<BaseState>()(
  immer((set) => ({
    prefersDarkMode: false,
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
    dialog: {
      open: false,
      component: null,
      props: undefined,
    },
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
