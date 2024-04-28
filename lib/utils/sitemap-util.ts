import { cApiUrl } from "@/lib/utils/util";
import { GetSeoMenusResponse } from "@/pages/api/menu/get-seo-menus";
import { getAllProductSlug, SlugInterface } from "@/lib/hooks/useGetProductSlug";
import { getAllBlogSlug } from "@/lib/hooks/useGetBlogSlug";
import { CustomPagesType, getAllCustomPage } from "@/lib/hooks/useGetAllCustomPage";

export const getIsEditMenus = async (): Promise<string[]> => {
  try {
    const f = await fetch(cApiUrl + "/api/menu/get-seo-menus");
    const res = await f.json() as {
      code: number,
      data: GetSeoMenusResponse[]
    };
    if (res.code === 200) {
      return res.data.map(item => item.link);
    }
    throw new Error("获取菜单失败");
  } catch (e) {
    console.error("getIsEditMenus Error:", e);
    return [];
  }
};

// 获取所有产品连接
export const getProductLinks = async () => {
  try {
    const slugs: SlugInterface[] = [];
    const data = await getAllProductSlug(1, 1000, slugs);
    if (data?.length) {
      return data.map(item => `${cApiUrl}/product/${item.params.slug}`);
    } else {
      throw new Error("获取产品链接接失败");
    }
  } catch (e) {
    console.error("getProductLinks Error:", e);
    return [];
  }
};

// 获取所有博客连接
export const getBlogLinks = async () => {
  try {
    const slugs: SlugInterface[] = [];
    const data = await getAllBlogSlug(1, 1000, slugs);
    if (data?.length) {
      return data.map(item => `${cApiUrl}/blog/${item.params.slug}`);
    } else {
      throw new Error("获取博客链接失败");
    }
  } catch (e) {
    console.error("getBlogLinks Error:", e);
    return [];
  }
};

// 获取所有自定义页面
export const getCustomPageLinks = async () => {
  try {
    const pages: CustomPagesType[] = [];
    const data = await getAllCustomPage(1, 500, pages);
    if (data?.length) {
      return pages.map(item => item.href);
    } else {
      throw new Error("获取自定义页面链接失败");
    }
  } catch (e) {
    console.error("getCustomPageLinks Error:", e);
    return [];
  }
};
