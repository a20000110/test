import { getLang, translateFormFields } from "@/lib/utils/util";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import { useLocale, useTranslations } from "next-intl";
import { useInquiryStore } from "@/lib/store/inquiry.store";
import SubmitForm, { Fields } from "@/components/Form/Inquiry/submit-form";
import client from "@/lib/ApolloClient/apolloClient";
import { GqlProductByIdDataInterface } from "@/lib/types/gql/product/product-by-id.type";
import PRODUCTS_BY_ID from "@/lib/queries/product-by-id";
import { translateStaticProps } from "@/lib/utils/translate-util";
import { toast } from "react-toastify";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
      messages: await getLang(context.locale)
    }
  };
};

type ProductType = GqlProductByIdDataInterface["products"]["nodes"]
export default function Inquiry() {
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const { inquiryList, removeInquiry } = useInquiryStore();
  const [fields, setFields] = useState<Fields[]>([]);
  const [product, setProduct] = useState<ProductType>([]);
  const [list, setList] = useState<{
    id: number,
    count: number
  }[]>([]);
  const t = useTranslations();
  const getFormFields = async () => {
    // 获取询盘表单字段
    if (Object.keys(inquiryList).length) {
      const formFields = await translateFormFields(locale) as Fields[];
      setFields(formFields);
    }
  };
  // 获取询盘产品数据
  const getProductData = async () => {
    const ids = Object.keys(inquiryList).map(item => {
      return parseInt(item);
    });
    const { data } = await client.query<GqlProductByIdDataInterface>({
      query: PRODUCTS_BY_ID,
      variables: {
        ids: ids,
        first: ids.length
      }
    });
    const nodes = await translateStaticProps(data.products.nodes, ["name"], "en", locale) as ProductType;
    setProduct(nodes);
  };

  const remove = (id: number) => {
    removeInquiry(id.toString());
    setProduct(old => {
      return old.filter(item => item.databaseId !== id);
    });
  };

  useEffect(() => {
    (async function() {
      try {
        setLoading(true);
        if (Object.keys(inquiryList).length) {
          await Promise.all([
            getFormFields(),
            getProductData()
          ]);
          setList(Object.keys(inquiryList).map(item => {
              return {
                id: +item,
                count: inquiryList[item].count
              };
            })
          );
        } else {
          setList([]);
        }
      } catch (e) {
        console.error(e);
        toast.error(t("message.fb1ec174b6ac8f409ffa6ebdf48e2666cc5e"));
      } finally {
        setLoading(false);
      }
    })();
  }, [inquiryList]);
  return <>
    {loading ?
      <div className="w-full c-flex my-64 max-md:my-32">
        <RingLoader color="#000" />
      </div>
      : !!list.length ? <div className="container my-32">
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {
            product.map(item => {
              return <li key={item.databaseId} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <img src={item.image.sourceUrl} alt={item.name}
                       className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48" />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link href={`/product/${item.slug}`}
                                className="font-medium text-gray-700 hover:text-gray-800">{item.name}</Link>
                        </h3>
                      </div>
                      <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">SKU</p>
                        <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{item.sku}</p>
                      </div>
                      <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">{t("product.Quantity")}</p>
                        <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{
                          list.find(f => f.id === item.databaseId)?.count || 1
                        }</p>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {item.regularPrice}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="absolute right-0 top-0">
                        <button type="button" className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                onClick={() => remove(item.databaseId)}>
                          <span className="sr-only">Remove</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>;
            })
          }
        </ul>
        <div className="max-w-4xl mx-auto inquiryButton my-16">
          <h2
            className="text-center text-2xl mb-10 max-md:text-lg font-bold">{t("form.ff3261e71883634845294a9020c9803716c1")}</h2>
          <style>
            {
              `
            .inquiryButton .submit-button{
              width:100%!important;
              text-align:center;
              justify-content:center;
            }
            `
            }
          </style>
          <SubmitForm goods={list} formFields={fields} />
        </div>
      </div> : <EmptyState />
    }
  </>;
}
