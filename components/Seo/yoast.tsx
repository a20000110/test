import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import { YoastJsonInterface } from "@/lib/types/rest-api/seo/yoast.type";

type SeoProps = {
  seo:YoastJsonInterface | null
}
const SEO = (props?: SeoProps) => {
  const router = useRouter();
  if (props?.seo) {
    const {
      title,
      description,
      robots,
      canonical,
      og_locale,
      og_image,
      og_type,
      og_title,
      og_description,
      og_url,
      og_site_name,
      article_published_time,
      article_modified_time,
      author,
      twitter_card,
      twitter_misc,
      schema
    } = props.seo;
    const currentLinkStr = decodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + router.asPath);
    const headTitle = (titleStr: string) => {
      if (process.env.NEXT_PUBLIC_COMPANY_NAME) {
        return `${titleStr.split(" - ")[0]} - ${process.env.NEXT_PUBLIC_COMPANY_NAME}`;
      } else {
        return titleStr;
      }
    };
    return (
      <Head>
        <title>{headTitle(title)}</title>
        <meta name="description" content={description || og_description || ""} />
        {robots && <meta name="robots" content={`${robots.index}, ${robots.follow}`} />}
        <link rel="canonical" href={currentLinkStr} />
        <meta property="og:locale" content="en_US" />
        {og_type && <meta property="og:type" content={og_type} />}
        {og_title && <meta property="og:title" content={headTitle(og_title)} />}
        {og_description && <meta property="og:description" content={og_description} />}
        {og_url && <meta property="og:url" content={currentLinkStr} />}
        {og_image && <meta property="og:image" content={og_image[0].url} />}
        <meta property="og:site_name" content={process.env.NEXT_PUBLIC_COMPANY_NAME} />
        {article_published_time && <meta property="article:published_time" content={article_published_time} />}
        {article_modified_time && <meta property="article:modified_time" content={article_modified_time} />}
        {author && <meta name="author" content={author} />}
        {twitter_card && <meta name="twitter:card" content={twitter_card} />}
        {twitter_misc && Object.entries(twitter_misc).map(([key, value], index) => (
          <React.Fragment key={index}>
            <meta name={`twitter:label${index + 1}`} content={key} />
            <meta name={`twitter:data${index + 1}`} content={value} />
          </React.Fragment>
        ))}
        {/*{schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}*/}
      </Head>
    );
  }
  return null;
};

export default SEO;
