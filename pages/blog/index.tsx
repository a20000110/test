import PostLayout from "@/components/Layout/post-layout";
import PostCard from "@/components/Post/post-card";
import client from "@/lib/ApolloClient/apolloClient";
import { POST } from "@/lib/queries/post";
import React, { useEffect, useState } from "react";
import { GqlPostsInterface, GqlPostsNodeInterface, GqlPostsSubInterface } from "@/lib/types/gql/post/post.type";
import { Button } from "@/components/Button";
import { RingLoader } from "react-spinners";
import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import { getPageHeadSeo } from "@/lib/hooks/useGetSeo";
import { useLocale, useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { defaultLocale, getLang, getNavProducts, getPostLayoutData } from "@/lib/utils/util";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { GqlPostCategoriesNodeInterface } from "@/lib/types/gql/post/post-categories.type";
import { GqlPostRecentNodeInterface } from "@/lib/types/gql/post/post-recent.type";
import { GqlPostTagsNodeInterface } from "@/lib/types/gql/post/post-tags.type";

export type PostDataType = {
  categories: GqlPostCategoriesNodeInterface[],
  recent: GqlPostRecentNodeInterface[],
  tags: GqlPostTagsNodeInterface[]
}

type GetPostData = {
  first?: number,
  after?: string,
  categoryName?: string,
  locale?: string;
}
export const getPostData = async ({
                                    first = 4,
                                    after = "",
                                    categoryName = "",
                                    locale = defaultLocale
                                  }: GetPostData) => {
  const { data: { posts } } = await client.query<GqlPostsInterface>({
    query: POST,
    variables: {
      first,
      after,
      categoryName
    }
  });
  if (locale === defaultLocale) {
    return posts;
  } else if (posts?.nodes?.length) {
    const nodes = await translateStaticProps(posts.nodes, ["title", "categories.nodes[].name", "excerpt"], "auto", locale);
    if (nodes.length) {
      return {
        ...posts,
        nodes: nodes
      };
    }
  }
  return posts;
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const promise = await Promise.allSettled([
    getPostData({
      first: 6,
      locale: context.locale
    }),
    getPageHeadSeo(3),
    getLang(context.locale)
  ]);
  const posts = promise[0].status === "fulfilled" ? promise[0].value : null;
  return {
    props: {
      posts,
      endCursor: posts?.pageInfo?.endCursor || "",
      seo: promise[1].status === "fulfilled" ? promise[1].value : null,
      messages: promise[2].status === "fulfilled" ? promise[2].value : undefined,
      postData: {
        ...await getPostLayoutData(context.locale)
      }
    },
    revalidate: REVA_DATE
  };
};

type Props = {
  posts: GqlPostsSubInterface;
  seo: PageSeoInterface | null;
  postData: PostDataType
}

function Blog(props: Props) {
  const [posts, setPosts] = useState<GqlPostsNodeInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState<string>(props.posts.pageInfo.endCursor);
  const [hasMore, setHasMore] = useState<boolean>(props.posts.pageInfo.hasNextPage);
  const locale = useLocale();
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPostData({
        after: endCursor,
        locale,
        first: 12
      });
      setEndCursor(data.pageInfo.endCursor);
      setHasMore(data.pageInfo.hasNextPage);
      setPosts([...posts, ...data.nodes]);
    } finally {
      setLoading(false);
    }
  };
  const t = useTranslations();
  useEffect(() => {
    setPosts(props.posts.nodes);
  }, [props.posts]);
  return <>
    <HeadSeo seo={props?.seo?.data} />
    <PostLayout postData={props.postData}>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-7 col-span-12 lg:col-span-7">
          {
            posts?.map((post: any) => <PostCard key={post.databaseId} post={post} />)
          }
        </div>
        <div className="c-flex my-8">
          {
            !loading ? (hasMore && <Button size="md" onClick={fetchData}>{t("common.Show_More")}</Button>) :
              <RingLoader className="text-main" />
          }
        </div>
      </div>
    </PostLayout>
  </>;
}

export default React.memo(Blog);
