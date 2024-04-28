import { Placeholder } from "@/components/Placeholder";
import FooterSocial from "@/components/Footer/footerSocial";
import { useTranslations } from "next-intl";

export default function PostPersonal() {
  const t = useTranslations("singleblog");
  return <div className="border rounded p-7 shadow">
    {/*  虚线*/}
    <div className="border-[1px] border-dashed border-gray-200 c-flex flex-col p-16">
      <div className="w-[200px] c-flex">
        <Placeholder src={"/image/logo-lefen.png"} imageWidth={200} imageHeight={200} />
      </div>
      <p className="pt-3 text-center">{t("cf81e340f8ce3647ef89f50a24117e90372b")}</p>
      <div className="pt-6">
        <FooterSocial />
      </div>
    </div>
  </div>;
}
