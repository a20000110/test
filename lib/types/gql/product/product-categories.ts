import { PageInfoInterface } from "@/lib/types/gql/index.type";

export interface GqlProductCategoriesInterface {
  productCategories: {
    pageInfo: PageInfoInterface;
    nodes: GqlProductCategoriesNodeInterface[];
  };
}

export interface GqlProductCategoriesNodeInterface {
  databaseId: number;
  name: string;
  id: string;
  slug: string;
  description?: any;
  image?: Image;
  count:number
}

interface Image {
  sourceUrl: string;
}
