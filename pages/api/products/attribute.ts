import {NextApiRequest, NextApiResponse} from "next";
import {Woocommerce} from "@/lib/Woocommerce/woocommerce";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const {id} = req?.query;
  const {data} = await Woocommerce.get(`products/attributes`);
  return res.status(200).json(data);
}
