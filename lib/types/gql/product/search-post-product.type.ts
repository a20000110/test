export interface GqlSearchPostProductInterface {
  products: Products;
  posts: Posts;
}

interface Posts {
  nodes: Node2[];
}

interface Node2 {
  databaseId: number;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  featuredImage?: FeaturedImage;
}

interface FeaturedImage {
  node: Image;
}

interface Products {
  nodes: Node[];
}

interface Node {
  databaseId: number;
  name: string;
  slug: string;
  image: Image;
  price: number | null;
}

interface Image {
  sourceUrl: string;
}
