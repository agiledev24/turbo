import { create } from "zustand";

export type UserCreditsStore = {
  userImageCredits: number | undefined;
  userVideoCredits: number | undefined;
  setUserImageCredits: (userImageCredits: number) => void;
  setUserVideoCredits: (userVideoCredits: number) => void;
};

export const useUserCreditsStore = create<UserCreditsStore>()((set) => ({
  userImageCredits: undefined,
  userVideoCredits: undefined,
  setUserImageCredits: (userImageCredits) => set({ userImageCredits }),
  setUserVideoCredits: (userVideoCredits) => set({ userVideoCredits }),
}));
