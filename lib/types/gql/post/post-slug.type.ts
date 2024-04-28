import { PageInfoInterface } from "@/lib/types/gql/index.type";

export interface GqlPostSlugInterface {
  posts: Products;
}
interface Products {
  pageInfo: PageInfoInterface;
  nodes: GqlPostSlugNodeInterface[];
}
export interface GqlPostSlugNodeInterface {
  id: string;
  slug: string;
}
