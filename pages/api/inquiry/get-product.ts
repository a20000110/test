import type { NextApiRequest, NextApiResponse } from "next";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";
import { getProductInfoById } from "@/lib/service/service/wp_posts.service";

export interface InquiryGetProductResponse {
  code: number;
  data: Datum[];
  msg: string;
}
interface Datum {
  id: number;
  name: string;
  image: string;
  link: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders( res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "GET") {
    return res.status(400).json({
      message: "You are not allowed"
    });
  }
  if (!req.query.ids) {
    const message = Error("parameter error");
    return res.status(message.code).json(message);
  }
  try {
    const query = req.query.ids as string;
    const ids = query.split(",");
    const promise = ids.map((item: string) => getProductInfoById(item));
    const result = await Promise.all(promise);
    const message = Success(result.filter((item: any) => item));
    return res.status(message.code).json(message);
  } catch (e: any) {
    const message = Error(e?.message);
    res.status(message.code).json(message);
  }
}
