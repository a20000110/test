import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { addOrUpdatePostSeo } from "@/lib/service/service/wp_custom_post_seo.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const slug = req.body.slug as string;
    const data = req.body.data;
    if (!slug || typeof slug !== "string") {
      const error = Error("slug is required");
      return res.status(error.code).json(error);
    }
    if (!data || typeof data !== "object") {
      const error = Error("data is required");
      return res.status(error.code).json(error);
    }
    const result = await addOrUpdatePostSeo(slug, data);
    const success = Success(result);
    return res.status(success.code).json(success);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
