import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sessionStoragePersistStorage } from "@/lib/store/kf.store";

type State = {
  loveIds: number[],
  setLoveProducts: (id: number) => void,
  removeAllLove: () => void;
}
export const useLoveStore = create(
  persist<State>(
    (set, get) => ({
      loveIds: [],
      setLoveProducts: (id) => {
        const loveIds = get().loveIds;
        if (!loveIds.includes(id)) {
          set({ loveIds: [...loveIds, id] });
        } else {
          set({ loveIds: loveIds.filter((loveId) => loveId !== id) });
        }
      },
      removeAllLove: () => {
        set({ loveIds: [] });
      }
    }),
    {
      name: "love-store",
      storage: sessionStoragePersistStorage
    }
  )
);
