export const ORDER_STATUS:{
  [key: string]: string
} = {
  pending: "order.Pending_payment", // 待支付
  processing: "order.Processing", // 处理中
  completed: "order.Completed",
  cancelled: "order.Canceled",
  refunded: "order.Refunded",
  failed: "order.Fail",
  "on-hold": "order.On_hold"
};
