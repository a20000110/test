import { useTranslations } from "next-intl";

export default function Slogon() {
  const t = useTranslations()
  return <div
    className="w-full h-[400px] bg-[url('/image/cp-banner.jpg')] bg-no-repeat max-md:bg-right bg-cover relative">
    <div className="absolute inset-0 c-flex flex-col">
      <h2 className="font-bold text-3xl">{t("singleblog.d86bef5ddf9a244a6d28b5da21633e99bff3")}</h2>
      <p className="pt-3 text-center">{t("singleblog.cf81e340f8ce3647ef89f50a24117e90372b")}</p>
    </div>
  </div>;
}
