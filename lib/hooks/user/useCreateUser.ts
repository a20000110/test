import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";


export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  function createUser(data: any, reset: any, setActive: any) {
    if (data.password !== data.confirmPassword) {
      toast(t("message.8810964afa6a6d413988f9e7567bec617ecc"), { type: "error" });
      return;
    }
    setLoading(true);
    axios.post("/api/auth/register", data)
      .then((response) => {
        toast(t("message.e799bac7bf23be4445b8f7cf50f6b78485e8"), {
          type: "success"
        });
        setLoading(false);
        reset();
        if (!getCookie("signup__user__info")) {
          const userInfo = {
            username: response.data.username,
            email: response.data.email,
            id: response.data.id
          };
          setCookie("created__user__info", userInfo);
        }
        setTimeout(() => {
          setActive(1);
        }, 1000);
      })
      .catch((error) => {
        if (!error?.response?.data?.code) {
          return toast(t("message.68c53dd9a67388497e1b48c6b208e75fd369"), {
            type: "error"
          });
        }
        if (
          error.response.data.code == "registration-error-email-exists" ||
          error.response.data.code == "registration-error-username-exists"
        ) {
          toast(t("message.31a9d22b1c535c4d0598eadaef98b0faa182"), {
            type: "error"
          });
        }
        if (error.response.data.code == "customer_invalid_email") {
          toast(t("message.921f2b497830d143aacbf3ab15ec70888bce"), { type: "error" });
        }
        if (error.response.data.code === "service-error") {
          toast(t("message.4aa583388500d7427b48f82c2dd496909f12"), { type: "error" });
        }
        setLoading(false);
      });
  }

  return { createUser, loading };
}
