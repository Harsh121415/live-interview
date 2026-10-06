import { create } from "zustand";

export const useInterview = create((set) => ({
  name: "",
  setNameFun: (value) =>
    set((state) => ({
      name: value.name,
    })),
  removeAllBears: () => set({ bears: 0 }),
}));
