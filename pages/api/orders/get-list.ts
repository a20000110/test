import { NextApiRequest, NextApiResponse } from "next";
import { Woocommerce } from "@/lib/Woocommerce/woocommerce";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
    return;
  }
  const { customer, page, per_page } = req.query as {
    [key: string]: string
  };
  if (!customer) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }
  Woocommerce.get("orders", {
    customer,
    page,
    per_page
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ error: error.response });
    });
}

