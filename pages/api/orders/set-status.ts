import { NextApiRequest, NextApiResponse } from "next";
import { Woocommerce } from "@/lib/Woocommerce/woocommerce";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * pending - 订单待付款。
   * processing - 订单已付款且库存已减少，订单处于待发货状态。
   * on-hold - 订单已付款，但库存未减少。
   * completed - 订单已完成，所有订单项都已发货，且所有款项已结清。
   * cancelled - 订单已取消，无需进一步操作。
   * refunded - 订单已全额或部分退款。
   * failed - 订单支付失败或被拒绝，无需进一步操作。
   * */

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
    return;
  }
  const { orderId, status } = req.body as {
    orderId: string;
    status: string
  };
  if (!orderId) {
    res.status(400).json({ error: "orderId is required" });
    return;
  }
  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }

  Woocommerce.put(`orders/${orderId}`, {
    status
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ error: error.response });
    });

}

