import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { GetServerSidePropsContext } from "next";
import { getLang, getNavProducts, translatePageCode, translatePageSEO } from "@/lib/utils/util";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const page_id = 7;
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
  const t = useTranslations("Return Policy");
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
      <div className=" mx-auto max-w-5xl my-32">
        <div className="space-y-8">
          <h2 className={"text-3xl mb-8 text-center"}>{t("RETURN_POLICY")}</h2>
          <p>
            {t("RETURN_POLICY1")}
          </p>

          <h2 className={"text-xl font-bold mt-10 mb-2"}>{t("RETURN_POLICY2")}</h2>
          <p>
            {t("RETURN_POLICY3")}
          </p>

          <h2 className={"text-xl font-bold mt-10 mb-2"}>{t("RETURN_POLICY4")}</h2>
          <p>
            {t("RETURN_POLICY5")}
          </p>
        </div>

        <div className="mt-16 space-y-4">
          <p>
            {t("RETURN_POLICY6")}
          </p>

          <p>
            {t("RETURN_POLICY7")}
          </p>

          <p>
            {t("RETURN_POLICY8")}
          </p>
        </div>

      </div>
    </BuildCustomHtml>
  </>;
}
