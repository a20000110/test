import type { NextApiRequest, NextApiResponse } from "next";
import { Error, Success } from "@/lib/service/inquiry/constant";
import WpInquiryService from "@/lib/service/service/wp_inquiry.service";
import { setCorsHeaders } from "@/lib/utils/util";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "You are not allowed"
    });
  }
  try {
    const body = req.body;
    const ids = body?.ids || [];
    if (ids.length === 0) {
      const message = Error("parameter error");
      return res.status(message.code).json(message);
    }
    const message = Success(await WpInquiryService.updateStatus(ids));
    return res.status(message.code).json(message);
  } catch (e: any) {
    const message = Error(e?.message);
    res.status(message.code).json(message);
  }
}
