import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { addCustomPage } from "@/lib/service/service/wp_custom_page.service";
import { nanoid } from "nanoid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    switch (req.method) {
      case "POST": {
        if (!req.body?.router_name || !req.body?.authority) {
          throw Error("Missing parameters");
        }
        const result = await addCustomPage({
          page_id: nanoid(),
          ...req.body
        });
        if (!result) {
          throw Error("Add failed");
        }
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
