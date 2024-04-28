import {gql} from "@apollo/client";

export interface GqlProductCateMenus {
    productCategories: ProductCategories;
}
interface ProductCategories {
    nodes: GqlProductCateMenusNode3[];
}
export interface GqlProductCateMenusNode3 {
    name: string;
    slug: string;
    children: Children3;
}
interface Children3 {
    nodes: (Node2 | Nodes2 | Nodes3)[];
}
interface Nodes3 {
    name: string;
    slug: string;
    children: Children2;
}
interface Children2 {
    nodes: any[];
}
interface Nodes2 {
    name: string;
    slug: string;
    children: Children;
}

interface Node2 {
    name: string;
    slug: string;
    children: Children;
}
interface Children {
    nodes: Node[];
}
interface Node {
    name: string;
    slug: string;
}
export const CATE_MENUS = gql`
    query GetCateMenus($slugs:[String!]) {
        productCategories(where: {parent: 0,slug:$slugs, order: ASC, orderby: TERM_ORDER}) {
            nodes {
                name
                slug
                children(first:100) {
                    nodes {
                        name
                        slug
                        children(first:100) {
                            nodes {
                                name
                                slug
                            }
                        }
                    }
                }
            }
        }
    }
`
