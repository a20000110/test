import { create } from "zustand";
import { GqlProductBySlugNodeInterface, GqlProductVariationsNode3 } from "@/lib/types/gql/product/product-by-slug.type";

type State = {
  currentProduct: GqlProductVariationsNode3 | null,
  setCurrentVariableProduct: (product: GqlProductVariationsNode3 | null) => void,
}

export const useProductVariableStore = create<State>(
  (set, get) => ({
    currentProduct: null,
    setCurrentVariableProduct: (product: GqlProductVariationsNode3 | null) => set({ currentProduct: product })
  })
);
