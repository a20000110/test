import React, { useEffect, useState } from "react";
import { useShoppingCartStore } from "@/lib/store/shoppingCart.store";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/EmptyState";
import clsx from "clsx";
import { XMarkIcon as XMarkIconMini } from "@heroicons/react/20/solid";
import Link from "next/link";
import { CartResponse } from "@/lib/hooks/cart/@types";
import Calculator from "@/components/Calculator";
import { updateCartItemSchema, useCart } from "@/lib/hooks/cart/useCart";
import { InferType } from "yup";
import Price from "@/components/Price/price";
import { RingLoader } from "react-spinners";
import { byMinorUnit, debounce } from "@/lib/utils/util";
import { toast } from "react-toastify";

type Props = {
  layout: "row" | "col";
  showButton?: boolean;
  showOrderSum?: boolean;
}
export const CartContent = (props: Props) => {
  const { cartList, setItemQuantity } = useShoppingCartStore();
  const t = useTranslations();
  const [cart, setCart] = useState(cartList);
  const [loading, setLoading] = useState(false);
  const { updateItemCount, removeCartItem } = useCart();

  const showProductAttr = (product: CartResponse.Item) => {
    if (product.meta.product_type === "variation" && !!Object.values(product?.meta?.variation || {}).length) {
      return <div className="mt-1 flex text-sm">
        {Object.values(product.meta.variation).map((item, index) => {
          return <p className={clsx("text-gray-500", !!index ? "ml-4 border-l border-gray-200 pl-4 text-gray-500" : "")}
                    key={index}>{item}</p>;
        })}
      </div>;
    } else if (product.meta.product_type === "simple" && !!Object.values(product?.cart_item_data || {}).length) {
      return <div className="mt-1 flex text-sm">
        {Object.values(product.cart_item_data).map((item, index) => {
          return <p className={clsx("text-gray-500", !!index ? "ml-4 border-l border-gray-200 pl-4 text-gray-500" : "")}
                    key={index}>{item}</p>;
        })}
      </div>;
    }
  };

  const changeCount = debounce(async function(countProps: InferType<typeof updateCartItemSchema>) {
    setItemQuantity(countProps);
    await updateItemCount(countProps, setLoading);
  }, 300);

  const delItem = async (item_key: string) => {
    await toast.promise(async () => {
      await removeCartItem({ item_key });
    }, {
      pending: t("shop.5c53f323b9915f4d3798aeee2d6bc2de16b0"),
      success: t("shop.eb786af290091041c46a35caa47679cf86a0"),
      error: t("shop.e713244dfbf24b4cb1391303b194153e133e")
    });
  };


  useEffect(() => {
    setCart(cartList);
  }, [cartList]);
  return <main>
    <p>{t("shop.cfda62081e94e043262a57701f1e268566d0", { count: cart?.item_count || 0 })}</p>
    {
      !cart?.items?.length ? <EmptyState /> :
        <div className={clsx("mt-4 grid w-full", props.layout === "col" ? "grid-cols-1" : "grid-cols-12 lg:gap-x-16")}>
          <section aria-labelledby="cart-heading" className={clsx(props.layout === "col" ? "" : "lg:col-span-7")}>
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cart.items.map((product, productIdx) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={product.featured_image}
                      alt={product.name}
                      className="h-16 w-16 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link href={`/product/${product.slug}`}
                                  className="font-medium text-gray-700 hover:text-gray-800">
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                        {
                          showProductAttr(product)
                        }
                        <Price
                          price={byMinorUnit(product.price, cart.currency.currency_minor_unit) * product.quantity.value}
                          className="mt-1 text-sm font-medium" />
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                          Quantity, {product.name}
                        </label>
                        <div className="absolute right-0 top-0">
                          <button type="button" className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                  onClick={() => {
                                    delItem(product.item_key);
                                  }}>
                            <span className="sr-only">Remove</span>
                            <XMarkIconMini className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {
                      !!product?.quantity?.max_purchase &&
                      <div className="relative w-fit">
                        {
                          loading && <div className="absolute inset-0 c-flex bg-white bg-opacity-90 z-[1]">
                            <RingLoader color="#000" size={22} />
                          </div>
                        }
                        <Calculator initCount={product?.quantity?.value || 1}
                                    disabled={loading}
                                    className="max-md:w-[40px] max-md:h-[20px] md:w-[80px]"
                                    changeCount={(count: number) => {
                                      changeCount({
                                        quantity: count.toString(),
                                        item_key: product.item_key
                                      });
                                    }}
                                    minCount={product?.quantity?.min_purchase || 1}
                                    maxCount={product.quantity.max_purchase} />
                      </div>
                    }
                  </div>
                </li>
              ))}
            </ul>
          </section>
          {
            props?.showOrderSum === false ? null : <section
              aria-labelledby="summary-heading"
              className={clsx("mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8 h-fit", props.layout === "col" ? "" : "lg:col-span-5")}
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
                    cart?.totals && Object.keys(cart.totals).map(k => {
                      return k !== "total" ?
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4" key={k}>
                          <dt className="flex items-center text-sm text-gray-600">
                            <span>{t(`shop.${k}`)}</span>
                          </dt>
                          <dd className="text-sm font-medium text-main">
                            {
                              cart.totals[k] && +cart.totals[k] !== 0 ? <Price
                                price={byMinorUnit(cart.totals[k], cart.currency.currency_minor_unit)} /> : cart.currency.currency_symbol + "0.00"
                            }
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
                             price={byMinorUnit(cart.totals.total, cart.currency.currency_minor_unit)} />
                    </dd>
                  </div>
                </dl>
                {
                  (props?.showButton !== false) && <div className="mt-6">
                    <Link
                      href={"/checkout"}
                      className="!w-full block text-center bg-main rounded-md duration-300 hover:bg-opacity-80 border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm">
                      {t("common.Checkout")}
                    </Link>
                  </div>
                }
              </div>
            </section>
          }
        </div>
    }
  </main>;
};
