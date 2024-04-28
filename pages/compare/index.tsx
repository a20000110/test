import { pageStaticProps } from "@/lib/utils/util";
import { GetStaticPropsContext } from "next";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import client from "@/lib/ApolloClient/apolloClient";
import PRODUCTS_BY_ID from "@/lib/queries/product-by-id";
import {
  GqlProductByIdDataInterface,
  GqlProductByIdProductInterface
} from "@/lib/types/gql/product/product-by-id.type";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { useCompareStore } from "@/lib/store/compare.store";
import { Placeholder } from "@/components/Placeholder";
import Price from "@/components/Price/price";
import Link from "next/link";
import Rating from "react-rating";
import { RingLoader } from "react-spinners";
import EmptyState from "@/components/EmptyState";
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

const CompareList = ({ list, removeItem }: {
  list: GqlProductByIdProductInterface[],
  removeItem: (id: number) => void
}) => {
  const t = useTranslations();
  return <div className="my-12">
    {
      list.map(item => {
        return <div key={item.databaseId} className="border-b-[1px] py-4 flex justify-between items-start">
          <div className="s-flex flex-wrap gap-x-3">
            <div className="w-[100px] h-[100px] c-flex">
              <Placeholder src={item?.image?.sourceUrl||""} imageWidth={100}
                           imageHeight={100} />
            </div>
            <div className="flex flex-col items-start justify-start">
              <Link href={`/product/${item.slug}`}
                    className="hover:text-main duration-300 line-clamp-1">{item.name}</Link>
              <p className="text-sm">
                <Price price={item.price} />
              </p>
              <p className="text-mainText text-sm">
                Sku:{item.sku}
              </p>
              <p className="text-mainText text-sm">
                {t("product.Quantity")}:{item.stockQuantity}
              </p>
              <p className="text-mainText text-sm s-flex">
                {t("order.Status")}:
                <i
                  className={`${item?.stockStatus === "IN_STOCK" ? "ri-check-line text-main" : "ri-close-line text-red-700"} ri-lg mr-1`}></i>
                {item?.stockStatus && t("state." + item?.stockStatus)}
              </p>
              <p>
                {/*// @ts-ignore*/}
                <Rating
                  readonly
                  initialRating={item?.averageRating}
                  emptySymbol={<i className="ri-star-fill text-themeSecondary300 h-4 w-4" />}
                  fullSymbol={<i className="ri-star-fill text-themeWarning500 h-4 w-4" />}
                />
              </p>
            </div>
          </div>
          <div className="hover:text-main duration-300 cursor-pointer"
               onClick={() => removeItem(item.databaseId)}>
            <i className="ri-close-line" /> {t("common.d229e36bfcfa8345f2da3663638e5ffcc57a")}
          </div>
        </div>;
      })
    }
  </div>;
};

export default function Compare({
                                  seo
                                }: Props) {
  const [compareList, setCompareList] = useState<GqlProductByIdProductInterface[]>([]);
  const t = useTranslations();
  const { compareIds, removeAllCompareIds, removeCompareItem } = useCompareStore();
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const removeItem = (id: number) => {
    removeCompareItem(id);
  };
  useEffect(() => {
    if (!compareIds.length || !locale) return setCompareList([]);
    fetchData(compareIds, setLoading, locale).then(res => {
      setCompareList(res);
    });
  }, [compareIds, locale]);
  return <>
    <HeadSeo seo={seo?.data} />
    <PostAndProductBanner name={`${t("nav.Compare").toUpperCase()}`} />
    <div className="container my-16">
      {
        !loading && !!compareList.length && <p className="e-flex mb-4">
          <span className="text-sm hover:text-main duration-300 cursor-pointer" onClick={() => removeAllCompareIds()}>
            <i className="ri-delete-bin-6-line"></i>
            {t("common.2404e3fb11a4cd4619b87d75ba56e345d8b0")}
          </span>
        </p>
      }
      {
        loading ? <div className="c-flex">
          <RingLoader color="#000" />
        </div> : compareList.length ? <CompareList list={compareList} removeItem={removeItem} /> : <EmptyState />
      }
    </div>
  </>;
}

export const getServerSideProps = async (context: GetStaticPropsContext) => {
  const page_id = 10;
  return await pageStaticProps({
    page_id, locale: context.locale
  });
};
