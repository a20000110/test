import { Button } from "@/components/Button";
import { useInquiryStore } from "@/lib/store/inquiry.store";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { GqlProductMetaDatum } from "@/lib/types/gql/product/product-by-slug.type";
import { getMinQuantity } from "@/components/Product/minimumOrder";

type Props = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string,
  count: number;
  id: string;
  text?: string;
  promptForInput?: boolean;
  metaData?: GqlProductMetaDatum[] | undefined | null;
}
export default function InquiryButton({
                                        size = "md",
                                        className = "",
                                        count,
                                        id,
                                        text = "form.86b85501d0c4e544898819934b5fc140c80f",
                                        promptForInput = false,
                                        metaData
                                      }: Props) {
  const { addInquiry } = useInquiryStore();
  const t = useTranslations();
  const handlerAddInquiry = () => {
    if (!id) return;
    let number: number | string = count;
    if (promptForInput && metaData) {
      const value = getMinQuantity(metaData) || "1";
      number = window.prompt(t("message.4e4d2f8893235b425b7877f609b7539103c5", { value }), value) as string;
      if (number === null) return;
      // 判断Number是否是一个数字字符串
      if (!/^\d+$/.test(number)) {
        toast(t("message.b0d882a3f5bc024e9afaeea371946241513d"), {
          type: "error"
        });
        return;
      }
      // 判断number是否小于value
      if (Number(number) < Number(value)) {
        toast(t("message.d617cc27b3e9d942b398e77a7ee78959449d", { value }), {
          type: "error"
        });
        return;
      }
    }
    addInquiry(id, +number);
    toast(t("message.a28166cedc921d4c31a8cfc4e7d4bc683bd4"), {
      type: "success"
    });
  };
  return <Button size={size} className={className}
                 onClick={handlerAddInquiry}>{t(text)}</Button>;
}
