import { NextApiRequest, NextApiResponse } from "next";
import { setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setPageCode } from "@/lib/service/service/wp_custom_page_code.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "POST") {
      return res.status(405).end();
    }
    const page_id = req.body?.page_id as string;
    const code = req.body?.code as string || "";
    const result = await setPageCode(page_id, code);
    const success = Success(result);
    return res.status(success.code).json(success);
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}
