import { create } from "zustand";
import { persist } from "zustand/middleware";



const useUserStore = create(
  persist(
    (set) => ({
        user: null,
        isLoggedIn: false,
        setUser: (user) => set({ user, isLoggedIn: true }),
        clearUser: () => set({ user: null, isLoggedIn: false }),
    }),
    {
        name: "user-storage",
        getStorage: () => localStorage, // use localStorage as the storage

    }
  )
);

export default useUserStore;

