import axios from "axios";
import { cApiUrl } from "@/lib/utils/util";

export const getPageContentCode = async (page_id: string | number): Promise<string> => {
  try {
    const res = await axios.get(cApiUrl + "/api/page/get-code?page_id=" + page_id);
    if (res.status === 200 && res?.data?.code === 200 && res?.data?.data?.code) {
      return res.data.data.code;
    }
    return "";
  } catch (e) {
    return "";
  }
};
