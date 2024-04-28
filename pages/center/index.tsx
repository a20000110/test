import React, { useEffect, useState } from "react";
import { RetrieveBilling, RetrieveShipping } from "@/lib/types/rest-api/user/retrieve.type";
import { BodyText } from "@/components/BodyText";
import Modals from "@/components/Modals";
import { Country, ICountry, IState } from "country-state-city";
import { useUpdateCustomer } from "@/lib/hooks/user/useUserUpdate";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import CenterLayout from "@/components/Layout/center-layout";
import { useLocale, useTranslations } from "next-intl";
import { getLang, getNavProducts } from "@/lib/utils/util";
import { useCountry } from "@/lib/hooks/useCountry";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { RingLoader } from "react-spinners";

const billingTitle = "center.920bb446dde5de43c1e85fc07547a58caa5e";
const shippingTitle = "center.f26a7189f413324e9058edcb137ad3de4be1";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const cookies = context.req?.headers.cookie;
  const userInfo = cookies?.split(";").find((item: string) => item.includes("__user__login__info"));
  if (userInfo) {
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

const UpdateBilling = (props: { data: RetrieveBilling | null, setBilling: (v: RetrieveBilling) => void }) => {
  const t = useTranslations();
  const { getCountryList, getStateListByCode } = useCountry();
  const [state, setState] = useState<IState[] | null>(null);
  const [country, setCountry] = useState<ICountry[]>(Country.getAllCountries());
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const { updateCustomerBillingAddress } = useUpdateCustomer();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    getValues: getFormValues
  } = useForm({
    mode: "onBlur"
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const billing = getFormValues() as RetrieveBilling;
      // check if email field is not have any space
      if (billing?.email.includes(" ")) {
        toast(t("message.30f153e36ded564f0bc8a9174f63431b6a7b"), {
          type: "error"
        });
        return;
      }
      if (billing) {
        const res = await updateCustomerBillingAddress(billing);
        if (res) {
          toast(t("message.9904f8f59f35734e63392463c456de4d2830"), {
            type: "success"
          });
          props.setBilling(res.billing);
        }
      }
    } catch (e) {
      toast(t("message.30f153e36ded564f0bc8a9174f63431b6a7b"), {
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  // 选中地区
  const handleChangeCountry = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("state", "");
    const state = await getStateListByCode(e.target.value);
    setState(state);
  };
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
    const handler = async () => {
      if (props?.data) {
        if (props.data?.country) {
          const state = await getStateListByCode(props.data.country);
          setState(state);
        }
        Object.keys(props.data).map(key => {
          // @ts-ignore
          setValue(key, props.data[key] || "");
        });
      }
    };
    handler();
  }, [props.data]);

  useEffect(() => {
    if (state?.length && props.data) {
      Object.keys(props.data).map(key => {
        if (key === "state") {
          // @ts-ignore
          setValue(key, props.data[key] || "");
        }
      });
    }
  }, [state, props.data]);

  return <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
    <div className="w-full grid gap-8">
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
              className={`appearance-none border rounded-md w-full p-3 ${errors.first_name ? "border-red-400" : "border-[#DDE6F5]"
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
              className={`appearance-none border rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.last_name ? "border-red-400" : "border-[#DDE6F5]"
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
      {/* Email address */}
      <div className="sm:flex grid sm:gap-5 gap-8">
        <div className="w-full">
          <div className="relative">
            <label
              className={`absolute -top-2 ${errors.email ? "text-red-400" : "text-[#85929E]"
              } left-3 bg-white text-xs`}
              htmlFor="email"
            >
              {t("form.33f1e5508234f14946ebcb12416f5a73bd87")}
            </label>
            <input
              className={`appearance-none border rounded-md w-full py-3.5 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.email ? "border-red-400" : "border-[#DDE6F5]"
              }`}
              type="email"
              placeholder={t("checkout.1fd8f1717eae894dd8d8ceee41b394ad7d7c")}
              id="email"
              {...register("email", {
                required: t("message.ab917b89e7aee34ae6880bb1446c8d97c5ef"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("message.91f67fdccfdc0c4abfd810abe671005c98ef")
                }
              })}
            />
          </div>
        </div>
      </div>
      <div>
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
          {loading ? t("order.Processing") + "..." : t("form.89d6993324b64541c93976dbb5de7af086c0")}
          {loading && <RingLoader color="#fff" size={20} />}
        </button>
      </div>
    </div>
  </form>;
};

const UpdateShipping = (props: { data: RetrieveShipping | null, setShipping: (v: RetrieveShipping) => void }) => {
  const t = useTranslations();
  const { getCountryList, getStateListByCode } = useCountry();
  const [state, setState] = useState<IState[] | null>(null);
  const [country, setCountry] = useState<ICountry[]>(Country.getAllCountries());
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const { updateCustomerShippingAddress } = useUpdateCustomer();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    getValues: getFormValues
  } = useForm({
    mode: "onBlur"
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const shopping = getFormValues() as RetrieveShipping;
      if (shopping) {
        const res = await updateCustomerShippingAddress(shopping);
        if (res) {
          toast(t("message.9904f8f59f35734e63392463c456de4d2830"), {
            type: "success"
          });
          props.setShipping(res.shipping);
        }
      }
    } catch (e) {
      toast(t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"), {
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  // 选中地区
  const handleChangeCountry = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("state", "");
    const state = await getStateListByCode(e.target.value);
    setState(state);
  };
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
    const handler = async () => {
      if (props?.data) {
        if (props.data?.country) {
          const state = await getStateListByCode(props.data.country);
          setState(state);
        }
        Object.keys(props.data).map(key => {
          // @ts-ignore
          setValue(key, props.data[key] || "");
        });
      }
    };
    handler();
  }, [props.data]);

  useEffect(() => {
    if (state?.length && props.data) {
      Object.keys(props.data).map(key => {
        if (key === "state") {
          // @ts-ignore
          setValue(key, props.data[key] || "");
        }
      });
    }
  }, [state, props.data]);

  return <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
    <div className="w-full grid gap-8">
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
              className={`appearance-none border rounded-md w-full p-3 ${errors.first_name ? "border-red-400" : "border-[#DDE6F5]"
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
              className={`appearance-none border rounded-md w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg focus:shadow-outline ${errors.last_name ? "border-red-400" : "border-[#DDE6F5]"
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
      <div>
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
          {loading ? t("order.Processing") + "..." : t("form.89d6993324b64541c93976dbb5de7af086c0")}
          {loading && <RingLoader color="#fff" size={20} />}
        </button>
      </div>
    </div>
  </form>;
};

export default function Center() {
  const [billing, setBilling] = useState<RetrieveBilling | null>(null);
  const [shipping, setShipping] = useState<RetrieveShipping | null>(null);
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState<1 | 2>(1);
  const { customer } = useUpdateCustomer();
  const t = useTranslations();

  useEffect(() => {
    setBilling(customer?.result?.billing || null);
    setShipping(customer?.result?.shipping || null);
  }, [customer]);

  return <CenterLayout>
    <div className="grid md:grid-cols-2 grid-cols-1 gap-5 md:gap-6 lg:gap-7">
      <div className="border rounded-2xl p-7 border-themeSecondary200">
        <div className="b-flex">
          <h3 className="font-bold">{t(billingTitle)}</h3>
          <span className="hover:text-main text-sm cursor-pointer text-themeSecondary400" onClick={() => {
            setOpen(true);
            setSelect(1);
          }}>{t("common.Edit")}</span>
        </div>
        <BodyText size="md" intent="medium" className=" mt-4 text-themeSecondary600 ">
          {`${billing?.first_name} ${billing?.last_name}`}
        </BodyText>
        <BodyText size="sm" className=" mt-2 text-themeSecondary500 ">
          {`${billing?.address_1}, ${billing?.address_2}`} <br />
          {`${billing?.state}, ${billing?.country}`}
        </BodyText>
        <BodyText size="sm" className=" mt-5 text-themeSecondary600 ">
          {`${billing?.email}`} <br />
          {`${billing?.phone}`}
        </BodyText>
      </div>
      <div className="border rounded-2xl p-7 border-themeSecondary200">
        <div className="b-flex">
          <h3 className="font-bold">{t(shippingTitle)}</h3>
          <span className="hover:text-main text-sm cursor-pointer text-themeSecondary400" onClick={() => {
            setOpen(true);
            setSelect(2);
          }}>{t("common.Edit")}</span>
        </div>
        <BodyText size="md" intent="medium" className=" mt-4 text-themeSecondary600 ">
          {`${shipping?.first_name} ${shipping?.last_name}`}
        </BodyText>
        <BodyText size="sm" className=" mt-2 text-themeSecondary500 ">
          {`${shipping?.address_1}, ${shipping?.address_2}`} <br />
          {`${shipping?.state}, ${shipping?.country}`}
        </BodyText>
        <BodyText size="sm" className=" mt-5 text-themeSecondary600 ">
          {`${shipping?.phone}`}
        </BodyText>
      </div>
    </div>
    <Modals open={open} setOpen={setOpen} top="10vh">
      <div className="s-flex">
        <h3 className="font-bold text-xl">{select === 1 ? t(billingTitle) : t(shippingTitle)}</h3>
      </div>
      <div className="w-[90vw] lg:w-[80vw] xl:w-[50vw] z-50]">
        {
          select === 1 ? <UpdateBilling data={billing} setBilling={setBilling} /> :
            <UpdateShipping data={shipping} setShipping={setShipping} />

        }
      </div>
    </Modals>
  </CenterLayout>;
}
