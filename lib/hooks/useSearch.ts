import { toast } from "react-toastify";
import client from "@/lib/ApolloClient/apolloClient";
import { GqlSearchPostProductInterface } from "@/lib/types/gql/product/search-post-product.type";
import { SEARCH_POST_PRODUCT } from "@/lib/queries/search-post-product";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { translateStaticProps } from "@/lib/utils/translate-util";


export const useSearch = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [searchLoading, setSearchLoading] = useState(false);
  const [postAndProduct, setPostAndProduct] = useState<GqlSearchPostProductInterface | null>(null);
  const searchPostAndProduct = async (q: string): Promise<GqlSearchPostProductInterface | null> => {
    try {
      setSearchLoading(true);
      const requestId = "7a765d6b6c08ac4f8e4bcbc5905e17a85fe9";
      client.abortRequest(requestId);
      const res = await client.query<GqlSearchPostProductInterface>({
        query: SEARCH_POST_PRODUCT,
        variables: {
          search: q
        },
        requestId
      });
      // 增加非空校验
      if (res && res.data) {
        const promise = [];
        let flag = 0;
        if (res.data?.posts?.nodes?.length) {
          flag = 1;
          promise.push(translateStaticProps(res.data.posts.nodes, ["title","excerpt"], "auto", locale));
        }
        if (res.data?.products?.nodes?.length) {
          flag = 2;
          promise.push(translateStaticProps(res.data.products.nodes, ["name"], "auto", locale));
        }
        if (res.data?.products?.nodes?.length && res.data?.posts?.nodes?.length) {
          flag = 3;
        }
        const result = await Promise.all(promise);
        const newData: GqlSearchPostProductInterface = {
          posts: {
            nodes: [
              ...(flag === 1 || flag === 3 ? result[0] : [])
            ]
          },
          products: {
            nodes: [
              ...(result[flag === 3 ? 1 : 0] || [])
            ]
          }
        };
        setPostAndProduct(newData);
        return (!newData.posts.nodes.length || !newData.products.nodes.length) ? null : newData;
      } else {
        console.error("Result data is empty or undefined.");
        toast.error(t("message.f857ab717abe1043aad82339c46e954b2da7")); // 使用更通用的错误消息key
        setPostAndProduct(null);
        return null;
      }
    } catch (e) {
      toast.error(t("message.68b3c109400381463f29a23b15161f88cc86"));
      setPostAndProduct(null);
      return null;
    } finally {
      setSearchLoading(false);
    }
  };

  return {
    postAndProduct,
    searchLoading,
    searchPostAndProduct
  };
};
