import type { NextApiRequest, NextApiResponse } from "next";
import WpInquiryFormFieldService from "@/lib/service/service/wp_inquiry_form_field.service";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";

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
  try {
    const data = Success(await WpInquiryFormFieldService.get());
    res.status(data.code).json(data);
  } catch (e: any) {
    const message = Error(e?.message);
    res.status(message.code).json(message);
  }
}
