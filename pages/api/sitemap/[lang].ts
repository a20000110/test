import { NextApiRequest, NextApiResponse } from "next";
import { withXMLResponse } from "@/lib/utils/withXMLResponse";
import { cApiUrl, createSitemap, defaultLocale } from "@/lib/utils/util";
import langPack from "@/languagePack.json";
import { getBlogLinks, getCustomPageLinks, getIsEditMenus, getProductLinks } from "@/lib/utils/sitemap-util";

export const config = {
  runtime: "edge"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_MULTI_LANGUAGE !== "1") {
    return
  }
  const url = new URL(req?.url || `${cApiUrl}/api/sitemap/${defaultLocale}?lang=${defaultLocale}`);
  const locale = url.searchParams.get("lang") || defaultLocale;
  const find = langPack.find(item => item.code === locale);
  if (!find) {
    return new Response("Wrong path!");
  }
  const promise = [
    getIsEditMenus(),
    getProductLinks(),
    getBlogLinks(),
    getCustomPageLinks()
  ];
  const result = await Promise.all(promise);
  const allMap = result.flat().map(m => {
    const url = new URL(m);
    const origin = url.origin;
    const asPath = m.split(origin);
    asPath[0] = `${origin}/${locale}`;
    return asPath.join("");
  });
  const sitemap = createSitemap(allMap);
  return withXMLResponse(sitemap);
}
