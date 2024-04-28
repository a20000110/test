import type { NextApiRequest, NextApiResponse } from "next";
import WpInquiryService from "@/lib/service/service/wp_inquiry.service";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { setCorsHeaders } from "@/lib/utils/util";
export interface QueryInquiryResponseInterface {
  code: number;
  data: QueryInquiryResponseDataInterface;
  msg: string;
}
export interface QueryInquiryResponseDataInterface {
  count: number;
  rows: Row[];
}
interface Row {
  goods: Good[];
  inquiry_info: Inquiryinfo;
  id: number;
  woocommerce_user: string;
  status: number;
  source: number;
  createdAt: string;
  updatedAt: string;
}
interface Inquiryinfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leaveAMessage: string;
}
interface Good {
  id: number;
  count: number;
}

export interface QueryInquiryInterface {
  page: number;
  pageSize: number;
  woocommerce_user?: string;
  filter_time?: {
    start: number;
    end: number;
  };
  status?: 0 | 1;
  source?: 0 | 1;
}

// 校验参数
const verifyParameters = (data: QueryInquiryInterface): boolean => {
  let flag = true;
  if (data.page && data.pageSize) {
    if (data?.status !== undefined && data?.status !== 0 && data?.status !== 1) {
      flag = false;
    }
    if (data?.source !== undefined && data?.source !== 0 && data?.source !== 1) {
      flag = false;
    }
    if (data?.filter_time && (!data?.filter_time?.start || !data?.filter_time?.end || data?.filter_time?.start > data?.filter_time?.end)) {
      flag = false;
    }
  }
  return flag;
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
    const body = req.body as QueryInquiryInterface;
    if (!verifyParameters(body)) {
      const message = Error("parameter error");
      return res.status(message.code).json(message);
    }
    const data = Success(await WpInquiryService.query(body));
    res.status(data.code).json(data);
  } catch (e: any) {
    console.error(e);
    const message = Error(e?.message);
    res.status(message.code).json(message);
  }
}
