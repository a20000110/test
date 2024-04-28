import { NextApiRequest, NextApiResponse } from "next";
import langPack from "@/languagePack.json"
import { getBlogLinks, getCustomPageLinks, getIsEditMenus, getProductLinks } from "@/lib/utils/sitemap-util";
import { withXMLResponse } from "@/lib/utils/withXMLResponse";
import { cApiUrl, createSitemap } from "@/lib/utils/util";

export const config = {
  runtime: "edge"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const isLang = process.env.NEXT_PUBLIC_MULTI_LANGUAGE === "1";

  // 未开启多语言
  if (!isLang) {
    const promise = [
      getIsEditMenus(),
      getProductLinks(),
      getBlogLinks(),
      getCustomPageLinks()
    ];
    const result = await Promise.all(promise);
    const allMap = result.flat().map(m => m);
    return withXMLResponse(createSitemap(allMap));
  }

  const urls: string[] = langPack.map(lang => {
    return `${cApiUrl}/api/sitemap/${lang.code}`;
  });
  urls.unshift(`${cApiUrl}/api/sitemap/ordinary`);
  return withXMLResponse(createSitemap(urls));
}
