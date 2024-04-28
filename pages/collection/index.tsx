import { pageStaticProps } from "@/lib/utils/util";
import { GetServerSidePropsContext } from "next";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useLoveStore } from "@/lib/store/love.store";
import { RingLoader } from "react-spinners";
import client from "@/lib/ApolloClient/apolloClient";
import PRODUCTS_BY_ID from "@/lib/queries/product-by-id";
import {
  GqlProductByIdDataInterface,
  GqlProductByIdProductInterface
} from "@/lib/types/gql/product/product-by-id.type";
import EmptyState from "@/components/EmptyState";
import { translateStaticProps } from "@/lib/utils/translate-util";
import ProductCard from "@/components/Product/product-card";
import PostAndProductBanner from "@/components/PostAndProductBanner";

type Props = {
  seo: PageSeoInterface | null,
}

const fetchData = async (ids: number[], setLoading: (loading: boolean) => void, locale: string): Promise<GqlProductByIdProductInterface[]> => {
  try {
    setLoading(true);
    const { data } = await client.query<GqlProductByIdDataInterface>({
      query: PRODUCTS_BY_ID,
      variables: {
        ids: ids
      }
    });
    const nodes = data?.products?.nodes || [];
    if (nodes.length) {
      const tranNodes = await translateStaticProps(nodes, ["name"], "auto", locale);
      return tranNodes.length ? tranNodes : nodes;
    }
    return nodes;
  } finally {
    setLoading(false);
  }
};

export default function Collection({
                                     seo
                                   }: Props) {
  const [loveList, setLoveList] = useState<GqlProductByIdProductInterface[]>([]);
  const t = useTranslations();
  const { loveIds, removeAllLove } = useLoveStore();
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    if (!loveIds.length || !locale) return setLoveList([]);
    fetchData(loveIds, setLoading, locale).then(res => {
      setLoveList(res);
    });
  }, [loveIds, locale]);
  return <>
    <HeadSeo seo={seo?.data} />
    <PostAndProductBanner name={`${t("common.COLLECTION")}`} />
    <div className="container my-16">
      {
        !loading && !!loveList.length && <div className="e-flex mb-4">
          <div className="text-sm hover:text-main duration-300 cursor-pointer" onClick={removeAllLove}>
            <i className="ri-delete-bin-6-line"></i>
            {t("common.2404e3fb11a4cd4619b87d75ba56e345d8b0")}
          </div>
        </div>
      }
      {
        loading ? <div className="c-flex">
          <RingLoader color="#000" />
        </div> : loveList.length ? <ul className="grid grid-cols-5 w-full max-md:grid-cols-2 gap-5">
          {
            loveList.map(item => {
              return <li key={item.databaseId}>
                <ProductCard product={item} />
              </li>;
            })
          }
        </ul> : <EmptyState />
      }
    </div>
  </>;
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const page_id = 18;
  return await pageStaticProps({
    page_id, locale: context.locale
  });
};
