import { Placeholder } from "@/components/Placeholder";
import Link from "next/link";
import { useTranslations } from "next-intl";

const list = [
  {
    title: "4e5126b38dfa6a471e48edb6e1c6cc88f5f4",
    value: "67cbb30058283c44a3b9b964c8ecd8705215"
  },
  {
    title: "ac30e174fa006b4cc80804519945f18776de",
    value: "e42bc16f84928a4127997c08f76166d64456"
  },
  {
    title: "38ccee90cf7ea8453e58f78e3b7ebf9fc722",
    value: "5457ffeb2315b0494b0bbf0a367eb966dc4f"
  },
  {
    title: "0538e264ced18247d3e8ebc6297a34daacfa",
    value: "fd87c72282f8164d44b87f7f720f8ab8048b"
  },
  {
    title: "36e961de3cf96941c019f444da805a876ba0",
    value: "35c3a851823eaf4b709994767a1a71375c07"
  },
  {
    title: "d98de559221d6c4816d8cb864fe23d3a2132",
    value: "218061dbd8d4a5426b9b8f6a4c2c976f6159"
  }
];

export default function SupplierDetails() {
  const t = useTranslations("product");

  return <div className="my-10 w-full max-md:hidden bg-[#f7fbfe] rounded-[8px] p-[28px] text-black">
    <div className="s-flex">
      <div className="bg-white w-[48px] h-[48px] rounded-[8px] border flex-shrink-0">
        <Placeholder src={"/image/logo-lefen.png"} imageWidth={48} imageHeight={48} fit="contain" />
      </div>
      <div className="ml-2">
        <Link href={"/about-us"} className="text-[14px] underline">
          Guangzhou Lefeng jewelry Co., LTD
        </Link>
        <div className="text-[12px]">
          {t("6cf108184be62c432988dadd02d3d50cf72d")} · {t("218057f090707f48a72836074d425fe7f029")} · {t("a64932728139ef46c838c512328915f3a3f5")} CN
        </div>
      </div>
    </div>
    <div className="my-10">
      <div className="grid grid-cols-3 gap-8">
        {
          list.map(item => {
            return <div className="flex flex-col gap-y-[8px]" key={item.title}>
              <p className="text-[16px] text-[#333]">{t(item.title)}</p>
              <p className="font-bold text-[20px] text-[#333]">{t(item.value)}</p>
            </div>;
          })
        }

      </div>
    </div>
  </div>;
}
