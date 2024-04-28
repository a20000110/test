import { NextApiRequest, NextApiResponse } from "next";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";
import WpInquiryService from "@/lib/service/service/wp_inquiry.service";
import WpInquiryFormFieldService from "@/lib/service/service/wp_inquiry_form_field.service";

// 获取表单字段
const getFormFields = async () => {
  const res = await WpInquiryFormFieldService.get();
  const fields = JSON.parse(res.dataValues.form_content);
  const required: string[] = [];
  const optional: string[] = [];
  fields.map((item: any) => {
    if (item.required) {
      required.push(item.name);
    } else {
      optional.push(item.name);
    }
  });
  return {
    required,
    optional
  };
};

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
    if (!body?.goods.length) {
      const message = Error("Please select the inquired product");
      return res.status(message.code).json(message);
    }
    if (!body?.inquiry_info) {
      const message = Error("Form parameter error");
      return res.status(message.code).json(message);
    }
    const {
      required,
      optional
    } = await getFormFields();
    let flag = false;
    if (typeof body.inquiry_info === "object") {
      if (!Object.keys(body.inquiry_info).length) {
        flag = true;
      } else {
        flag = Object.keys(body.inquiry_info).some((key: string) => {
          const isRequired = required.includes(key);
          const isOptional = optional.includes(key);
          let ident = false;`1`
          if (isRequired) ident = !body.inquiry_info[key];
          else ident = !isOptional;
          return ident;
        });
      }
    }
    if (flag) {
      const message = Error("inquiry_info fields error");
      return res.status(message.code).json(message);
    }
    const result = Success(await WpInquiryService.send(body));
    fetch("https://saaswsuser.pintreel.com/api/v1/next/notice/email/push", {
      method: "POST",
      body: JSON.stringify({
        domain: (new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL as string)).hostname,
        type: "next_email_notice"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.status(result.code).json(body);
  } catch (e: any) {
    const message = Error(e?.message);
    res.status(message.code).json(message);
  }
}
