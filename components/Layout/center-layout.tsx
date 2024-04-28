import { UserInfoInterface } from "@/lib/types/rest-api/user/user.type";
import React, { memo, useEffect, useState } from "react";
import { BodyText } from "@/components/BodyText";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCocartLogout } from "@/lib/hooks/user/useCocartLogout";
import { Placeholder } from "@/components/Placeholder";
import { useUserStore } from "@/lib/store/user.store";
import { siteStore } from "@/lib/store/site.store";
import { useTranslations } from "next-intl";

export default memo(function CenterLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations();
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfoInterface>();
    const { logout } = useCocartLogout();
    const { userInfo: UserInfo } = useUserStore();
    const { isBtob } = siteStore();
    const list: { icon: string, link?: string, label: string, show: boolean }[] = [
      {
        label: "Center",
        link: "/center",
        icon: "ri-dashboard-fill",
        show: true
      }, {
        label: "Settings",
        link: "/center/setting",
        icon: "ri-settings-4-line",
        show: true
      }, {
        label: "Inquiry",
        link: "/center/inquiry",
        icon: "ri-file-list-2-line",
        show: !!isBtob
      }, {
        label: "Orders",
        link: "/center/order",
        icon: "ri-list-ordered",
        show: !isBtob
      }, {
        label: "Logout",
        icon: "ri-logout-circle-r-line",
        show: true
      }
    ];
    useEffect(() => {
      UserInfo && setUserInfo(UserInfo);
    }, [UserInfo]);
    return <div className="container min-h-[36vh] my-14 max-md:my-4 px-5 sm:px-0 w-full justify-center">
      <div className="lg:flex items-start gap-10 space-y-10 lg:space-y-0">
        <div className="w-full p-5 border rounded-2xl lg:w-80 shrink-0 border-themeSecondary200 lg:block">
          <div className="flex flex-wrap items-center gap-4 p-4 lg:flex-nowrap rounded-xl bg-themeSecondary100">
            <Placeholder src={"/image/default-avatar-f.jpg"} alt="" className="rounded-md" imageWidth={50}
                         imageHeight={50} />
            <div className="flex flex-col justify-start">
              <BodyText size="lg" intent="bold">{
                userInfo?.username
              }</BodyText>
              <Link href={"/center/setting"}
                    className="text-sm cursor-pointer text-themeSecondary400 hover:text-main">{t("common.Edit")}</Link>
            </div>
          </div>
          <div className="my-4">
            {
              list.map((item, index) => {
                return item.show && <Link href={item.link || "/"}
                                          onClick={(e) => {
                                            if (!item.link) {
                                              e.preventDefault();
                                              logout();
                                            }
                                          }}
                                          className={`p-4 gap-4 s-flex rounded-lg cursor-pointer duration-300 hover:bg-main hover:text-white ${router.asPath === item.link ? "text-white bg-main" : ""}`}
                                          key={index}>
                  <i className={`${item.icon} ri-xl`}></i>
                  <span className="text-[18px]">{t("common." + item.label)}</span>
                </Link>;
              })
            }
          </div>
        </div>
        <div className="grow">{children}</div>
      </div>
    </div>;
  }
);
