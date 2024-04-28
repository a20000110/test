import { GqlProductBySlugNodeInterface } from "@/lib/types/gql/product/product-by-slug.type";
import Skeleton from "react-loading-skeleton";
import Price from "@/components/Price/price";
import { BodyText } from "@/components/BodyText";
import Badge from "@/components/Badge";
import ProductAttributes from "@/components/Product/product-attributes";
import ProductCartBuyInquiry from "@/components/Product/product-cart-buy-inquiry";
import { SocialShare } from "@/components/SingleBlog/SocialShare";
import Link from "next/link";
import ProductVariable from "@/components/Product/product-variable";
import { useProductVariableStore } from "@/lib/store/product-variable.store";
import { useProductAttributeStore } from "@/lib/store/product-attribute.store";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { debounce, observeElementIntersection } from "@/lib/utils/util";
import { MinimumOrder } from "@/components/Product/minimumOrder";

type Props = {
  product: GqlProductBySlugNodeInterface | null
}

export type ChangeValueType = {
  key: string,
  value: string,
  id?: number,
  label: string
}

export default function Information({ product }: Props) {
  const t = useTranslations();
  const productSelectRef = useRef<HTMLDivElement | null>(null);
  const { setSelectAttribute } = useProductAttributeStore();
  const handlerAttribute = ({ key, value, id, label }: ChangeValueType) => {
    setSelectAttribute(key, value, id || product!.databaseId, label);
  };
  const { currentProduct } = useProductVariableStore();
  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const proSel = productSelectRef.current;
    window.addEventListener("scroll", debounce(() => {
      // 获取当前屏幕宽度
      if (window.innerWidth <= 768) return;
      if (!proSel) return;
      if (window.scrollY >= 1200) {
        proSel.classList.add("proSel");
      } else {
        proSel.classList.remove("proSel");
        proSel.classList.remove("proSel-important");
        proSel.style.top = "";
        proSel.style.position = "";
      }
    }, 10));
    const rv = document.querySelector("#recently-viewed") as HTMLDivElement;
    observeElementIntersection("#recently-viewed", () => {
      if (window.innerWidth <= 768) return;
      if (window.proSelBottom) return;
      if (!proSel) return;
      if (!proSel.classList.contains("proSel")) return;
      window.proSelBottom = true;
      proSel.classList.remove("proSel-important");
      proSel.style.top = `${rv.offsetTop - 1500}px`;
      proSel.style.position = "absolute";
    });
    observeElementIntersection("#product-select-top", () => {
      if (window.innerWidth <= 768) return;
      if (!proSel) return;
      if (window.proSelBottom) {
        proSel.classList.add("proSel-important");
        window.proSelBottom = false;
      }
    });
  }, []);


  return <div className="relative flex-1 max-w-[772px]">
    <div id="product-select" ref={productSelectRef}>
      <div id="product-select-top"></div>
      {
        product?.name ?
          <>
            <h1 className="text-xl lg:text-3xl md:leading-10 font-bold text-themeSecondary800">{product?.name}</h1>
            <MinimumOrder productMeta={product?.metaData} />
          </> :
          <>
            <Skeleton width={"100%"} height={40} />
            <Skeleton width={"100%"} height={40} />
          </>
      }
      <div className="py-3 s-flex gap-2 md:gap-4 flex-wrap">
        <div className="c-flex gap-2">
          {
            product ? <>
              <Price price={product?.price || ""} className="text-xl font-bold" />
              {
                !product.variations && product.price !== product.regularPrice &&
                <Price price={product?.regularPrice || ""}
                       className="font-normal text-xs sm:text-sm text-themeSecondary400 line-through" />
              }
              <div className="bg-themeSecondary200 h-8 w-0.5 hidden md:block"></div>
            </> : <Skeleton width={120} height={30} />
          }
        </div>
        <div className="c-flex gap-2">
          {
            product ? <>
                <BodyText>
                  <i className="ri-star-s-fill ri-xl text-base text-themeWarning500"></i>
                  <span
                    className="font-normal text-xs sm:text-sm  text-themeSecondary800 px-0.5">{product?.averageRating}</span>
                </BodyText>
                <BodyText
                  className="font-normal text-xs sm:text-sm text-themeSecondary800">- {product?.reviewCount || 0} {t("product.reviews")}
                </BodyText>
              </>
              : <Skeleton width={120} height={30} />
          }
        </div>
        <div className="c-flex gap-2">
          {
            product ? product?.stockStatus ?
                <Badge
                  className={`${(currentProduct?.stockStatus || product?.stockStatus) === "OUT_OF_STOCK" ? "bg-themeWarning500" : ""}`}>
                  {t("state." + (currentProduct?.stockStatus || product?.stockStatus))}
                </Badge> : "" :
              <Skeleton width={100} height={30} />
          }
        </div>
      </div>
      <div className="proSel-options">
        {
          product ? product?.shortDescription && <>
            <div className="border border-themeSecondary200 w-full mt-5" />
            <BodyText innerHTML={product?.shortDescription || ""}
                      className="font-normal text-base text-themeSecondary500 mt-5"></BodyText>
            <div className="border border-themeSecondary200 w-full mt-5" />
          </> : [0, 1, 2].map(i => {
            return <Skeleton width={"100%"} height={30} className="mt-2" key={i} />;
          })
        }
        {
          product ? !product?.variations?.nodes?.length ? product?.attributes?.nodes?.map((atr, index) => {
                return <div key={index}>
                  {
                    !product?.shortDescription && <div className="border border-themeSecondary200 w-full mt-5" />
                  }
                  <ProductAttributes {...atr} changeValue={handlerAttribute} />
                </div>;
              }) :
              <div>
                {
                  !product?.shortDescription && <div className="border border-themeSecondary200 w-full mt-5" />
                }
                <ProductVariable product={product} changeValue={handlerAttribute} />
                {/*这里展示选中的变体价格*/}
                {
                  currentProduct?.price &&
                  <div>
                    <Price price={currentProduct?.price || ""} className="text-xl font-bold" />
                  </div>
                }
              </div>
            : <>
              <Skeleton width={150} height={30} className="mt-2" />
              <div className="s-flex gap-x-4">
                {
                  [0, 1, 2].map(i => {
                    return <Skeleton key={i} width={30} height={30} className="mt-2" style={{
                      borderRadius: "50%"
                    }} />;
                  })
                }
              </div>
            </>
        }
      </div>
      <ProductCartBuyInquiry {...product!} />
      <div className="mt-3">
        <div className="my-2 s-flex flex-wrap">
          {t("common.Category")}:
          {
            product?.productCategories?.edges?.map((edge, index) => {
              return <div key={index} className="mx-1">
                <Link href={`/${edge?.node?.slug}`}
                      className="font-normal text-xs sm:text-sm text-themeSecondary600">{edge?.node?.name}</Link>
              </div>;
            })
          }
        </div>
        <div className="my-2 s-flex">
          {t("product.Quantity")}:
          <BodyText className="mx-1">
            {
              (product?.variations ? currentProduct?.stockQuantity || product?.stockQuantity : product?.stockQuantity) || "N/A"
            }
          </BodyText>
        </div>
        <SocialShare />
      </div>
    </div>
  </div>;
}
