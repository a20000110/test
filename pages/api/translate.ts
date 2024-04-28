import { NextApiRequest, NextApiResponse } from "next";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { TranslatePageDataResponse } from "@/lib/utils/translate-util";

// const baseUrl = "https://ptmsg.pintreel.com/search/pinTrans_new";
const baseUrl = "https://shuju.pintreel.com/search/pinTrans_new";
// const baseUrl = "http://data-api.pintreel.com/api/translate/many";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method === "POST") {
      const result = await fetch(baseUrl, {
        method: "post",
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json",
          verifytoken: "3fcf0c6a28caaa1be5e8bb524e213c76"
        }
      }).then(async (res) => {
        return await res.json();
      }) as TranslatePageDataResponse;
      if (result.code === 0) {
        const success = Success(result.data);
        return res.status(success.code).json(success);
      } else {
        throw Error(result.msg);
      }
    }
  } catch (e: any) {
    const error = Error(e.message);
    return res.status(error.code).json(error.data);
  }
}
