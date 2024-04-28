import { GetServerSidePropsContext, GetStaticProps, GetStaticPropsContext } from "next";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { getLang, getNavProducts, translateFormFields, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import React from "react";
import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";
import { ContactEmail, ContactPhone } from "@/lib/constants/contact";
import SubmitForm, { Fields } from "@/components/Form/Inquiry/submit-form";
import { Disclosure } from "@headlessui/react";
import VideoCard from "@/components/VideoCard";
import { BodyText } from "@/components/BodyText";

const faqs = [
  {
    question: "about.fqa_q1",
    answer: "about.fqa_a1"
  }, {
    question: "about.fqa_q2",
    answer: "about.fqa_a2"
  }, {
    question: "about.fqa_q3",
    answer: "about.fqa_a3"
  }, {
    question: "about.fqa_q4",
    answer: "about.fqa_a4"
  }
];

const Title = ({ titleKey }: { titleKey: string }) => {
  const t = useTranslations();
  return <p className="text-3xl font-bold max-md:text-2xl">{t(titleKey)}</p>;
};

export default function AboutUs({ seo, page_code, fields }: {
  seo: PageSeoInterface | null;
  page_code: string,
  fields: Fields[]
}) {
  const t = useTranslations();
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
      <div
        className="w-full h-[300px] bg-[url('/image/about/about_banner.jpg')] bg-cover bg-no-repeat max-md:h-[180px] max-md:bg-center">
        <div className="container h-full flex flex-col items-start justify-center">
          <p className="Constantia text-5xl font-bold">{t("common.About us")}</p>
          <p className="py-4 s-flex gap-x-2">
            <Link href={"/"}>{(t("common.Home")).toUpperCase()}</Link>
            /
            <span>{(t("common.About us")).toUpperCase()}</span>
          </p>
        </div>
      </div>
      <div className="container py-6 grid grid-cols-3 gap-y-4 gap-x-8 max-md:grid-cols-1 mt-10">
        <div className="w-fit h-fit rounded-md overflow-hidden ">
          <Placeholder src={"/image/about/p08-S02-img.jpg"} imageWidth={450} imageHeight={600} fit="cover" />
        </div>
        <div className="w-fit h-fit rounded-md overflow-hidden mt-20">
          <Placeholder src={"/image/about/p08-s05-img-case-sthudies.jpg"} imageWidth={450} imageHeight={600} fit="cover" />
        </div>
        <div className="c-flex flex-col !items-start">
          <Title titleKey={"about.8e14a0ca67947b41c61892d7130fc1a89d28"} />
          <div className="s-flex flex-col gap-y-6 mt-4 text-mainText">
            <p>{t("about.1bc2cd870cc09a425a2890be84c2f62ffa0e")}</p>
            <p>{t("about.8b117a62bd2b6f44f3c81f5708284919597a")}</p>

          </div>
        </div>
      </div>
      <div className="container py-16 md:flex md:justify-between md:!items-end">
        <div>
          <Title titleKey={"common.Contact Us"} />
          <div className="mt-4 flex justify-start items-start gap-y-3 flex-col">
            <p>{t("about.509f0525ae06ff4e9a2873a60336887c7bc5")}</p>
            <p dangerouslySetInnerHTML={{ __html: t.raw("about.5fb6ad4898987b4b4a780e75aedee3539a0e") }}></p>
            <p>{t("about.54716d1b6031ac426d48cbfc1cd201613312")}</p>
            <p>
              <strong>{t("footer.Tel")}:</strong>
              <Link href={`tel:${ContactPhone}`}>{ContactPhone}</Link>
            </p>
            <p>
              <strong>{t("common.Email")}:</strong>
              <Link href={`mailto:${ContactEmail}`}>{ContactEmail}</Link>
            </p>
            <p>
              {t("about.3d3d0ca9126dd44b01e8a53baa40bddafbfb")}:
            </p>
            <p>
              {t("contact.c3c24240b73842469418ccd5f2977446bfe1")}
            </p>
          </div>
        </div>
        <div className="max-md:mt-4 max-md:flex max-md:justify-center">
          <Placeholder src={"/image/about/Main-06.jpg"} imageWidth={300} imageHeight={300} />
        </div>
      </div>
      <div className="container py-16 grid grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-y-16">
        <div className="md:w-[60%]">
          <Title titleKey={"about.0cd03b8703acec408728771cb0f7b921ca42"} />
          <SubmitForm goods={[{ id: 0, count: 0 }]} title="" formFields={fields} />
        </div>
        <div>
          <Title titleKey={"about.d3af449918a505495ae80faaecc2c74ce3f2"} />
          <div className="bg-white">
            <div className="mx-auto mt-10 max-md:mt-4">
              <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                <dl className="space-y-6 divide-y divide-gray-900/10">
                  {faqs.map((faq, index) => (
                    <Disclosure as="div" key={index} className="pt-6">
                      {({ open }) => (
                        <>
                          <dt>
                            <Disclosure.Button
                              className="flex w-full items-start justify-between text-left text-gray-900">
                              <span className="text-base font-semibold leading-7">{t(faq.question)}</span>
                              <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <i className="ri-arrow-up-s-line ri-xl"></i>
                          ) : (
                            <i className="ri-arrow-down-s-line ri-xl"></i>
                          )}
                        </span>
                            </Disclosure.Button>
                          </dt>
                          <Disclosure.Panel as="dd" className="mt-2 pr-12">
                            <p className="text-base leading-7 text-gray-600">{t(faq.answer)}</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container c-flex py-16">
        <VideoCard subTitle={"about.2edfb1cf8b32d54b8658e9388752021f5ff8"}
                   title={"about.3dc0c175e6179c44576969e7343aa42dff53"}
                   backgroundUrl={"/image/about/v1.jpg"}
                   videoUrl={"https://react005.pinshop.com/wp-content/uploads/2024/04/乐锋介绍视频_33M.mp4"} className="!w-[80%]" />
      </div>
      <div className="container py-16">
        <div>
          <BodyText intent="bold" size="lg" className="max-md:!text-[15px]">
            {t("about.corporate_vision")}
          </BodyText>
          <BodyText size="md" className="py-4 max-md:!text-[13px] text-mainText">
            {t("about.Our_Vision")}
          </BodyText>
          <BodyText intent="bold" size="lg" className="max-md:!text-[15px]">
            {t("about.Our_Mission")}
          </BodyText>
          <BodyText size="md" className="py-4 max-md:!text-[13px] text-mainText">
            {t("about.Provide")}
          </BodyText>
          <div className="mt-8">
            <Link href="/contact" className="pb-1  text-sm font-bold border-b-2 border-b-main">
              {t("common.Read More")}
            </Link>
          </div>
        </div>
      </div>
    </BuildCustomHtml>
  </>;

}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const page_id = 1;
  const promise = await Promise.all([
    translatePageCode(page_id, context.locale),
    translatePageSEO(page_id, context.locale),
    translateFormFields(context.locale),
    getLang(context.locale)
  ]);
  const [page_code, seo, fields, messages] = promise;
  return {
    props: {
      seo,
      page_code,
      fields,
      messages
    }
  };
};
