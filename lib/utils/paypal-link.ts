// 生成paypallink需要的参数
import { CreateOrderResponseInterface } from "@/lib/types/rest-api/order/create-order.type";
import { GetWooPaypalOptionsType } from "@/lib/service/service/wp_options.service";
import { cApiUrl } from "./util";
import { Success } from "@/lib/service/inquiry/constant";

type Response = ReturnType<typeof Success> & {
  data: {
    redirect: URL
  }
}

export const generatePaypalLink = async (data: CreateOrderResponseInterface) => {
  const orderId = data.id;
  // 获取paypal支付链接
  const result = await fetch(`${cApiUrl}/api/checkout/paypal?orderId=${orderId}`).then(r => r.json()).catch(e => null) as Response;
  if (result && result.code === 200) {
    return result.data.redirect;
  } else {
    return null;
  }
};
