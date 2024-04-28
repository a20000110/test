import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Country, ICountry, IState } from "country-state-city";
import { RingLoader } from "react-spinners";
import { Placeholder } from "@/components/Placeholder";
import { useRouter } from "next/router";
import { byMinorUnit, isDev, pageStaticProps } from "@/lib/utils/util";
import { BodyText } from "@/components/BodyText";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import EmptyState from "@/components/EmptyState";
import Step, { StepStatus } from "@/components/Step";
import { useUserStore } from "@/lib/store/user.store";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { Button } from "@/components/Button";
import Link from "next/link";
import { siteStore } from "@/lib/store/site.store";
import { useLocale, useTranslations } from "next-intl";
import { GetServerSidePropsContext } from "next";
import { Breadcrumb } from "@/components/Breadcrumbs";
import { useCountry } from "@/lib/hooks/useCountry";
import { SettingInterface } from "@/lib/types/rest-api/setting.type";
import { CartContent } from "@/components/Product/ShoppingCart/cartContent";
import { useShoppingCartStore } from "@/lib/store/shoppingCart.store";
import { toast } from "react-toastify";
import axios from "axios";
import { CreateOrderResponseInterface } from "@/lib/types/rest-api/order/create-order.type";
import { useCart } from "@/lib/hooks/cart/useCart";
import { useUpdateCustomer } from "@/lib/hooks/user/useUserUpdate";
import { RetrieveShipping } from "@/lib/types/rest-api/user/retrieve.type";
import clsx from "clsx";
import { Shipping } from "@/components/Checkout/shipping";
import PayMeth from "@/components/Checkout/paymeth";
import { CartResponse, CartTotals } from "@/lib/hooks/cart/@types";
import { OrderSum } from "@/components/Checkout/orderSum";


type LinesItems = {
  product_id?: number,
  variation_id?: number,
  quantity: number,
  meta_data?: {
    key: string;
    value: string;
  }[]
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const page_id = 8;
  return await pageStaticProps({
    page_id, locale: context.locale
  });


};

let pollCount = 10;


const AccountInfo = ({
                       cOrderId,
                       email
                     }: {
  cOrderId: number | string,
  email: string,
}) => {
  const t = useTranslations();
  return <div className="my-10 p-4 bg-white rounded-md font-bold grid grid-cols-1 gap-y-3">
    {
      cOrderId && <p>{t("checkout.67d229c330a0b9415c8810d8b5918bd976a7")}: <span
        className="font-medium">#{cOrderId}</span></p>
    }
    <p>{t("checkout.10bf4b1d8021244ebb08bbb544aa6731c2f4")}: <span
      className="font-medium">{email}</span></p>
    <p>{t("checkout.37d725c0ae9f954a646832f6cd0cebb7a390")}: </p>
    <p>{t("checkout.d99d8d00bb7c944a85086fba3e26aec9ce0c")}: <span
      className="font-medium">91600002988</span></p>
    <p>{t("checkout.e26eebf1e8194a458bf8513a927caae936ad")}: <span className="font-medium">Guangzhou LeFeng Jewelry Co., Ltd.</span>
    </p>
    <p>{t("checkout.ac39a0a4fa2379498d78453cfd5d7fa8f7cf")}: <span className="font-medium">USD EUR GBP HKD CNH AUD CAD JPY CHF DKK NOK NZD
                  SEK SGD ZAR</span></p>
    <p>{t("checkout.37fffe5aacece0453819bfdc7be1da390140")}: <span className="font-medium">CITIBANK N.A. SINGAPORE BRANCH </span>
    </p>
    <p>{t("checkout.20bb3d8f4bee4c40d7486bab0c1f3f7b24a2")}: <span className="font-medium">Singapore</span>
    </p>
    <p>{t("checkout.978491aec44aff44bf090ec451b2d7b26eba")}: <span className="font-medium">3 Changi Business, Park Crescent, #07-00,
                  Singapore 486026 </span></p>
    <p>{t("checkout.c92fb53a7aa1ef422709410e9aafb7be34eb")}: <span className="font-medium">Current</span>
    </p>
    <p>{t("checkout.520f300d899c5a4bc9fb66f9c82fe050cb51")}: <span
      className="font-medium">CITISGSGXXX</span></p>
    <p>{t("checkout.a2a14af89214b94d876a78ad2bd67233b34d")}:<span className="font-medium"> 7214001</span>
    </p>
    <p>{t("checkout.ce85669279887c43ac09c46f879ffef6ec28")}: <span className="font-medium">Ruifeng Liu Guangzhou Guangdong China</span>
    </p>
  </div>;
};

function Checkout({ formLoader, seo }: { formLoader: boolean, seo: PageSeoInterface | null }) {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
    getValues: getFormValues
  } = useForm({
    mode: "onBlur"
  });
  const { clearCart, getCartTotalByShipping } = useCart();
  const { customer, updateCustomerShippingAddress } = useUpdateCustomer();
  const { cartList, setCartList } = useShoppingCartStore();
  const [cartData, setCartData] = useState(cartList);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<ICountry[]>(Country.getAllCountries());
  const [state, setState] = useState<IState[] | null>(null);
  const router = useRouter();
  const [activeId, setActiveId] = useState(1);
  const locale = useLocale();
  const { userInfo } = useUserStore();
  const { getPaypalPaymentLink, pollOrderStatus, setOrderStatus } = useCheckout();
  const [orderStatusText, setOrderStatusText] = useState<string>(t("message.db061d7ad349624a868aa8a585db77fccca3"));
  const { isBtob } = siteStore();
  const [cOrderId, setOrderId] = useState<string | number>();
  const [setting, setSetting] = useState<SettingInterface>();
  const { getCountryList, getStateListByCode } = useCountry();
  const [userShipping, setUserShipping] = useState<RetrieveShipping>();
  const [showForm, setShowForm] = useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [orderSummary, setOrderSummary] = useState<CartTotals.RootObject | null>(null);
  // 选中地区
  const handleChangeCountry = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("state", "");
    const state = await getStateListByCode(e.target.value);
    setState(state);
  };

  // 生成订单产品信息
  const generateOrderProduct = () => {
    let data: LinesItems[] = [];
    cartData?.items.map(item => {
      if (item.meta.product_type === "simple") {
        let where: LinesItems = {
          product_id: item.id,
          quantity: item.quantity.value
        };
        if (!Array.isArray(item.cart_item_data) && !!Object.keys(item.cart_item_data).length) {
          where.meta_data = Object.keys(item.cart_item_data).map(k => {
            return {
              key: k,
              // @ts-ignore
              value: item.cart_item_data[k]
            };
          });
        }
        // 简单产品
        data.push(where);
      } else {
        // 可变产品
        data.push({
          quantity: item.quantity.value,
          variation_id: item.id
        });
      }
    });
    return data;
  };

  const onSubmit = async (data: any) => {
    if (!cartData) return;
    if (!userInfo) {
      toast(t("message.1a0ec3c72a531b4791288d44a37faf6da886"), {
        type: "warning"
      });
      const login = document.querySelector("#web-login")!;
      // @ts-ignore
      login.click();
      return;
    }
    setLoading(true);
    if (showForm) { // 显示表单的时候为创建地址
      try {
        const updateShipping = await updateCustomerShippingAddress(data);
        setUserShipping(updateShipping?.shipping);
        setLoading(false);
        setShowForm(false);
        toast.success(t("message.c1d1b0fe14107a4782b8836e84bcf8f55e94"));
      } catch (e) {
        toast.error(t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"));
      } finally {
        setLoading(false);
      }
      return;
    }
    const minor_unit = cartData?.currency?.currency_minor_unit || 2;

    const orderData: any = {
      customer_id: userInfo?.id, // 用户ID
      payment_method: "paypal", // 支付方式
      payment_method_title: "PayPal", // 支付方式标题
      set_paid: false, // 是否已支付
      billing: customer?.result.billing || data,// 客户账单信息
      shipping: customer?.result.shipping || data,// 客户配送信息
      line_items: generateOrderProduct(), // 订单产品信息
      discount_total: cartData?.totals?.discount_total ? byMinorUnit(cartData?.totals?.discount_total, minor_unit) : 0, // 折扣总计
      discount_tax: cartData?.totals?.discount_tax ? byMinorUnit(cartData?.totals?.discount_tax, minor_unit) : 0, // 折扣税
      shipping_total: cartData?.totals?.shipping_total ? byMinorUnit(cartData?.totals?.shipping_total, minor_unit) : 0, // 运费总计
      shipping_tax: cartData?.totals?.shipping_tax ? byMinorUnit(cartData?.totals?.shipping_tax, minor_unit) : 0, // 运费税
      total_tax: cartData?.totals?.total_tax ? byMinorUnit(cartData?.totals?.total_tax, minor_unit) : 0, // 税总计
      prices_include_tax: true
    };
    if (cartData?.needs_shipping && selectedDeliveryMethod && cartData?.shipping?.packages?.default.rates[selectedDeliveryMethod]) {
      const rates = cartData.shipping.packages.default.rates[selectedDeliveryMethod];
      orderData.shipping_lines = [ // 运费信息
        {
          method_id: rates.method_id, // 运送方式ID
          method_title: rates.label,
          total: rates?.cost ? byMinorUnit(rates.cost, minor_unit).toString() : "0",
          total_tax: rates?.taxes ? byMinorUnit(rates.taxes, minor_unit).toString() : "0"
        }
      ];
    }
    try {
      const response = await axios.post<CreateOrderResponseInterface>("/api/orders", orderData);
      setOrderId(response.data.id);
      const link = await getPaypalPaymentLink(response.data);
      link && window.open(link, isDev ? "_blank" : "_self");
      setActiveId(2);
      router.push("/checkout", {
        query: {
          orderId: response.data.id
        }
      });
      if (response?.data) {
        toast(t("message.64c503562f60be424d98720dfc5217478d92"), {
          type: "success"
        });
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  const stepsStatus = (id: number) => {
    const status: StepStatus[] = ["complete", "current", "incomplete"];
    if (activeId === 3) return status[0];
    if (id === activeId) return status[1];
    if (id < activeId) return status[0];
  };

  const fetchOrderStatus = () => {
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    if (!orderId || typeof +orderId !== "number" || activeId === 3) return;
    setOrderId(+orderId);
    setActiveId(2);
    const fetchOrder = async () => {
      setOrderStatusText(t("message.db061d7ad349624a868aa8a585db77fccca3"));
      orderId && pollOrderStatus(+orderId).then(res => {
        pollCount = pollCount - 1;
        if (pollCount === 0) {
          setOrderStatusText(t("message.173037d4b31378424ac9b04ce70bb3a6726d"));
          pollCount = 10;
          return;
        }
        if (res?.status) {
          if (["pending", "processing"].includes(res.status)) {
            activeId === 2 && fetchOrder();
            return;
          }
          if (["on-hold", "completed"].includes(res.status)) {
            setActiveId(3);
            clearCart();
          }
          if (["cancelled" + "failed"].includes(res.status)) {
            setOrderStatusText(t("message.3ad7afeff3e19841cdc94798643d61fdc568"));
            setActiveId(1);
            router.push("/checkout");
          }
        }
      });
    };
    activeId === 2 && fetchOrder();
  };
  useEffect(() => {
    const orderId = router.query.cancel_orderId;
    if (!orderId || typeof +orderId !== "number" || activeId === 3) return;
    setOrderId(+orderId);
    setActiveId(2);
    setOrderStatusText(t("message.343295065cb2034325e8bca0a3c3fd000ad3"));
    // 判断订单ID和用户的id是否匹配
    pollOrderStatus(+orderId).then(async res => {
      if (res?.customer_id && userInfo?.id) {
        if (+res.customer_id === +userInfo.id) {
          const statusResult = await setOrderStatus(res.id, "cancelled");
          if (statusResult && statusResult.status === "cancelled") {
            setOrderStatusText(t("message.cfbe93bc0a047a4aed68ef5450460c2ab656"));
          }
        } else {
          setOrderStatusText(t("message.14ee5301e3531c463898732f2b28c504e576"));
        }
      } else {
        setOrderStatusText(t("message.0baa7b8947b9944ce5b892f9c6fa55f8eb6a"));
      }
    }).catch(e => {
      setOrderStatusText(t("message.992927fdf02f37435439e1e6ea75a2dbf027"));
    });
  }, [router.query]);
  useEffect(() => {
    fetchOrderStatus();
    if (isBtob) {
      if (activeId === 1) {
        router.push("/");
      }
    }
  }, [activeId]);

  useEffect(() => {
    getCountryList().then(res => {
      res.length && setCountry(res);
    });
    const { country } = getFormValues();
    if (country) {
      getStateListByCode(country).then(res => {
        res.length && setState(res);
      });
    }
  }, [locale]);
  useEffect(() => {
    fetch("/api/setting/paypal").then(async res => {
      const r = await res.json();
      setSetting(r.data as SettingInterface);
    });
  }, []);

  useEffect(() => {
    setCartData(cartList);
    const handler = async () => {
      if (cartList?.customer?.shipping_address?.shipping_country) {
        const state = await getStateListByCode(cartList.customer.shipping_address.shipping_country);
        setState(state);
      }
    };
    handler();
    cartList?.shipping?.packages?.default?.chosen_method && setSelectedDeliveryMethod(cartList.shipping.packages.default.chosen_method);
  }, [cartList]);
  useEffect(() => {
    setUserShipping(customer?.result?.shipping);
  }, [customer]);
  useEffect(() => {
    const shipping = userShipping;
    const flag = shipping && Object.values(shipping).length;
    if (shipping && flag) {
      reset();
      Object.keys(shipping).map(key => {
        // @ts-ignore
        setValue(key, shipping[key] || "");
      });
      if (state?.length) {
        Object.keys(shipping).map(key => {
          if (key === "state") {
            // @ts-ignore
            setValue(key, shipping[key] || "");
          }
        });
      }
    }
  }, [userShipping, state]);

  useEffect(() => {
    if (selectedDeliveryMethod) {
      const newValue = JSON.parse(JSON.stringify(cartData)) as CartResponse.RootObject | null;
      if (newValue) {
        const rates = newValue.shipping.packages.default.rates[selectedDeliveryMethod];
        getCartTotalByShipping({
          total: byMinorUnit(rates.cost, cartData?.currency?.currency_minor_unit || 2).toString()
        }).then(res => {
          setOrderSummary(res);
        });
      }
    }
  }, [selectedDeliveryMethod, cartList]);

  return <>
    <HeadSeo seo={seo?.data} />
    <Breadcrumb name={t("common.Checkout")} />
    <div className="bg-themeSecondary100">
      <Step
        steps={[{
          id: 1,
          name: t("message.cfe62e95200fa44dc3f8874281d7421873f4"),
          active: activeId === 1,
          status: stepsStatus(1),
          children: <div className="container">
            {
              !cartData?.item_count ? <EmptyState /> : <div className="lg:flex grid gap-10 pt-8 pb-28">
                <div className="2xl:w-3/4 lg:w-2/3 w-11/12 mx-auto">
                  <div className="bg-white shadow-md rounded-xl overflow-hidden p-6 relative">
                    <div className=" grid lg:gap-3 gap-8">
                      <div className="flex p-2.5 bg-themeLightGray rounded font-medium text-xl text-themeDark mb-6">
                        <h3
                          className="w-full md:w-4/12 sm:w-5/12 ml-2">{t("checkout.86317421d9bc62436858c0333136cb6c40e6")}</h3>
                      </div>
                      {/* Form input lists */}
                      {cartData && Object.keys(cartData).length > 0 && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <p
                            className="mb-2 text-[18px]">{t("checkout.50bbaec2acfc624b37c8ed228cf90903d988")}</p>
                          <div className={clsx("w-full gap-8", showForm ? "grid" : "hidden")}>
                            <div className="text-blue-500 cursor-pointer"
                                 onClick={() => setShowForm(false)}>{t("checkout.Return")}</div>
                            {/* First Name & Last Name */}
                            <div className="sm:flex grid sm:gap-5 gap-8">
                              {/* First Name */}
                              <div className="sm:w-1/2 w-full">
                                <div className="relative">
                                  <label
                                    className={`absolute -top-2 ${errors.first_name ? "text-red-400" : "text-[#85929E]"
                                    } left-3 bg-white text-xs`}
                                    htmlFor="first_name"
                                  >
                                    {t("form.f788c9b20398a5481f38c08cf68f2cb8c964")}
                                  </label>
                                  <input
                                    className={`appearance-none border rounded-md w-full py-3.5 px-5 ${errors.first_name ? "border-red-400" : "border-[#DDE6F5]"
                                    } text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline`}
                                    type="text"
                                    placeholder={t("form.f788c9b20398a5481f38c08cf68f2cb8c964")}
                                    id="first_name"
                                    {...register("first_name", {
                                      required: t("message.f5414f2236ca1a42db98da7c6b796fbbf035")
                                    })}
                                  />
                                </div>
                              </div>
                              {/* Last Name */}
                              <div className="sm:w-1/2 w-full">
                                <div className="relative">
                                  <label
                                    className={`absolute -top-2 ${errors.last_name ? "text-red-400" : "text-[#85929E]"
                                    } left-3 bg-white text-xs`}
                                    htmlFor="last_name"
                                  >
                                    {t("form.2bb382a16eab9d446ac91af90ce99c3cc7f8")}
                                  </label>
                                  <input
                                    className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.last_name ? "border-red-400" : "border-[#DDE6F5]"
                                    }`}
                                    type="text"
                                    placeholder={t("form.2bb382a16eab9d446ac91af90ce99c3cc7f8")}
                                    id="last_name"
                                    {...register("last_name", {
                                      required: t("message.8fb4bc206b4dd947543999d66757d14712e6")
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* company name & country */}
                            <div className="sm:flex grid sm:gap-5 gap-8">
                              {/* Company name */}
                              <div className="sm:w-1/2 w-full">
                                <div className="relative">
                                  <label className="absolute -top-2 text-[#85929E] left-3 bg-white text-xs"
                                         htmlFor="company">
                                    {t("checkout.50d8b5d2a6636b442d08250ad47532b73fd5")}
                                  </label>
                                  <input
                                    className="appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 border-[#DDE6F5] leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline"
                                    type="text"
                                    placeholder={t("form.c0b9782f9dec7d44b00be190c883b25e35f0")}
                                    id="company"
                                    {...register("company")}
                                  />
                                </div>
                              </div>
                              {/* Country / Region */}
                              <div className="sm:w-1/2 w-full">
                                <div className="relative">
                                  <label
                                    className={`absolute -top-2 ${errors.country ? "text-red-400" : "text-[#85929E]"
                                    } left-3 bg-white text-xs`}
                                    htmlFor="country"
                                  >
                                    {t("checkout.eae6597b15706c40889b12521a6e903edff3")}
                                  </label>
                                  <select
                                    title={t("form.country")}
                                    className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.country ? "border-red-400" : "border-[#DDE6F5]"
                                    }`}
                                    {...register("country", {
                                      required: t("message.562a4f23b5987749455830dffe3b68e567e2")
                                    })}
                                    onChange={handleChangeCountry}
                                  >
                                    <option value="">{t("checkout.861db9266e3bf743b5c84bb5b8de3b67ebcc")}</option>
                                    {country.map((item, index) => (
                                      <option key={index} value={item.isoCode}>
                                        {item.flag} {item.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            {/* Street address */}
                            <div className="sm:flex grid sm:gap-5 gap-8">
                              <div className="w-full">
                                <div className="relative">
                                  <label
                                    className={`absolute -top-2 ${errors.address_1 ? "text-red-400" : "text-[#85929E]"
                                    } left-3 bg-white text-xs`}
                                    htmlFor="address_1"
                                  >
                                    {t("checkout.7db196092b824b40ca89655c15feadaf064e")}
                                  </label>
                                  <input
                                    className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.address_1 ? "border-red-400" : "border-[#DDE6F5]"
                                    }`}
                                    type="text"
                                    placeholder={t("common.Address")}
                                    id="address_1"
                                    {...register("address_1", {
                                      required: t("message.c9183efb9d6f184d03390158cd782f83a406")
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* Town / City & District */}
                            <div className="sm:flex grid sm:gap-5 gap-8">
                              {/* Town / City */}
                              <div className="sm:w-1/2 w-full">
                                <div className="relative">
                                  <label
                                    className={`absolute -top-2 ${errors.city ? "text-red-400" : "text-[#85929E]"
                                    } left-3 bg-white text-xs`}
                                    htmlFor="city"
                                  >
                                    {t("checkout.db41a8b095d4e045dec8e41ee7b29f79a6e7")}
                                  </label>
                                  <input
                                    className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.city ? "border-red-400" : "border-[#DDE6F5]"
                                    }`}
                                    type="text"
                                    placeholder={t("form.City")}
                                    id="city"
                                    {...register("city", {
                                      required: t("message.cc6e29b38f06b64001e8e9a6a1bf81a2d3ef")
                                    })}
                                  />
                                </div>
                              </div>
                              {/* State */}
                              {

                                <div className="sm:w-1/2 w-full">
                                  <div className="relative">
                                    <label
                                      className={`absolute z-[1] -top-2 ${errors.state ? "text-red-400" : "text-[#85929E]"
                                      } left-3 bg-white text-xs`}
                                      htmlFor="state"
                                    >
                                      {t("checkout.1350af9875f65e46975b46c51798e07e4ec6")}
                                    </label>
                                    <select
                                      title="state"
                                      className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 border-[#DDE6F5] leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.state ? "border-red-400" : "border-[#DDE6F5]"
                                      }`}
                                      id="state"
                                      {...register("state", {
                                        required: (state === null || (Array.isArray(state) && !!state.length)) ? t("message.06a2213c23e37b46a098774ff7a67f6f9c41") : false
                                      })}
                                      disabled={state === null || (Array.isArray(state) && !state.length)}
                                    >
                                      <option value="">{t("checkout.8663fa346fc3a54cff1873e9ffa5a7e0c44a")}</option>
                                      {state?.map((item: any, index: any) => (
                                        <option key={index} value={item.isoCode}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              }
                            </div>
                            {/* Postcode / ZIP & Phone */}
                            <div className="sm:flex grid sm:gap-5 gap-8">
                              {/* Postcode / ZIP */}
                              <div className="sm:w-1/2 w-full">
                                <div className="relative">
                                  <label
                                    className={`absolute -top-2 ${errors.postcode ? "text-red-400" : "text-[#85929E]"
                                    } left-3 bg-white text-xs`}
                                    htmlFor="postcode"
                                  >
                                    {t("checkout.dc9ed9c83a3614477c18c92b64ea25203d52")}
                                  </label>
                                  <input
                                    className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.postcode ? "border-red-400" : "border-[#DDE6F5]"
                                    }`}
                                    type="text"
                                    placeholder={t("checkout.dc09d2d018ce2d462a3837538323e8b86ad8")}
                                    id="postcode"
                                    {...register("postcode", {
                                      required: t("message.3b70d452b0ded6486e2a9f82f3db3aac0e75")
                                    })}
                                  />
                                </div>
                              </div>
                              {/* Phone */}
                              <div className="sm:w-1/2 w-full">
                                <div className="relative">
                                  <label
                                    className={`absolute -top-2 ${errors.phone ? "text-red-400" : "text-[#85929E]"
                                    } left-3 bg-white text-xs`}
                                    htmlFor="phone"
                                  >
                                    {t("common.Phone")}
                                  </label>
                                  <input
                                    className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 border-[#DDE6F5] leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.phone ? "border-red-400" : "border-[#DDE6F5]"
                                    }`}
                                    type="tel"
                                    placeholder={t("checkout.78fb2d8b706a0d46bfb800f2d2c97e103e1e")}
                                    id="phone"
                                    {...register("phone", {
                                      required: t("message.6da2af7b8d5c5345f20988a3cbccd7cdfb8f")
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={clsx("b-flex gap-x-2 border p-2 rounded-[3px]", showForm ? "!hidden" : "!flex")}>
                          <span>{
                            cartList?.shipping?.packages?.default?.formatted_destination ?
                              cartList?.shipping?.packages?.default?.formatted_destination :
                              t("message.7e6c66beee6b96438db89cd5edc91445f762")
                          }</span>
                            <span
                              className="text-sm text-blue-500 cursor-pointer"
                              onClick={() => setShowForm(true)}>{t(`common.${cartList?.shipping?.packages?.default?.formatted_destination ? "Edit" : "Create"}`)}</span>
                          </div>
                          <div>
                            {
                              !showForm && <>
                                {/*物流选项*/}
                                <Shipping selectedDeliveryMethod={selectedDeliveryMethod} cartData={cartData}
                                          setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                                          setOrderSummary={setOrderSummary} />
                                {/*支付方式*/}
                                <PayMeth />
                                {/*订单的总价*/}
                                <OrderSum orderSummary={orderSummary} />
                              </>
                            }
                            {/* Order Button */}
                            <button
                              id="buy-button"
                              type="submit"
                              className={`${isValid
                                ? loading
                                  ? "bg-gray-800 shadow-md text-white cursor-not-allowed"
                                  : "bg-orangeTwo shadow-4xl text-white hover:opacity-70 cursor-pointer"
                                : "bg-orangeTwo text-white cursor-not-allowed opacity-50"
                              } transition-all duration-300 ease-in-out flex justify-center items-center gap-4 rounded-md text-base font-semibold font-Roboto capitalize py-4 px-7 mt-6`}
                              disabled={!isValid || loading}
                            >
                              {loading ? t("order.Processing") + "..." : showForm ? t("form.89d6993324b64541c93976dbb5de7af086c0") : t("message.cfe62e95200fa44dc3f8874281d7421873f4")}
                              {loading && <RingLoader color="#fff" size={20} />}
                            </button>
                            {/* Add a image  */}
                            {/*<div className="flex justify-center mt-6 w-1/3">*/}
                            {/*  <Placeholder src="/image/checkout/2checkout_logo.webp" alt="payment icon" imageWidth={300}*/}
                            {/*               imageHeight={100} />*/}
                            {/*</div>*/}
                            <AccountInfo cOrderId={cOrderId || ""} email={setting?.email || ""} />
                          </div>
                        </form>
                      )}
                      {!cartData || Object.keys(cartData).length === 0 && <EmptyState />}
                    </div>
                  </div>
                </div>
                <div className="2xl:max-w-md lg:w-1/3 w-11/12 mx-auto h-fit">
                  <div className="bg-white sticky top-2 p-6 shadow-md rounded-xl overflow-hidden">
                    <CartContent layout={"col"} showButton={false} showOrderSum={false} />
                  </div>
                </div>
              </div>
            }
          </div>
        },
          {
            id: 2,
            name: t("checkout.f280da5593e54d4dcccbe7a9af91f97d2939"),
            active: activeId === 2,
            status: stepsStatus(2),
            children: <div className="container pt-8 pb-28 c-flex flex-col">
              <Placeholder src="/image/checkout/online_payment.png" imageWidth={500} imageHeight={400}
                           alt="Online payment" className="!bg-transparent" />
              <BodyText className="mr-2" size="lg">{orderStatusText}</BodyText>
              <AccountInfo cOrderId={cOrderId || ""} email={setting?.email || ""} />
            </div>
          },
          {
            id: 3,
            name: t("common.Successful"),
            active: activeId === 3,
            status: stepsStatus(3),
            children: <div className="container pt-8 pb-28 c-flex flex-col">
              <Placeholder src="/image/checkout/zhifuchenggong.png" imageWidth={500} imageHeight={400}
                           alt="Online payment" className="!bg-transparent" />
              <BodyText size="lg">{t("message.8a11c4b7ee6af74a7f489c6eea045b957b10")}</BodyText>
              <AccountInfo cOrderId={cOrderId || ""} email={setting?.email || ""} />
              <div className="c-flex gap-4 my-4">
                <Link href="/"> <Button size="sm">{t("checkout.612baf866c0271434b3bf0a97d96572b376a")}</Button></Link>
                <Link href="/center/order">
                  <Button size="sm">{t("checkout.506ba86307bce54097398fb22d5f040a09f3")}</Button>
                </Link>
              </div>
            </div>
          }]} />
    </div>
  </>;
}

export default React.memo(Checkout);
