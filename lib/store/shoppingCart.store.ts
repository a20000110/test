import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartResponse } from "@/lib/hooks/cart/@types";
import { InferType } from "yup";
import { updateCartItemSchema } from "@/lib/hooks/cart/useCart";
import { deleteCookie } from "cookies-next";

type State = {
  cartList: CartResponse.RootObject | null;
  cartCount: number;
  setCartList: (cartList: CartResponse.RootObject | null) => void;
  setCartCount: (cartCount: number) => void;
  setItemQuantity: (props: InferType<typeof updateCartItemSchema>) => void;
}

export const useShoppingCartStore = create(
  persist<State>(
    (set, get) => ({
      cartList: null,
      cartCount: 0,
      setCartList: (cartList: CartResponse.RootObject | null) => {
        if (cartList?.cart_key || cartList === null) {
          if (cartList === null) {
            deleteCookie("cart_key");
          }
          set({ cartList: cartList ? JSON.parse(JSON.stringify(cartList)) : cartList });
          get().setCartCount(cartList?.item_count || 0);
        }
      },
      setCartCount: (cartCount: number) => {
        set({ cartCount });
      },
      setItemQuantity: (props: InferType<typeof updateCartItemSchema>) => {
        const cartList = JSON.parse(JSON.stringify(get().cartList)) as CartResponse.RootObject || null;
        if (cartList) {
          const item = cartList.items.find(item => item.item_key === props.item_key);
          item && (item.quantity.value = +props.quantity) && set({ cartList: JSON.parse(JSON.stringify(cartList)) });
        }
      }
    }),
    {
      name: "shoppingCartStore"
    }
  )
);
