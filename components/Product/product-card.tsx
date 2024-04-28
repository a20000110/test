import { GqlProductNodeInterface } from "@/lib/types/gql/product/product.type";
import { Placeholder } from "@/components/Placeholder";
import Link from "next/link";
import { BodyText } from "@/components/BodyText";
import Price from "@/components/Price/price";
import InquiryButton from "@/components/Inquiry/Button";
import Skeleton from "react-loading-skeleton";
import React, { useEffect, useState } from "react";
import { GqlProductBySlugNodeInterface } from "@/lib/types/gql/product/product-by-slug.type";
import { getDiscount } from "@/lib/utils/util";
import Badge from "@/components/Badge";
import { Button } from "@/components/Button";
import { siteStore } from "@/lib/store/site.store";
import Rating from "react-rating";
import { useTranslations } from "next-intl";
import { GqlProductTabsNodeInterface } from "@/lib/types/gql/product/product-tabs.type";
import { useLoveStore } from "@/lib/store/love.store";
import clsx from "clsx";
import { GqlProductByIdProductInterface } from "@/lib/types/gql/product/product-by-id.type";
import { useCompareStore } from "@/lib/store/compare.store";
import { GqlBestSellNode } from "@/lib/queries/bestselling-product";
import ProductCardAddToCard from "@/components/Product/product-card-addToCard";

export type ProductType =
  GqlProductNodeInterface
  | GqlProductBySlugNodeInterface
  | GqlProductTabsNodeInterface["node"]
  | GqlProductByIdProductInterface
  | GqlBestSellNode

export default function ProductCard({ product: Product, loading = false }: {
  product?: ProductType,
  loading?: boolean
}) {
  const t = useTranslations();
  const [product, setProduct] = useState<ProductType>();
  const [discount, setDiscount] = useState<number | string>(0);
  const [isLove, setIsLove] = useState(false);
  const { loveIds, setLoveProducts } = useLoveStore();
  const [isCompare, setCompare] = useState(false);
  const { compareIds, setCompareIds } = useCompareStore();
  const addOrDelLike = () => {
    const id = product?.databaseId;
    if (id) {
      setLoveProducts(id);
    }
  };

  const addOrDelCompare = () => {
    const id = product?.databaseId;
    if (id) {
      setCompareIds(id);
    }
  };

  useEffect(() => {
    setProduct(Product);
    if (Product) {
      setDiscount(getDiscount(Product.price, Product.regularPrice));
    }
  }, [Product]);

  useEffect(() => {
    if (loveIds.length && Product?.databaseId) {
      setIsLove(loveIds.includes(Product.databaseId));
    } else {
      setIsLove(false);
    }
  }, [loveIds]);
  useEffect(() => {
    if (compareIds.length && Product?.databaseId) {
      setCompare(compareIds.includes(Product.databaseId));
    } else {
      setCompare(false);
    }
  }, [compareIds]);
  return <>
    {
      <div
        className="shadow-md rounded-[5px] hover:shadow-2xl duration-300 bg-white flex group flex-col h-full w-full justify-between overflow-hidden">
        <div className="duration-300 relative overflow-hidden c-flex">
          {
            !loading && !!discount && <Badge className="absolute z-[1] right-1 top-1">
              {discount}
            </Badge>
          }
          {
            loading ? <Skeleton height={300} width={300} /> :
              <>
                <div className={`relative`}>
                  <Link href={`/product/${product?.slug}`} className="c-flex">
                    <Placeholder
                      src={product?.image?.sourceUrl || ""}
                      quality={60} imageHeight={500}
                      imageWidth={500} fit="cover" />
                  </Link>
                  {/*添加比较按钮*/}
                  <div className="absolute bottom-0 left-0 right-0 h-[30px] bg-black bg-opacity-20 b-flex px-2">
                    <i
                      className={clsx("text-[22px] cursor-pointer", isCompare ? "ri-check-line text-main" : "ri-arrow-left-right-line text-white")}
                      onClick={addOrDelCompare}></i>
                    {/*添加到喜欢按钮*/}
                    <i
                      className={clsx("text-[22px] cursor-pointer", isLove ? "ri-heart-3-fill text-main" : "ri-heart-3-line text-white")}
                      onClick={addOrDelLike}></i>
                  </div>
                </div>
              </>
          }
        </div>
        <div className="p-4 max-md:px-1.5 max-md:py-2 pb-0 overflow-hidden">
          {
            loading ? <Skeleton height={48} width={"100%"} /> :
              <Link href={`/product/${product?.slug}`} onClick={(e) => {
                if (!product?.slug) {
                  e.preventDefault();
                }
              }}>
                <BodyText className="line-clamp-2 text-themeSecondary800 max-md:text-sm" size={"md"}>
                  {product?.name}
                </BodyText>
              </Link>
          }
          {
            loading ? <Skeleton height={20} width={"100%"} /> :
              // @ts-ignore
              <Rating
                readonly
                initialRating={product?.averageRating}
                emptySymbol={<i className="ri-star-fill text-themeSecondary300 max-md:text-sm" />}
                fullSymbol={<i className="ri-star-fill text-themeWarning500 max-md:text-sm" />}
              />
          }
          {
            loading ? <Skeleton height={20} width={"100%"} /> :
              <div className="s-flex text-sm max-md:text-xs">
                <i
                  className={`${product?.stockStatus === "IN_STOCK" ? "ri-check-line text-main" : "ri-close-line text-red-700"} ri-lg mr-1`}></i>
                {product?.stockStatus && t("state." + product?.stockStatus)}
              </div>
          }
          {
            loading ? <Skeleton height={30} width={"50%"} /> :
              <div className="s-flex font-bold flex-wrap">
                {product?.regularPrice && product.regularPrice !== product.price &&
                  <Price price={product?.regularPrice} className="py-0.5 !text-gray-500 text-sm mr-1 line-through" />
                }
                <Price price={product?.price || ""} className="py-0.5 max-md:text-xs" />
              </div>
          }
        </div>
        <div className="mb-3">
          {
            loading ? <div className="px-4"><Skeleton height={36} width={128} /></div> : product?.databaseId ?
              <div className="b-flex gap-x-4 mx-4 max-md:mx-2 max-md:flex-col gap-y-1">
                {
                  product?.stockStatus === "IN_STOCK" ?
                    <ProductCardAddToCard id={product.databaseId} className="whitespace-nowrap w-full" /> :
                    <InquiryButton metaData={product?.metaData} promptForInput={true} size="xs" count={1}
                                   className="whitespace-nowrap w-full"
                                   id={product.databaseId.toString()}
                                   text={"common.03a44d0a2ee10e4152e8c47f29e9cf7b6cbe"} />
                }
                <Link href={`/product/${product.slug}`} shallow={true} className="h-full c-flex max-md:w-full">
                  <Button size="xs" className="max-md:w-full whitespace-nowrap rounded-[2px] max-md:text-[14px]">
                    {t("common.View")}
                  </Button>
                </Link>
              </div>
              : ""
          }
        </div>
      </div>
    }
  </>;

}
