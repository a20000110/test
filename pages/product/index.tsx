import { Breadcrumb } from "@/components/Breadcrumbs";
import { BodyText } from "@/components/BodyText";
import client from "@/lib/ApolloClient/apolloClient";
import PRODUCTS from "@/lib/queries/product";
import {
  GqlProductInterface,
  GqlProductNodeInterface,
  GqlProductsInterface
} from "@/lib/types/gql/product/product.type";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/Product/product-card";
import "react-loading-skeleton/dist/skeleton.css";
import { Button } from "@/components/Button";
import { RingLoader } from "react-spinners";
import ProductFilter from "@/components/Product/product-filter";
import EmptyState from "@/components/EmptyState";
import { ProductFist } from "@/lib/constants/product";
import SubLayout from "@/components/SubLayout";
import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import { useLocale, useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { defaultLocale, getLang, getNavProducts, getProductFilterData, translatePageSEO } from "@/lib/utils/util";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { GqlProductCategoriesParentNode2Interface } from "@/lib/types/gql/product/product-categories-parent.type";
import { toast } from "react-toastify";
import { StockStatus } from "@/lib/types/gql/product/product-by-slug.type";

export type GetProductData = {
  first: number,
  after?: string,
  categorySlug?: string,
  orderby?: [{
    field: string,
    order: "ASC" | "DESC"
  }],
  featured?: boolean,
  stockStatus?: StockStatus[]
}

export const getProductData = async (props?: GetProductData, locale?: string | undefined) => {
  try {
    const { data } = await client.query<GqlProductsInterface>({
      query: PRODUCTS,
      variables: {
        ...props,
        first: props?.first || ProductFist,
        after: props?.after || "",
        categorySlug: props?.categorySlug || "",
        orderby: props?.orderby || [{
          field: "DATE",
          order: "DESC"
        }],
        stockStatus: props?.stockStatus || ["IN_STOCK"]
      }
    });
    if (locale === defaultLocale) {
      return data;
    } else if (data?.products?.edges?.length) {
      const nodes = await translateStaticProps(data.products.edges, ["node.name", "node.shortDescription"], "auto", locale);
      if (nodes.length) {
        return {
          products: {
            edges: nodes,
            pageInfo: data.products.pageInfo
          }
        } as GqlProductsInterface;
      }
    }
    return data || null;
  } catch (e) {
    return Promise.reject(e);
  }
};

type Props = {
  products: GqlProductInterface;
  seo: PageSeoInterface | null;
  productAllCate: GqlProductCategoriesParentNode2Interface[]
}

const filterFirst = [9, 12, 15, 30];
const inventoryStatus = [{
  label: "3492c13ee10e3a44be697408872ad0de38d2",
  value: "IN_STOCK"
}, {
  label: "429a47bcd7a99b443459f550615350038a9f",
  value: "OUT_OF_STOCK"
}, {
  label: "5db2c09de97dee438f58a5c73d4a121fd5ae",
  value: "totalSales"
}, {
  label: "ab731567f3898c497c68199437fc7872750d",
  value: "new"
}];

function Product(props: Props) {
  const t = useTranslations();
  const [products, setProducts] = useState<GqlProductInterface>(props.products);
  const [totalCount, setTotalCount] = useState<number>(props.products?.pageInfo?.offsetPagination?.total || 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [currentStockStatus, setCurrentStockStatus] = useState<StockStatus>("IN_STOCK");
  const [currentFirst, setCurrentFirst] = useState<number>(ProductFist);
  const [queryWhere, setQueryWhere] = useState<GetProductData>({
    first: ProductFist,
    after: props.products?.pageInfo?.endCursor || "",
    categorySlug: "",
    orderby: [{
      field: "DATE",
      order: "DESC"
    }],
    stockStatus: [currentStockStatus]
  });
  const [hasMore, setHasMore] = useState<Boolean>(!!props.products?.pageInfo?.hasNextPage);
  const locale = useLocale();
  const setParams = (data: GqlProductInterface, coverProducts: boolean, setTotal?: boolean) => {
    setQueryWhere(val => {
      return { ...val, after: data?.pageInfo?.endCursor };
    });
    setHasMore(!!data?.pageInfo?.hasNextPage);
    setProducts((prev) => {
      if (coverProducts) {
        return data;
      } else {
        const newPrev = JSON.parse(JSON.stringify(prev));
        newPrev.edges = [...prev.edges, ...data.edges];
        return newPrev;
      }
    });
    setTotal && setTotalCount(data?.pageInfo?.offsetPagination?.total);
  };
  const onSearchChange = async (data?: GetProductData | null, setTotal ?: boolean) => {
    try {
      setLoading(true);
      data && setQueryWhere(val => {
        return { ...val, ...data };
      });
      const { products: product } = await getProductData({
        ...queryWhere,
        ...data,
        after: ""
      }, locale);
      setParams(product, true, typeof setTotal === "boolean" ? setTotal : true);
    } catch (e) {
      toast(t("message.68c53dd9a67388497e1b48c6b208e75fd369"), { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onLoadMore = async () => {
    try {
      setMoreLoading(true);
      const { products } = await getProductData(queryWhere, locale);
      setParams(products, false, false);
    } catch (e) {
      toast(t("message.68c53dd9a67388497e1b48c6b208e75fd369"), { type: "error" });
    } finally {
      setMoreLoading(false);
    }
  };

  const handleFilterChange = async ({ slug }: any) => {
    await onSearchChange({
      ...queryWhere,
      categorySlug: slug
    }, true);
  };

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  return <>
    <HeadSeo seo={props?.seo?.data} />
    <Breadcrumb name={t("common.Product")} />
    <SubLayout className="b-flex !items-start max-md:flex-col gap-x-16">
      <div className="container lg:py-16 md:py-8 py-6 b-flex !items-start max-md:flex-col gap-x-16">
        <div className="flex-1 w-full max-md:mb-8">
          <ProductFilter title={t("common.CATEGORY")} list={props.productAllCate} click={handleFilterChange} />
        </div>
        <div className="md:w-[72%]">
          <div className="b-flex max-md:flex-col max-md:gap-y-4">
            <BodyText size="lg">
              {t("product_cate.6fef5b88c5633448a4f80b40c8eaed55a28e", {
                length: products.edges.length,
                total: totalCount
              })}
            </BodyText>
            <div className="e-flex">
              {/*筛选产品是否是现货*/}
              <select defaultValue={ProductFist}
                      className="px-4"
                      onChange={(e) => {
                        const value = e.target.value
                        const stockStatus = e.target.value.indexOf("STOCK") >= 0 ? e.target.value as StockStatus : "IN_STOCK";
                        let where: any = {
                          first: currentFirst
                        };
                        if (stockStatus) {
                          where.stockStatus = [stockStatus];
                        }
                        if (value==="totalSales"){
                          where.orderby = [{
                            field: "TOTAL_SALES",
                            order: "DESC"
                          }];
                        }
                        if (value === "new"){
                          where.orderby = [{
                            field: "DATE",
                            order: "DESC"
                          }];
                        }
                        onSearchChange(where);
                      }}
              >
                {
                  inventoryStatus.map((item, index) => {
                    return <option key={index} value={item.value}>
                      {t("product." + item.label)}
                    </option>;
                  })
                }
              </select>

              <select defaultValue={ProductFist}
                      className="px-4"
                      onChange={(e) => {
                        setCurrentFirst(+e.target.value);
                        onSearchChange({
                          first: +e.target.value
                        });
                      }}
              >
                {
                  filterFirst.map((item, index) => {
                    return <option key={index} value={item}>
                      {t("product.34a62cc2e6325848e97a5d4e5a91a7bd61a2", { count: item })}
                    </option>;
                  })
                }
              </select>
            </div>
          </div>
          {
            products.edges.length ? <div
              className="py-5 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-x-3 gap-y-14 max-md:gap-y-4">
              {
                products.edges.map((item) => {
                  const node: GqlProductNodeInterface = item.node;
                  return <div key={node.databaseId}>
                    <ProductCard product={node} loading={loading} />
                  </div>;
                })
              }
            </div> : <EmptyState className="my-0" text={t("message.545b505e0af8394091681f76485d361f972c")} />
          }
          <div className="c-flex py-12">
            {
              moreLoading ? <RingLoader color="#000" /> : hasMore &&
                <Button onClick={onLoadMore}>{t("common.Show_More")}</Button>
            }
          </div>
        </div>
      </div>
    </SubLayout>
  </>;
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const page_id = 2;

  const promise = await Promise.all([
    translatePageSEO(page_id, context.locale),
    getProductData({
      first: ProductFist,
      after: "",
      categorySlug: "",
      orderby: [{
        field: "DATE",
        order: "DESC"
      }]
    }, context.locale),
    getLang(context.locale),
    getProductFilterData(context.locale)
  ]);
  const seo = promise[0];
  const { products } = promise[1];
  return {
    props: {
      products: {
        ...products
      },
      seo,
      productAllCate: promise[3],
      messages: promise[2]
    },
    revalidate: REVA_DATE
  };
};

export default React.memo(Product);
