import axios from "axios";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useShoppingCartStore } from "@/lib/store/shoppingCart.store";
import { useUserStore } from "@/lib/store/user.store";


export function useCocartLogout() {
  const router = useRouter();
  const [isLogout, setIsLogout] = useState(false);
  const t = useTranslations();
  const { setCartList } = useShoppingCartStore();
  const { deleteUserLoginInfo } = useUserStore();

  async function logout() {
    try {
      setCartList(null);
      deleteCookie("__user__login__info");
      deleteUserLoginInfo();
      router.push("/");
      if (isLogout) return;
      setIsLogout(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/cocart/v2/logout`
      );
      if (res.data) {
        toast(t("message.ee500c73376d3c46b79a7316e3308880a6a5"), {
          type: "success"
        });
      }
    } catch (error: any) {
      toast(t("message.b03f242682e69f415a28cd1ae45825c4d8af"), { type: "error" });
    } finally {
      setIsLogout(false);
    }
  }

  return {
    logout
  };
}

