import type { NextApiRequest, NextApiResponse } from "next";
import { Success } from "@/lib/service/inquiry/constant";
import { Menu, menus } from "@/lib/constants/menus";
import { cApiUrl, setCorsHeaders } from "@/lib/utils/util";

export const getEditablePages = (menus: Menu[]): Menu[] => {
  let editablePages: Menu[] = [];

  menus.forEach(menu => {
    if (menu.isEditPage) {
      editablePages.push(menu);
    }
    if (menu.children) {
      editablePages = [...editablePages, ...getEditablePages(menu.children)];
    }
  });

  return editablePages;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  const editMenus = getEditablePages(menus);
  const success = Success(editMenus.map(item => {
    return {
      id: item.id,
      name: item.name,
      link: cApiUrl + item.link,
      isEditSeo: item.isEditSeo
    };
  }));
  return res.status(200).json(success);
}
