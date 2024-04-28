import { GqlProductMetaDatum } from "@/lib/types/gql/product/product-by-slug.type";

interface Image {
  sourceUrl: string;
}

export interface GqlProductByIdDataInterface {
  products: Products;
}

interface Products {
  nodes: GqlProductByIdProductInterface[];
}

export interface GqlProductByIdProductInterface {
  databaseId: number;
  name: string;
  slug: string;
  sku: string;
  image: Image;
  averageRating: number;
  stockQuantity: number;
  stockStatus: string;
  metaData: GqlProductMetaDatum[];
  price?: any;
  regularPrice?: any;
  salePrice?: any;
  vSlug?: string;
  parent?: {
    databaseId: number;
    slug: string;
  };
}

interface Image {
  sourceUrl: string;
}
