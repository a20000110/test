import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { getPageById } from "@/lib/service/service/wp_custom_page.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    switch (req.method) {
      case "GET": {
        if (!req.query?.page_id) {
          throw Error("Missing parameters");
        }
        const result = await getPageById(req.query.page_id as string);
        if (!result) throw Error("Page does not exist");
        const success = Success(result);
        return res.status(success.code).json(success);
      }
    }
  } catch (e: any) {
    const msg = e.message || e.msg;
    const error = Error(msg);
    return res.status(error.code).json(error);
  }
}
