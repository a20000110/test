import { Breadcrumb } from "@/components/Breadcrumbs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client from "@/lib/ApolloClient/apolloClient";
import { HEADER_POST_SEARCH } from "@/lib/queries/post-by-name";
import { GqlHeaderSearchPostInterface } from "@/lib/types/gql/post/header-post-search.type";
import { GqlPostsNodeInterface } from "@/lib/types/gql/post/post.type";
import { Spaces } from "@/components/Spaces";
import { RingLoader } from "react-spinners";
import PostCard from "@/components/Post/post-card";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import { useLocale, useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { pageStaticProps } from "@/lib/utils/util";
import { translateStaticProps } from "@/lib/utils/translate-util";

export default function Search({ seo }: {
  seo: PageSeoInterface | null
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<GqlPostsNodeInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const fetchData = async (q: string, cursor?: string) => {
    try {
      !cursor ? setLoading(true) : setFetching(true);
      const { data } = await client.query<GqlHeaderSearchPostInterface>({
        query: HEADER_POST_SEARCH,
        variables: {
          search: q,
          size: 4,
          cursor: cursor || ""
        }
      });
      if (data?.posts?.nodes.length) {
        const nodes = await translateStaticProps(data.posts.nodes, ["title", "categories.nodes[].name"], "auto", locale);
        setPosts(val => {
          return [...val, ...(nodes.length ? nodes : data.posts.nodes)];
        });
        if (data.posts.pageInfo.hasNextPage) {
          setEndCursor(data.posts.pageInfo.endCursor);
        } else {
          setHasMore(false);
        }
      }
    } finally {
      !cursor ? setLoading(false) : setFetching(false);
    }
  };
  useEffect(() => {
    if (router?.query?.q) {
      setQuery(router.query.q as string);
      fetchData(router.query.q as string);
    }
  }, [router?.query?.q]);
  return <>
    <HeadSeo seo={seo?.data} />
    <Breadcrumb name={t("common.Search")} />
    <Spaces size="lg" />
    {
      router.query.q ?
        (
          !loading ? (!!posts.length ? <div className="grid container lg:grid-cols-4 grid-cols-2 gap-8 max-md:gap-4">
              {
                posts.map(p => (<PostCard post={p} key={p.databaseId} />))
              }
            </div> : <EmptyState />) :
            <div className="c-flex flex-col">
              <Spaces size="lg" />
              <RingLoader className="text-main" />
              <Spaces size="lg" />
            </div>
        ) : <EmptyState />
    }
    <Spaces size="lg" />
    <div className="c-flex">
      {
        !fetching ? (!loading && hasMore && router.query.q && !!posts.length &&
            <Button onClick={() => fetchData(query, endCursor)}>{t("common.Show_More")}</Button>) :
          <RingLoader className="text-main" />
      }
    </div>
    <Spaces size="lg" />
  </>;
}


export const getServerSideProps = async (context: GetStaticPropsContext) => {
  const page_id = 6;
  return await pageStaticProps({
    page_id,
    locale: context.locale
  });
};
