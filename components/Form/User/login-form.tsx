import React from "react";
import { Button } from "@/components/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { RingLoader } from "react-spinners";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useCart } from "@/lib/hooks/cart/useCart";
import { useUserStore } from "@/lib/store/user.store";

type FormValues = {
  username?: string;
  password?: string;
  remember?: boolean;
  onSubmit: (data?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  setLoginModalOn?: any;
};

interface LoginFormProps {
  setLoginModalOn?: any;
}

const LoginForm = ({ setLoginModalOn }: LoginFormProps) => {
  const t = useTranslations();
  const { getCart } = useCart();
  const { setUserLoginInfo } = useUserStore();
  let get_form_info: any = getCookie("created__user__info");
  if (get_form_info) {
    get_form_info = JSON.parse(get_form_info);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>();

  const [loading, setLoading] = React.useState(false);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    await axios
      .post("/api/auth/login", data)
      .then(async (response) => {
        if (response?.data?.status === 400) {
          toast(t("message.3936ed020820014a9539121adf8645e2424c"), {
            type: "error"
          });
          setLoading(false);
        } else {
          toast(t("message.ddfa34d0a8bcca4502b8e7a1765f16d592b3"), {
            type: "success"
          });
          setUserLoginInfo({
            username: data.username as string,
            password: data.password as string
          });
          if (!getCookie("__user__login__info")) {
            const logInfo = {
              username: response.data?.data?.display_name,
              email: response.data?.data?.email,
              id: response.data?.data?.user_id,
              role: response.data?.data?.role,
              avatar: response.data?.data?.avatar_urls
            };
            if (data?.remember != false) {
              setCookie("__user__login__info", logInfo, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
            } else {
              setCookie("__user__login__info", logInfo);
            }
          }
          setLoading(false);
          reset();
          setLoginModalOn(false);
          await getCart();
        }
      })
      .catch((err) => {
        toast(err?.response?.data.description || t("message.54fa2bdedde2a0470e38ed51a3e216c8a43d"), {
          type: "error"
        });
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="mt-7">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            id="email"
            className={`px-5 py-3 rounded-lg outline-none border bg-white text-xl  placeholder:text-lg w-full ${errors.username ? "border-red-500" : "border-themeSecondary300"
            }`}
            defaultValue={get_form_info?.username}
            placeholder={t("form.109a2790cc6b48461908f883b7b41549f9b3")}
            {...register("username", { required: true })}
          />
          <input
            type="password"
            id="password"
            className={`px-5 py-3 rounded-lg outline-none border bg-white text-xl  placeholder:text-lg w-full mt-6 ${errors.password ? "border-red-500" : "border-themeSecondary300"
            }`}
            placeholder={t("common.Password")}
            {...register("password", { required: true })}
          />
          <div className="my-6 flex items-center justify-between">
            <label className="text-base cursor-pointer">
              <input type="checkbox" className="w-4 h-4 cursor-pointer" id="remember" {...register("remember")} />
              <span className=" ml-2">{t("common.Remember_me")}</span>
            </label>
            {/* <BodyText size="md" className=" text-themePrimary600 cursor-pointer">
              Forgot Password?
            </BodyText> */}
          </div>
          <Button
            className={`flex gap-4 items-center justify-center w-full mt-6 ${loading ? "bg-themeSecondary800" : ""}`}
          >
            {loading ? <RingLoader color="#fff" size={30} /> : ""}
            {loading ? t("message.7f9e518a7a1d1e4bc3e8990bed1d9be4d404") + "..." : t("common.Sign_in")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
