import { NextApiRequest, NextApiResponse } from "next";
import { isDev, setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { getWooPaypalOptions } from "@/lib/service/service/wp_options.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    isDev && setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method === "GET") {
      const result = await getWooPaypalOptions();
      return res.status(200).json(Success({
        email: result?.email,
      }));
    }
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
