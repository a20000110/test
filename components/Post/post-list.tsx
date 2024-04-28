import { GqlPostsNodeInterface, GqlPostsSubInterface } from "@/lib/types/gql/post/post.type";
import React, { useEffect, useState } from "react";
import client from "@/lib/ApolloClient/apolloClient";
import { GqlHeaderSearchPostInterface } from "@/lib/types/gql/post/header-post-search.type";
import { HEADER_POST_SEARCH } from "@/lib/queries/post-by-name";
import { Breadcrumb } from "@/components/Breadcrumbs";
import { Spaces } from "@/components/Spaces";
import PostCard from "@/components/Post/post-card";
import EmptyState from "@/components/EmptyState";
import { RingLoader } from "react-spinners";
import { Button } from "@/components/Button";
import { useTranslations } from "next-intl";

type Props = {
  slug: string;
  posts: GqlPostsSubInterface | null;
  size: number
}
export default function PostList(props: Props) {
  const t = useTranslations();
  const [slug, setSlug] = useState<string>(props.slug);
  const [posts, setPosts] = useState<GqlPostsNodeInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);


  const fetchData = async (category: string, cursor?: string) => {
    try {
      !cursor ? setLoading(true) : setFetching(true);
      const { data } = await client.query<GqlHeaderSearchPostInterface>({
        query: HEADER_POST_SEARCH,
        variables: {
          category,
          size: props.size,
          cursor: cursor || ""
        }
      });
      if (data?.posts?.nodes.length) {
        setPosts(val => {
          return [...val, ...data.posts.nodes];
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
    props.slug && setSlug(props.slug);
    if (props.posts && props?.posts?.pageInfo?.offsetPagination.total) {
      setPosts(props.posts.nodes);
      if (props.posts.pageInfo.hasNextPage) {
        setEndCursor(props.posts.pageInfo.endCursor);
      } else {
        setHasMore(false);
      }
    }
  }, [props]);
  return <>
    <Spaces size="lg" />
    {
      slug ?
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
        !fetching ? (!loading && hasMore && slug && !!posts.length &&
            <Button onClick={() => fetchData(slug, endCursor)}>{t("common.Show_More")}</Button>) :
          <RingLoader className="text-main" />
      }
    </div>
    <Spaces size="lg" />
  </>;
}
