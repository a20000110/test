import { ContactEmail, ContactPhone } from "@/lib/constants/contact";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CustomPagesType, getAllCustomPage } from "@/lib/hooks/useGetAllCustomPage";
import { useLocale, useTranslations } from "next-intl";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { Placeholder } from "@/components/Placeholder";
import SendEmail from "@/components/Form/Inquiry/send-email";
import FooterSocial from "@/components/Footer/footerSocial";
import { siteStore } from "@/lib/store/site.store";
import { GqlProductCateMenusNode3 } from "@/lib/queries/nav-product";
import { navProductCates } from "@/lib/constants";

function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const [customPage, setCustomPage] = useState<CustomPagesType[]>([]);
  const { navCateMenus, getNavCateMenus } = siteStore();
  const [navProduct, setNavProduct] = useState<GqlProductCateMenusNode3[]>(navProductCates as GqlProductCateMenusNode3[]);
  useEffect(() => {
    getAllCustomPage(1, 500, []).then(async res => {
      const result = !!res?.length ? await translateStaticProps(res, ["name"], "auto", locale) : res;
      result && setCustomPage(result);
    });
  }, []);
  useEffect(() => {
    if (navCateMenus.length) {
      setNavProduct(navCateMenus);
    }
  }, [navCateMenus]);
  const navigation = {
    venace: [
      {
        name: "common.Products",
        href: "/product"
      },
      {
        name: "common.About Us",
        href: "/about-us"
      }, {
        name: "nav.Faq",
        href: "/faq"
      }, {
        name: "nav.Services",
        href: "/services"
      }, {
        name: "nav.Blog",
        href: "/blog"
      }, {
        name: "common.Contact Us",
        href: "/contact"
      }
    ],
    contact: [
      { name: `${ContactPhone}`, href: `tel:${ContactPhone}`, icon: "ri-smartphone-line" },
      { name: `${ContactEmail}`, href: `mailto:${ContactEmail}`, icon: "ri-mail-line" },
      {
        name: t("contact.c3c24240b73842469418ccd5f2977446bfe1"),
        href: `https://www.google.com/maps/search/Room 3403, No. 30, Fuli Ying Tong Business Building, Huaxia Road, Tianhe District, Guangzhou, Guangdong, China.`,
        icon: "ri-map-pin-2-line"
      }
    ]
  };

  return (
    <footer className="bg-[#fbfaf7] max-md:mb-mfnav-h" aria-labelledby="footer-heading">
      <div className="mx-auto container pb-8 pt-16 sm:pt-24 lg:pt-32">
        <div className="xl:grid xl:grid-cols-5 xl:gap-3">
          <div className="space-y-4 ">
            <Link href={"/"}>
              <Placeholder src={"/image/logo-lefen.png"} imageWidth={120} imageHeight={120} />
            </Link>
            <div className="text-themeGray">
              <p className="text-sm leading-6">
                Guangzhou Lefeng jewelry Co., LTD
              </p>
              <p className="text-sm leading-6">
                广州乐锋饰品有限公司
              </p>
            </div>
            <FooterSocial />
            <div>
              <SendEmail labelColor={"!text-themeGray"} />
            </div>
          </div>
          <div className="mt-10 md:mt-0">
            <h3
              className="text-lg font-semibold leading-6 text-themeGray">{t("footer.345defbcd6133f43daf9ab533d681a0909bc")}</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.venace.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}
                        className="text-sm leading-6 text-gray-500 hover:text-themeGray">
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 md:mt-0">
            <h3 className="text-lg font-semibold leading-6 text-themeGray">{t("common.Category")}</h3>
            <ul role="list" className="mt-6 space-y-4">
              {
                !!navProduct?.length && navProduct.map(item => {
                  return <li className="text-sm leading-6 text-gray-500 hover:text-themeGray" key={item.slug}>
                    <Link href={`/${item.slug}`}>
                      {item.name.startsWith("nav.") ? t(item.name) : item.name}
                    </Link>
                  </li>;
                })
              }
            </ul>
          </div>
          <div className="mt-10 md:mt-0">
            <h3
              className="text-lg font-semibold leading-6 text-themeGray">{t("links.8f60d4ab7bb65a4005787ff098eeb29d2891")}</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li className="text-sm leading-6 text-gray-500 hover:text-themeGray">
                <Link href={"/return-policy"}>
                  {t("links.755655572279d143d47b6e8a82e7e0d9f75b")}
                </Link>
              </li>
              <li className="text-sm leading-6 text-gray-500 hover:text-themeGray">
                <Link href={"/privacy-policy"}>
                  {t("links.d1413bba709e3247cb58279b70acd8da45e9")}
                </Link>
              </li>
              <li className="text-sm leading-6 text-gray-500 hover:text-themeGray">
                <Link href={"/wholesale-inquiries"}>
                  {t("links.4df4323ce41dfd4c834898244f290731480b")}
                </Link>
              </li>
              <li className="text-sm leading-6 text-gray-500 hover:text-themeGray">
                <Link href={"/shipping-returns"}>
                  {t("links.9a7f92abf1901a4094391658b9196933e5b0")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-10 md:mt-0">
            <h3 className="text-lg font-semibold leading-6 text-themeGray">{t("common.Contact Us")}</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.contact.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} target="_blank"
                        className="text-sm leading-6 text-gray-500 hover:text-themeGray">
                    <i className={`${item.icon} ri-xl`}></i>:
                    <span style={{
                      overflowWrap: "break-word"
                    }}> {item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/*自定义页面*/}
          {/*{*/}
          {/*  !!customPage.length && <div className="mt-10 md:mt-0">*/}
          {/*    <h3 className="text-lg font-semibold leading-6 text-themeGray">{t("common.Customer_Information")}</h3>*/}
          {/*    <ul role="list" className="mt-6 space-y-4">*/}
          {/*      {customPage.map(item => (*/}
          {/*        <li key={item.id}>*/}
          {/*          <Link href={(new URL(item.href).pathname)} target="_blank"*/}
          {/*                className="text-sm leading-6 text-gray-500 hover:text-themeGray">*/}
          {/*          <span style={{*/}
          {/*            overflowWrap: "break-word"*/}
          {/*          }}> {item.name}</span>*/}
          {/*          </Link>*/}
          {/*        </li>*/}
          {/*      ))}*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*}*/}
        </div>
      </div>
      <div className="border-t-[1px] border-[#878787] py-4">
        <div className="container b-flex text-themeGray text-xs max-md:flex-col max-md:gap-y-2">
          <p>©Copyright 2019 Lefeng Jewelry. All Rights Reserved. </p>
          <Placeholder src={"/image/home/pay.png"} imageWidth={180} imageHeight={20} />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
