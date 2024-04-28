import {DocumentNode, gql} from "@apollo/client";

// 获取woocommerce价格单位  返回示例为 "UGX0.00" 需要删除数字
const PRICE_UNIT: DocumentNode = gql`query{
    cart {
        rawSubtotal: subtotal(format: FORMATTED)
    }
}`;
export default PRICE_UNIT;
