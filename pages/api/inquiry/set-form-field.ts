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
  if (req.method !== "POST") {
  return   res.status(400).json({
      message: "You are not allowed"
    });
  }
  try {
    const body = req.body;
    if (!body?.form_content || body.form_content.length === 0) {
      const message = Error("parameter error");
      res.status(message.code).json(message);
      return;
    }
    const data = Success(!!(await WpInquiryFormFieldService.set(body.form_content))[1]);
    res.status(data.code).json(data);
  } catch (e: any) {
    const message = Error(e?.message);
    res.status(message.code).json(message);
  }
}
