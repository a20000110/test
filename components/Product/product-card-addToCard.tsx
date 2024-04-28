import { Button } from "@/components/Button";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Drawer from "@/components/Drawer";
import client from "@/lib/ApolloClient/apolloClient";
import { GET_PRODUCT_ATTRS, GqlGetProAttrsInterface } from "@/lib/queries/get-product-attr";
import { RingLoader } from "react-spinners";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { useProductAttributeStore } from "@/lib/store/product-attribute.store";
import { ChangeValueType } from "@/components/Product/information";
import ProductAttributes from "@/components/Product/product-attributes";
import ProductVariable from "@/components/Product/product-variable";
import Calculator from "@/components/Calculator";
import { useProductVariableStore } from "@/lib/store/product-variable.store";
import Price from "@/components/Price/price";
import { setOverflow } from "@/lib/utils/util";
import { useProductStore } from "@/lib/store/product.store";
import clsx from "clsx";
import { AddToCartButton } from "@/components/Product/ShoppingCart/addToCart";
import Link from "next/link";
import { useUserStore } from "@/lib/store/user.store";

const fetchData = async ({
                           id,
                           setLoading,
                           setLoadingText,
                           locale
                         }: {
  id: number;
  setLoading?: (loading: boolean) => void;
  setLoadingText?: (loadingText: string) => void;
  locale: string;
}) => {
  try {
    setLoading?.(true);
    const requestId = "7bba48706b576f4494596cde2b39515c1da3";
    const { data: { product } } = await client.query<GqlGetProAttrsInterface>({
      query: GET_PRODUCT_ATTRS,
      variables: {
        id
      },
      requestId
    });
    setLoadingText?.("message.7b829c9548bb5544be6a9ef0e2e6af71f608");
    let node = JSON.parse(JSON.stringify(product));
    const keys = ["name"];
    node?.attributes?.nodes?.length && keys.push("attributes.nodes[].label");
    node?.variations?.nodes?.length && keys.push("variations.nodes[].attributes.nodes[].label");
    node = await translateStaticProps([product], keys, "auto", locale);
    return node.at(-1) as GqlGetProAttrsInterface["product"];
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
  } finally {
    setLoading?.(false);
  }
};

export default function ProductCardAddToCard({ id, className = "" }: {
  id: number,
  className?: string
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("message.f344bd3289283344956b2a19aa278a22d168");
  const [product, setProduct] = useState<GqlGetProAttrsInterface["product"]>();
  const { setSelectAttribute, selectAttribute, removeSelectAttribute } = useProductAttributeStore();
  const [count, setCount] = useState(1);
  const { currentProduct } = useProductVariableStore();
  const { currencyUnit } = useProductStore();
  const [price, setPrice] = useState<string>("0");
  const { userInfo } = useUserStore();
  const t = useTranslations();
  const handlerAttribute = ({ key, value, id, label }: ChangeValueType) => {
    setSelectAttribute(key, value, id!, label);
  };
  const changeCount = (number: number) => {
    setCount(number);
    if (product?.variations) {
      if (currentProduct?.price) {
        const price = currentProduct.price.replace(currencyUnit, "").replace(/[^\d.]/g, "");
        setPrice((+price * number).toString());
      }
    } else {
      if (product?.price) {
        setPrice((+product.price.replace(currencyUnit, "").replace(/[^\d.]/g, "") * number).toString());
      }
    }

  };

  const handlerClick = () => {
    if (!userInfo) {
      const login = document.querySelector("#web-login") as HTMLLIElement;
      login.click();
      return;
    }
    removeSelectAttribute();
    if (!id) return;
    setLoadingText("message.f344bd3289283344956b2a19aa278a22d168");
    fetchData({
      id,
      setLoading,
      setLoadingText,
      locale
    }).then(res => {
      setProduct(res);
      setPrice(res.price || "0");
    });
    setOpen(true);
  };

  const closeOpen = () => {
    setOpen(false);
    setOverflow("auto");
  };

  useEffect(() => {
    if (currentProduct && currentProduct.price) {
      setPrice(currentProduct.price);
    } else {
      setPrice(product?.price || "");
    }
  }, [currentProduct]);

  return <>
    <Button onClick={handlerClick} size="xs"
            className={clsx("rounded-[2px] max-md:text-[14px] whitespace-nowrap", className)}>
      {t("common.335ce3a24d8c804001f8cb7619a736751c5f")}
    </Button>
    {
      open &&
      <Drawer width={"40vw"} className="max-md:!w-10/12 overflow-hidden cursor-auto" visible={open} direction="right"
              onClose={closeOpen} title={t("common.335ce3a24d8c804001f8cb7619a736751c5f")}>
        {
          loading ? <div className="w-full h-full c-flex flex-col gap-y-2">
            <RingLoader color="#000" />
            <p>{t(loadingText)}</p>
          </div> : <div className="b-flex flex-col">
            <div className="s-flex w-full px-4">
              <Link href={`/product/${product?.slug}`} className="text-left line-clamp-1">{product?.name}</Link>
            </div>
            <div className="h-[89.7vh] max-md:h-[86vh] overflow-y-auto w-full px-4">
              {
                product ? !product?.variations?.nodes?.length ? product?.attributes?.nodes?.map((atr, index) => {
                      return <div key={index}>
                        <ProductAttributes {...atr} changeValue={handlerAttribute} />
                      </div>;
                    }) :
                    <div>
                      <ProductVariable product={product} changeValue={handlerAttribute} />
                    </div>
                  : ""
              }
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt
                      className="text-sm font-medium leading-6 text-gray-900">{t("shop.6b148211c636ed43c61806727ba89a735893")}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <Price price={price} className="text-base font-bold" />
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt
                      className="text-sm font-medium leading-6 text-gray-900">{t("shop.04e8df6b18bc73469b7802bdbc1e77e546a5")}</dt>
                    <dd
                      className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{
                      product?.variations ?
                        currentProduct?.stockQuantity || 0 :
                        product?.stockQuantity || 0
                    }</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="h-[56px] w-full px-4 border-t shadow-boxShaddowxl s-flex">
              {
                product?.variations ? <Calculator initCount={1} className="max-md:w-[80px]" changeCount={changeCount}
                                                  disabled={!currentProduct?.stockQuantity} maxCount={
                    currentProduct?.stockQuantity} /> :
                  <Calculator initCount={1} className="max-md:w-[80px]" changeCount={changeCount}
                              disabled={selectAttribute.length !== product?.attributes?.nodes?.length || !product?.stockQuantity}
                              maxCount={
                                product?.stockQuantity} />
              }

              {
                product?.variations ? <AddToCartButton<"VariableProduct">
                  // 什么时候禁用？
                  // 当前产品不存在
                  // 库存不存在
                  // 库存状态无货
                  // 产品id不存在
                  // 产品没有价格
                  disabled={!currentProduct || !currentProduct?.stockQuantity || currentProduct?.stockStatus !== "IN_STOCK" || !currentProduct?.databaseId || !currentProduct?.price}
                  __typename={"VariableProduct"}
                  className="ml-2"
                  product={{
                    databaseId: currentProduct?.databaseId.toString() || "",
                    quantity: count.toString(),
                    stockQuantity: currentProduct?.stockQuantity || 0,
                    stockStatus: currentProduct?.stockStatus || "OUT_OF_STOCK",
                    attributes: product?.attributes?.nodes || [],
                    variation: currentProduct?.attributes.nodes || selectAttribute
                  }}
                /> : <AddToCartButton<"SimpleProduct">
                  disabled={(!!product?.attributes?.nodes?.length ? selectAttribute.length !== product?.attributes?.nodes?.length : false) || !product || !product?.stockQuantity || product?.stockStatus !== "IN_STOCK" || !product?.databaseId || !product?.price}
                  __typename={"SimpleProduct"}
                  className="ml-2"
                  product={{
                    databaseId: product?.databaseId.toString() || "",
                    quantity: count.toString(),
                    stockQuantity: product?.stockQuantity || 0,
                    stockStatus: product?.stockStatus || "OUT_OF_STOCK",
                    attributes: product?.attributes?.nodes || [],
                    item_data: (() => {
                      let item_data: Record<string, string> = {};
                      selectAttribute.map(item => {
                        item_data[item.name] = item.value;
                      });
                      return item_data;
                    })()
                  }}
                />
              }
            </div>
          </div>
        }
      </Drawer>
    }
  </>;
}
