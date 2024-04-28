import { GqlProductMetaDatum, StockStatus } from "@/lib/types/gql/product/product-by-slug.type";

export interface GqlProductTabsInterface {
  newProducts:Edges
}

interface Edges {
  edges: GqlProductTabsNodeInterface[];
}


export interface GqlProductTabsNodeInterface {
  node: node;
}

interface node {
  databaseId: number;
  name: string;
  averageRating: number;
  slug: string;
  price: string;
  regularPrice: string;
  metaData: GqlProductMetaDatum[];
  stockStatus: StockStatus;
  sku?: any;
  image?: {
    sourceUrl: string
  };

  [key: string]: any;
}
