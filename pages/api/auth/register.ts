import { NextApiRequest, NextApiResponse } from "next";
import { Woocommerce } from "@/lib/Woocommerce/woocommerce";
import { setCorsHeaders } from "@/lib/utils/util";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  // only accept POST requests
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "You are not allowed"
    });
  }

  if (req.method === "POST") {
    try {
      const { data } = await Woocommerce.post(`customers`, req.body);
      return res.status(200).json(data);
    } catch (e: any) {
      console.error(e);
      const data = e?.response?.data || {
        code: "service-error",
        message: e?.message || "Service error",
        data: { status: 500 }
      };
      return res.status(data.data.status).json(data);
    }
  }
}
