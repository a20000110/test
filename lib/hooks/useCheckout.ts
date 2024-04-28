import axios from "axios";
import { toast } from "react-toastify";
import { generatePaypalLink } from "@/lib/utils/paypal-link";
import { CreateOrderResponseInterface } from "@/lib/types/rest-api/order/create-order.type";
import { WooGetResponse } from "@/lib/Woocommerce/WooCommerceRApi";


export type OrderStatus =
  "pending"
  | "processing"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed"
  | "expired"
  | "unknown";

export const useCheckout = () => {
  // 获取paypal在线支付链接
  const getPaypalPaymentLink = async (order: CreateOrderResponseInterface) => {
    return await generatePaypalLink(order);
  };

  // 轮询订单状态
  const pollOrderStatus = async (orderId: number): Promise<CreateOrderResponseInterface | null> => {
    const res = await axios.get<WooGetResponse<CreateOrderResponseInterface>>("/api/orders/get?orderId=" + orderId);
    if (res.status !== 200 || !res.data.result) {
      toast.error("Failed to obtain payment connection ---- error code : 2");
      return null;
    }
    return res.data.result;
  };

  // 修改订单状态
  const setOrderStatus = async (orderId: number, status: OrderStatus): Promise<CreateOrderResponseInterface | null> => {
    const res = await axios.post<CreateOrderResponseInterface>("/api/orders/set-status", {
      orderId,
      status
    });
    if (res.status !== 200 || !res.data) {
      toast.error("Failed to obtain payment connection ---- error code : 3");
      return null;
    }
    return res.data;
  };


  return {
    getPaypalPaymentLink,
    pollOrderStatus,
    setOrderStatus
  };
};
