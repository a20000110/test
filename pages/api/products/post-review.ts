import { NextApiRequest, NextApiResponse } from "next";
import {Woocommerce} from "@/lib/Woocommerce/woocommerce";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { product_id, review, reviewer, reviewer_email, rating } = req?.body;
    const { data } = await Woocommerce.post("products/reviews", {
        product_id,
        review,
        reviewer,
        reviewer_email,
        rating,
    });
    return res.status(200).json(data);
}
