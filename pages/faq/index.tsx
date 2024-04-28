import SubmitForm, { Fields } from "@/components/Form/Inquiry/submit-form";
import { ContactEmail, ContactPhone } from "@/lib/constants/contact";
import { REVA_DATE } from "@/lib/constants";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { getLang, getNavProducts, translateFormFields, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import FAQAccordion from "@/components/Faq";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const page_id = 21;
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

export default function Contact({ seo, page_code, formFields }: {
  formFields: Fields[],
  seo: PageSeoInterface | null,
  page_code: string
}) {
  const t = useTranslations();

  // 假设的FAQ数据
  const faqs = [
    {
      question: "about.fqa_q1",
      answer: "about.fqa_a1"
    },
    {
      question: "about.fqa_q2",
      answer: "about.fqa_a2"
    },
    {
      question: "about.fqa_q3",
      answer: "about.fqa_a3"
    },
    {
      question: "about.fqa_q4",
      answer: "about.fqa_a4"
    },{
      question: "about.fqa_q5",
      answer: "about.fqa_a5"
    },
    {
      question: "about.fqa_q6",
      answer: "about.fqa_a6"
    },
    {
      question: "about.fqa_q7",
      answer: "about.fqa_a7"
    },{
      question: "about.fqa_q8",
      answer: "about.fqa_a8"
    },{
      question: "about.fqa_q9",
      answer: "about.fqa_a9"
    },{
      question: "about.fqa_q10",
      answer: "about.fqa_a10"
    },{
      question: "about.fqa_q11",
      answer: "about.fqa_a11"
    },{
      question: "about.fqa_q12",
      answer: "about.fqa_a12"
    },

    // 更多FAQs...
  ];

  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code} />
    {/* 其他页面内容... */}
    <div></div>
    <div className="my-20">
      <FAQAccordion faqs={faqs} />
    </div>


  </>;
}
