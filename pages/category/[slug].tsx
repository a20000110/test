import React from "react";
import client from "@/lib/ApolloClient/apolloClient";
import { HEADER_POST_SEARCH } from "@/lib/queries/post-by-name";
import { GqlHeaderSearchPostInterface } from "@/lib/types/gql/post/header-post-search.type";
import { GqlPostsSubInterface } from "@/lib/types/gql/post/post.type";
import { POST_CATEGORIES } from "@/lib/queries/post-categories";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import PostList from "@/components/Post/post-list";
import { REVA_DATE } from "@/lib/constants";
import { GqlPostCategoriesInterface } from "@/lib/types/gql/post/post-categories.type";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import { getPostCateSeo } from "@/lib/hooks/useGetSeo";
import { getLang, getNavProducts, getStaticLocalePaths, handlerPathSlug } from "@/lib/utils/util";
import PostAndProductBanner from "@/components/PostAndProductBanner";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { useTranslations } from "next-intl";

const size = 8;
type Props = {
  slug: string;
  posts: GqlPostsSubInterface | null,
  seo: PageSeoInterface | null,
  banner: string;
}

export default function CategorySlug(props: Props) {
  const t = useTranslations();
  return <>
    <HeadSeo seo={props?.seo?.data} />
    <PostAndProductBanner name={`${t("common.Category")}: ${props?.seo?.data?.title || props.slug}`}
                          banner={props.banner} />
    <PostList {...props} size={size} />
  </>;
}

export const getStaticProps = async (context: GetStaticPropsContext<{
  slug: string
}>) => {
  const slug = handlerPathSlug(context.params!.slug);
  if (slug) {
    const promise = await Promise.all([
      client.query<GqlHeaderSearchPostInterface>({
        query: HEADER_POST_SEARCH,
        variables: {
          category: slug,
          size: size
        }
      }),
      getLang(context.locale),
      getPostCateSeo(slug, context.locale)
    ]);
    let posts: any = null;
    posts = promise[0]?.data?.posts || null;
    let newPosts: any = null;
    if (posts) {
      newPosts = await translateStaticProps(posts.nodes, ["excerpt", "title", "categories.nodes[].name"], "auto", context.locale);
      if (newPosts.length) {
        newPosts = {
          pageInfo: posts.pageInfo,
          nodes: newPosts
        };
      }
    }
    const newSlug = await translateStaticProps([{ slug }], ["slug"], "auto", context.locale);
    return {
      props: {
        slug: newSlug.length ? newSlug[0].slug : slug,
        posts: newPosts,
        seo: promise[2].seo,
        messages: promise[1],
        banner: promise[2].banner
      },
      revalidate: REVA_DATE
    };
  }
};

export const getStaticPaths = async () => {
  const { data } = await client.query<GqlPostCategoriesInterface>({
    query: POST_CATEGORIES
  });
  const pathsData: {
    params: {
      slug: string;
    };
  }[] = [];
  data?.categories?.nodes && data?.categories?.nodes.map((c) => {
    if (!!c.slug) {
      pathsData.push({ params: { slug: c?.slug } });
    }
  });
  return getStaticLocalePaths(
    {
      paths: pathsData,
      fallback: "blocking"
    } as GetStaticPathsResult
  );
};
