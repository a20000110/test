import { NextApiRequest, NextApiResponse } from "next";
import { Woocommerce } from "@/lib/Woocommerce/woocommerce";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
    return;
  }
  const { orderId } = req.query as {
    orderId: string;
  };
  if (!orderId) {
    res.status(400).json({ error: "orderId is required" });
    return;
  }
  Woocommerce.get(`orders/${orderId}`)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ error: error.response });
    });
}

