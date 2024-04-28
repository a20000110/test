import { GetServerSideProps } from "next";
import { cApiUrl, getLang, getNavProducts, getSiteTypeIsTob } from "@/lib/utils/util";
import CenterLayout from "@/components/Layout/center-layout";
import { QueryInquiryResponseDataInterface, QueryInquiryResponseInterface } from "@/pages/api/inquiry/get-inquiry";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { RingLoader } from "react-spinners";
import EmptyState from "@/components/EmptyState";
import { InquiryGetProductResponse } from "@/pages/api/inquiry/get-product";
import { Avatar } from "@/components/Avatar";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { useUserStore } from "@/lib/store/user.store";
import { useLocale, useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { toast } from "react-toastify";

const limit = 10;
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const cookies = context.req?.headers.cookie;
  const userInfo = cookies?.split(";").find((item: string) => item.includes("__user__login__info"));
  if (userInfo && !(await getSiteTypeIsTob())) {
    return {
      props: {
        messages: await getLang(context.locale)
      }
    };
  }
  return {
    redirect: {
      destination: "/" + (context.locale || ""),
      permanent: false
    }
  };
};

const fetchData = async ({
                           page,
                           pageSize = limit,
                           username,
                           setLoading
                         }: {
  page: number,
  pageSize?: number,
  username: string,
  setLoading?: (loading: boolean) => void
}): Promise<QueryInquiryResponseDataInterface | null> => {
  try {
    setLoading && setLoading(true);
    const getInquiry: AxiosResponse<QueryInquiryResponseInterface> = await axios.post("/api/inquiry/get-inquiry", {
      page: page,
      pageSize: pageSize,
      woocommerce_user: username,
      source: 0
    });
    if (getInquiry.status === 200 && getInquiry.data.code === 200) {
      return getInquiry.data.data;
    }
    return null;
  } catch (e) {
    return null;
  } finally {
    setLoading && setLoading(false);
  }
};

const fetchProduct = async (ids: number[]): Promise<InquiryGetProductResponse["data"] | null> => {
  try {
    const res: AxiosResponse<InquiryGetProductResponse> = await axios.get(`/api/inquiry/get-product?ids=${ids.join(",")}`);
    if (res.status === 200 && res.data.code === 200) {
      return res.data.data;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

function Table({ tableData }: {
  tableData: any
}) {
  const statuses = { 1: "text-green-400 bg-green-400/10", 0: "text-rose-400 bg-rose-400/10" };

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const t = useTranslations();
  const [newTableData, setNewTableData] = useState(tableData);
  const locale = useLocale();
  useEffect(() => {
    tableData?.length && translateStaticProps(tableData, ["goods[].name"], "auto", locale).then(res => {
      if (res.length) {
        setNewTableData(res);
      }
    });
  }, [tableData]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    {t("table.Creation_time")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t("table.State")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t("table.Content")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t("table.Product")}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">{t("common.Edit")}</span>
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {newTableData?.map((td: any) => (
                  <tr key={td.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <time dateTime={td.createdAt}>
                        {td.createdAt}
                      </time>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                        <div className={classNames(statuses[td.status as 0 | 1], "flex-none rounded-full p-1")}>
                          <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        <div className="hidden text-gray-900 sm:block">{
                          {
                            0: t("table.unread"),
                            1: t("table.read")
                          }[td.status as 0 | 1]
                        }</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {
                        Object.keys(td.inquiry_info).map((key: string) => {
                          return <p key={key}>
                            <span>{key}:</span>
                            <span>{td.inquiry_info[key]}</span>
                          </p>;
                        })
                      }
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {
                        td.goods.map((item: any) => {
                          return <div key={item.id} className="s-flex">
                            <div className="w-[30px] h-[30px]">
                              <Avatar src={item.image} size="sm" />
                            </div>
                            <Link href={item.link}
                                  className="pl-1 whitespace-break-spaces hover:text-main hover:underline line-clamp-1"
                                  target="_blank">{item.name}</Link>
                            <span className="text-main pl-2">x{item.count}</span>
                          </div>;
                        })
                      }
                    </td>
                    {/*<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">*/}
                    {/*  <a href="#" className="text-indigo-600 hover:text-indigo-900">*/}
                    {/*    Edit<span className="sr-only">, {person.name}</span>*/}
                    {/*  </a>*/}
                    {/*</td>*/}
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CenterInquiry() {
  const [inquiry, setInquiry] = useState<QueryInquiryResponseDataInterface | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useUserStore();
  const t = useTranslations();
  const getData = async (pageVal: number) => {
    setLoading(true);
    fetchData({
      page: pageVal,
      pageSize: limit,
      username: userInfo?.username || ""
    }).then(async res => {
      const goodIds: number[] = [];
      res?.rows?.map(item => {
        item?.goods.map(p => {
          if (p?.id) {
            goodIds.push(p.id);
          }
        });
      });
      if (!goodIds.length) return setLoading(false);
      const product = await fetchProduct(goodIds);
      res?.rows.map(item => {
        item.goods.map((p: any) => {
          if (p?.id) {
            const productInfo = product?.find(item => item.id === p.id);
            if (productInfo) {
              p.name = productInfo.name;
              p.image = productInfo.image;
              p.link = cApiUrl + productInfo.link;
            }
          }
        });
      });
      setLoading(false);
      setInquiry(res);
    }).catch(e => {
      setLoading(false);
      toast(t("message.a620d51a2e9909463bd843ecf702cfdfb9d8"), {
        type: "error"
      });
      console.error(e);
    });
  };
  const handlerPageChange = (val: number) => {
    setPage(val);
  };
  useEffect(() => {
    getData(1);
  }, []);
  return <CenterLayout>
    {
      loading ? <div className="c-flex my-40">
        <RingLoader className="text-main" />
      </div> : inquiry?.count ?
        <div>
          <Table tableData={inquiry.rows} />
          <Pagination limit={limit} page={page} total={inquiry.count} onChange={(val) => {
            handlerPageChange(val);
          }} />
        </div>
        : <EmptyState />
    }
  </CenterLayout>;
}

export default React.memo(CenterInquiry);
