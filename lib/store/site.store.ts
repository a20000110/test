import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNavProducts, getSiteTypeIsTob } from "@/lib/utils/util";
import { GqlProductCateMenus } from "@/lib/queries/nav-product";

type State = {
  isBtob: boolean | null,
  getSiteType: () => void;
  navCateMenus: GqlProductCateMenus["productCategories"]["nodes"];
  getNavCateMenus: (locale: string | undefined) => void;
}

export const siteStore = create(
  persist<State>(
    (set, get) => ({
      isBtob: false,
      getSiteType: async () => {
        set({ isBtob: await getSiteTypeIsTob() });
      },
      navCateMenus: [],
      getNavCateMenus: async (locale) => {
        const navCateMenus = await getNavProducts(locale);
        set({ navCateMenus });
      }
    }),
    {
      name: "siteStore"
    }
  )
);
