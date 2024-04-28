import { NextApiRequest, NextApiResponse } from "next";
import { WpProductCateSeoModelInterface } from "@/lib/service/models/wp_product_cate_seo.model";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";
import { updateProductCateSeo } from "@/lib/service/service/wp_post_cate_seo.service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "POST") {
      return res.status(405).end();
    }
    const slug = req.query.slug as string;
    const body = req.body as Omit<WpProductCateSeoModelInterface, "slug" | "cate_id">;
    const result = await updateProductCateSeo(slug, body);
    if (!!result[0]){
      const success = Success(null);
      return res.status(success.code).json(success);
    }else {
      const error = Error("Update failed");
      return res.status(error.code).json(error);
    }
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
