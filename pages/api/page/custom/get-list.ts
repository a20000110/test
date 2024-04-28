import { NextApiRequest, NextApiResponse } from "next";
import { cApiUrl, setCorsHeaders } from "@/lib/utils/util";
import { Error, Success } from "@/lib/service/inquiry/constant";
import { getCustomPageList } from "@/lib/service/service/wp_custom_page.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    switch (req.method) {
      case "GET": {
        const { page, limit } = req.query as {
          page: string;
          limit: string;
        };
        if (!page || !limit || +limit > 500) {
          throw Error("Missing parameters");
        }
        const result = await getCustomPageList(page, limit);
        if (!result) throw Error("Acquisition failed");
        result.rows = result.rows.map((item: any) => {
          delete item.createdAt;
          delete item.updatedAt;
          return {
            id: item.page_id,
            name: item.router_name,
            link: `${cApiUrl}/custom/${item.router_name}`,
            flag: 4,
            isEditPage: true,
            isEditSeo: true
          };
        }) as any;
        const success = Success(result);
        return res.status(success.code).json(success);
      }
    }
  } catch (e: any) {
    const msg = e.message || e.msg;
    const error = Error(msg);
    return res.status(error.code).json(error);
  }
}
