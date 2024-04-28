import { GqlProductMetaDatum, StockStatus } from "@/lib/types/gql/product/product-by-slug.type";

export interface GqlProductsInterface {
  products: GqlProductInterface;
}

export interface GqlProductInterface {
  __typename: string;
  edges: Edge[];
  pageInfo: PageInfo;
}

interface PageInfo {
  __typename: string;
  hasNextPage: boolean;
  endCursor: string;
  offsetPagination: OffsetPagination;
}

interface OffsetPagination {
  __typename: string;
  total: number;
}

interface Edge {
  __typename: string;
  node: GqlProductNodeInterface;
}

export type ProductTypeName = "VariableProduct" | "SimpleProduct"

export interface GqlProductNodeInterface {
  __typename: ProductTypeName;
  databaseId: number;
  name: string;
  slug: string;
  shortDescription: string;
  averageRating: number;
  image: Image;
  stockStatus: StockStatus;
  sku: string;
  metaData: GqlProductMetaDatum[];
  price?: any;
  salePrice?: any;
  regularPrice?: any;
  galleryImages: GalleryImages;
  productCategories: ProductCategories;
}

interface GalleryImages {
  __typename: string;
  nodes: Image[];
}

interface Image {
  __typename: string;
  sourceUrl: string;
}

interface ProductCategories {
  edges: ProductCategoriesEdges[];
}

interface ProductCategoriesEdges {
  node: {
    name: string;
    slug: string;
  };
}
