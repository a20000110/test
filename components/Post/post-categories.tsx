import { BodyText } from "@/components/BodyText";
import client from "@/lib/ApolloClient/apolloClient";
import { GqlPostCategoriesInterface, GqlPostCategoriesNodeInterface } from "@/lib/types/gql/post/post-categories.type";
import { POST_CATEGORIES } from "@/lib/queries/post-categories";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { PostDataType } from "@/pages/blog";

export const empty3Arr = Array.from({ length: 3 });
type Props = {
  cate: PostDataType["categories"]
}

function PostCategories({ cate }: Props) {
  const t = useTranslations();
  return <div className="border rounded p-7 shadow">
    <BodyText intent="medium" size="xl"
              className="text-thmeBlackLight mb-6">{t("post.2bc04df77fc9c84dd24a4699b5f8e5909087")}</BodyText>
    <ul className="space-y-2">
      {
        cate?.map((c) => {
          return <li key={c.slug}>
            <Link href={`/category/${c.slug}`}>
              <div className="b-flex my-2 text-themeGray hover:text-main">
                <BodyText size="lg">
                  {c.name} ({c.count || 0})
                </BodyText>
                <i className="ri-arrow-right-s-line ri-xl"></i>
              </div>
              <div className="border h-[1px] w-full"></div>
            </Link>
          </li>;
        })
      }
    </ul>
  </div>;
}

export default React.memo(PostCategories);
