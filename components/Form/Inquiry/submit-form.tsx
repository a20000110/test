import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/Button";
import { RingLoader } from "react-spinners";
import { cApiUrl, sleep, translateFormFields } from "@/lib/utils/util";
import { getCookie } from "cookies-next";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";

export type Fields = {
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  error?: string;
}
// 获取询盘表单字段
export const getInquiryFormFields = async () => {
  try {
    const res = await axios.get<{
      data: {
        form_content: Fields[]
      }
    }>(cApiUrl + "/api/inquiry/get-form-field");
    return Promise.resolve(res.data.data.form_content);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      return Promise.reject(e.response?.data);
    } else {
      return Promise.reject({ msg: "Service error" });
    }
  }
};

// 提交询盘表单
export const sendInquiryForm = async (formValue: { [key: string]: any }) => {
  try {
    const res = await axios.post<{
      data: {
        code: number
        success: boolean;
        msg: string;
      }
    }>(`/api/inquiry/send-inquiry`, formValue);
    return Promise.resolve(res.data.data);
  } catch (e: any) {
    console.log(e);
    if (axios.isAxiosError(e)) {
      return Promise.reject(e.response?.data);
    }
  }
};

export type SubmitFormProps = {
  goods: {
    id: number;
    count: number;
  }[];
  title?: string;
  callback?: () => void;
  formFields?: Fields[]
}

export default function SubmitForm({
                                     goods = [],
                                     title = "",
                                     callback,
                                     formFields
                                   }: SubmitFormProps) {
  const t = useTranslations();
  const [fields, setFields] = useState<Fields[]>([]);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<{ [key: string]: string }>({});
  const locale = useLocale();
  const inputType = (type: string) => {
    return {
      text: "text",
      email: "email",
      phone: "text",
      longText: "textarea"
    }[type];
  };

  // 判断表单校验是否通过
  const checkForm = () => {
    Object.keys(formValue).forEach(key => {
      if (!formValue[key]) {
        generateError(fields.find(item => item.name === key)!, t("form.1fe5c67d14d7e149abc832904cea66ecea89"));
      }
    });
    return window.verificationPassed;
  };

  // 获取当前用户登录的信息
  const getLoginInfo = (): any => {
    let get_form_info: any = getCookie("__user__login__info");
    if (get_form_info) {
      get_form_info = JSON.parse(get_form_info);
    }
    return get_form_info;
  };

  const handlerSubmit = async () => {
    if (!goods.length) {
      return toast(t("message.b35d1a12e841f04f9708f98cb3e78a68d6f8"), {
        type: "error"
      });
    }
    if (submitLoading) return;
    const adopt = checkForm();
    if (!adopt) return;
    try {
      setSubmitLoading(true);
      const params = {
        inquiry_info: formValue,
        goods,
        woocommerce_user: (getLoginInfo())?.username || undefined,
        source: goods[0].id === 0 ? 1 : 0
      };
      await sendInquiryForm(params);
      toast(t("message.773027b2d81ade41fc7aa2b98f704442cae7"), {
        type: "success"
      });
      sleep(2000).then(() => {
        setFormValue(() => {
          const values: { [key: string]: string } = {};
          fields.map(f => {
            values[f.name] = "";
          });
          return values;
        });
        callback && callback();
      });
    } catch (e: any) {
      toast(e.msg, { type: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  const generateError = (item: Fields, msg: string) => {
    setFields((value) => {
      return value.map(i => {
        if (i.required && i.name === item.name) {
          return { ...i, error: msg };
        } else {
          return i;
        }
      });
    });
  };

  const handlerChange = (e: any, item: Fields) => {
    const { value } = e.target;
    generateError(item, "");
    setFormValue(prev => ({ ...prev, [item.name]: value }));
    if (item.required && !value) {
      return generateError(item, t("form.1fe5c67d14d7e149abc832904cea66ecea89"));
    }
    if (item.type === "email" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return generateError(item, t("message.3fa193ac9320fd45a31baa4dda871b7b74ed"));
    }
  };

  useEffect(() => {
    if (formFields?.length) {
      setFields(formFields);
      setFormValue(prev => {
        return formFields.reduce((prev, item) => {
          return { ...prev, [item.name]: "" };
        }, {});
      });
      return;
    }
    translateFormFields(locale).then((res) => {
      const r = res as Fields[]
      setFields(r);
      setFormValue(prev => {
        return r.reduce((prev, item) => {
          return { ...prev, [item.name]: "" };
        }, {});
      });
    }).catch(e => {
      if (e.msg) {
        toast(e.msg, { type: "error" });
      }
    });
  }, [formFields]);

  useEffect(() => {
    window.verificationPassed = !(fields.some(item => {
      if (item.required) {
        return item.error || item.error === undefined;
      }
    }));
  }, [fields, formValue]);
  return <>
    {
      !!fields.length && <div>
        {/*<h2 className="text-2xl text-center font-bold  pb-6">{title}</h2>*/}
        {
          <div className="grid md:grid-cols-1 grid-cols-1 gap-y-2 max-md:gap-y-2">
            {
              fields.map((item, index) => {
                return <div key={index}>
                  <div className="mt-2">
                    {
                      inputType(item.type) === "textarea" ?
                        <textarea
                          onChange={(e) => {
                            handlerChange(e, item);
                          }}
                          placeholder={item.placeholder}
                          value={formValue[item.name]}
                          name={item.name}
                          required={item.required}
                          className={`block w-full px-1 rounded-md border-0 py-1.5 text-gray-900  shadow-sm ring-1 ring-inset 
            sm:text-sm sm:leading-6 ${item?.error ? "ring-red-500 focus-visible:outline-none" : "ring-gray-300"}`}
                        />
                        : <input
                          onChange={(e) => {
                            handlerChange(e, item);
                          }}
                          placeholder={item.placeholder}
                          value={formValue[item.name]}
                          type={inputType(item.type)}
                          required={item.required}
                          name={item.name}
                          className={`block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
              sm:text-sm sm:leading-6 ${item?.error ? "ring-red-500 focus-visible:outline-none" : "ring-gray-300"}`}
                        />
                    }
                    <p
                      className={`text-red-500 text-xs ${item.error ? "opacity-100" : "opacity-0"}`}>{item.error || t("common.error")}</p>
                  </div>
                </div>;
              })
            }
          </div>
        }
        <Button size="md" className="flex bg-main mt-6 items-center rounded-full submit-button"
                disabled={submitLoading} onClick={handlerSubmit}>
          {submitLoading && <RingLoader color="#fff" size={30} />}
          <span
            className={`${submitLoading ? "mx-2" : ""}`}>{submitLoading ? t("message.67ff475350241449ff580775aa23090d7e0b") + "..." : t("common.Submit")}</span>
        </Button>
      </div>
    }
  </>;
}
