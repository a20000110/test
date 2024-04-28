import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProductData } from "@/pages/product";
import { GqlProductInterface } from "@/lib/types/gql/product/product.type";
import SubLayout from "@/components/SubLayout";
import ProductCard from "@/components/Product/product-card";
import { RingLoader } from "react-spinners";
import { Button } from "@/components/Button";
import { BodyText } from "@/components/BodyText";
import client from "@/lib/ApolloClient/apolloClient";
import { GqlProductCategoriesInterface } from "@/lib/types/gql/product/product-categories";
import { PRODUCT_CATEGORIES } from "@/lib/queries/product-categories";
import { GetStaticPropsContext } from "next";
import { getProductCateSeo } from "@/lib/hooks/useGetSeo";
import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import ProductFilter from "@/components/Product/product-filter";
import { useLocale, useTranslations } from "next-intl";
import { getLang, getProductFilterData, getStaticLocalePaths } from "@/lib/utils/util";
import { GqlProductCategoriesParentNode2Interface } from "@/lib/types/gql/product/product-categories-parent.type";
import { toast } from "react-toastify";
import PostAndProductBanner from "@/components/PostAndProductBanner";
import { translateStaticProps } from "@/lib/utils/translate-util";

type Props = {
  tranSlug: string;
  slug: string;
  products: GqlProductInterface | null;
  seo: PageSeoInterface | null;
  allCate: GqlProductCategoriesParentNode2Interface[],
  banner: string;
}

const first = 10;
const emptyArray = Array.from({ length: first });

function Page(props: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [products, setProducts] = useState<GqlProductInterface | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [after, setAfter] = useState<string>("");
  const [total, setTotal] = useState(0);
  const locale = useLocale();

  const onLoadMore = async () => {
    try {
      setMoreLoading(true);
      const { products } = await getProductData({
        categorySlug: router.query.slug as string || "",
        first: first,
        after: after
      }, locale);
      setProducts((val) => {
        return val ? {
          ...val,
          edges: [...val.edges, ...products.edges]
        } : products;
      });
      setHasMore(products?.pageInfo.hasNextPage);
      setAfter(products?.pageInfo?.endCursor);
    } catch (e) {
      toast(
        t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"),
        {
          type: "error"
        }
      );
    } finally {
      setMoreLoading(false);
    }

  };
  useEffect(() => {
    if (router.query.slug && typeof router.query.slug === "string") {
      setSlug(router.query.slug);
    }
  }, [router]);
  useEffect(() => {
    if (props.products) {
      setLoading(true);
      try {
        setProducts(props.products);
        setHasMore(props.products?.pageInfo.hasNextPage);
        setAfter(props.products?.pageInfo?.endCursor);
        setTotal(props.products?.pageInfo.offsetPagination.total);
      } catch (e) {
        toast(
          t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"),
          {
            type: "error"
          }
        );
      } finally {
        setLoading(false);
      }
    }
  }, [props]);
  return <>
    <HeadSeo seo={props?.seo?.data} />
    <PostAndProductBanner name={`${t("common.Category")}: ${props?.seo?.data?.title || props?.tranSlug || props.slug}`}
                          banner={props.banner} />
    <SubLayout>
      <div className="b-flex !items-start gap-x-16 max-md:flex-col">
        <div className="flex-1 w-full max-md:mb-8">
          <ProductFilter title={t("common.CATEGORY")} routerFilter={true} list={props.allCate} click={() => {
          }} />
        </div>
        <div className="md:w-[72%]">
          <BodyText className="pb-4" size="lg">
            {t("product_cate.6fef5b88c5633448a4f80b40c8eaed55a28e", {
              length: products?.edges?.length || 0,
              total: total
            })}
          </BodyText>
          <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-x-6 gap-y-8">
            {
              products ? products.edges?.map(item => (
                <div key={item.node.databaseId}>
                  <ProductCard product={item.node} loading={loading} />
                </div>
              )) : emptyArray.map((item, index) => (
                <div key={index}>
                  <ProductCard loading={loading} />
                </div>
              ))
            }
          </div>
          <div className="c-flex my-12">
            {
              moreLoading ? <RingLoader color="#000" /> : hasMore && !loading &&
                <Button onClick={onLoadMore}>{t("common.Show_More")}</Button>
            }
          </div>
        </div>
      </div>

    </SubLayout>
  </>;
}

export const getStaticPaths = async () => {
  const { data } = await client.query<GqlProductCategoriesInterface>({
    query: PRODUCT_CATEGORIES
  });
  const pathsData = data.productCategories.nodes.slice(0,1).map((item) => {
    return {
      params: {
        slug: item.slug
      }
    };
  });
  return getStaticLocalePaths({
    paths: pathsData,
    fallback: "blocking"
  });
};

export const getStaticProps = async (context: GetStaticPropsContext<{
  slug: string
}>) => {
  const slug = context.params?.slug || "";
  try {
    if (slug) {
      const promise = await Promise.all([
        getProductData({
          categorySlug: slug,
          first: first
        }, context.locale),
        getProductFilterData(context.locale),
        getLang(context.locale),
        getProductCateSeo(slug, context.locale),
        translateStaticProps([{ slug }], ["slug"], "auto", context.locale)
      ]);
      return {
        props: {
          products: promise[0].products,
          allCate: promise[1],
          seo: promise[3].seo,
          messages: promise[2],
          banner: promise[3].banner,
          tranSlug: promise[4][0].slug || slug,
          slug
        },
        revalidate: REVA_DATE
      };
    }
  } catch (e) {
    return {
      props: {
        products: [],
        allCate: [],
        seo: null,
        navProducts: [],
        messages: await getLang(context.locale),
        banner: "",
        tranSlug: (await translateStaticProps([{ slug }], ["slug"], "auto", context.locale))[0]?.slug || slug,
        slug
      },
      revalidate: REVA_DATE
    };
  }
};

export default Page;
