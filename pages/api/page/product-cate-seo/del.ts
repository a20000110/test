import { NextApiRequest, NextApiResponse } from "next";
import { WpProductCateSeoModelInterface } from "@/lib/service/models/wp_product_cate_seo.model";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";
import {
  addProductCateSeo,
  delProductCateSeoBySlug,
  getProductCateSeoBySlug
} from "@/lib/service/service/wp_product_cate_seo.service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "DELETE") {
      return res.status(405).end();
    }
    const slug = req.query?.slug as string;
    if (!slug){
      throw Error("slug is required");
    }
    const result = await delProductCateSeoBySlug(slug);
    if (!result){
      throw Error("Delete failed");
    }
    const success = Success(result);
    return res.status(success.code).json(success);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
