import { StockStatus } from "@/lib/types/gql/product/product-by-slug.type";

export interface GqlProductBySlugsInterface {
  products: Products;
}

interface Products {
  pageInfo: PageInfo;
  edges: Edge2[];
}

interface Edge2 {
  node: GqlProductBySlugsNodeInterface;
}

export interface GqlProductBySlugsNodeInterface {
  databaseId: number;
  reviewCount: number;
  name: string;
  slug: string;
  averageRating: number;
  image: Image;
  shortDescription: string;
  description: string;
  sku?: any;
  metaData: GqlProductMetaDatum[];
  attributes: Attributes;
  variations: Variations;
  link: string;
  weight?: any;
  length?: any;
  width?: any;
  height?: any;
  price: string;
  stockStatus: StockStatus;
  stockQuantity?: any;
  salePrice: string;
  regularPrice: string;
  productTags: ProductTags;
  galleryImages: GalleryImages;
  productCategories: ProductCategories;
}

interface ProductCategories {
  edges: ProductCategoriesEdges[];
}

interface ProductCategoriesEdges {
  node: {
    name: string;
    slug: string;
    parent: {
      node: {
        slug: string
        name: string
        parent: {
          node: {
            slug: string
            name: string
          }
        } | null
      }
    } | null
  };
}

export interface GqlProductCategoriesEdges extends ProductCategoriesEdges {
}


interface GalleryImages {
  nodes: Image[];
}

interface ProductTags {
  nodes: any[];
}

interface Variations {
  nodes: GqlProductVariationsNode3[];
}

export interface GqlProductVariationsNode3 {
  stockStatus: StockStatus;
  stockQuantity?: number;
  databaseId: number;
  attributes: Attributes2;
  image: Image;
  price: string;
  slug: string;
  regularPrice?: string;
}

interface Attributes2 {
  nodes: Node2[];
}

interface Node2 {
  label: string;
  name: string;
  value: string;
}

interface Attributes {
  nodes: GqlProductAttributeNodeInterface[];
}

export interface GqlProductAttributeNodeInterface {
  variation: boolean;
  visible: boolean;
  label: string;
  name: string;
  options: string[];
}

export interface GqlProductMetaDatum {
  value: string;
  id: string;
  key: string;
}

interface Image {
  sourceUrl: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
  offsetPagination: OffsetPagination;
}

interface OffsetPagination {
  total: number;
}
