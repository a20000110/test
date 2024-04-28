import {ProductReviewInterface} from "@/lib/types/rest-api/product/review.type";
import {WooGetResponse} from "@/lib/Woocommerce/WooCommerceRApi";

export const useReviews = async (id: number): Promise<WooGetResponse<ProductReviewInterface[]>> => {
    const res = await fetch(`/api/products/review?id=${id}`);
    return res.json();
};
