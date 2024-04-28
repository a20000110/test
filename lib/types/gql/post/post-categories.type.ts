export interface GqlPostCategoriesInterface {
  categories: Categories;
}

interface Categories {
  nodes: GqlPostCategoriesNodeInterface[];
}

export interface GqlPostCategoriesNodeInterface {
  id: string;
  name: string;
  slug: string;
  count?: number;
}
