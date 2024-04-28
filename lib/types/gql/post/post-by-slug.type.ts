export interface GqlPostBySlugInterface {
  posts: Posts;
}

interface Posts {
  nodes: GqlPostBySlugNodeInterface[];
}

export interface GqlPostBySlugNodeInterface {
  databaseId: number;
  title: string;
  id: string;
  link: string;
  featuredImage?: any;
  commentCount: number;
  commentStatus: string;
  comments: Comments;
  date: string;
  content: string;
  categories: Categories;
  author: Author2;
}

interface Author2 {
  node: Node4;
}

interface Node4 {
  name: string;
  databaseId: number;
}

interface Categories {
  nodes: Node3[];
}

interface Node3 {
  databaseId: number;
  slug: string;
  name: string;
}

interface Comments {
  nodes: GqlPostBySlugNode2Interface[];
}

export interface GqlPostBySlugNode2Interface {
  content: string;
  date: string;
  id: number;
  author: Author;
}

interface Author {
  node: Node;
}

interface Node {
  name: string;
  avatar: Avatar;
}

interface Avatar {
  url: string;
}
