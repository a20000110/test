import { ReactNode, useState } from "react";
import Drawer from "@/components/Drawer";
import { useTranslations } from "next-intl";
import { CartContent } from "@/components/Product/ShoppingCart/cartContent";
import { useUserStore } from "@/lib/store/user.store";

type Props = {
  children: ReactNode,
  callback?: (...arg: any) => void,
  className?: string
}

export const CartDrawer = (props: Props) => {
  const [open, setOpen] = useState(false);
  const { userInfo } = useUserStore();
  const t = useTranslations();
  const handlerOpen = () => {
    if (!userInfo) {
      const login = document.querySelector("#web-login") as HTMLLIElement;
      login.click();
      return;
    }
    props?.callback?.(true);
    setOpen(true);
  };

  return <>
    <div onClick={handlerOpen} className={props?.className ? props.className : ""}>
      {props.children}
    </div>
    <Drawer width={"40vw"} className="max-md:!w-10/12 overflow-hidden cursor-auto" visible={open} direction="right"
            onClose={() => setOpen(false)} title={t("shop.0b1dcf5c5c3d9b4fe53b771d965840f7159e")}>
      <div className="lg:px-8 px-2">
        <CartContent layout="col" />
      </div>
    </Drawer>
  </>;
};
