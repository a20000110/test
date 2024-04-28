import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import axios from "axios";
import { cApiUrl, defaultLocale } from "@/lib/utils/util";
import { translateStaticProps } from "@/lib/utils/translate-util";

export const getPageHeadSeo = async (page_id: number | string): Promise<PageSeoInterface | null> => {
  try {
    const res = await axios.get(cApiUrl + "/api/seo/get-page-seo?page_id=" + page_id);
    if (res.status === 200 && res?.data?.code === 200 && res?.data?.data) {
      return res.data.data;
    }
    throw new Error("Error");
  } catch (e) {
    console.error("getPageHeadSeo Error:", e);
    return null;
  }
};

export const getPostHeadSeo = async (slug: string): Promise<PageSeoInterface | null> => {
  try {
    const res = await axios.get(cApiUrl + "/api/seo/get-post-seo?slug=" + slug);
    if (res.status === 200 && res?.data?.code === 200 && res?.data?.data) {
      return res.data.data;
    }
    throw new Error("Error");
  } catch (e) {
    console.log(e,'seo');
    return null;
  }
};

export const getMenuHeadSeo = (slug: string) => {
  return {
    data: {
      title: `${slug}`,
      description: "",
      keywords: {
        related_keywords: []
      }
    }
  };
};

export const getProductCateSeo = async (slug: string, locale?: string) => {
  try {
    const seoResult = await axios.get<any>(`${cApiUrl}/api/page/product-cate-seo/get?slug=${slug}`);
    let seo = getMenuHeadSeo(slug);
    let banner = "";
    if (seoResult.data.code === 200) {
      seo.data = seoResult.data.data.seo;
      banner = seoResult.data.data.banner;
    }
    if (locale) {
      const keys: string[] = [];
      seo.data.title && keys.push("title");
      seo.data.description && keys.push("description");
      seo.data.keywords && seo.data.keywords.related_keywords.length && keys.push("keywords.related_keywords[]");
      if (keys.length) {
        const newSeo = await translateStaticProps([seo.data], keys, "auto", locale || defaultLocale);
        (newSeo && newSeo.length) ? (seo.data = newSeo[0]) : null;
      }
    }
    return {
      seo,
      banner
    };
  } catch (e: any) {
    return {
      seo: null,
      banner: ""
    };
  }
};

export const getPostCateSeo = async (slug: string, locale?: string) => {
  try {
    const seoResult = await axios.get<any>(`${cApiUrl}/api/page/post-cate-seo/get?slug=${slug}`);
    let seo = getMenuHeadSeo(slug);
    let banner = "";
    if (seoResult.data.code === 200) {
      seo.data = seoResult.data.data.seo;
      banner = seoResult.data.data.banner;
    }
    if (locale) {
      const keys: string[] = [];
      seo.data.title && keys.push("title");
      seo.data.description && keys.push("description");
      seo.data.keywords && seo.data.keywords.related_keywords.length && keys.push("keywords.related_keywords[]");
      if (keys.length) {
        const newSeo = await translateStaticProps([seo.data], keys, "auto", locale || defaultLocale);
        (newSeo && newSeo.length) ? (seo.data = newSeo[0]) : null;
      }
    }
    return {
      seo,
      banner
    };
  } catch (e: any) {
    return {
      seo: null,
      banner: ""
    };
  }
};
