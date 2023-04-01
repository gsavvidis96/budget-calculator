import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),
  }))
);

export default useAuthStore;
