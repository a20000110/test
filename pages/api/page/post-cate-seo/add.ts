import { NextApiRequest, NextApiResponse } from "next";
import { WpProductCateSeoModelInterface } from "@/lib/service/models/wp_product_cate_seo.model";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";
import { addProductCateSeo } from "@/lib/service/service/wp_post_cate_seo.service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "POST") {
      return res.status(405).end();
    }
    const body = req.body as WpProductCateSeoModelInterface;
    const result = await addProductCateSeo(body);
    if (result?.dataValues?.seo) {
      result.dataValues.seo = JSON.parse(result.dataValues.seo);
    }
    const success = Success(result);
    return res.status(success.code).json(success);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
