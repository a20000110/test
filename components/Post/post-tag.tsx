import { BodyText } from "@/components/BodyText";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PostDataType } from "@/pages/blog";

type Props = {
  tags: PostDataType["tags"]
}

function PostTag({ tags }: Props) {
  const t = useTranslations();
  if (!tags.length) return null;
  return <div className="border rounded p-7 shadow">
    <BodyText intent="medium" size="xl" className="text-thmeBlackLight mb-6">{t("common.Tags")}</BodyText>
    {
      <div className="s-flex flex-wrap gap-3">
        {
          tags.map((tag, index) => {
            return <Link href={`/tag/${tag.slug}`} key={index}
                         className="border hover:border-main hover:text-main duration-300 py-2 px-3 rounded-3xl text-themeSecondary400">
              {tag.name}
            </Link>;
          })
        }
      </div>
    }
  </div>;
}

export default React.memo(PostTag);
