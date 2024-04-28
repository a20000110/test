import HomeBanner from "@/components/Home/banner";
import { REVA_DATE } from "@/lib/constants";
import client from "@/lib/ApolloClient/apolloClient";
import { POST } from "@/lib/queries/post";
import { GqlPostsInterface, GqlPostsNodeInterface } from "@/lib/types/gql/post/post.type";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";
import BuildCustomHtml from "@/components/BuildCustomHtml";
import { PRODUCT_CATEGORIES2 } from "@/lib/queries/product-categories";
import {
  GqlProductCategoriesInterface,
  GqlProductCategoriesNodeInterface
} from "@/lib/types/gql/product/product-categories";
import Link from "next/link";
import React, { useEffect } from "react";
import PostCard from "@/components/Post/post-card";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";
import { getLang, translatePageCode, translatePageSEO } from "@/lib/utils/util";
import { translateStaticProps } from "@/lib/utils/translate-util";
import ProductCard from "@/components/Product/product-card";
import { GqlProductTabsInterface } from "@/lib/types/gql/product/product-tabs.type";
import SubmitForm from "@/components/Form/Inquiry/submit-form";
import { NEW_PRODUCTS } from "@/lib/queries/product-new";

const Title = ({ title, className = "" }: {
  title: string,
  className?: string
}) => {
  return <h2 className={`py-8 font-bold text-3xl max-md:text-xl ${className}`}>{title}</h2>;
};

const Layout = ({
                  children,
                  className = ""
                }: {
  children: React.ReactNode;
  className?: string
}) => {
  return <div className={`container py-[100px] max-md:py-[60px] ${className}`}>
    {children}
  </div>;
};

// 第一部分
const FirstStage = () => {
  const t = useTranslations("home");
  return (
    <div className="py-20 bg-white">
      <div className="grid md:grid-cols-3 container items-center">
        <div className="col-span-1 px-10 space-y-2">
          <h2 className="Constantia text-black text-4xl font-black mb-4">{t("Tailor-made")}</h2>
          <p>
            <span className="font-black">{t("Custom_Necklaces")}:</span>{t("Custom_Necklaces_lf")}
          </p>
          <p><span className="font-black">{t("Custom_Bracelets")}:</span>{t("Custom_Bracelets_lf")}</p>
          <p><span className="font-black">{t("Custom_Rings")}:</span>{t("Custom_Rings_lf")}</p>
          <p><span className="font-black">{t("Custom_Earrings")}:</span>{t("Custom_Earrings_lf")}</p>
          <Link href="/product">
            <button
              className="my-4 px-6 py-3 text-main font-black rounded-full bg-white border border-main hover:bg-main hover:text-white">{t("Read_More")}</button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4 col-span-2">
          <Link href="/contact">
            <img src="/image/home/necklace.jpg" alt="" />
            <h2 className="my-4 text-black font-black text-center Constantia">{t("Custom_Necklaces")}</h2>
          </Link>
          <Link href="/contact">
            <img src="/image/home/bracelet.jpg" alt="" />
            <h2 className="my-4 text-black font-black text-center Constantia">{t("Custom_Bracelets")}</h2>
          </Link>
          <Link href="/contact">
            <img src="/image/home/ring.jpg" alt="" />
            <h2 className="my-4 text-black font-black text-center Constantia">{t("Custom_Rings")}</h2>
          </Link>
          <Link href="/contact">
            <img src="/image/home/earrings.jpg" alt="" />
            <h2 className="my-4 text-black font-black text-center Constantia">{t("Custom_Earrings")}</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductNewFeatBest = ({ productNFB }: {
  productNFB: GqlProductTabsInterface["newProducts"] | null;
}) => {
  const t = useTranslations();
  return <Layout>
    <div className="">
      <Title title={t("home.New_Arrivals")} className="text-black text-2xl text-center font-black mb-6" />
      <p className="text-black text-sm font-light text-center mb-6">{t("home.Take_jewellery")}</p>
    </div>
    <div className="grid grid-cols-5 gap-4 max-md:grid-cols-2">
      {
        productNFB && productNFB.edges.map(item => {
          return <ProductCard product={item.node} key={item.node.databaseId} />;
        })
      }
    </div>
  </Layout>;
};


const useAnimateOnScroll = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate__animated", "animate__fadeInUp");
            observer.unobserve(entry.target); // 可选：动画播放后停止观察
          }
        });
      },
      {
        root: null, // 使用默认的视口
        rootMargin: "0px",
        threshold: 0.1 // 10%元素可见时触发
      }
    );

    // 观察所有具有特定类的元素
    document.querySelectorAll(".animate-on-scroll").forEach(item => {
      observer.observe(item);
    });

    return () => observer.disconnect(); // 组件卸载时停止观察
  }, []);
};
const OneStop = () => {
  const t = useTranslations("home");
  useAnimateOnScroll();
  return (
    <div style={{
      backgroundSize: "cover",
      backgroundImage: `url(/image/home/advantage.jpg)`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      padding: "8%",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }}>

      <div className="space-y-6 container">
        <h2 className="Constantia text-center text-white text-2xl md:text-5xl">{t("One-stop")}</h2>
        <p className="container text-white text-center text-base w-2/3">{t("Jewelry_Solution")}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 animate-on-scroll">
            <img src="/image/home/01.png" alt="" />
            <h3 className="text-white text-xl font-black Constantia">{t("Pre-production")}</h3>
            <p className="text-white text-sm">{t("Pre-production_neiron")}</p>
          </div>
          <div className="space-y-4 animate-on-scroll">
            <img src="/image/home/02.png" alt="" />
            <h3 className="text-white text-xl font-black Constantia">{t("Production")}</h3>
            <p className="text-white text-sm">{t("Production_neiron")}</p>
          </div>
          <div className="space-y-4 animate-on-scroll">
            <img src="/image/home/03.png" alt="" />
            <h3 className="text-white text-xl font-black Constantia">{t("Inspection")}</h3>
            <p className="text-white text-sm">{t("Inspection_neiron")}</p>
          </div>
          <div className="space-y-4 animate-on-scroll">
            <img src="/image/home/04.png" alt="" />
            <h3 className="text-white text-xl font-black Constantia">{t("Package")}</h3>
            <p className="text-white text-sm">{t("Package_neiron")}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <Link href="/services">
            <button
              className="my-4 px-6 py-3 text-main font-black rounded-full bg-white border border-main hover:bg-main hover:text-white">{t("Read_More")}</button>
          </Link>
        </div>

      </div>
    </div>
  );
};


// 第四部分
const Customization = () => {
  const t = useTranslations("home");
  return (
    <div>
      <div className="py-20 bg-gray-100" style={{
        backgroundSize: "cover",
        backgroundImage: `url(/image/home/about_bj.png)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}>
        <div className="container grid lg:grid-cols-2 sm:grid-cols-1 gap-8 mb-6 items-center">
          <div className="mr-8">
            <h2 className="font-black text-3xl text-black mb-4">{t("Customization")}</h2>
            <p className="text-sm font-light">
              {t("Customize_a_solution")}
            </p>
            <ul className="space-y-4 my-5  list-none">
              <li className="flex items-center">
                <span className="mr-2 inline-block h-10 w-10 md:w-10 md:h-8 bg-no-repeat bg-center"
                      style={{ backgroundImage: `url(/image/home/li.svg)` }}></span>
                {t("Customization1")}
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-block h-10 w-10 md:w-10 md:h-8 bg-no-repeat bg-center"
                      style={{ backgroundImage: `url(/image/home/li.svg)` }}></span>
                {t("Customization2")}
              </li>
              <li className="flex items-center">
                <span className="mr-2 inline-block h-14 w-14 md:w-10 md:h-8 bg-no-repeat bg-center"
                      style={{ backgroundImage: `url(/image/home/li.svg)` }}></span>
                {t("Customization3")}
              </li>
            </ul>
            <Link href="/contact">
              <button
                className="my-4 px-6 py-3 text-main font-black rounded-full bg-white border border-main hover:bg-main hover:text-white">{t("Read_More")}</button>
            </Link>
          </div>
          <div><img src="/image/home/company9 (1).png" alt="" /></div>
        </div>
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h2 className="Constantia text-main text-7xl text-center mb-8">
              15
            </h2>
            <p className="text-center">
              {t("15")}
            </p>
          </div>
          <div>
            <h2 className="Constantia text-main text-7xl text-center mb-8">
              200
            </h2>
            <p className="text-center">
              {t("200")}
            </p>
          </div>
          <div>
            <h2 className="Constantia text-main text-7xl text-center mb-8">
              160
            </h2>
            <p className="text-center">
              {t("160")}
            </p>
          </div>
          <div>
            <h2 className="Constantia text-main text-7xl text-center mb-8">
              100+
            </h2>
            <p className="text-center">
              {t("100+")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 第五部分
const ExpertAdvice = ({ blog }: {
  blog: GqlPostsNodeInterface[] | null;
}) => {
  const t = useTranslations("home");
  return <Layout>
    <div className="grid grid-cols-3 items-center">
      <div className="col-span-2">
        <Title title={t("33c2cd5a3680ab4200c8f5ece96ff27a20d9")} />
        <p className=" mb-10">{t("Ew-neiron")}</p>
      </div>
      <div className="col-span-1 flex justify-end">
        <Link href="/blog">
          <button
            className="my-4 px-6 py-3 text-main font-black rounded-full bg-white border border-main hover:bg-main hover:text-white">{
            t("allupdates")
          }
          </button>
        </Link>
      </div>
    </div>
    <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 max-md:gap-2">
      {
        !!blog && blog?.map((item) => {
          return <PostCard post={item} key={item.databaseId} />;
        })
      }
    </div>
  </Layout>;
};

// 第六部分
const Contact = ({}) => {
  const t = useTranslations("home");
  return (
    <div className="" style={{
      backgroundImage: `url(/image/home/dtbg.jpg)`,
      backgroundSize: "cover",
      padding: "10%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
      <div className="container">
        <h2 className="Constantia text-2xl md:text-5xl md:mt-10 mt-28">{t("Get-em")}</h2>
        <p className="my-6 md:w-1/2 w-full">{t("GEt-em-neirong")}</p>
        <div className="flex flex-col md:w-1/2 w-full">
          <SubmitForm
            goods={[{ id: 0, count: 0 }]}
            title=""
          />
        </div>
      </div>

    </div>
  );
};

export default React.memo(function HomePage(props: {
  blog: GqlPostsNodeInterface[] | null;
  seo: PageSeoInterface | null;
  page_code: string;
  productCategory: GqlProductCategoriesNodeInterface[] | null;
  productNFB: GqlProductTabsInterface | null;
}) {
  return <>
    <HeadSeo seo={props?.seo?.data} />
    <div className="bg-[#f4f2ef]">
      <HomeBanner />
      <FirstStage />
    </div>
    <BuildCustomHtml html={props.page_code}>
      <div className="bg-[#f4f2ef]">
        <ProductNewFeatBest productNFB={props.productNFB?.newProducts || null} />
        <OneStop />
        <Customization />
        <ExpertAdvice blog={props.blog} />
        <Contact />
      </div>
    </BuildCustomHtml>
  </>;
});

export async function getStaticProps(context: GetStaticPropsContext) {
  const page_id = 0;
  let blog: GqlPostsNodeInterface[] | null = null;
  let productCategory: GqlProductCategoriesNodeInterface[] | null = null;
  let seo: PageSeoInterface | any = {};
  let page_code: string = "";
  const promise = Promise.all([
    client.query<GqlPostsInterface>({
      query: POST,
      variables: {
        first: 4
      }
    }),
    client.query<GqlProductCategoriesInterface>({
      query: PRODUCT_CATEGORIES2,
      variables: {
        first: 8
      }
    }),
    client.query<GqlProductTabsInterface>({
      query: NEW_PRODUCTS
    })
  ]);

  let [{ data }, { data: productCategorys }, { data: productNFB }] = await promise;
  const transPromise = [];
  if (data?.posts?.nodes?.length) {
    transPromise.push(translateStaticProps(data.posts.nodes, ["title", "excerpt", "categories.nodes[].name"], "auto", context.locale));
  }
  transPromise.push(translatePageSEO(page_id, context.locale));
  if (productCategorys?.productCategories?.nodes?.length) {
    productCategory = productCategorys.productCategories.nodes;
    transPromise.push(translateStaticProps(productCategory, ["name", "description"], "auto", context.locale));
  }

  if (productNFB) {
    transPromise.push(translateStaticProps([productNFB], ["bestSellingProducts.edges[].node.name", "featuredProducts.edges[].node.name", "newProducts.edges[].node.name"], "auto", context.locale));
  }
  transPromise.push(translatePageCode(page_id, context.locale));

  const transPromiseResult = await Promise.all(transPromise);
  blog = transPromiseResult[0];
  const seoData = transPromiseResult?.[1]?.[0] || null;
  seo ? (seo.data = seoData) : null;
  productCategory = transPromiseResult?.[2] || null;

  productNFB = transPromiseResult?.[3]?.[0] || null;

  page_code = transPromiseResult?.[4]?.[0] || page_code;
  return {
    props: {
      blog: blog,
      seo: seo,
      page_code: page_code,
      productCategory: productCategory,
      productNFB: productNFB,
      messages: await getLang(context.locale)
    },
    revalidate: REVA_DATE
  };
}
