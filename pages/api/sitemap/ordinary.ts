import { NextApiRequest, NextApiResponse } from "next";
import { withXMLResponse } from "@/lib/utils/withXMLResponse";
import { createSitemap } from "@/lib/utils/util";
import { getBlogLinks, getCustomPageLinks, getIsEditMenus, getProductLinks } from "@/lib/utils/sitemap-util";

export const config = {
  runtime: "edge"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_MULTI_LANGUAGE !== "1") {
    return
  }
  const promise = [
    getIsEditMenus(),
    getProductLinks(),
    getBlogLinks(),
    getCustomPageLinks()
  ];
  const result = await Promise.all(promise);
  const allMap = result.flat();
  const sitemap = createSitemap(allMap);
  return withXMLResponse(sitemap);
}

