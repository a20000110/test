import React from "react";
import { Button } from "@/components/Button";
import { RingLoader } from "react-spinners";
import { useCreateUser } from "@/lib/hooks/user/useCreateUser";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

type FormValues = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  onSubmit: (data?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
};

interface SignUpFormProps {
  setActive: any;
}

const SignUpForm = ({ setActive }: SignUpFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>();

  const { createUser, loading } = useCreateUser();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createUser(data, reset, setActive);
  };

  const t = useTranslations();

  return (
    <div>
      <div className=" mt-7">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            id="username"
            className={`px-5 py-3 rounded-lg outline-none border bg-white text-xl  placeholder:text-lg w-full ${
              errors.username ? "border-red-500" : "border-themeSecondary300"
            }`}
            placeholder={t("common.Username")}
            {...register("username", { required: true })}
          />
          <input
            type="email"
            id="email"
            className={`px-5 py-3 rounded-lg outline-none border bg-white text-xl  placeholder:text-lg w-full mt-6 ${
              errors.email ? "border-red-500" : "border-themeSecondary300"
            }`}
            placeholder={t("common.Email")}
            {...register("email", { required: true })}
          />
          <input
            type="password"
            id="password"
            className={`px-5 py-3 rounded-lg outline-none border bg-white text-xl  placeholder:text-lg w-full mt-6 ${
              errors.password ? "border-red-500" : "border-themeSecondary300"
            }`}
            placeholder={t("common.Password")}
            {...register("password", { required: true })}
          />
          <input
            type="password"
            id="confirmPassword"
            className={`px-5 py-3 rounded-lg outline-none border bg-white text-xl  placeholder:text-lg w-full mt-6 ${
              errors.confirmPassword ? "border-red-500" : "border-themeSecondary300"
            }`}
            placeholder={t("message.abe0432e8d804e4cd748b0993c2626be5413")}
            {...register("confirmPassword", { required: true })}
          />
          <Button
            className={`flex gap-4 items-center justify-center w-full mt-6 ${loading ? "bg-themeSecondary800" : ""}`}
          >
            {loading && <RingLoader color="#fff" size={30} />}
            {loading ? t("message.7f9e518a7a1d1e4bc3e8990bed1d9be4d404") + "..." : t("common.Sign_Up")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
