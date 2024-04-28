import { GqlPostRecentInterface, GqlPostRecentNodeInterface } from "@/lib/types/gql/post/post-recent.type";
import React, { useEffect, useState } from "react";
import client from "@/lib/ApolloClient/apolloClient";
import { POSTS_RECENT } from "@/lib/queries/post-recent";
import { empty3Arr } from "@/components/Post/post-categories";
import Skeleton from "react-loading-skeleton";
import { Placeholder } from "@/components/Placeholder";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { PostDataType } from "@/pages/blog";
type Props = {
  recent: PostDataType["recent"]
}
function PostRecent({recent}:Props) {
  const t = useTranslations();
  return <>
    <h3
      className="text-xl md:text-2xl sm:leading-8 font-sans font-semibold text-thmeBlackLight mb-6">{t("post.Recent_Posts")}</h3>
    <ul className="space-y-4">
      {
        recent?.map(p => {
          return <li key={p.slug} className="flex gap-5 items-center border rounded shadow p-3 mb-4">
            <div className="w-[100px] h-[100px] flex-shrink-0">
              <Placeholder
                src={p.featuredImage?.node?.sourceUrl || ""} imageHeight={100}
                imageWidth={100} />
            </div>
            <div>
              <Link href={`/blog/${p.slug}`} className="text-lg line-clamp-2 text-themeSecondary800">
                {p.title}
              </Link>
              <div className="text-xs mt-2">
                <span className="text-themeSecondary400">BY:</span>
                <span
                  className="text-themePrimary600">{process.env.NEXT_PUBLIC_COMPANY_NAME}</span>
              </div>
            </div>
          </li>;
        })
      }
    </ul>
  </>;
}

export default React.memo(PostRecent);
