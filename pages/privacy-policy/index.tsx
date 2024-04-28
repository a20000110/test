import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { GetServerSidePropsContext } from "next";
import { getLang, getNavProducts, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import Link from "next/link";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const page_id = 8;
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
  const t = useTranslations("Privacy Policy");
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
      <div className="mx-auto max-w-5xl my-32 ">
        <div className="space-y-16">
          <h2 className="text-center text-3xl">{t("PRIVACY POLICY")}</h2>
          <p>
            {t("PRIVACY POLICY1")}

          </p>
          <p>
            {t("PRIVACY POLICY2")}
          </p>
          <p>
            {t("PRIVACY POLICY3")}
          </p>

        </div>

        <div className="mt-16">
          <p>
            {t("PRIVACY POLICY4")}
          </p>

          <p>
            {t("PRIVACY POLICY5")}
          </p>

          <p>
            {t("PRIVACY POLICY6")}
          </p>
        </div>
        <div className="mt-20">
          <p>
            {t("PRIVACY POLICY7")}
          </p>
          <p>
            {t("PRIVACY POLICY8")}
          </p>
          <p>
            {t("PRIVACY POLICY9")}
          </p>
          <p className="mt-8">
            {t("PRIVACY POLICY10")}
          </p>

          <p>
            {t("PRIVACY POLICY11")} linda@lefengjewelry.com
          </p>

          <p className="mt-8">
            {t("PRIVACY POLICY12")}
          </p>
          <p>
            {t("PRIVACY POLICY13")}
          </p>

          <p className="my-16">
            {t("PRIVACY POLICY14")}
          </p>
          <p>
            {t("PRIVACY POLICY15")}
          </p>
          <ul className="list-inside list-disc my-6">
            <li>{t("PRIVACY POLICY16")}</li>
            <li>{t("PRIVACY POLICY17")} <Link
              href={"https://www.paypal.com/au/webapps/mpp/ua/privacy-full"}
              className="underline hover:text-main">https://www.paypal.com/au/webapps/mpp/ua/privacy-full</Link></li>
          </ul>
          <ul className="list-inside list-disc my-16">
            <li>{t("PRIVACY POLICY18")}</li>
            <li>{t("PRIVACY POLICY19")} <Link
              href={"https://stripe.com/au/privacy"}
              className="underline hover:text-main">https://stripe.com/au/privacy</Link></li>
          </ul>

          <p>
            {t("PRIVACY POLICY20")}
          </p>

          <h3 className="mt-16">
            {t("PRIVACY POLICY21")}
          </h3>
          <p className="mb-8">
            {t("PRIVACY POLICY22")}
          </p>
          <h3>{t("PRIVACY POLICY23")}</h3>
          <p className="mb-8">
            {t("PRIVACY POLICY24")}
          </p>
          <h3>{t("PRIVACY POLICY25")}</h3>
          <p className="mb-8">
            {t("PRIVACY POLICY26")}
          </p>

          <h3>
            {t("PRIVACY POLICY27")}
          </h3>
          <p className="mb-8">
            {t("PRIVACY POLICY28")} <Link
            href={"mailto:linda@lefengjewelry.com"} className="underline hover:text-main">linda@lefengjewelry.com</Link>
          </p>
          <ul className="list-disc list-inside space-y-4">
            <li>{t("PRIVACY POLICY29")}</li>
            <li>
              {t("PRIVACY POLICY30")}
            </li>
            <li>
              {t("PRIVACY POLICY31")}
            </li>
            <li>
              {t("PRIVACY POLICY32")}
            </li>
            <li>
              {t("PRIVACY POLICY33")}
            </li>
            <li>
              {t("PRIVACY POLICY34")}
            </li>
            <li>
              <Link href={"/"} className="underline hover:text-main">{t("PRIVACY POLICY35")}</Link>
            </li>
            <li>
              {t("PRIVACY POLICY36")}
            </li>
            <li>{t("PRIVACY POLICY37")}</li>
            <li>{t("PRIVACY POLICY38")}
            </li>
            <li>{t("PRIVACY POLICY39")}</li>
            <li>{t("PRIVACY POLICY40")}</li>
            <li>{t("PRIVACY POLICY41")}
            </li>
            <li>{t("PRIVACY POLICY42")}
            </li>
            <li>{t("PRIVACY POLICY43")}
            </li>
            <li>{t("PRIVACY POLICY44")}
            </li>
            <li>{t("PRIVACY POLICY45")}</li>
            <li>{t("PRIVACY POLICY46")}
            </li>
            <li>{t("PRIVACY POLICY47")}</li>
            <li>{t("PRIVACY POLICY48")}
            </li>
            <li>{t("PRIVACY POLICY49")}</li>
            <li>{t("PRIVACY POLICY50")}
            </li>
            <li>{t("PRIVACY POLICY51")}
            </li>
            <li>{t("PRIVACY POLICY52")}</li>
            <li><Link href={"mailto:linda@lefengjewelry.com"}
                      className="underline hover:text-main">linda@lefengjewelry.com</Link></li>

            <li>{t("PRIVACY POLICY53")}
            </li>
            <li>{t("PRIVACY POLICY54")}</li>
            <li>{t("PRIVACY POLICY55")}
            </li>
            <li>{t("PRIVACY POLICY56")}
            </li>
            <li>{t("PRIVACY POLICY57")}</li>
            <li>{t("PRIVACY POLICY58")}
            </li>
            <li>{t("PRIVACY POLICY59")}</li>
            <li>{t("PRIVACY POLICY60")}
            </li>
            <li>{t("PRIVACY POLICY61")}</li>
            <li>{t("PRIVACY POLICY62")}
            </li>
            <li>{t("PRIVACY POLICY63")}</li>
            <li>{t("PRIVACY POLICY64")}</li>
          </ul>
          <p className="mt-8">
            {t("PRIVACY POLICY65")}
          </p>
        </div>
      </div>
    </BuildCustomHtml>
  </>;
}
