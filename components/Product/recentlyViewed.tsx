import React, { useEffect, useState } from "react";
import { useProductStore } from "@/lib/store/product.store";
import client from "@/lib/ApolloClient/apolloClient";
import ProductCard from "@/components/Product/product-card";
import { useLocale, useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { GqlProductBySlugsInterface } from "@/lib/types/gql/product/product-by-slugs.type";
import PRODUCT_BY_SLUGS from "@/lib/queries/product-by-slugs";

const emptyArray = Array.from({ length: 4 });

function RecentlyViewed() {
  const { recentlyViewed, setAllRecentlyViewed } = useProductStore();
  const t = useTranslations();
  const locale = useLocale();
  const [recentlyProducts, setRecentlyProducts] = useState<GqlProductBySlugsInterface["products"]>();
  const fetchData = async (slugs: string[]) => {
    const { data: { products } } = await client.query<GqlProductBySlugsInterface>({
      query: PRODUCT_BY_SLUGS,
      variables: {
        slug: slugs
      }
    });
    const nodes = products.edges.length ? await translateStaticProps(products.edges, ["node.name", "node.shortDescription"], "auto", locale) : products.edges;
    modifyNumbers(products.edges.map((e) => e.node.slug));
    setRecentlyProducts({
      edges: nodes,
      pageInfo: products.pageInfo
    });
  };

  // 这里设置全部最近产品是为了去除后台已经删除的产品
  const modifyNumbers = (ids: string[]) => {
    if (!areArraysEqual(recentlyViewed, ids) && !!recentlyViewed.length) {
      setAllRecentlyViewed(ids);
    }
  };

  const areArraysEqual = (arr1: string[], arr2: string[]) => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
  };

  useEffect(() => {
    if (recentlyViewed && recentlyViewed.length) {
      fetchData(recentlyViewed);
    }
  }, [recentlyViewed]);
  return <>
    <div className="w-full h-[1px] my-20 border" id="recently-viewed"></div>
    <h2
      className="text-xl lg:text-3xl md:leading-10 font-bold  text-themeSecondary800">{t("product.77233134eae8ce42e5a8207268ed9ee26c47")}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-14 max-md:gap-y-4 mt-11">
      {
        !!recentlyProducts ? recentlyProducts.edges.map((r) => {
            const { node } = r;
            return <div key={node.databaseId}>
              <ProductCard product={node} />
            </div>;
          }) :
          <>{emptyArray.map((e, i) => <div key={i}>
            <ProductCard loading={true} />
          </div>)}</>
      }
    </div>
  </>;
}

export default React.memo(RecentlyViewed);
