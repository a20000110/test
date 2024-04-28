import SubmitForm, { Fields } from "@/components/Form/Inquiry/submit-form";
import { ContactEmail, ContactPhone } from "@/lib/constants/contact";
import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { getLang, getNavProducts, translateFormFields, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import Slogon from "@/components/slogon";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const page_id = 4;
  try {
    const formFields = await translateFormFields(context.locale);
    const seo = await translatePageSEO(page_id, context.locale);
    const page_code = await translatePageCode(page_id, context.locale);
    return {
      props: {
        formFields,
        seo,
        page_code,
        messages: await getLang(context.locale)
      },
      revalidate: REVA_DATE
    };
  } catch (e) {
    return {
      props: {
        formFields: [],
        seo: null,
        page_code: ""
      },
      revalidate: REVA_DATE
    };
  }
};

export default function Contact({ formFields, seo, page_code }: {
  formFields: Fields[],
  seo: PageSeoInterface | null,
  page_code: string
}) {
  const t = useTranslations();
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
      <Slogon />
      <div className="relative isolate bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 items-center">
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div
                className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
                <svg
                  className="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                      width={200}
                      height={200}
                      x="100%"
                      y={-1}
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M130 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" strokeWidth={0} fill="white" />
                  <svg x="100%" y={-1} className="overflow-visible fill-gray-50">
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
                </svg>
              </div>
              <h2
                className="Constantia text-3xl font-bold tracking-tight text-gray-900">{t("contact.d68bbd5065b263419909fba0114a63b42cd6")}</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {t("contact.c6c7e9fd4913874309a89e33e39cf6a745d2")}
              </p>
              <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">{t("common.Address")}</span>
                    <i className="ri-community-line ri-xl text-gray-400"></i>
                  </dt>
                  <dd>
                    {t("contact.c3c24240b73842469418ccd5f2977446bfe1")}86-020-37417257
                  </dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">{t("contact.Telephone")}</span>
                    <i className="ri-phone-line ri-xl text-gray-400"></i>
                  </dt>
                  <dd>
                    <a className="hover:text-gray-900" href={`tel:${ContactPhone}`}>
                      {ContactPhone}
                    </a>
                  </dd>
                </div>
                <div className=" flex gap-x-4">
                  <dt className=" flex-none">
                    <span className=" sr-only">{t("common.Email")}</span>
                    <i className="ri-mail-line ri-xl text-gray-400"></i>
                  </dt>
                  <dd>
                    <a className=" hover:text-gray-900" href={`mailto:${ContactEmail}`}>
                      {ContactEmail}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="px-6 py-20 md:pb-24 md:pt-20 sm:pb-32 lg:px-8">
            <SubmitForm goods={[{ id: 0, count: 0 }]} title="" formFields={formFields} />
          </div>
        </div>
      </div>
    </BuildCustomHtml>
  </>;
}
