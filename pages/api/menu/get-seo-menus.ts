import type { NextApiRequest, NextApiResponse } from "next";
import { Success } from "@/lib/service/inquiry/constant";
import { Menu, menus } from "@/lib/constants/menus";
import { setCorsHeaders } from "@/lib/utils/util";
import client from "@/lib/ApolloClient/apolloClient";
import { POST_CATEGORIES } from "@/lib/queries/post-categories";
import { GqlPostCategoriesInterface } from "@/lib/types/gql/post/post-categories.type";
import { PRODUCT_CATEGORIES } from "@/lib/queries/product-categories";
import { GqlProductCategoriesInterface } from "@/lib/types/gql/product/product-categories";
import { GqlPostTagsInterface } from "@/lib/types/gql/post/post-tags.type";
import { POST_TAGS } from "@/lib/queries/post-tags";

export type GetSeoMenusResponse = {
  id: number | string;
  link: string;
  name: string;
  flag: number;
  isEditPage: boolean;
}

// 生成链接
const generateLink = (link: string) => {
  if (link.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}${link}`;
  } else {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/${link}`;
  }
};

// 获取网站基础菜单
export const getBaseMenus = (menus: Menu[]) => {
  const flattenMenu = (menu: Menu[]) => {
    return menu.reduce((acc: Menu[], item) => {
      const { children, ...rest } = item;
      acc.push(rest);
      if (children && children.length) {
        acc.push(...flattenMenu(children));
      }
      return acc;
    }, []);
  };
  return flattenMenu(menus).filter(item => item.isEditSeo).map(item => {
    return {
      id: item.id,
      name: item.name,
      link: generateLink(item.link),
      flag: 0,
      isEditPage: item.isEditPage
    };
  });
};

// 获取产品分类菜单
export const getProductMenus = async () => {
  const { data } = await client.query<GqlProductCategoriesInterface>({
    query: PRODUCT_CATEGORIES
  });
  return data.productCategories.nodes.map(item => {
    return {
      id: item.id,
      name: item.name,
      link: generateLink(item.slug),
      flag: 1,
      isEditPage: false
    };
  });
};

// 获取博客分类菜单
export const getBlogMenus = async () => {
  const { data } = await client.query<GqlPostCategoriesInterface>({
    query: POST_CATEGORIES
  });
  return data.categories.nodes.map(item => {
    return {
      id: item.id,
      name: item.name,
      link: generateLink(`/category/${item.slug}`),
      flag: 2,
      isEditPage: false
    };
  });
};

// 获取博客tag分类菜单
export const getBlogTagMenus = async () => {
  const { data } = await client.query<GqlPostTagsInterface>({
    query: POST_TAGS
  });
  return data.tags.nodes.map(item => {
    return {
      id: item.id,
      name: item.name,
      link: generateLink(`/tag/${item.slug}`),
      flag: 3,
      isEditPage: false
    };
  });
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  // const promise = [
  //   getProductMenus()
  // ];
  //
  // const promiseResult = await Promise.all(promise);
  //
  // res.status(200).json(Success([...getBaseMenus(menus), ...promiseResult.flat()]));
  res.status(200).json(Success(getBaseMenus(menus)));
}
