import { Fields } from "@/components/Form/Inquiry/submit-form";
import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { getLang, getNavProducts, translateFormFields, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import Link from "next/link";
import React from "react";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const page_id = 22;
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

export default function Services({ seo, page_code }: {
  formFields: Fields[],
  seo: PageSeoInterface | null,
  page_code: string
}) {
  const t = useTranslations("services");
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
      <div
        className="md:h-[500px] h-[300px] w-full bg-cover flex flex-col justify-center bg-center bg-no-repeat items-center opacity-80 "
        style={{ backgroundImage: `url(/image/services/severs-banner.jpg)` }}>
        <div className="container text-center  py-20 ">
          <h2
            className=" mb-6 text-2xl md:text-6xl font-bold text-black Constantia ">{t("Custom_Jewelry_Services")}</h2>
          <p className="text-xl Constantia text-black">{t("h1")}</p>
        </div>
      </div>
      <div className="container mt-20">
        <h2 className="text-center text-4xl Constantia font-bold my-8">{t("One-Stop")}</h2>
        <p className="text-center mx-auto max-w-[1200px] ">{t("One-Stop1")}
        </p>
        <div className="flex justify-center items-center my-8">
          <img src="/image/about/p06-s02-img.jpg" alt="" />
        </div>

      </div>
      <EasySteps />
      <ContactUs />
    </BuildCustomHtml>

  </>;
}
const EasySteps = () => {
  const t = useTranslations("services");
  return (
    <div className="mx-auto max-w-[1200px] my-20 space-y-10">
      <h2 className="text-center text-4xl Constantia font-bold my-8">{t("s1")}</h2>
      {/*1*/}
      <div className="flex flex-col md:flex-row gap-8 items-center p-5 md:p-0">
        <div className="md:basis-1/3 space-y-6">
          <div className="w-1/3">
            <img src="/image/services/p06-s03-title-01.png" alt="" />
          </div>
          <h3 className="Constantia font-bold text-3xl">{t("s1-1")}</h3>
          <p>
            {t("s1-2")}
          </p>
          <p>
            {t("s1-3")}
          </p>
          <Link href={"/contact"} className="underline hover:text-red-600">
            {t("s1-4")}
          </Link>
        </div>
        <div className="md:basis-2/3">
          <img src="/image/services/p06-s03-img-01.jpg" alt="" className="w-full" />
        </div>
      </div>
      {/*2*/}
      <div className="flex  gap-8 items-center p-5 md:p-0 flex-col-reverse md:flex-row">
        <div className="md:basis-2/3">
          <img src="/image/services/p06-s03-img-02.jpg" alt="" className="w-full" />
        </div>
        <div className="md:basis-1/3 space-y-6">
          <div className="w-1/3">
            <img src="/image/services/p06-s03-title-02.png" alt="" />
          </div>
          <h3 className="Constantia font-bold text-3xl">{t("s2-1")}</h3>
          <p>{t("s2-2")}</p>
          <ul className="space-y-2">
            <li className="flex items-center">
                <span className="mr-2 inline-block h-10 w-10 md:w-10 md:h-8 bg-no-repeat bg-center"
                      style={{ backgroundImage: `url(/image/home/li.svg)` }}></span>
              {t("s2-3")}
            </li>
            <p className="ml-4 text-gray-500">{t("s2-4")}</p>
            <li className="flex items-center">
                <span className="mr-2 inline-block h-10 w-10 md:w-10 md:h-8 bg-no-repeat bg-center"
                      style={{ backgroundImage: `url(/image/home/li.svg)` }}></span>
              {t("s2-5")}
            </li>
            <p className="ml-4 text-gray-500">{t("s2-6")}</p>
          </ul>
        </div>
      </div>
      {/*3*/}
      <div className="flex flex-col md:flex-row gap-8 items-center p-5 md:p-0">
        <div className="md:basis-1/3 space-y-6">
          <div className="w-1/3">
            <img src="/image/services/p06-s03-title-03.png" alt="" />
          </div>
          <h3 className="Constantia font-bold text-3xl">{t("s3-1")}</h3>
          <p>
            {t("s3-2")}
          </p>
        </div>
        <div className="md:basis-2/3">
          <img src="/image/services/p06-s03-img-03.jpg" alt="" className="w-full" />
        </div>
      </div>
      {/*4*/}
      <div className="flex  gap-8 items-center p-5 md:p-0 flex-col-reverse md:flex-row">
        <div className="md:basis-2/3">
          <img src="/image/services/p06-s03-img-04.jpg" alt="" className="w-full" />
        </div>
        <div className="md:basis-1/3 space-y-6">
          <div className="w-1/3">
            <img src="/image/services/p06-s03-title-04.png" alt="" />
          </div>
          <h3 className="Constantia font-bold text-3xl">{t("s4-1")}</h3>
          <p>{t("s4-2")}</p>
        </div>
      </div>
      {/*5*/}
      <div className="flex flex-col md:flex-row gap-8 items-center p-5 md:p-0">
        <div className="md:basis-1/3 space-y-6">
          <div className="w-1/3">
            <img src="/image/services/p06-s03-title-05.png" alt="" />
          </div>
          <h3 className="Constantia font-bold text-3xl">{t("s5-1")}</h3>
          <p>
            {t("s5-2")}
          </p>
          <p>{t("s5-3")}</p>
        </div>
        <div className="md:basis-2/3">
          <img src="/image/services/p06-s03-img-05.jpg" alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
};

const ContactUs = () => {
  const t = useTranslations("services");
  return (
    <div className="bg-main md:pb-16 pt-8 pb-6">
      <div className="mx-auto max-w-[1200px] flex gap-4 p-5 md:p-0 md:items-end md:flex-row flex-col">
        <h2 className="Constantia text-4xl md:text-4xl lg:text-5xl text-white">
          {t("s6-1")}
        </h2>
        <Link href={"/contact"}>
          <button
            className="rounded-full bg-white text-main px-8 py-3 mt-10 transition duration-300 ease-in-out transform hover:scale-110">
            {t("s6-2")}
          </button>
        </Link>
      </div>

    </div>
  );
};
