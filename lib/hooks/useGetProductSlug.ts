import { handlerPathSlug } from "@/lib/utils/util";
import axios from "axios";

export interface SlugInterface {
  params: {
    slug: string
  };
};

export const getAllProductSlug = async (page: number, limit: number, slugs: SlugInterface[]): Promise<SlugInterface[] | void> => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_TRANSLATE_URL}/api/next-website/product/slugs`, {
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
          slug: "adjustable-desk"
        }
      }
    ];
  }
  // if (data.products.pageInfo.hasNextPage) {
  //   await getAllProductSlug(first, data.products.pageInfo.endCursor, slugs);
  // } else {
  //   return slugs;
  // }
};
