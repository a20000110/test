import React, { useEffect, useState } from "react";
import "swiper/swiper-bundle.css";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { GqlProductBySlugNodeInterface, GqlProductCategoriesEdges } from "@/lib/types/gql/product/product-by-slug.type";
import ImageGallery from "@/components/Product/imageGallery";
import Information from "@/components/Product/information";
import Describe from "@/components/Product/describe";
import { useProductStore } from "@/lib/store/product.store";
import RecentlyViewed from "@/components/Product/recentlyViewed";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import HeadSeo from "@/components/Seo/head-seo";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import { getAllProductSlug, SlugInterface } from "@/lib/hooks/useGetProductSlug";
import { getLang, getStaticLocalePaths, handlerPathSlug, translatePostSEO } from "@/lib/utils/util";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { translateStaticProps } from "@/lib/utils/translate-util";

SwiperCore.use([Navigation, Autoplay, Pagination]);
type Props = {
  seo: PageSeoInterface | null;
  slug: string;
  tranSlug: string;
  product: GqlProductBySlugNodeInterface | null;
  productCateMenus: { slug: string; name: string }[]
}

// 排序产品分类
const orderProductCategories = (categories: GqlProductCategoriesEdges[]) => {
  // 计算每个节点的深度
  function calculateDepth(node: any, depth = 0): any {
    if (node.parent) {
      return calculateDepth(node.parent.node, depth + 1);
    } else {
      return depth;
    }
  }

// 获取每个节点的深度
  const nodesWithDepth = categories.map(({ node }) => ({
    node,
    depth: calculateDepth(node)
  }));

// 按深度从小到大排序
  nodesWithDepth.sort((a, b) => a.depth - b.depth);

// 提取节点
  return nodesWithDepth.map(({ node }) => {
    return {
      slug: node.slug,
      name: node.name
    };
  });
};

function Page(props: Props) {
  const { setRecentlyViewed } = useProductStore();
  const [product, setProduct] = useState<GqlProductBySlugNodeInterface | null>(null);
  useEffect(() => {
    if (props.slug) {
      setRecentlyViewed(props.slug);
    }
    if (props.product) {
      setProduct(props.product);
    }
  }, [props]);

  const t = useTranslations();
  return <>
    <HeadSeo seo={props?.seo?.data} />
    <div>
      <div className="container pt-16 max-md:pt-8">
        <nav className="s-flex text-sm gap-x-3">
          <Link href="/" className="text-mainText hover:!text-main duration-300">{t("common.Home")}</Link>
          <span className="text-mainText">/</span>
          {
            !props.productCateMenus?.length && <>
              <Link href="/product" className="text-mainText hover:!text-main duration-300">{t("common.Product")} </Link>
              <span className="text-mainText">/</span>
            </>
          }
          {
            !!props.productCateMenus?.length ? <>{
              props.productCateMenus.map((item, index) => {
                return <div key={index}>
                  <Link href={`/${item.slug}`}
                        className="text-mainText hover:!text-main duration-300">{item.name} </Link>
                  <span className="text-mainText">/</span>
                </div>;
              })
            }</> : ""
          }
          <span className="line-clamp-1">{props.tranSlug}</span>
        </nav>
      </div>
      <div className="grid grid-cols-2 max-md:grid-cols-1 container py-16 gap-x-6 max-md:py-8">
        <ImageGallery product={product} />
        <Information product={product} />
      </div>
      <div className="container py-8">
        <Describe {...product!} />
      </div>
      <div className="container py-8">
        <RecentlyViewed />
      </div>
    </div>
  </>;
}

export default React.memo(Page);
export const getStaticPaths = async () => {
  const slugs: SlugInterface[] = [];
  const pathsData = await getAllProductSlug(1, 1, slugs);
  const paths = getStaticLocalePaths(
    {
      paths: pathsData,
      fallback: "blocking"
    } as GetStaticPathsResult
  );

  console.log(paths.paths.length, "product.length");
  return paths;
};

export const getStaticProps = async (context: GetStaticPropsContext<{ slug: string }>) => {
  const slug = handlerPathSlug(context.params!.slug);
  // const promise = Promise.all([
  //   client.query<GqlProductBySlugInterface>({
  //     query: PRODUCT_BY_SLUG,
  //     variables: {
  //       slug: slug
  //     }
  //   }),
  //   translatePostSEO(slug, context.locale),
  //   getLang(context.locale),
  //   translateStaticProps([{ slug }], ["slug"], "auto", context.locale)
  // ]);
  // const [{ data }, seo, messages, tranSlug] = await promise;
  // if (!data?.product) throw new Error("The product cannot be found");
  // const node = data?.product;
  // const keys = ["name"];
  // node?.shortDescription && keys.push("shortDescription");
  // node?.description && keys.push("description");
  // node?.productCategories?.edges[0].node.name && keys.push("productCategories.edges[].node.name");
  // node?.attributes?.nodes?.length && keys.push(...["attributes.nodes[].label"]);
  // const product = JSON.parse(JSON.stringify(data?.product ? (await translateStaticProps([data.product], keys, "auto", context.locale))[0] : data.product));
  // if (product?.variations?.nodes?.length) {
  //   product.variations.nodes = await translateStaticProps(product.variations.nodes, ["attributes.nodes[].label"], "auto", context.locale);
  // }
  // let productCateMenus = [];
  // if (node?.productCategories?.edges?.length) {
  //   const cateMenus = orderProductCategories(node.productCategories.edges);
  //   if (cateMenus.length) {
  //     productCateMenus = await translateStaticProps(cateMenus, ["name"], "auto", context.locale);
  //   }
  // }
  // return {
  //   props: {
  //     slug,
  //     tranSlug: tranSlug[0]?.slug || slug,
  //     seo,
  //     product: product,
  //     messages: messages,
  //     productCateMenus
  //   },
  //   revalidate: REVA_DATE
  // };
  const promise = await Promise.all([
    translatePostSEO(slug, context.locale),
    getLang(context.locale),
    translateStaticProps([{ slug }], ["slug"], "auto", context.locale)
    // getLang(context.locale),
    // translateStaticProps([{ slug }], ["slug"], "auto", context.locale)
  ]);
  const [seo, messages, tranSlug] = promise;
  return {
    props: {
      seo,
      messages,
      tranSlug
    }
  };
};
