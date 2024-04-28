import Link from "next/link";
import { useTranslations } from "next-intl";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { getLang } from "@/lib/utils/util";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      messages: await getLang(context.locale)
    }
  };
};
export default function NotFound() {
  const t = useTranslations();
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 h-[50vh]">
        <div className="text-center">
          <p className="text-base font-semibold text-main">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{t("message.5ac70b9874e49045904b156ffb9d5edb1360")}</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">{t("message.4b15a6d0a875c2494ec8419438cc0ebd3228")}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-main px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-themeSecondary700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("message.708ac198542190400a6814bcf21267c96967")}
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-900">
              {t("message.ffc1759f514ca74bcf69f07c18bebdbb48aa")}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
