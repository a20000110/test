import { InferType, object, string } from "yup";
import { AddToCartProps, CartResponse, CartTotals, RemoveCartItemProps, SetLoading } from "@/lib/hooks/cart/@types";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import CoCartAPI, { CoCartOptions } from "@cocart/cocart-rest-api";
import { useShoppingCartStore } from "@/lib/store/shoppingCart.store";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { UserLoginInfo, useUserStore } from "@/lib/store/user.store";

export const addToCartSchema = object({
  id: string().required(),
  quantity: string().required(),
  variation: object(),
  item_data: object()
});

export const removeCartItemSchema = object({
  item_key: string().required()
});

export const updateCartItemSchema = object({
  item_key: string().required(),
  quantity: string().required()
});

// 合并cart_key 到url中
const mergeCartKey = (url: string) => {
  return url;
};

// 翻译购物车数据
const translateCartData = async (data: CartResponse.RootObject, locale: string) => {
  try {
    let list = JSON.parse(JSON.stringify(data.items)) as CartResponse.Item[];
    list = await translateStaticProps(list, ["name"], "auto", locale);
    return {
      ...data,
      items: list
    };
  } catch (e) {
    console.error(e);
    return data;
  }
};

export const useCart = () => {
  const t = useTranslations("message");
  const locale = useLocale();
  const { setCartList, setCartCount } = useShoppingCartStore();
  const { getUserLoginInfo } = useUserStore();
  const CoCart = (version?: CoCartOptions["version"]) => {
    const user = getUserLoginInfo() as unknown as UserLoginInfo | null;
    return new CoCartAPI({
      version: version ? version : "cocart/v2",
      url: process.env.NEXT_PUBLIC_WORDPRESS_URL as string,
      consumerKey: user?.username || "",
      consumerSecret: user?.password || ""
    });
  };

  // 添加产品到购物车
  const addToCart = async (props: AddToCartProps, setLoading?: SetLoading) => {
    try {
      setLoading?.(true);
      // 检验传入参数
      const validate: InferType<typeof addToCartSchema> = await addToCartSchema.validate(props, { strict: true });
      // 发送请求
      const result = (await CoCart().post(mergeCartKey("cart/add-item"), validate)).data as CartResponse.RootObject;
      toast.success(t("84b3bc24a8318a4c186a2f5a2c4661a5612f"));
      const tranResult = await translateCartData(result, locale);
      setCartList(tranResult);
      return tranResult;
    } catch (e: any) {
      console.error(e);
      toast.error(t("0875dfc7f846b04dd6c8cf7092eca88d3a2d"));
    } finally {
      setLoading?.(false);
    }
  };

  // 从购物车删除某个产品
  const removeCartItem = async (props: RemoveCartItemProps, setLoading?: SetLoading) => {
    try {
      setLoading?.(true);
      // 检验传入参数
      const validate: InferType<typeof removeCartItemSchema> = await removeCartItemSchema.validate(props, { strict: true });
      // 发送请求
      const result = (await CoCart().delete(mergeCartKey(`cart/item/${validate.item_key}`), {
        return_status: false
      })).data as CartResponse.RootObject;
      const tranResult = await translateCartData(result, locale);
      setCartList(tranResult);
      return tranResult;
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading?.(false);
    }
  };

  // 清空整个购物车
  const clearCart = async (setLoading?: SetLoading) => {
    try {
      setLoading?.(true);
      await CoCart().post(mergeCartKey("cart/clear"), {
        keep_remove_items: false
      });
      setCartList(null);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      setLoading?.(false);
    }
  };

  // 获取购物车内容
  const getCart = async () => {
    try {
      const result = (await CoCart().get(mergeCartKey("cart"))).data as CartResponse.RootObject;
      const tranResult = await translateCartData(result, locale);
      setCartList(tranResult);
      return tranResult;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // 获取购物车的数量
  const getCartCount = async () => {
    try {
      const count = (await CoCart().get(mergeCartKey("cart/items/count"), {
        removed_items: false
      })).data as number;
      setCartCount(count || 0);
      return count;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // 计算购物车总价格
  const getCartTotal = async () => {
    try {
      return (await CoCart().get(mergeCartKey("cart/totals"), {
        html: false
      })).data as CartTotals.RootObject;
    } catch (e) {
      console.error(e);
    }
  };

  // 根据运费计算购物车总价格
  const getCartTotalByShipping = async (shipping: {
    total: string;
  }, setLoading?: SetLoading) => {
    try {
      const totals = await getCartTotal();
      if (totals) {
        const { subtotal } = totals;
        return {
          ...totals,
          shipping_total: shipping.total,
          total: (+subtotal + +shipping.total).toString()
        } as CartTotals.RootObject;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      setLoading?.(false);
    }
  };

  // 更新购物车数量
  const updateItemCount = async (props: InferType<typeof updateCartItemSchema>, setLoading?: SetLoading) => {
    try {
      setLoading?.(true);
      await updateCartItemSchema.validate(props, { strict: true });
      const result = (await CoCart().post(mergeCartKey(`cart/item/${props.item_key}`), {
        quantity: props.quantity,
        return_cart: true
      })).data as CartResponse.RootObject;
      const tranResult = await translateCartData(result, locale);
      setCartList(tranResult);
      return tranResult;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading?.(false);
    }
  };

  return {
    getCartTotalByShipping,
    addToCart,
    removeCartItem,
    clearCart,
    getCart,
    getCartCount,
    getCartTotal,
    updateItemCount
  };
};
