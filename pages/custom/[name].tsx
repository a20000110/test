import { GetServerSideProps, GetServerSidePropsContext } from "next";
import axios from "axios";
import { cApiUrl, getLang, getNavProducts, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import { WpCustomPageModelInterface } from "@/lib/service/models/wp_custom_page";
import { BaseAxiosResponse } from "@/lib/types/utils.type";
import { getPageHeadSeo } from "@/lib/hooks/useGetSeo";
import { getPageContentCode } from "@/lib/hooks/useGetPageCode";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";

export const getServerSideProps = async (context: GetServerSidePropsContext<{name:string}>) => {
  try {
    const name = context?.params?.name;
    const result = await axios.get<BaseAxiosResponse<WpCustomPageModelInterface>>(`${cApiUrl}/api/page/custom/get-by-name`, {
      params: {
        router_name: name
      }
    });
    if (result.status !== 200 || result.data?.code !== 200 || !result.data?.data) {
      return {
        notFound: true
      };
    }
    const { page_id, authority } = result.data.data;
    if (authority === 1) {
      const cookies = context.req?.headers.cookie;
      const userInfo = cookies?.split(";").find((item: string) => item.includes("__user__login__info"));
      if (!userInfo) {
        return {
          redirect: {
            destination: "/",
            permanent: false
          }
        };
      }
    }
    const seo = await translatePageSEO(page_id,context.locale)
    const page_code = await translatePageCode(page_id,context.locale);
    return {
      props: {
        seo,
        page_code,
        messages: await getLang(context.locale)
      }
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true
    };
  }
};

export default function CustomPage({
                                     seo,
                                     page_code
                                   }: {
  seo: PageSeoInterface | null,
  page_code: string
}) {
  return <>
    <HeadSeo seo={seo?.data} />
    <BuildCustomHtml html={page_code}>
    </BuildCustomHtml>
  </>;
}
