import { GetStaticPaths, GetStaticPathsResult, GetStaticPropsContext } from "next";
import client from "@/lib/ApolloClient/apolloClient";
import { POST_TAGS } from "@/lib/queries/post-tags";
import { GqlPostTagsInterface } from "@/lib/types/gql/post/post-tags.type";
import { GqlHeaderSearchPostInterface } from "@/lib/types/gql/post/header-post-search.type";
import { HEADER_POST_SEARCH } from "@/lib/queries/post-by-name";
import { GqlPostsSubInterface } from "@/lib/types/gql/post/post.type";
import PostList from "@/components/Post/post-list";
import React, { useEffect } from "react";
import { REVA_DATE } from "@/lib/constants";
import { getMenuHeadSeo } from "@/lib/hooks/useGetSeo";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import { getLang, getNavProducts, getStaticLocalePaths, handlerPathSlug } from "@/lib/utils/util";
import { translateStaticProps } from "@/lib/utils/translate-util";

const size = 8;

type Props = {
  slug: string;
  posts: GqlPostsSubInterface | null;
  seo: PageSeoInterface | null;
}

export default function BlogTags(props: Props) {
  return <>
    <HeadSeo seo={props?.seo?.data} />
    <PostList {...props} size={size} />
  </>;
}

export const getStaticProps = async (context: GetStaticPropsContext<{ slug: string }>) => {
  const slug = handlerPathSlug(context.params!.slug);
  const promise = await Promise.all([
    client.query<GqlHeaderSearchPostInterface>({
      query: HEADER_POST_SEARCH,
      variables: {
        tag: slug,
        size: size
      }
    }),
    translateStaticProps([{ slug }], ["slug"], "auto", context.locale),
    getLang(context.locale)
  ]);
  const [{ data }, tranSlug, messages] = promise;
  if (slug) {
    const nodes = data.posts.nodes.length ? await translateStaticProps(data.posts.nodes, ["title", "categories.nodes[].name"], "auto", context.locale) : data.posts.nodes;
    if (!nodes) throw new Error("Post not found");
    return {
      props: {
        slug,
        posts: {
          ...data.posts,
          nodes: nodes
        },
        seo: getMenuHeadSeo(tranSlug?.at(-1)?.slug || slug),
        messages,
      },
      revalidate: REVA_DATE
    };
  }
};


export const getStaticPaths = async () => {
  const { data } = await client.query<GqlPostTagsInterface>({
    query: POST_TAGS
  });
  const pathsData: { params: { slug: string; }; }[] = [];
  data?.tags?.nodes && data?.tags?.nodes.slice(0,1).map((tag) => {
    if (!!tag.slug) {
      pathsData.push({ params: { slug: tag?.slug } });
    }
  });
  return getStaticLocalePaths({
    paths: pathsData,
    fallback: "blocking"
  } as GetStaticPathsResult);
};
