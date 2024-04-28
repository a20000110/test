import client from "@/lib/ApolloClient/apolloClient";
import { cApiUrl, handlerPathSlug } from "@/lib/utils/util";
import { GqlPostSlugInterface } from "@/lib/types/gql/post/post-slug.type";
import { SlugInterface } from "@/lib/hooks/useGetProductSlug";
import { POST_SLUG } from "@/lib/queries/post-slug";
import axios from "axios";
import lang from "@/languagePack.json";

export const getAllBlogSlug = async (page: number, limit: number, slugs: SlugInterface[]): Promise<SlugInterface[] | void> => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_TRANSLATE_URL}/api/next-website/blog/slugs`, {
      params: {
        page,
        limit,
        custom_key: process.env.NEXT_WC_CONSUMER_KEY,
        custom_secret: process.env.NEXT_WC_CONSUMER_SECRET,
        db_host: process.env.NEXT_PUBLIC_DB_HOST,
        db_name: process.env.NEXT_PUBLIC_DB_NAME,
        db_user: process.env.NEXT_PUBLIC_DB_USER,
        db_password: process.env.NEXT_PUBLIC_DB_PASSWORD
      }
    });
    if (res.data.code === 200) {
      slugs.push(...res.data.data.map((slug: string) => {
        return {
          params: {
            slug: handlerPathSlug(slug)
          }
        };
      }));
    }
    return slugs;
  } catch (e) {
    return [
      {
        params: {
          slug: "best-selling-closet-accessories"
        }
      }
    ];
  }
  // if (isDev) return slugs;
  // if (data.posts.pageInfo.hasNextPage) {
  //   await getAllBlogSlug(first, data.posts.pageInfo.endCursor, slugs);
  // } else {
  //   return slugs;
  // }
};
