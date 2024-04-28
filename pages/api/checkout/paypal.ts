import { NextApiRequest, NextApiResponse } from "next";
import { cApiUrl, setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    const { orderId } = req.query;
    if (req.method !== "GET" || !orderId) {
      const error = Error("请求参数错误");
      return res.status(error.code).json(error);
    }
    // 发送请求获取paypal支付链接
    const result = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/ps-pay/v1/paypal/payLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        return: `${cApiUrl}/api/checkout/return/${orderId}`,
        cancel_return: `${cApiUrl}/api/checkout/cancel/${orderId}`
      })
    }).then(r => r.json());
    if (result?.code === 1) {
      const success = Success(result.data);
      return res.status(success.code).json(success);
    } else {
      throw Error(result.msg);
    }
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error);
  }
}



