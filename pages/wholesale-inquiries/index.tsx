import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { GetServerSidePropsContext } from "next";
import { getLang, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import Link from "next/link";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const page_id = 9;
  const seo = await translatePageSEO(page_id, context.locale);
  const page_code = await translatePageCode(page_id, context.locale);
  return {
    props: {
      seo,
      page_code,
      messages: await getLang(context.locale)
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
  const t = useTranslations("inquiries");
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
      <div className=" mx-auto max-w-5xl my-32 py-20">
        <div className="space-y-16">
          <h2 className={"text-3xl mb-8 text-center"}>{t("WHOLESALE-INQUIRIES")}</h2>
          <p>
            {t("Thank-you")}
          </p>
          <p>
            {t("contact")} <Link href={"mailto:linda@lefengjewelry.com"}
                                 className="underline hover:text-main">linda@lefengjewelry.com</Link>
          </p>
        </div>
      </div>
    </BuildCustomHtml>
  </>;
}
