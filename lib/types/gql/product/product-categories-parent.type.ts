import { PageInfoInterface } from "@/lib/types/gql/index.type";

export interface GqlProductCategoriesParentInterface {
  productCategories: ProductCategories;
}

interface ProductCategories {
  pageInfo: PageInfoInterface;
  nodes: GqlProductCategoriesParentNode2Interface[];
}

export interface GqlProductCategoriesParentNode2Interface {
  databaseId: number;
  name: string;
  slug: string;
  count?: number;
  children: Children1;
}

interface Children1 {
  nodes: Node1[];
}


interface Node1 {
  databaseId: number;
  name: string;
  slug: string;
  count: number;
  children: GqlProductCategoriesParentNode2Children2Interface;
}

export interface GqlProductCategoriesParentNode2Children2Interface {
  nodes: Node2[];
}

interface Node2 {
  databaseId: number;
  name: string;
  slug: string;
  count: number;
}
