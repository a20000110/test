import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { pageStaticProps } from "@/lib/utils/util";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearch } from "@/lib/hooks/useSearch";
import { RingLoader } from "react-spinners";
import { Placeholder } from "@/components/Placeholder";
import Link from "next/link";
import Price from "@/components/Price/price";
import { PageSeoInterface } from "@/lib/types/rest-api/seo/page-seo.type";
import HeadSeo from "@/components/Seo/head-seo";

export default function Search({
                                 seo
                               }: {
  seo: PageSeoInterface | null;
}) {
  const router = useRouter();
  const t = useTranslations();
  const { searchPostAndProduct, searchLoading, postAndProduct } = useSearch();
  const search = (q: string) => {
    q && searchPostAndProduct(q);
  };
  useEffect(() => {
    const query = router.query as { q: string };
    query?.q && search(query.q);
  }, [router.query]);
  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("q");
    q && search(q);
  }, [router.locale]);
  return <>
    <HeadSeo seo={seo?.data} />
    <div className="bg-white">
      <div aria-hidden="true" className="relative">
        <img
          src="/image/product-feature-02-full-width.webp"
          alt=""
          className="h-96 w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white" />
      </div>

      <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("common.Search")}</h2>
          <p className="mt-4 text-gray-500">
            {t("message.63e5c00fac7e1b40dce84d8bd0a9a7313499")}
          </p>
          <p className="mt-1 text-gray-500">
            {t("message.1ffc1801e27faa4bdea8bd9ceca5379b8311", { max: 10 })}
          </p>
        </div>
        {
          searchLoading ? <div className="md:my-32 my-16 c-flex">
            <RingLoader color="#000" />
          </div> : !!postAndProduct && <>
            <div className="my-16">
              <div className="b-flex">
                <h2 className="text-2xl font-bold">{t("common.Product")}</h2>
                <Link href={"/product"} className="ri-menu-line ri-xl"
                      title={t("banner.0db144fb94fe4345594896d37faaf0e26260")} />
              </div>
              <dl
                className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:max-w-none lg:grid-cols-4 lg:gap-x-8">
                {postAndProduct.products.nodes.map((item) => (
                  <Link href={`/product/${item.slug}}`} key={item.databaseId} className="group">
                    <div className="border-t border-gray-200 pt-4">
                      <div className="w-full c-flex">
                        <Placeholder src={item.image?.sourceUrl || ""} imageWidth={400} imageHeight={400}
                                     fit={"cover"} />
                      </div>
                      <dt className="font-medium py-2 text-gray-900 group-hover:text-main duration-300">
                        {item.name}
                      </dt>
                      {
                        item.price && <dd className="text-sm text-gray-500">
                          <Price price={item.price} />
                        </dd>
                      }
                    </div>
                  </Link>
                ))}
              </dl>
            </div>
            <div className="my-16">
              <div className="b-flex">
                <h2 className="text-2xl font-bold">{t("common.Blog")}</h2>
                <Link href={"/blog"} className="ri-menu-line ri-xl"
                      title={t("banner.0db144fb94fe4345594896d37faaf0e26260")} />
              </div>
              <dl
                className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:max-w-none lg:grid-cols-4 lg:gap-x-8">
                {postAndProduct.posts.nodes.map((item) => (
                  <Link href={`/blog/${item.slug}}`} key={item.databaseId} className="group">
                    <div className="border-t border-gray-200 pt-4">
                      <div className="w-full c-flex">
                        <Placeholder src={item.featuredImage?.node?.sourceUrl || ""} imageWidth={400} imageHeight={400}
                                     fit={"cover"} />
                      </div>
                      <dt className="font-medium py-2 text-gray-900 group-hover:text-main duration-300">
                        {item.title}
                      </dt>
                      <dd className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: item.excerpt }}>
                      </dd>
                    </div>
                  </Link>
                ))}
              </dl>
            </div>
          </>
        }
      </div>
    </div>
  </>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const page_id = 21;
  return await pageStaticProps({
    page_id, locale: context.locale
  });
};
