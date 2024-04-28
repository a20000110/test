import Head from "next/head";
import React from "react";

export default function HeadSeo({ seo }: {
  seo?: {
    [key: string]: any
  }
}) {
  if (!seo) {
    return null;
  }
  const keywords = () => {
    if (seo?.keywords?.related_keywords?.length) {
      return seo.keywords.related_keywords.join(",");
    }
    return "";
  };
  return <Head>
    {seo.title && <title>{`${seo.title} - ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>}
    {seo.description && <meta name="description" content={seo.description} />}
    {keywords() && <meta name="keywords" content={keywords()} />}
  </Head>;
}
