import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { updatePageById } from "@/lib/service/service/wp_custom_page.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    switch (req.method) {
      case "POST": {
        if (!req.body?.router_name || !req.body?.page_id) {
          throw Error("Missing parameters");
        }
        const result = await updatePageById(req.body.page_id, {
          router_name: req.body.router_name,
          authority: req.body.authority === 2 ? 2 : 1
        });
        if (!result) throw Error("Page does not exist");
        const success = Success(result);
        return res.status(success.code).json(success);
      }
    }
  } catch (e: any) {
    let msg = e.message || e.msg;
    if (msg === "Validation error") msg = "router_name 重复";
    const error = Error(msg);
    return res.status(error.code).json(error);
  }
}
