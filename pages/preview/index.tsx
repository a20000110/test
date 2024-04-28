import { useEffect, useState } from "react";
import Head from "next/head";
import { REVA_DATE } from "@/lib/constants";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { getLang, getNavProducts } from "@/lib/utils/util";
import { useLocale } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";

const getHtmlLang = async (html: string, locale: string) => {
  const newHtml = await translateStaticProps([{ html }], ["html"], "auto", locale);
  return newHtml?.at(-1)?.html || html;
};

export default function Preview() {
  const [contentHtml, setContentHtml] = useState<string>("");
  const locale = useLocale();
  useEffect(() => {
    const html = window.sessionStorage.getItem("content");
    html && getHtmlLang(html, locale).then(res => {
      res && setContentHtml(decodeURIComponent(res));
    });
  }, []);
  return <>
    <Head>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://cdn.tailwindcss.com"></script>
    </Head>
    <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
  </>;
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
      messages:await  getLang(context.locale)
    },
    revalidate: REVA_DATE
  };
};
