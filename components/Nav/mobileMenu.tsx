import React, { useEffect, useState } from "react";
import { setOverflow } from "@/lib/utils/util";
import Drawer from "@/components/Drawer";
import { menus } from "@/lib/constants/menus";
import Link from "next/link";
import { BodyText } from "@/components/BodyText";
import { FooterLinks } from "@/lib/constants/contact";
import { useRouter } from "next/router";
import { useUserStore } from "@/lib/store/user.store";
import { useCocartLogout } from "@/lib/hooks/user/useCocartLogout";
import LoginModal from "@/components/User/login-modal";
import { useTranslations } from "next-intl";
import FooterSocial from "@/components/Footer/footerSocial";
import Translate from "@/components/Translate";
import SearchInput from "@/components/Nav/searchInput";
import { GqlNavProductsInterface } from "@/lib/types/gql/product/nav-product.type";
import { Disclosure } from "@headlessui/react";

type Props = {
  navProduct: GqlNavProductsInterface[]
}
const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat."
  }
];
export default function MobileMenu(props: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openChild, setOpenChild] = useState<number>(0);
  const { userInfo } = useUserStore();
  const { logout } = useCocartLogout();
  const [openModal, setOpenModal] = useState(false);

  const [activeId, setActiveId] = useState(1);
  const [loginLi, setLoginLi] = useState<{
    icon: string,
    name: string
  }>({
    icon: "ri-user-line",
    name: "common.4fe8c868a63194494f5b8fb50a40baade21f"
  });
  const handlerOpen = () => {
    setOpen(!open);
    setOverflow(open ? "overflow-y-hidden" : "overflow-y-auto");
  };
  const handlerLogin = () => {
    if (userInfo) {
      logout();
    } else {
      setOpen(false);
      setOpenModal(true);
    }
  };
  const handlerSearch = (value: string) => {
    router.push(`/search?q=${value}`);
  };

  useEffect(() => {
    setLoginLi({
      icon: "ri-user-line",
      name: !!userInfo ? "common.LOG_OUT" : "common.4fe8c868a63194494f5b8fb50a40baade21f"
    });
  }, [userInfo]);
  useEffect(() => {
    setOpen(false);
  }, [router.asPath]);

  return <>
    <div className="max-md:!flex c-flex !hidden cursor-pointer relative" onClick={() => {
      handlerOpen();
    }}>
      <i className="ri-menu-fill ri-xl"></i>
    </div>
    <Drawer visible={open} title={(process.env.NEXT_PUBLIC_COMPANY_NAME!).toUpperCase()} width={"90vw"}
            onClose={() => setOpen(false)}>
      <div className="b-flex flex-col !items-start overflow-y-auto" style={{
        height: "calc(100vh - 48px)"
      }}>
        <div className="py-1 flex-col w-full">
          <div className="px-2">
            <SearchInput onSearch={handlerSearch} className="shadow-none rounded-none border-none" />
          </div>
          <dl>
            <dt className="b-flex w-full active:bg-sky-100">
              <Link href={`/best-sellers`} className="py-2 line-clamp-1 whitespace-nowrap px-6 block w-full">
                <BodyText size="md">
                  {t("nav.Best Sellers")}
                </BodyText>
              </Link>
            </dt>
            {props?.navProduct?.map((i1) => (
              <Disclosure as="div" key={i1.slug}>
                {({ open }) => (
                  <>
                    <dt className="b-flex w-full active:bg-sky-100">
                      <Link href={`/${i1.slug}`} className="py-2 line-clamp-1 whitespace-nowrap px-6 block w-full">
                        <BodyText size="md">
                          {i1.name.startsWith("nav.") ? t(i1.name) : i1.name}
                        </BodyText>
                      </Link>
                      {
                        !!i1?.children?.nodes?.length && <Disclosure.Button
                          className="text-gray-900 mr-4 flex-shrink-0">
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <i className="h-6 w-6 ri-arrow-up-s-fill" aria-hidden="true" />
                          ) : (
                            <i className="h-6 w-6 ri-arrow-down-s-fill" aria-hidden="true" />
                          )}
                        </span>
                        </Disclosure.Button>
                      }
                    </dt>
                    {
                      !!i1?.children?.nodes?.length && <Disclosure.Panel as="dd" className="my-2 mx-4 bg-gray-100">
                        {
                          i1.children.nodes.map(i2 => {
                            return <div key={i2.slug}>
                              <Link href={`/${i2.slug}`}
                                    className="py-1 line-clamp-2 px-6 block w-full">
                                <BodyText size="md">
                                  {i2.name}
                                </BodyText>
                              </Link>
                              {
                                !!i2.children.nodes?.length && i2.children.nodes.map(i3 => {
                                  return <Link href={`/${i3.slug}`} key={i3.slug}
                                               className="py-1 line-clamp-2 px-10 block w-full">
                                    <BodyText size="md">
                                      {i3.name}
                                    </BodyText>
                                  </Link>;
                                })
                              }
                            </div>;
                          })
                        }
                      </Disclosure.Panel>
                    }
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
          {
            menus.map((menu) => (menu.id === 1 || (!("show" in menu) && !menu.show && menu.id !== 7)) && (
              <div key={menu.id}>
                <div className="b-flex px-6 active:bg-sky-100">
                  <Link href={menu.link} className="py-2 block w-full">
                    <BodyText size="md">
                      {t("common." + menu.name)}
                    </BodyText>
                  </Link>
                  {
                    menu?.icon && <i className={`${menu.icon} ri-xl flex-1 e-flex relative group`}
                                     onClick={() => {
                                       setOpenChild(val => {
                                         if (val === menu.id) return -1;
                                         return menu.id;
                                       });
                                     }} />
                  }
                </div>
              </div>
            ))
          }
          <div className="b-flex px-6 active:bg-sky-100">
            <Link href={"/compare"} className="py-2 block w-full text-[18px]">
              {t("nav.Compare")}
            </Link>
          </div>
          <div className="b-flex px-6 active:bg-sky-100">
            <Link href={"/collection"} className="py-2 block w-full text-[18px]">
              {t("nav.Love")}
            </Link>
          </div>
        </div>
        <div className="bg-[#f6f6f6] p-6 h-[40%] w-full flex flex-col justify-between items-start">
          <ul className="flex flex-col space-y-6">
            {/*移动端翻译*/}
            <li>
              <Translate />
            </li>
            <li onClick={handlerLogin}>
              <i className={`${loginLi.icon} ri-xl`}></i>
              <span className="pl-3 whitespace-nowrap">{
                t(loginLi.name)
              }</span>
            </li>
            {
              FooterLinks.map((item, index) => {
                return <li key={index}>
                  {
                    item.link ? <Link href={item.link} className="s-flex">
                      <i className={`${item.icon} ri-xl`}></i>
                      <span className="pl-3">{
                        item.name.startsWith("t.") ? t(item.name.split("t.").at(-1)) : item.name
                      }</span>
                    </Link> : <div onClick={item.click}>
                      <i className={`${item.icon} ri-xl`}></i>
                      <span className="pl-3">{
                        item.name.startsWith("t.") ? t(item.name.split("t.").at(-1)) : item.name
                      }</span>
                    </div>
                  }
                </li>;
              })
            }
          </ul>
          <div className="border-t-[1.5px] w-full py-2">
            <FooterSocial />
          </div>
        </div>
      </div>
    </Drawer>
    <LoginModal openModal={openModal}
                setOpenModal={setOpenModal}
                activeId={activeId}
                setActiveId={setActiveId} />
  </>;
}
