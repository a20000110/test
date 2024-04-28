import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";
import { menus } from "@/lib/constants/menus";
import { BodyText } from "@/components/BodyText";
import React, { useEffect, useRef, useState } from "react";
import { ContactPhone } from "@/lib/constants/contact";
import { useRouter } from "next/router";
import { useInquiryStore } from "@/lib/store/inquiry.store";
import { siteStore } from "@/lib/store/site.store";
import NavUser from "@/components/User/nav-user";
import CountBadge from "@/components/Badge/count-badge";
import Translate from "@/components/Translate";
import { useLocale, useTranslations } from "next-intl";
import SearchInput from "@/components/Nav/searchInput";
import { useUserStore } from "@/lib/store/user.store";
import { useLoveStore } from "@/lib/store/love.store";
import { useCompareStore } from "@/lib/store/compare.store";
import clsx from "clsx";
import { useShoppingCartStore } from "@/lib/store/shoppingCart.store";
import { CartDrawer } from "@/components/Product/ShoppingCart/cartDrawer";
import { GqlProductCateMenusNode3 } from "@/lib/queries/nav-product";
import { navProductCates } from "@/lib/constants";
import MobileMenu from "@/components/Nav/mobileMenu";

const headerNavHeight = "32px";
export const headerNavHeightPx = +headerNavHeight.replace(/\D/g, "");

const navLeftList = [
  {
    label: "about.Faq",
    href: "/faq"
  }, {
    label: "nav.Services",
    href: "/services"
  }, {
    label: "common.About Us",
    href: "/about-us"
  }];


export const NavPhone = ({ className = "" }: { className?: string }) => {
  return <Link href={`tel:${ContactPhone}`} className={`c-flex gap-x-0.5 ${className}`}>
    <i className="ri-phone-line"></i>
    <BodyText size="xs">
      {ContactPhone}
    </BodyText>
  </Link>;
};

export const NavCompany = ({ className = "" }: { className?: string }) => {
  return <BodyText size="xs" className={className}>
    {process.env.NEXT_PUBLIC_COMPANY_FULLNAME}
  </BodyText>;
};

export const Nav = () => {

  const router = useRouter();
  const { inquiryList } = useInquiryStore();
  const { isBtob } = siteStore();
  const { cartList } = useShoppingCartStore();
  const [count, setCount] = useState(0);

  const [active, setActive] = useState("");

  const headerMenuRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("");
  const { userInfo } = useUserStore();
  const [loveCount, setLoveCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const { loveIds } = useLoveStore();
  const { compareIds } = useCompareStore();
  const locale = useLocale();
  const t = useTranslations();
  const { navCateMenus, getNavCateMenus } = siteStore();
  const [navProduct, setNavProduct] = useState<GqlProductCateMenusNode3[]>(navProductCates as GqlProductCateMenusNode3[]);
  const showMenus = menus.filter(item => item.show === undefined);
  const handlerSearch = (value: string) => {
    router.push(`/search?q=${value}`);
  };
  const handlerScroll = () => {
    const headerMenu = headerMenuRef.current!;
    window.addEventListener("scroll", () => {
      if (window.scrollY > headerNavHeightPx) {
        headerMenu?.classList?.add("fixed");
      } else {
        headerMenu?.classList?.remove("fixed");
      }
    });
  };

  useEffect(() => {
    if (isBtob) {
      setCount(Object.keys(inquiryList).length);
    } else {
      setCount(cartList?.item_count || 0);
    }
    setInquiryCount(Object.keys(inquiryList).length);
  }, [inquiryList, cartList]);


  useEffect(() => {
    handlerScroll();
    menus.some(menu => {
      if (router.asPath === menu.link) {
        setActive(menu.link);
        return;
      }
    });
  }, []);
  useEffect(() => {
    (async () => {
      while (true) {
        await getNavCateMenus(locale);
        await new Promise(resolve => setTimeout(resolve, 60 * 1000));
      }
    })();
  }, [locale]);

  useEffect(() => {
    if (navCateMenus.length) {
      setNavProduct(() => {
        const newNavCateMenus = JSON.parse(JSON.stringify(navCateMenus)) as GqlProductCateMenusNode3[];
        newNavCateMenus.forEach(item => {
          navProductCates.forEach(subItem => {
            if (item.slug === subItem.slug) {
              item.name = subItem.name;
            }
          });
        });
        return newNavCateMenus;
      });
    }
  }, [navCateMenus]);

  useEffect(() => {
    if (!!userInfo) {
      setUserName(userInfo?.username || "");
    } else {
      setUserName("");
    }
  }, [userInfo]);

  useEffect(() => {
    menus.some(menu => {
      if (router.asPath === "/") {
        return setActive(router.asPath);
      }
      if (router.asPath.startsWith(menu.link)) {
        return setActive(menu.link);
      }
    });
  }, [router]);

  useEffect(() => {
    setLoveCount(() => {
      return loveIds.length > 99 ? 99 : loveIds.length;
    });
  }, [loveIds]);
  useEffect(() => {
    setCompareCount(() => {
      return compareIds.length > 99 ? 99 : compareIds.length;
    });
  }, [compareIds]);

  return (
    <header className="header bg-white h-header-height max-md:!h-[92px] absolute top-0 right-0 left-0 z-[4]">
      <section className={`bg-[#f3f3f3] text-mainText max-md:hidden`} style={{
        height: headerNavHeight
      }}>
        <div className="container h-full b-flex mx-auto">
          <div className="block max-md:hidden gap-x-4 mr-1 s-flex">
            <Translate />
            <div className="w-[1px] h-[18px] bg-gray-400" />
            <div className="b-flex gap-x-4">
              {
                navLeftList.map((item, index) => {
                  return <Link href={item.href} key={index} className="text-xs hover:text-mainTextHover">
                    {t(item.label)}
                  </Link>;
                })
              }
            </div>
          </div>
          <div className="text-[11px] text-main">{t("singleblog.cf81e340f8ce3647ef89f50a24117e90372b")}</div>
          <div className="b-flex gap-x-3 max-md:!hidden">
            <NavPhone className="hover:text-mainTextHover" />
            <div className="w-[1px] h-[18px] bg-gray-400" />
            <NavCompany className="hover:text-mainTextHover" />
          </div>
        </div>
      </section>
      <section ref={headerMenuRef}
               className="top-0 left-0 right-0 bg-[#fbfaf7] shadow">
        <div className="container h-[90px] justify-between flex mx-auto relative z-[99]">
          <MobileMenu navProduct={navProduct} />
          <div className="logo h-full">
            <Link href="/" className="flex h-full c-flex">
              <Placeholder src="/image/logo-lefen.png" imageWidth={100} imageHeight={100} quality={100}></Placeholder>
            </Link>
          </div>
          <div className="w-full px-12 max-md:hidden h-full s-flex">
            <SearchInput onSearch={handlerSearch} />
          </div>
          <ul className="gap-x-4 flex">
            <li className="c-flex cursor-pointer max-md:!hidden">
              <Link href={"/compare"} className="c-flex rounded-full bg-[#efeeeb] relative w-[42px] shadow h-[42px]">
                <i className="ri-arrow-left-right-line ri-xl text-[#525251]"></i>
                {
                  !!compareCount && <span
                    className="right-0 top-0 absolute w-[18px] h-[18px] rounded-full bg-[#f44336] text-white text-[10px] c-flex">{compareCount}</span>
                }
              </Link>
            </li>
            <li className="c-flex cursor-pointer max-md:!hidden">
              <Link href={"/collection"} className="c-flex rounded-full bg-[#efeeeb] relative w-[42px] shadow h-[42px]">
                <i className="ri-heart-3-line ri-xl text-[#525251]"></i>
                {
                  !!loveCount && <span
                    className="right-0 top-0 absolute w-[18px] h-[18px] rounded-full bg-[#f44336] text-white text-[10px] c-flex">{loveCount}</span>
                }
              </Link>
            </li>
            <li className="c-flex cursor-pointer max-md:!hidden">
              <NavUser>
                <div className="c-flex rounded-full bg-[#efeeeb] px-4 shadow h-[42px]">
                  <div className="s-flex gap-x-2 text-[#525251]">
                    <i className="ri-user-line ri-xl"></i>
                    <p
                      className="text-sm whitespace-nowrap"> {userName || t("common.d8cfad914a6a0942a7d81df21cc76064bb6f")}</p>
                  </div>
                </div>
              </NavUser>
            </li>
            <li className="c-flex cursor-pointer">
              <Link href={"/inquiry"}
                    className="c-flex rounded-full bg-[#efeeeb] relative w-[42px] max-md:bg-transparent md:shadow h-[42px]">
                <i className="ri-file-list-line ri-xl text-[#525251] max-md:text-black"></i>
                {
                  !!inquiryCount && <span
                    className="right-0 top-0 absolute w-[18px] h-[18px] rounded-full bg-[#f44336] text-white text-[10px] c-flex">{inquiryCount}</span>
                }
              </Link>
            </li>
            <li className="c-flex cursor-pointer max-md:!hidden">
              <CartDrawer>
                <div className="c-flex rounded-full bg-[#efeeeb] w-[42px] md:shadow h-[42px]">
                  <i
                    className={`ri-shopping-bag-line ri-xl relative max-md:text-black text-[#525251]`}>
                    <CountBadge count={count} />
                  </i>
                </div>
              </CartDrawer>
            </li>
          </ul>
        </div>
        <div className="container pt-2 pb-4 b-flex max-md:hidden">
          <div className="b-flex gap-x-5 text-md text-mainText max-[1152px]:gap-x-4">
            <Link href={"/best-sellers"}
                  className="s-flex gap-x-1.5 cursor-pointer hover:text-mainTextHover duration-300">
              <Placeholder src="/image/menu/efbdecab954f0affa82e9670f9742b0.png" imageWidth={18} imageHeight={18}
                           className="w-4 h-4" />
              <span>{t("nav.Best Sellers")}</span>
            </Link>
            {
              !!navProduct?.length && navProduct?.map((item) => {
                return <div key={item.slug} className="group relative">
                  <Link href={`/${item.slug}`}
                        className="s-flex gap-x-1.5">
                    <Placeholder src={`/image/menu/${item.slug}.png`} imageWidth={18} imageHeight={18}
                                 className="w-4 h-4" />
                    <span
                      className="group-hover:text-mainTextHover">{item.name.startsWith("nav.") ? t(item.name) : item.name}</span>
                    {
                      !!item?.children?.nodes?.length && <i className="ri-arrow-down-s-fill" />
                    }
                  </Link>
                  {
                    !!item?.children?.nodes?.length &&
                    <div className="absolute top-full left-0 h-0 group-hover:h-[80vh] duration-500 transition-all">
                      <div className="hidden group-hover:flex flex-col min-w-[300px] shadow rounded-md bg-white">
                        {
                          item?.children?.nodes.map(item2 => {
                            return <div key={item2.slug}
                                        className={clsx("overflow-hidden", item2.children.nodes.length ? "max-h-[40px] transition-all  hover:max-h-[1000px] duration-[1000ms]" : "")}>
                              <div className="b-flex pr-2 hover:bg-gray-100 relative duration-300 group">
                                <Link href={`/${item2.slug}`}
                                      className="px-2 py-2 block whitespace-nowrap flex-1">{item2.name}</Link>
                                {
                                  !!item2.children.nodes?.length && <i className="ri-arrow-down-s-fill" />
                                }
                              </div>
                              {
                                !!item2.children.nodes?.length &&
                                <div>
                                  {
                                    item2.children.nodes.map(item3 => {
                                      return <Link href={`/${item3.slug}`} key={item3.slug}
                                                   className="px-4 text-sm py-2 hover:text-main bg-gray-50 duration-300 hover:bg-gray-100 block whitespace-nowrap">{item3.name}</Link>;
                                    })
                                  }
                                </div>
                              }
                            </div>;
                          })
                        }
                      </div>
                    </div>
                  }
                </div>;
              })
            }
            {
              showMenus.map((item, index) => {
                return <div className="group relative" key={index}>
                  <Link href={item.link} key={item.id}
                        className="hover:text-mainTextHover s-flex gap-x-1.5">
                    <Placeholder src={item?.icon || ""} imageWidth={16} imageHeight={16} className="w-4 h-4" />
                    <span>{t("common." + item.name)}</span>
                  </Link>
                </div>;
              })
            }
          </div>
        </div>
      </section>
    </header>
  );
};
