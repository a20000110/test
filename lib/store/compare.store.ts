import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sessionStoragePersistStorage } from "@/lib/store/kf.store";

type State = {
  compareIds: number[],
  setCompareIds: (id: number) => void,
  removeCompareItem: (id: number) => void,
  removeAllCompareIds: () => void;
}
export const useCompareStore = create(
  persist<State>(
    (set, get) => ({
      compareIds: [],
      setCompareIds: (id) => {
        const compareIds = get().compareIds;
        if (!compareIds.includes(id)) {
          set({ compareIds: [...compareIds, id] });
        } else {
          set({ compareIds: compareIds.filter((compareIds) => compareIds !== id) });
        }
      },
      removeAllCompareIds: () => {
        set({ compareIds: [] });
      },
      removeCompareItem: (id) => {
        const compareIds = get().compareIds;
        set({ compareIds: compareIds.filter((compareIds) => compareIds !== id) });
      }
    }),
    {
      name: "compare-store",
      storage: sessionStoragePersistStorage
    }
  )
);
