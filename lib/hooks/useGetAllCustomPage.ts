import { cApiUrl } from "@/lib/utils/util";
import { BaseAxiosResponse } from "@/lib/types/utils.type";

export type CustomPagesType = {
  href: string;
  name: string;
  id: string;
}
export const getAllCustomPage = async (page: number, limit: number, pages?: CustomPagesType[]) => {
  const Pages = pages||[]
  try {
    const result = await fetch(`${cApiUrl}/api/page/custom/get-list?page=${page}&&limit=${limit}`);
    if (result.status !== 200) {
      return Pages;
    }
    const res = await result.json() as BaseAxiosResponse<{
      count: number;
      rows: any[];
    }>;
    if (res.code !== 200) {
      return Pages;
    }
    Pages.push(...res.data.rows.map(item => ({
      href: item.link,
      name: item.name,
      id: item.id
    })));
    if (!!res.data.rows.length && res.data.rows.length === limit) {
      getAllCustomPage(page + 1, limit, Pages);
    } else {
      return Pages;
    }
  } catch (e) {
    return Pages;
  }
};
