import type { NextApiRequest, NextApiResponse } from "next";
import { Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  res.status(200).json(Success({
    flag: {
      "0": "网站基础菜单",
      "1": "产品分类菜单",
      "2": "博客分类菜单",
      "3": "博客tag分类菜单",
      "4": "自定义菜单"
    }
  }));
}
