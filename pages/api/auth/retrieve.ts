import { NextApiRequest, NextApiResponse } from "next";
import { Woocommerce } from "@/lib/Woocommerce/woocommerce";
import { getCookie } from "cookies-next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // only accept GET requests
    if (req.method !== "GET") {
      return res.status(400).json({
        message: "You are not allowed"
      });
    }
    const userInfo = getCookie("__user__login__info", { req, res }) as any;
    if (!userInfo) {
      return res.status(401).json({
        message: "You are not logged in"
      });
    }
    const user = JSON.parse(userInfo);
    const id = user?.id;
    const { data } = await Woocommerce.get(`customers/${id}`);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(400).json({ error: 1 });
  }
}
