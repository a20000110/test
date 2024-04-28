import { BodyText } from "@/components/BodyText";
import Link from "next/link";
import { useState } from "react";
import { useUserStore } from "@/lib/store/user.store";
import LoginModal from "@/components/User/login-modal";
import { siteStore } from "@/lib/store/site.store";
import { useTranslations } from "next-intl";
import { CartDrawer } from "@/components/Product/ShoppingCart/cartDrawer";

const { useRouter } = require("next/router");

export default function FooterMenu() {
  const t = useTranslations();
  const router = useRouter();
  const [zIndex, setZIndex] = useState(3);
  const { userInfo } = useUserStore();

  const [activeId, setActiveId] = useState(1);

  const [openModal, setOpenModal] = useState(false);

  const openCartCallBack = (open: boolean) => {
    setZIndex(open ? 50 : 3);
  };

  const jumpCenter = () => {
    if (userInfo) {
      router.push("/center");
    } else {
      setActiveId(1);
      setOpenModal(true);
    }
  };

  return <div className={`fixed bottom-0 left-0 right-0 block md:hidden`} style={{
    zIndex: zIndex
  }}>
    <div className="container h-mfnav-h bg-white grid grid-cols-3 border-t">
      <Link href="/" className="c-flex flex-col">
        <i className="ri-home-3-line ri-xl"></i>
        <BodyText intent="bold" className="pt-1">{t("common.Home")}</BodyText>
      </Link>
      <div className="c-flex flex-col" onClick={jumpCenter}>
        <i className="ri-map-pin-user-line ri-xl"></i>
        <BodyText intent="bold" className="pt-1">{t("common.Center")}</BodyText>
      </div>
      <CartDrawer callback={openCartCallBack} className="c-flex flex-col relative">
        <i className={`ri-shopping-bag-line ri-xl relative`}>
          <div className="text-xs absolute top-[-3px] right-[-2px] p-1 bg-[#f44336] rounded-full"></div>
        </i>
        <BodyText intent="bold" className="pt-1">{
          t("common.Cart")
        }</BodyText>
      </CartDrawer>
    </div>
    <LoginModal activeId={activeId} setActiveId={setActiveId} openModal={openModal} setOpenModal={setOpenModal} />
  </div>;
}
