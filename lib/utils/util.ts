import { GetStaticPathsResult, NextApiResponse } from "next";
import { ObserveElementFunction } from "@/lib/types/utils.type";
import { YoastJsonInterface } from "@/lib/types/rest-api/seo/yoast.type";
import axios from "axios";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { getPageHeadSeo, getPostHeadSeo } from "@/lib/hooks/useGetSeo";
import { getPageContentCode } from "@/lib/hooks/useGetPageCode";
import { getInquiryFormFields } from "@/components/Form/Inquiry/submit-form";
import client from "@/lib/ApolloClient/apolloClient";
import { GqlPostCategoriesInterface } from "@/lib/types/gql/post/post-categories.type";
import { POST_CATEGORIES } from "@/lib/queries/post-categories";
import { GqlPostRecentInterface } from "@/lib/types/gql/post/post-recent.type";
import { POSTS_RECENT } from "@/lib/queries/post-recent";
import { GqlPostTagsInterface } from "@/lib/types/gql/post/post-tags.type";
import { POST_TAGS } from "@/lib/queries/post-tags";
import { PostDataType } from "@/pages/blog";
import {
  GqlProductCategoriesParentInterface,
  GqlProductCategoriesParentNode2Interface
} from "@/lib/types/gql/product/product-categories-parent.type";
import { GET_PRODUCT_CATEGORIES_PARENT } from "@/lib/queries/product-categories-parent";
import lang from "@/languagePack.json";
import { CATE_MENUS, GqlProductCateMenus } from "@/lib/queries/nav-product";
import { GqlNavProductsInterface } from "@/lib/types/gql/product/nav-product.type";

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

export const setCorsHeaders = (res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // 注意：这允许任何源
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

export function observeElementIntersection(className: string, enter: ObserveElementFunction, leave?: ObserveElementFunction) {
  const elements = document.querySelectorAll(`${className}`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        enter(entry.target);
      } else {
        leave && leave(entry.target);
      }
    });
  });

  elements.forEach((element) => {
    observer.observe(element);
  });
}

// 设置html的overflow
export function setOverflow(overflow: string) {
  document.documentElement.style.overflow = overflow;
}

export const defaultLocale = "en";

// 防抖函数
export function debounce(fn: Function, delay: number) {
  let timer: any = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, delay);
  };
}

// 传递多个数组然后传递字段根据字段去重
export function uniqueArray(arr: any[], key: string): any[] {
  const map = new Map();
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!map.has(item[key])) {
      map.set(item[key], true);
      result.push(item);
    }
  }
  return result;
}


// 用于拆分wordpress产品图片，并重组
export const splitImgSrc = (link: string, splicing: string) => {
  if (link && link.includes("/")) {
    const splitLink = link.split("/");
    const last = splitLink.at(-1)?.split(".");
    const fileName = last?.[0] + splicing + "." + last?.at(-1);
    const newLink = splitLink.slice(0, splitLink.length - 1);
    newLink.push(fileName);
    return newLink.join("/");
  }
  return link;
};

// 计算产品折扣
export const getDiscount = (price: string, regularPrice: string) => {
  const normalPrice = convertPriceToNumber(price);
  const RegularPrice = convertPriceToNumber(regularPrice);
  if (price && regularPrice) {
    const discount = Math.round(((normalPrice - RegularPrice) / normalPrice) * 100);
    return discount > 0 ? discount + "%" : 0;
  }
  return 0;
};

export const isDev = process.env.NODE_ENV === "development";

export function convertPriceToNumber(priceString: string): number {
  if (!priceString) return 0;
  if (isNaN(+priceString[0])) {
    priceString = priceString.replace(/[^0-9.]/g, "");
  }

  return parseFloat(priceString);
}

export function formatPrice(price: string) {
  const newPrice = convertPriceToNumber(price);
  return newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getYoastSeoHead(url: string): Promise<{
  status: number;
  json: YoastJsonInterface
}> {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/yoast/v1/get_head?url=${url}`);
    resolve(await res.json());
  });
}

export const cApiUrl = isDev ? "http://localhost:" + process.env.NEXT_PUBLIC_PROD : process.env.NEXT_PUBLIC_SITE_URL;
// export const cApiUrl = "http://localhost:" + process.env.NEXT_PUBLIC_PROD;

// 处理后台数据 需要innerHTML的参数
export const handlerInnerHtml = (html: string): string => {
  if (!html) return html;
  return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#8216;/g, "‘").replace(/&#8217;/g, "’").replace(/&#8211;/g, "–").replace(/&nbsp;/g, " ");
};

// 判断字符串是否是html
export function isHtml(str: string) {
  const reg = /<[^>]+>/g;
  return reg.test(str);
}

// 判断是否是中文
export function isChinese(str: string) {
  const reg = /[\u4e00-\u9fa5]/;
  return reg.test(str);
}

// 处理中文slug
export const handlerPathSlug = (slug: string): string => {
  return isChinese(decodeURIComponent(slug)) ? decodeURIComponent(slug) : slug;
};

// 提取youtube视频链接
export const getYoutubeLink = (url: string) => {
  const reg = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(reg);
  return (match && match[7].length === 11) ? match[7] : "";
};

// 提取vimeo视频链接id
export const getVimeoLink = (url: string): string => {
  const regex = /vimeo\.com\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

// 获取当前地址的url参数
export const getUrlParams = () => {
  return new URLSearchParams(window.location.search);
};


// 获取当前站点类型
export const getSiteTypeIsTob = async () => {
  let type = "tob";
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_SOFT_URL + "/api/pinshop/account/get_site_type", {
      params: {
        domain: new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL as string).hostname
      }
    });
    if (res.status !== 200 || res.data.code !== 1) {
      type = "tob";
    } else {
      type = res.data.data.site_type;
    }
  } catch (e) {
    type = "tob";
  }
  return type === "tob";
};

// 获取语言包
export const getLang = async (locale: string | undefined, key_list?: string[]) => {
  const defaultLang = (await import(`@/lib/constants/lang/en.json`)).default;
  if (!locale || locale === "en") return defaultLang;
  const res = await axios.post(`${process.env.NEXT_PUBLIC_AI_URL}/api/v1/ml_web/get_translate_dict`, {
    domain: new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL as string).hostname,
    language: locale,
    key_list: key_list || []
  });
  if (res.data.code === 200) {
    return res.data.result.data;
  } else {
    return defaultLang;
  }
};


// 翻译博客产品seo
export const translatePostSEO = async (slug: string | null, locale: string | undefined) => {
  if (slug) {
    let seo = await getPostHeadSeo(slug);
    if (!seo || !seo?.data) return null;
    if (!locale || locale === defaultLocale) return seo;
    const keys = [];
    seo.data.title && keys.push("title");
    seo.data.description && keys.push("description");
    seo.data.keywords && seo.data.keywords.related_keywords.length && keys.push("keywords.related_keywords[]");
    if (!keys.length) return seo;
    const newSeo = await translateStaticProps([seo.data], keys, "auto", locale || defaultLocale);
    (newSeo && newSeo.length) ? (seo.data = newSeo[0]) : null;
    return seo;
  }
  return null;
};

// 翻译页面seo
export const translatePageSEO = async (page_id: number | string, locale: string | undefined) => {
  try {
    if (page_id) {
      let seo = await getPageHeadSeo(page_id);
      if (!seo || !seo?.data) return null;
      if (!locale || locale === defaultLocale) return seo;
      const keys = [];
      seo.data.title && keys.push("title");
      seo.data.description && keys.push("description");
      seo.data.keywords.length && keys.push("keywords.related_keywords[]");
      if (!keys.length) return seo;
      const newSeo = await translateStaticProps([seo.data], keys, "auto", locale || defaultLocale);
      newSeo ? (seo.data = newSeo[0]) : null;
      return seo;
    }
    return null;
  } catch (e) {
    return null;
  }
};

// 翻译页面code
export const translatePageCode = async (page_id: number | string, locale: string | undefined) => {
  if (!page_id || !locale) return undefined;
  const page_code = await getPageContentCode(page_id);
  const code = await translateStaticProps([{ page_code }], ["page_code"], "auto", locale);
  return code[0].page_code;
};

// 翻译表单字段
export const translateFormFields = async (locale: string | undefined) => {
  if (!locale) return undefined;
  try {
    const formFields = await getInquiryFormFields();
    return await translateStaticProps(formFields, ["label", "placeholder"], "auto", locale);
  } catch (e) {
    return [];
  }
};

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function(c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case "\"":
        return "&quot;";
      default :
        return c;
    }
  });
}

export const createSitemap = (urls: string[]): string => {
  return `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
    <url>
      <loc>${escapeXml(url)}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>`).join("\n")}
</urlset>`;
};

// 获取nav分类产品
export const getNavProducts = async (locale: string | undefined) => {
  try {
    if (!locale) return;
    const { data } = await client.query<GqlProductCateMenus>({
      query: CATE_MENUS,
      variables: {
        slugs: ["stainless-steel-jewelry", "925-sterling-silver-jewelry", "brass-jewelry", "more-jewelry"]
      }
    });
    const result: GqlNavProductsInterface[] = await translateStaticProps(data.productCategories.nodes, ["name", "cate[].name", "children.nodes[].name", "children.nodes[].children.nodes[].name"], "auto", locale);
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// 获取post-layout的数据
export const getPostLayoutData = async (locale: string | undefined): Promise<PostDataType> => {
  if (!locale) return {
    categories: [],
    recent: [],
    tags: []
  };
  const promise = await Promise.all([
    client.query<GqlPostCategoriesInterface>({
      query: POST_CATEGORIES
    }),
    client.query<GqlPostRecentInterface>({
      query: POSTS_RECENT
    }),
    client.query<GqlPostTagsInterface>({
      query: POST_TAGS
    })
  ]);
  let categories = promise[0];
  let recent = promise[1];
  let tags = promise[2];
  const tranPromise = await Promise.all([
    translateStaticProps(categories.data.categories.nodes, ["name"], "auto", locale),
    translateStaticProps(recent.data.posts.nodes, ["title"], "auto", locale),
    translateStaticProps(tags.data.tags.nodes, ["name"], "auto", locale)
  ]);
  return {
    categories: tranPromise[0],
    recent: tranPromise[1],
    tags: tranPromise[2]
  };
};

// 获取product-filter的数据
export const getProductFilterData = async (locale: string | undefined): Promise<GqlProductCategoriesParentNode2Interface[]> => {
  let productCate: GqlProductCategoriesParentNode2Interface[] = [];
  const getParentCategory = async (array: GqlProductCategoriesParentNode2Interface[], after: string) => {
    const { data } = await client.query<GqlProductCategoriesParentInterface>({
      query: GET_PRODUCT_CATEGORIES_PARENT,
      variables: {
        parent: 0,
        after
      }
    });
    data.productCategories && data.productCategories?.nodes?.length && array.push(...data.productCategories.nodes);
    if (data.productCategories.pageInfo.hasNextPage) {
      await getParentCategory(array, data.productCategories.pageInfo.endCursor);
    } else {
      productCate = data.productCategories.nodes.length ? await translateStaticProps(data.productCategories.nodes, ["name", "children.nodes[].name", "children.nodes[].children.nodes[].name"], "auto", locale) : data.productCategories.nodes;
    }
  };

  await getParentCategory(productCate, "");
  return productCate;
};


export const pageStaticProps = async ({
                                        page_id,
                                        locale
                                      }: {
  page_id: number;
  locale: string | undefined;
}) => {
  const promise = await Promise.all([
    getLang(locale),
    translatePageSEO(page_id, locale)
  ]);
  return {
    props: {
      messages: promise[0],
      seo: promise[1]
    }
  };
};


export const getStaticLocalePaths = (paths: GetStaticPathsResult) => {
  return paths;
  const localePaths: GetStaticPathsResult["paths"] = [];
  lang.slice(0, 7).forEach(locale => {
    paths.paths.map(path => {
      if (typeof path !== "string") {
        path.locale = locale.code;
        localePaths.push({
          params: path.params,
          locale: locale.code
        });
      }
    });
  });
  return {
    paths: localePaths,
    fallback: paths.fallback
  };
};


// 根据价格，货币最小单位数量级生成价格
export const byMinorUnit = (price: number | string, minor_unit: number) => {
  return parseInt(String(+price)) / Math.pow(10, minor_unit);
};
