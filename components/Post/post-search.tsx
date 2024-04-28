import { BodyText } from "@/components/BodyText";
import React, { useRef } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

function PostSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const handlerSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      query();
    }
  };
  const query = () => {
    const value = inputRef.current?.value;
    value && router.push(`/blog/search?q=${value}`);
  };
  const t = useTranslations();
  return <div className="border rounded p-7 shadow">
    <BodyText intent="medium" size="xl" className="text-thmeBlackLight mb-6">{t("common.Search")}</BodyText>
    <div className="flex items-center">
      <input type="text" ref={inputRef} onKeyDown={handlerSearch}
             className="focus:outline-none bg-themWhite w-full px-5 h-14 rounded-l-lg"
             placeholder={t("post.5304b284538c9f4012a8aa7e98c2614abbb2")} />
      <button className="bg-main h-14 w-14 rounded-r-lg" onClick={query}>
        <i className="ri-search-line text-white ri-xl"></i>
      </button>
    </div>
  </div>;
}

export default React.memo(PostSearch);
