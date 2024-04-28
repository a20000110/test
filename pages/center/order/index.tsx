import CenterLayout from "@/components/Layout/center-layout";
import Pagination from "@/components/Pagination";
import React, { useEffect, useState } from "react";
import { CreateOrderResponseInterface } from "@/lib/types/rest-api/order/create-order.type";
import { useUserStore } from "@/lib/store/user.store";
import axios from "axios";
import { WooGetResponse } from "@/lib/Woocommerce/WooCommerceRApi";
import { toast } from "react-toastify";

import { RingLoader } from "react-spinners";
import moment from "moment";
import { ORDER_STATUS } from "@/lib/constants/order";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { getLang, getNavProducts, getSiteTypeIsTob, getUrlParams } from "@/lib/utils/util";
import { useRouter } from "next/router";
import Modals from "@/components/Modals";
import { BodyText } from "@/components/BodyText";
import { Placeholder } from "@/components/Placeholder";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";
import Link from "next/link";

const limit = 5;

const tableColumns = [{
  title: "order.Order"
}, {
  title: "order.Date"
}, {
  title: "order.Status"
}, {
  title: "order.Total"
}, {
  title: "order.3d1464c10265cc478278bdb2e516148970a6"
}, {
  title: "order.99275e08ddb8e14f08e885e2f422649e41bc"
}, {
  title: "order.Actions"
}];
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
      destination: "/",
      permanent: false
    }
  };
};

function OrderViews({ order }: {
  order: CreateOrderResponseInterface
}) {
  const t = useTranslations();
  const subtotal = (Math.round(order.line_items.reduce((acc, item) => acc + item.quantity * item.price, 0) * 100) / 100).toFixed(2);
  return <div className="w-[600px] max-md:w-[320px] py-2 text-left">
    <h4 className="s-flex">#{order.id}</h4>
    <BodyText className="text-themeGray py-3">
      {t("order.Order")} <span
      className="text-main font-bold">#{order.id}</span> {t("order.f0a65083d6fd4f4e622950d279b6495fee19")} <span
      className="text-main font-bold">{moment(order.date_created).format("YYYY-MM-DD")}</span> {t("order.c8523ff6bbc7e943ffb8f96bb9ed5a6b0ddf")}
      <span className="text-main font-bold">{t(ORDER_STATUS[order.status])}</span>
    </BodyText>

    <h2 className="pt-4 pb-3 font-bold">{t("order.ORDER_DETAILS")}</h2>
    <div className="text-sm font-bold px-4 my-4">
      <div className="b-flex">
        <span>{t("common.Products")}</span>
        <span>{t("common.Total")}</span>
      </div>
      <div className="w-full h-[1px] bg-[#e1e0dc] my-4"></div>
      {
        order.line_items.map((item) => {
          return <div key={item.id}>
            <div className="s-flex">
              <Placeholder src={item.image.src} alt={item.name} imageHeight={50} imageWidth={50} quality={10} />
              <BodyText intent="bold" className="ml-2">
                {item.name} <span> x {item.quantity}</span>
              </BodyText>
            </div>
            <div className="b-flex !items-start">
              <div className="flex flex-col gap-y-3 my-4 text-[12px]">
                {
                  item.meta_data.map((meta, index) => {
                    return meta.display_key !== "_reduced_stock" && <div key={index}>
                      <span>{meta.display_key}</span>:
                      <span>{meta.display_value}</span>
                    </div>;
                  })
                }
              </div>
              <div>{order.currency_symbol}{item.total}</div>
            </div>
            <div className="w-full h-[1px] bg-[#e1e0dc] my-4"></div>
          </div>;
        })
      }
      <div className="b-flex">
        <span>{t("common.Subtotal")}:</span>
        <span>{order.currency_symbol}{subtotal}</span>
      </div>
      <div className="w-full h-[1px] bg-[#e1e0dc] my-4"></div>
      <div className="b-flex">
        <span>{t("order.Payment_method")}:</span>
        <span>{order.payment_method_title}</span>
      </div>
      <div className="w-full h-[1px] bg-[#e1e0dc] my-4"></div>
      <div className="b-flex">
        <span>{t("order.Shipping")} :</span>
        <span>{order.currency_symbol}{order.shipping_total}</span>
      </div>
      <div className="w-full h-[1px] bg-[#e1e0dc] my-4"></div>
      <div className="b-flex text-lg">
        <span>{t("order.Total")}:</span>
        <span>{order.currency_symbol}{order.total}</span>
      </div>
      <div className="w-full h-[1px] bg-[#e1e0dc] my-4"></div>
    </div>
    <h2 className="pt-4 pb-3 font-bold">{t("order.BILLING_ADDRESS")}</h2>
    <address className="my-2 text-[14px]">
      {
        Object.values(order.billing).map((value, index) => {
          return <div key={index}>
            <span>{value}</span>
          </div>;
        })
      }
    </address>
  </div>;
}

function Order() {
  const [orders, setOrders] = useState<CreateOrderResponseInterface[]>();
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const { userInfo } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { setOrderStatus, getPaypalPaymentLink } = useCheckout();
  const router = useRouter();
  const t = useTranslations();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openOrder, setOpenOrder] = useState<CreateOrderResponseInterface | null>(null);
  const fetchOrders = async (customer: string, currentPage: number) => {
    try {
      setLoading(true);
      const res = await axios.get<WooGetResponse<CreateOrderResponseInterface[]>>(`/api/orders/get-list`, {
        params: {
          customer,
          page: currentPage,
          per_page: limit
        }
      });
      if (res.status !== 200 || !res.data.result) {
        throw new Error("Failed to obtain order");
      }
      let result = JSON.parse(JSON.stringify(res.data.result));
      result = (await translateStaticProps(result, ["line_items[].name"], "auto", router.locale)) as CreateOrderResponseInterface[];
      setOrders(() => {
        const data = result;
        const cancel_orderId = getUrlParams().get("cancel_orderId");
        const hold_orderId = getUrlParams().get("hold_orderId");
        if (hold_orderId) {
          data.map((order: CreateOrderResponseInterface) => {
            if (order.id === +hold_orderId) {
              order.status = "on-hold";
            }
            return order;
          });
        }
        if (cancel_orderId) {
          setOrderStatus(+cancel_orderId, "cancelled");
          data.map((order: CreateOrderResponseInterface) => {
            if (order.id === +cancel_orderId) {
              order.status = "cancelled";
            }
            return order;
          });
        }
        router.push("/center/order");
        return data;
      });
      setOrderTotal(res.data.total);
    } catch (e: any) {
      e.message && typeof e.message === "string" && toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handlerChangePage = (val: number) => {
    setPage(val);
    userInfo && userInfo.id && fetchOrders(userInfo.id, val);
  };

  const handlerOrderCancel = async (orderId: number) => {
    const res = await setOrderStatus(orderId, "cancelled");
    if (res?.status === "cancelled") {
      toast.success(t("message.49197988dc35584002a804fccab310931695"));
      setOrders(old => {
        return old ? old.map(order => {
          if (order.id === orderId) {
            order.status = "cancelled";
          }
          return order;
        }) : old;
      });
    }
  };

  const handlerOrderPayLink = async (order: CreateOrderResponseInterface) => {
    const link = await getPaypalPaymentLink(order);
    link && window.open(link, "_self");
  };

  const getOrderLogisticsInfo = (meta_data: CreateOrderResponseInterface["meta_data"]) => {
    const logistics: {
      company: string;
      companyLink: string;
      orderNumber: string;
    } = meta_data.find(item => item.key === "logistics")?.value as {
      company: string;
      companyLink: string;
      orderNumber: string;
    };
    return logistics || {
      company: "",
      companyLink: "",
      orderNumber: ""
    };
  };

  useEffect(() => {
    userInfo && userInfo.id && fetchOrders(userInfo.id, page);
  }, []);
  return <CenterLayout>
    {
      loading ?
        <div className="h-[20vh] c-flex">
          <RingLoader className="text-main c-flex" size={60} />
        </div> :
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                  <tr>
                    {
                      tableColumns.map((item, index) => {
                        return <th scope="col" key={index}
                                   className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          {t(item.title)}
                        </th>;
                      })
                    }
                    <th scope="col" className="relative py-3.5 pl-3 px-2 sm:pr-0">
                      <span className="sr-only">{t("common.Edit")}</span>
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {
                    orders?.map(item => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                          {"#" + item.id}
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                          {moment(item.date_created).format("YYYY-MM-DD")}
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                          {t(ORDER_STATUS[item.status])}
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                          <span className="text-[#f59a57]">
                            {item.currency_symbol}{item.total}
                          </span>
                          <span>{t("order.af2184be09f93f45aa28bf638a3ae350fb23", { length: item.line_items.length })}</span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                          {
                            getOrderLogisticsInfo(item.meta_data).orderNumber
                          }
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-sm text-blue-500">
                          <a href={getOrderLogisticsInfo(item.meta_data).companyLink} target={"_blank"}>
                            {getOrderLogisticsInfo(item.meta_data).companyLink}
                          </a>
                        </td>
                        <td className="relative s-flex px-2 gap-x-2 whitespace-nowrap py-4 text-sm font-medium">
                          {
                            item.status === "pending" &&
                            <span className="text-indigo-600 cursor-pointer hover:text-indigo-900" onClick={() => {
                              handlerOrderPayLink(item);
                            }}>
                            {t("order.Pay")}
                          </span>
                          }
                          <span className="text-indigo-600 cursor-pointer hover:text-indigo-900" onClick={() => {
                            setOpenOrder(item);
                            setOpenModal(true);
                          }}>
                            {t("common.View")}
                          </span>
                          {
                            item.status === "pending" &&
                            <span className="text-indigo-600 cursor-pointer hover:text-indigo-900" onClick={() => {
                              handlerOrderCancel(item.id);
                            }}>
                            {t("order.Cancel")}
                          </span>
                          }
                        </td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    }
    {
      !!orderTotal && <Pagination limit={limit} page={page} total={orderTotal} onChange={(val) => {
        handlerChangePage(val);
      }} />
    }
    <Modals open={openModal} setOpen={setOpenModal} top="10vh">
      {
        openOrder && <OrderViews order={openOrder} />
      }
    </Modals>
  </CenterLayout>;
}

export default React.memo(Order);
