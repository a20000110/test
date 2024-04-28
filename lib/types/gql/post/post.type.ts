import { PageInfoInterface } from "@/lib/types/gql/index.type";
export interface GqlPostsInterface {
  posts: GqlPostsSubInterface;
}
export interface GqlPostsSubInterface {
  pageInfo: PageInfoInterface;
  nodes: GqlPostsNodeInterface[];
}
export interface GqlPostsNodeInterface {
  databaseId: number;
  slug: string;
  commentCount?:number
  title: string;
  date: string;
  excerpt: string;
  featuredImage?: any;
  author: Author;
  categories: Categories;
}
interface Categories {
  nodes: Node2[];
}
interface Node2 {
  name: string;
  slug: string;
}
interface Author {
  node: Node;
}
interface Node {
  name: string;
  databaseId: number;
}
