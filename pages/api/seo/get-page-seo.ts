import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { getPageSeo } from "@/lib/service/service/wp_custom_page_seo.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "GET") {
      return res.status(405).end();
    }
    const page_id = req.query?.page_id as string;
    if (!page_id) {
      const error = Error("Missing necessary parameters: post_id");
      return res.status(error.code).json(error);
    }
    const result = await getPageSeo(page_id);
    const success = Success(result);
    return res.status(success.code).json(success);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
