import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Screen = "auth" | "chat" | "admin";

export type UserWithRole = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  bio?: string;
};

interface UserState {
  user: UserWithRole | null;
  currentScreen: Screen;
  setUser: (user: UserWithRole | null) => void;
  setCurrentScreen: (screen: Screen) => void;
  login: (userData: UserWithRole) => void;
  logout: () => void;
  switchToAdmin: () => void;
  switchToChat: () => void;
}

export const useUserStore = create<UserState>()(

  (set) => ({
    user: null,
    currentScreen: "auth",
    setUser: (user) => set({ user }),
    setCurrentScreen: (screen) => set({ currentScreen: screen }),
    login: (userData) =>
      set({
        user: userData,
        currentScreen: userData.role === "admin" ? "admin" : "chat",
      }),
    logout: () =>
      set({
        user: null,
        currentScreen: "auth",
      }),
    switchToAdmin: () =>
      set((state) => {
        if (state.user?.role === "admin") {
          return { currentScreen: "admin" };
        }
        return state;
      }),
    switchToChat: () => set({ currentScreen: "chat" }),
  })
);