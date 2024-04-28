import { GqlProductBySlugNodeInterface } from "@/lib/types/gql/product/product-by-slug.type";
import Skeleton from "react-loading-skeleton";
import Calculator from "@/components/Calculator";
import React, { useEffect, useState } from "react";
import InquiryButton from "@/components/Inquiry/Button";
import { useProductVariableStore } from "@/lib/store/product-variable.store";
import { useProductAttributeStore } from "@/lib/store/product-attribute.store";
import { siteStore } from "@/lib/store/site.store";
import { AddToCartButton } from "@/components/Product/ShoppingCart/addToCart";
import { getMinQuantity } from "@/components/Product/minimumOrder";

export default function ProductCartBuyInquiry(props?: GqlProductBySlugNodeInterface) {
  const { isBtob } = siteStore();
  const isProps = !!Object?.keys(props!)?.length;
  const [count, setCount] = useState(1);
  const { currentProduct } = useProductVariableStore();
  const { selectAttribute } = useProductAttributeStore();
  const [minQuantity, setMinQuantity] = useState(-1);
  useEffect(() => {
    const value = getMinQuantity(props?.metaData);
    if (value) {
      setMinQuantity(+value);
    }
  }, [props?.metaData]);
  return <>
    <div className="border border-themeSecondary200 w-full mt-5" />
    <div className="mt-5">
      {
        !isProps ? <>
          <div className="s-flex gap-x-4">
            <Skeleton width={220} height={60} style={{
              borderRadius: "15px"
            }}></Skeleton>
            <Skeleton width={220} height={60} style={{
              borderRadius: "15px"
            }}></Skeleton>
          </div>
        </> : <div className="s-flex gap-x-4 flex-wrap gap-y-4">
          <Calculator initCount={minQuantity > 0 ? minQuantity : 1} changeCount={setCount} disabled={false}
                      minCount={minQuantity > 0 ? minQuantity : 1} maxCount={
            props?.variations ? currentProduct?.stockQuantity :
              props?.stockQuantity} />
          {
            isBtob ?
              <InquiryButton count={count} id={props!.databaseId.toString()} /> : ""
          }
          <div className="c-flex gap-x-4">
            {
              props?.variations ? <AddToCartButton<"VariableProduct">
                // 什么时候禁用？
                // 当前产品不存在
                // 库存不存在
                // 库存状态无货
                // 产品id不存在
                // 产品没有价格
                disabled={!currentProduct || !currentProduct?.stockQuantity || currentProduct?.stockStatus !== "IN_STOCK" || !currentProduct?.databaseId || !currentProduct?.price}
                __typename={"VariableProduct"}
                buyNow={true}
                product={{
                  databaseId: currentProduct?.databaseId.toString() || "",
                  quantity: count.toString(),
                  stockQuantity: currentProduct?.stockQuantity || 0,
                  stockStatus: currentProduct?.stockStatus || "OUT_OF_STOCK",
                  attributes: props?.attributes?.nodes || [],
                  variation: currentProduct?.attributes.nodes || selectAttribute
                }}
              /> : <AddToCartButton<"SimpleProduct">
                disabled={(!!props?.attributes?.nodes?.length ? selectAttribute.length !== props?.attributes?.nodes?.length : false) || !props || !props?.stockQuantity || props?.stockStatus !== "IN_STOCK" || !props?.databaseId || !props?.price}
                __typename={"SimpleProduct"}
                buyNow={true}
                product={{
                  databaseId: props?.databaseId.toString() || "",
                  quantity: count.toString(),
                  stockQuantity: props?.stockQuantity || 0,
                  stockStatus: props?.stockStatus || "OUT_OF_STOCK",
                  attributes: props?.attributes?.nodes || [],
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
          <InquiryButton className="!px-3 !py-2 !rounded-[5px]" count={count} id={props!.databaseId.toString()} />
        </div>
      }
    </div>
    <div className=" border border-themeSecondary200 w-full mt-5"></div>
  </>;
}
