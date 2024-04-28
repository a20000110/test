import {NextApiRequest, NextApiResponse} from "next";
import {Woocommerce} from "@/lib/Woocommerce/woocommerce";
import {ProductReviewInterface} from "@/lib/types/rest-api/product/review.type";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const {id} = req?.query;
    const {data} = await Woocommerce.get<ProductReviewInterface[]>(`products/reviews?product=${id}`);
    return res.status(200).json(data);
}
