import { GetStaticPropsContext } from "next";
import { REVA_DATE } from "@/lib/constants";
import { getLang, getNavProducts, translatePageSEO } from "@/lib/utils/util";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import React, { useEffect, useState } from "react";
import PostAndProductBanner from "@/components/PostAndProductBanner";
import { useLocale, useTranslations } from "next-intl";
import { RingLoader } from "react-spinners";
import client from "@/lib/ApolloClient/apolloClient";
import { GET_BESTSELLING_PRODUCTS, GqlBestsellingProducts } from "@/lib/queries/bestselling-product";
import { translateStaticProps } from "@/lib/utils/translate-util";
import ProductCard from "@/components/Product/product-card";


type FetchDataProps = {
  setLoading: (loading: boolean) => void;
  locale: string;
  variables?: {
    first: number;
    after?: string;
  }
}
const fetchData = async (props: FetchDataProps) => {
  try {
    props.setLoading(true);
    const { data: { products } } = await client.query<GqlBestsellingProducts>({
      query: GET_BESTSELLING_PRODUCTS,
      variables: props.variables
    });
    let nodes = await translateStaticProps(products.nodes, ["name"], "auto", props.locale) as GqlBestsellingProducts["products"]["nodes"];
    return {
      nodes,
      pageInfo: products.pageInfo
    };
  } finally {
    props.setLoading(false);
  }
};

export default function BestSellers({
                                      seo
                                    }: {
  seo: PageSeoInterface | null;
}) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState("");
  const locale = useLocale();
  const [products, setProducts] = useState<GqlBestsellingProducts["products"]["nodes"]>([]);
  const showMore = async () => {
    if (!hasNextPage) return;
    fetchData({
      setLoading,
      locale,
      variables: {
        first: 10,
        after: endCursor
      }
    }).then(res => {
      setProducts((old) => {
        return [...old, ...res.nodes];
      });
      setHasNextPage(res.pageInfo.hasNextPage);
      setEndCursor(res.pageInfo.endCursor);
    });
  };
  useEffect(() => {
    showMore();
  }, []);
  return <>
    <HeadSeo seo={seo?.data} />
    <PostAndProductBanner name={`${t("nav.Best Sellers")}`} />
    <div className="py-32 container">
      <div className="grid grid-cols-5 max-md:grid-cols-2 gap-8">{
        products.map(item => {
          return <div className="relative" key={item.databaseId}>
            <ProductCard product={item} key={item.databaseId} />
            <div className="w-10 c-flex text-[12px] text-white rounded-[5px] h-5 absolute z-[1] right-1 top-1 bg-main">
              {t("nav.HOT")}
            </div>
          </div>;
        })
      }</div>
      <div className="h-20 max-md:h-10 w-full"></div>
      {
        !loading && hasNextPage && <div className="c-flex w-full">
          <div className="px-4 py-3 rounded-[5px] bg-main text-white cursor-pointer" onClick={showMore}>
            {t("banner.0db144fb94fe4345594896d37faaf0e26260")}
          </div>
        </div>
      }
      {
        loading && <div className="c-flex">
          <RingLoader color="#000" />
        </div>
      }
    </div>
  </>;
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const page_id = 28;
  const promise = await Promise.all([
    translatePageSEO(page_id, context.locale),
    getLang(context.locale)
  ]);
  return {
    props: {
      seo: promise[0],
      messages: promise[1]
    },
    revalidate: REVA_DATE
  };
};
