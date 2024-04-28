import WooCommerceRApi from "@/lib/Woocommerce/WooCommerceRApi";

export const Woocommerce = new WooCommerceRApi({
    url: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}`,
    consumerKey: `${process.env.NEXT_WC_CONSUMER_KEY}`,
    consumerSecret: `${process.env.NEXT_WC_CONSUMER_SECRET}`,
    version: "wc/v3",
    queryStringAuth: true,
    timeout: 30000
});
