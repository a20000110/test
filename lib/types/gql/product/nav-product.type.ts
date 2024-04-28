export interface GqlNavProductInterface {
  productCategories: Node3;
}
 interface Node3 {
  nodes: Node3[];
}
export interface GqlNavProductsInterface {
  name: string;
  slug: string;
  children: Children2;
}
interface Children2 {
  nodes: Node2[];
}
interface Node2 {
  name: string;
  slug: string;
  image?: (Image | null)[];
  children: Children;
}
interface Children {
  nodes: Node[];
}
interface Node {
  name: string;
  slug: string;
  image?: any;
}
interface Image {
  sourceUrl: string;
}
