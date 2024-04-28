import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { addOrUpdatePageSeo } from "@/lib/service/service/wp_custom_page_seo.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const page_id = req.body.page_id as number;
    const data = req.body.data;
    if (page_id < 0 || typeof page_id !== "number") {
      const error = Error("page_id is required");
      return res.status(error.code).json(error);
    }
    if (!data || typeof data !== "object") {
      const error = Error("data is required");
      return res.status(error.code).json(error);
    }
    const result = await addOrUpdatePageSeo(page_id.toString(), data);
    const success = Success(result);
    return res.status(success.code).json(success);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
