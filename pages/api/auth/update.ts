import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";
import {Woocommerce} from "@/lib/Woocommerce/woocommerce";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(400).json({
      message: "You are not allowed",
    });
  }

  const userInfo = getCookie("__user__login__info", { req, res }) as any;
  const user = JSON.parse(userInfo);
  const id = user?.id;

  if (req.method === "PUT") {
    const { data } = await Woocommerce.put(`customers/${id}`, req.body);
    return res.status(200).json(data);
  }
}
