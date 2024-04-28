import { NextApiRequest, NextApiResponse } from "next";
import { Woocommerce } from "@/lib/Woocommerce/woocommerce";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  Woocommerce.post("orders", {
    ...req.body
  }).then((response) => {
    res.status(200).json(response.data);
  })
    .catch((error) => {
      console.error(error.response.data);
      res.status(400).json(error.response.data);
    });
}

