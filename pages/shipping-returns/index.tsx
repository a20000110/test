import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { GetServerSidePropsContext } from "next";
import { getLang, getNavProducts, translatePageCode, translatePageSEO } from "@/lib/utils/util";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const page_id = 10;
    const seo = await translatePageSEO(page_id, context.locale);
    const page_code = await translatePageCode(page_id, context.locale);
    return {
      props: {
        seo,
        page_code,
        messages: await getLang(context.locale),
      }
    };
};

export default function ReturnPolicy({
                                       seo,
                                       page_code
                                     }: {
  seo: PageSeoInterface | null,
  page_code: string
}) {
  const t = useTranslations("SHIPPING-RETURNS");
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
      <div className=" mx-auto max-w-5xl my-32">
        <div className="space-y-8">
          <h2 className={"text-3xl mb-8 text-center"}>{t("SHIPPING-RETURNS1")}</h2>
          <p className="font-black">
            {t("SHIPPING-RETURNS2")}
          </p>
          <p>
            {t("SHIPPING-RETURNS3")}
          </p>
          <p>
            {t("SHIPPING-RETURNS4")}
          </p>

          <p>
            {t("SHIPPING-RETURNS5")}
          </p>
          <p>
            {t("SHIPPING-RETURNS6")}
          </p>

          <h3 className="font-black">
            {t("SHIPPING-RETURNS7")}
          </h3>
          <img src="/image/home/Shipping_time_express.webp" alt="" />

          <p>
            {t("SHIPPING-RETURNS8")}
          </p>

          <p className="font-black">
            {t("SHIPPING-RETURNS9")}
          </p>
          <ul className="list-disc list-inside">
            <li>{t("SHIPPING-RETURNS10")}</li>
            <li>{t("SHIPPING-RETURNS11")}</li>
            <li>{t("SHIPPING-RETURNS12")}</li>
          </ul>

          <p>
            {t("SHIPPING-RETURNS13")}
          </p>
          <p>
            {t("SHIPPING-RETURNS14")}
          </p>

          <h3 className="font-black">{t("SHIPPING-RETURNS15")}</h3>
          <p>
            {t("SHIPPING-RETURNS16")}
          </p>

          <h3 className="font-black">
            {t("SHIPPING-RETURNS17")}
          </h3>
          <p>
            {t("SHIPPING-RETURNS18")}
          </p>

          <h3 className="font-black">{t("SHIPPING-RETURNS19")}</h3>
          <p>
            {t("SHIPPING-RETURNS20")}
          </p>

          <h3 className="font-black">{t("SHIPPING-RETURNS21")}</h3>
          <p>
            {t("SHIPPING-RETURNS22")}
          </p>
          <p>
            {t("SHIPPING-RETURNS23")}
          </p>
        </div>
      </div>
    </BuildCustomHtml>
  </>;
}
