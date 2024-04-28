import WpOptionsModel from "../models/wp_options.model";
import { unserialize } from "php-serialize";

export interface PaypalOptionsInterface {
  enabled: string;
  title: string;
  description: string;
  email: string;
  advanced: string;
  testmode: string;
  debug: string;
  ipn_notification: string;
  receiver_email: string;
  identity_token: string;
  invoice_prefix: string;
  send_shipping: string;
  address_override: string;
  paymentaction: string;
  image_url: string;
  api_details: string;
  api_username: string;
  api_password: string;
  api_signature: string;
  sandbox_api_username: string;
  sandbox_api_password: string;
  sandbox_api_signature: string;
  _should_load: string;
}

export type GetWooPaypalOptionsType = Omit<PaypalOptionsInterface, "api_details" |
  "api_username" |
  "api_password" |
  "api_signature" |
  "sandbox_api_username" |
  "sandbox_api_password" |
  "sandbox_api_signature">;

// 获取woo的paypal设置信息

export const getWooPaypalOptions = async (): Promise<GetWooPaypalOptionsType | null> => {
  try {
    const options = await WpOptionsModel.findOne({
      where: {
        option_name: "woocommerce_paypal_settings"
      }
    });
    if (options?.dataValues?.option_value) {
      return unserialize(options.dataValues.option_value) as GetWooPaypalOptionsType;
    }
    return null;
  } catch (error) {
    console.error("getWooPaypalOptions:Error", error);
    return null;
  }
};
