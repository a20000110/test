import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  currencyUnit: string,
  setCurrencyUnit: (unit: string) => void,
  recentlyViewed: string[],
  setRecentlyViewed: (id: string) => void,
  setAllRecentlyViewed: (ids: string[]) => void,
}

export const useProductStore = create(
  persist<State>(
    (set, get) => ({
      currencyUnit: "$",// 货币初始单位
      setCurrencyUnit: (unit: string) => set({ currencyUnit: unit }), // 更新货币单位的方法
      recentlyViewed: [],
      setRecentlyViewed: (id: string) => {
        const old = get().recentlyViewed;
        if (old.length >= 4) {
          return set({ recentlyViewed: [...new Set([id, ...old.slice(0, 3)])] });
        }
        return set({ recentlyViewed: [...new Set([...get().recentlyViewed, id])] });
      },
      setAllRecentlyViewed: (ids: string[]) => {
        return set({ recentlyViewed: ids });
      }

    }),
    {
      name: "productState"
    }
  )
);
