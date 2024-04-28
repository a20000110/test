import React, { useEffect, useState } from "react";
import { BodyText } from "@/components/BodyText";
import LoginForm from "@/components/Form/User/login-form";
import SignUpForm from "@/components/Form/User/sign-up-form";
import { useCocartLogout } from "@/lib/hooks/user/useCocartLogout";
import Link from "next/link";
import { useUserStore } from "@/lib/store/user.store";
import LoginModal from "./login-modal";
import { useTranslations } from "next-intl";

type Props = {
  children: React.ReactNode;
}

export type SignSwitchProps = {
  activeId: number;
  setActiveId: (id: number) => void;
  setOpenModal: (open: boolean) => void;
}

export function SignSwitch({ activeId = 1, setActiveId, setOpenModal }: SignSwitchProps) {
  const t = useTranslations();
  const list = [
    {
      id: 1,
      label: "common.Sign_in",
      description: "message.e6d7f9862ff4ff40a9eaf8523c08e6c4624c",
      component: <LoginForm setLoginModalOn={setOpenModal} />
    },
    {
      id: 2,
      label: "common.Sign_Up",
      description: "message.b0e9e6e07105254449b889ccac3a508d8c88",
      component: <SignUpForm setActive={setActiveId} />
    }
  ];
  return <div className="w-[340px] sm:w-[440px] xl:w-[480px] z-50">
    <div className="c-flex relative">
      {
        list.map(item => {
          return <div key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={`px-8 border-b-[2px] ${activeId === item.id ? "border-themePrimary600" : ""}`}>
            <BodyText size="lg"
                      className={`font-medium text-center ${activeId === item.id ? "text-themePrimary600" : ""} cursor-pointer py-4`}>{t(item.label)}</BodyText>
          </div>;
        })
      }
    </div>
    <div className="mt-7">
      <h3 className="text-xl md:text-2xl sm:leading-8 font-SGB text-center text-themeSecondary800">{
        t(list[activeId - 1].label)
      }</h3>
      <BodyText className="text-center text-themeSecondary500 mt-2">{
        t(list[activeId - 1].description)
      }</BodyText>
      {
        list[activeId - 1].component
      }
    </div>
  </div>;
}


type NavUserList = {
  id: number,
  label: string,
  show: boolean,
  callback?: (item: NavUserList) => void,
  link?: string
}
export default function NavUser({ children }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [activeId, setActiveId] = useState(1);
  const [list, setList] = useState<NavUserList[]>([]);
  const { logout } = useCocartLogout();
  const { userInfo, getUserInfo } = useUserStore();
  const t = useTranslations();
  useEffect(() => {
    setList([
      {
        id: 1,
        label: "common.login",
        show: !userInfo,
        callback: (option: NavUserList) => {
          setOpenModal(true);
          setActiveId(option.id);
        }
      }, {
        id: 2,
        label: "common.register",
        show: !userInfo,
        callback: (option: NavUserList) => {
          setOpenModal(true);
          setActiveId(option.id);
        }
      }, {
        id: 3,
        label: "common.center",
        show: !!userInfo,
        link: "/center"
      }, {
        id: 4,
        label: "common.logout",
        show: !!userInfo,
        callback: logout
      }]);
  }, [userInfo]);
  useEffect(() => {
    getUserInfo();
  }, []);
  return <div className="relative group">
    {children}
    <ul
      className="absolute flex-col bg-white shadow rounded top-full hidden min-w-full w-fit group-hover:flex border left-0">
      {
        list.map(item => {
          return item.show && <li key={item.id} id={item.id === 1 ? "web-login" : ""}
                                  className="hover:bg-themeSecondary200 py-2 duration-300 px-4 whitespace-nowrap"
                                  onClick={() => item.callback && item.callback(item)}>
            {
              item.link ? <Link href={item.link} className="block w-full h-full">{t(item.label)}</Link> : t(item.label)
            }
          </li>;
        })
      }
    </ul>
    <LoginModal openModal={openModal} setOpenModal={setOpenModal} activeId={activeId} setActiveId={setActiveId} />
  </div>;
}
