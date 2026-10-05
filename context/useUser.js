import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUserStore = create()(
  persist(
    (set, get) => ({
      user: 0,
      setUser: (userData) => set({ user:userData}),
    }),
    {
      name: 'userprofile', // name of the item in the storage (must be unique)
    },
  ),
)
