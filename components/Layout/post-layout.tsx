import React from "react";
import { Spaces } from "@/components/Spaces";
import PostFilter from "@/components/Post/post-filter";
import PostMobileFilter from "@/components/Post/post-mobile-filter";
import { useTranslations } from "next-intl";
import { PostDataType } from "@/pages/blog";

export default function PostLayout({ children, title, postData }: {
  children: React.ReactNode,
  title?: string,
  postData: PostDataType
}) {
  const t = useTranslations();
  return <>
    <div
      className="w-full h-[300px] bg-[url('/image/bolg—banner.jpg')] bg-cover bg-no-repeat max-md:h-[180px] max-md:bg-center">
      <div className="container s-flex h-full">
        <p className="text-5xl font-bold text-white">{t("common.Blog")}</p>
      </div>
    </div>
    <Spaces size="md" />
    <div className="c-flex lg:!hidden container">
      <PostMobileFilter postData={postData} />
    </div>
    <section className="container mb-7 flex gap-7 items-start">
      <div className="w-full">
        {children}
      </div>
      <div className="hidden lg:block w-[45%] ">
        <PostFilter postData={postData} />
      </div>
    </section>
  </>;
}
