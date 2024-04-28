import { useEffect, useState } from "react";
import { useUpdateCustomer } from "@/lib/hooks/user/useUserUpdate";
import { Button } from "@/components/Button";
import { RingLoader } from "react-spinners";
import CenterLayout from "@/components/Layout/center-layout";
import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { getLang, getNavProducts } from "@/lib/utils/util";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
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
export default function Setting() {
  const [userInfoUdate, setUserInfoUpdate] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar_url: ""
  });
  const t = useTranslations();
  const [imagePreview, setImagePreview] = useState("");
  const [updateClickloading, SetUpdateClickSetLoading] = useState(false);
  const { customer, updateCustomer, updateCustomerBillingAddress } = useUpdateCustomer();

  const handleUserInfoUpdate = (e: any) => {
    const { name, value } = e.target;
    setUserInfoUpdate({ ...userInfoUdate, [name]: value });
    if (name === "avatar_url") {
      setUserInfoUpdate({ ...userInfoUdate, [name]: e?.target?.files[0] });
      setImagePreview(URL.createObjectURL(e?.target?.files[0]));
    }
  };

  const handleUpdateClick = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    SetUpdateClickSetLoading(true);

    // check if email field is not have any space
    if (userInfoUdate.email.includes(" ")) {
      toast(t("message.db3a3da982203c489a8887afa25ca7dac6d5"), {
        type: "error"
      });
      SetUpdateClickSetLoading(false);
      return;
    }
    await updateCustomer(userInfoUdate).then((res) => {
      if (res) {
        toast(t("message.39f9bcc42b4fd546c0e90d205a8134afc8c4"), {
          type: "success"
        });
      }
    }).finally(() => {
      SetUpdateClickSetLoading(false);
    });
  };
  useEffect(() => {
    setUserInfoUpdate({
      first_name: customer?.result?.first_name || "",
      last_name: customer?.result?.last_name || "",
      email: customer?.result.email || "",
      avatar_url: customer?.result.avatar_url || ""
    });
  }, [customer]);
  return <CenterLayout>
    <div className="p-5 sm:p-10 rounded-2xl border">
      <h3 className="font-bold">{t("center.be117347c0a11c43846a0eba6e842cbb5f0a")}</h3>
      <div className="lg:relative">
        <form action="">
          <div className="flex flex-wrap lg:flex-nowrap items-start gap-5 lg:gap-10 mt-6">
            <div className="grow space-y-5">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-5">
                <input
                  type="text"
                  placeholder={t("form.f788c9b20398a5481f38c08cf68f2cb8c964")}
                  className="focus:outline-none border rounded-lg px-5 h-12 w-full focus:shadow-lg focus:shadow-outline"
                  name="first_name"
                  value={userInfoUdate.first_name}
                  onChange={handleUserInfoUpdate}
                />
                <input
                  type="text"
                  placeholder={t("form.2bb382a16eab9d446ac91af90ce99c3cc7f8")}
                  className="focus:outline-none border rounded-lg px-5 h-12 w-full focus:shadow-lg focus:shadow-outline"
                  name="last_name"
                  value={userInfoUdate.last_name}
                  onChange={handleUserInfoUpdate}
                />
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-5">
                <input
                  type="email"
                  placeholder={t("form.33f1e5508234f14946ebcb12416f5a73bd87")}
                  className="focus:outline-none border rounded-lg px-5 h-12 w-full focus:shadow-lg focus:shadow-outline"
                  name="email"
                  value={userInfoUdate.email}
                  onChange={handleUserInfoUpdate}
                />
              </div>
            </div>
          </div>
          <div onClick={handleUpdateClick} className="w-fit mt-8">
            <Button className={`flex items-center gap-2 ${updateClickloading && "bg-themeSecondary800"}`}>
              {updateClickloading && <RingLoader color="#fff" size={20} />}
              {t("form.89d6993324b64541c93976dbb5de7af086c0")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </CenterLayout>;
}
