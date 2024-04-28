import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next/types";
import { setCorsHeaders } from "@/lib/utils/util";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "You are not allowed"
    });
  }
  // cocart login api
  const { username, password } = req.body;
  try {
    const { data } = await axios
      .post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/cocart/v2/login`,
        {},
        {
          auth: {
            username: username,
            password: password
          }
        }
      )
      .then((res: any) => {
        return res.data.role === "Customer"
          ? {
            data: {
              message: "Login success",
              data: res.data
            }
          }
          : {
            data: {
              message: "You are not allowed",
              description: "You are not allowed.Because you are not customer",
              status: 400
            }
          };
      });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "User or password is incorrect",
      error_message: "Username or password is incorrect",
      data: error
    });
  }
}
