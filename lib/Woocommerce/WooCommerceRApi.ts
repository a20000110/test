import WooCommerceRestApi, {WooCommerceRestApiOptions} from "@woocommerce/woocommerce-rest-api";

export type WooGetResponse<T extends any> = {
    result: T;
    total: number;
    totalPage: number
}

export default class WooCommerceRApi extends WooCommerceRestApi {
    constructor(opt: WooCommerceRestApiOptions | WooCommerceRestApi) {
        super(opt);
    }

    // 重写父类get方法
    async get<T>(endpoint: string, params?: any): Promise<{
        data: WooGetResponse<T>
    }> {
        const result = await super.get(endpoint, params);
        result.data = {
            result: result.data,
            total: +result.headers["x-wp-total"],
            totalPage: +result.headers["x-wp-totalpages"]
        };
        return result;
    }
}
