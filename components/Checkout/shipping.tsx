import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import Price from "@/components/Price/price";
import { byMinorUnit } from "@/lib/utils/util";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { CartResponse, CartTotals } from "@/lib/hooks/cart/@types";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/hooks/cart/useCart";
import { RingLoader } from "react-spinners";

type Props = {
  cartData: CartResponse.RootObject | null,
  selectedDeliveryMethod: string;
  setSelectedDeliveryMethod: React.Dispatch<React.SetStateAction<string>>;
  setOrderSummary: React.Dispatch<React.SetStateAction<CartTotals.RootObject | null>>;
}
export const Shipping = ({ cartData, selectedDeliveryMethod, setOrderSummary, setSelectedDeliveryMethod }: Props) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const { getCartTotalByShipping } = useCart();
  const handlerChange = async (key: string) => {
    try {
      setLoading(true);
      const rates = cartData?.shipping?.packages?.default?.rates;
      if (rates) {
        const item = rates[key];
        const shippingTotal = byMinorUnit(item.cost, cartData?.currency?.currency_minor_unit);
        const orderTotal = await getCartTotalByShipping({
          total: shippingTotal.toString()
        });
        setSelectedDeliveryMethod(key);
        setOrderSummary(orderTotal);
      }
    } finally {
      setLoading(false);
    }
  };
  return <>
    {
      // 如果needs_shipping 为true 那么表示这些商品必需使用物流 如果rates没有值那么这个购物车的商品那么就不支持配送
      // 反之则表示这些商品不需要物流 应为免费包邮
      !!cartData?.needs_shipping ? !!cartData?.shipping?.total_packages && <>
        <RadioGroup value={selectedDeliveryMethod} onChange={handlerChange}
                    className="mt-10 border-t border-gray-200 pt-10">
          <RadioGroup.Label
            className="text-lg mb-2 font-medium text-gray-900">{t("checkout.72864a7d76fa7c41f7b80445738f67f080c7")}</RadioGroup.Label>
          <div className="grid grid-cols-4 gap-x-4 max-md:grid-cols-2 relative">
            {
              loading && <div className="absolute z-[1] inset-0 c-flex bg-white bg-opacity-90">
                <RingLoader color={"#000"} />
              </div>
            }
            {
              Object.keys(cartData.shipping.packages.default.rates).map(key => {
                const rates = cartData.shipping.packages.default.rates;
                const item = rates[key];
                return <RadioGroup.Option key={item.key} value={item.key}
                                          className={({ checked, active }) => clsx(
                                            "border-[2px]",
                                            checked ? "border-main" : "border-gray-300",
                                            active ? "ring-2 ring-indigo-500" : "",
                                            "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                                          )}
                >
                  {() => {
                    return <>
                      <div className="flex flex-1 justify-between">
                        <div className="flex flex-col">
                          <RadioGroup.Label as="span"
                                            className="block text-sm text-black font-bold">
                            {item.label}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className="mt-1 flex items-center text-sm text-gray-500"
                          >
                            {t("shop.Taxes")}: {item?.taxes || "null"}
                          </RadioGroup.Description>
                          <RadioGroup.Description as="span"
                                                  className="mt-6 text-sm font-medium text-gray-900">
                            <Price className="!text-black"
                                   price={byMinorUnit(item.cost, cartData?.currency.currency_minor_unit)} />
                          </RadioGroup.Description>
                        </div>
                        {selectedDeliveryMethod === item.key ? (
                          <CheckCircleIcon className="h-5 w-5 text-main" aria-hidden="true" />
                        ) : null}
                      </div>
                    </>;
                  }}
                </RadioGroup.Option>;
              })
            }
          </div>
        </RadioGroup>
      </> : ""
    }
  </>;
};
