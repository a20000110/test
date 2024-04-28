export interface GqlPostRecentInterface {
  posts: Posts;
}

interface Posts {
  nodes: GqlPostRecentNodeInterface[];
}

export interface GqlPostRecentNodeInterface {
  title: string;
  slug: string;
  date: string;
  featuredImage?: FeaturedImage;
  author: Author;
}

interface Author {
  node: Node2;
}

interface Node2 {
  name: string;
  databaseId: number;
}

interface FeaturedImage {
  node: Node;
}

interface Node {
  sourceUrl: string;
}
