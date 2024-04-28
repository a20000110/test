import {PageInfoInterface} from "@/lib/types/gql/index.type";
import { GqlPostsNodeInterface } from "@/lib/types/gql/post/post.type";

export interface GqlHeaderSearchPostInterface {
    posts: Posts;
}

interface Posts {
    pageInfo: PageInfoInterface;
    nodes: GqlPostsNodeInterface[];
}


interface FeaturedImage {
    node: Node;
}

interface Node {
    sourceUrl: string;
}
