import { gql } from "@apollo/client";
import { PageInfoInterface } from "@/lib/types/gql/index.type";
import { GqlProductMetaDatum, StockStatus } from "@/lib/types/gql/product/product-by-slug.type";

export interface GqlBestsellingProducts {
  products: Products;
}

interface Products {
  pageInfo: PageInfoInterface;
  nodes: GqlBestSellNode[];
}

export interface GqlBestSellNode {
  name: string;
  slug: string;
  databaseId: number;
  image: Image;
  price: string;
  regularPrice: string;
  averageRating: number;
  stockStatus: StockStatus;
  metaData: GqlProductMetaDatum[];
}

interface Image {
  sourceUrl: string;
}

export const GET_BESTSELLING_PRODUCTS = gql`
    query GetHotProducts($first: Int, $after: String) {
        products(
            where: {orderby: {field: TOTAL_SALES, order: ASC}, status: "PUBLIC"}
            first: $first
            after: $after
        ) {
            pageInfo {
                endCursor
                hasNextPage
            }
            nodes {
                name
                slug
                databaseId
                image {
                    sourceUrl
                }
                metaData(keysIn:["min_quantity"]){
                    value
                    id
                    key
                }
                averageRating
                ... on SimpleProduct {
                    price
                    regularPrice
                    stockStatus
                }
                ... on VariableProduct {
                    price
                    regularPrice
                    stockStatus
                }
            }
        }
    }
`;
