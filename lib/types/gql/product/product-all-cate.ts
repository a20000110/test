import { PageInfoInterface } from "@/lib/types/gql/index.type";


export interface GqlProductAllCategoryInterface {
  productCategories: ProductCategories;
}
interface ProductCategories {
  pageInfo: PageInfoInterface;
  nodes: GqlProductAllCateNodeInterface[];
}
export interface GqlProductAllCateNodeInterface {
  databaseId: number;
  name: string;
  slug: string;
  count?: number;
  parent?: Parent;
}
interface Parent {
  node: Node;
}
interface Node {
  databaseId: number;
}
