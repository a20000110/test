import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { getPostSeo } from "@/lib/service/service/wp_custom_post_seo.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "GET") {
      return res.status(405).end();
    }
    const slug = req.query?.slug as string;
    if (!slug) {
      const error = Error("Missing necessary parameters: slug");
      return res.status(error.code).json(error);
    }
    const result = await getPostSeo(slug);
    const success = Success(result);
    return res.status(success.code).json(success);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
