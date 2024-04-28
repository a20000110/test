import clsx from "clsx";
import { RingLoader } from "react-spinners";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CartTotals } from "@/lib/hooks/cart/@types";
import Price from "@/components/Price/price";

type Props = {
  orderSummary: CartTotals.RootObject | null
}
export const OrderSum = ({
                           orderSummary
                         }: Props) => {
  const showKeys = ["subtotal", "subtotal_tax", "fee_total", "fee_tax", "discount_total", "discount_tax", "shipping_total", "shipping_tax", "total_tax"];
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  return <section
    aria-labelledby="summary-heading"
    className={clsx("mt-10 mb-10 py-10 border-y")}
  >
    <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
      {t("shop.2725b01476ca66429dd8f0b0ef7585e5f645")}
    </h2>

    <div className="relative">
      {
        loading && <div className="absolute inset-0 c-flex z-[1] bg-gray-50 bg-opacity-90">
          <RingLoader color="#000" />
        </div>
      }
      <dl className="mt-6 space-y-4">
        {
          orderSummary && Object.keys(orderSummary).map(k => {
            const item = orderSummary[k];
            return showKeys.includes(k) && item && +item !== 0 ?
              <div className="flex items-center justify-between border-b border-gray-200 pb-4" key={k}>
                <dt className="flex items-center text-sm text-gray-600">
                  <span>{t(`shop.${k}`)}</span>
                </dt>
                <dd className="text-sm font-medium text-main">
                  <Price price={item} />
                </dd>
              </div> : "";
          })
        }
        <div className="b-flex flex-wrap">
          <dt className="flex items-center">
            {t("shop.4e1c96d4e59b7a4567c8fa2cb6a598de43c7")}
          </dt>
          <dd className="font-medium">
            <Price className="!text-black"
                   price={orderSummary?.total || 0} />
          </dd>
        </div>
      </dl>
    </div>
  </section>;
};
