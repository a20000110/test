import { gql } from "@apollo/client";
import { StockStatus } from "@/lib/types/gql/product/product-by-slug.type";

export interface GqlGetProAttrsInterface {
    product: Product;
}
interface Product {
    name: string;
    databaseId:number;
    slug: string;
    attributes: Attributes;
    variations: Variations;
    price: string;
    stockStatus: StockStatus;
    stockQuantity?: any;
    salePrice?: any;
    regularPrice: string;
}
interface Variations {
    nodes: Node3[];
}
interface Node3 {
    stockStatus: StockStatus;
    stockQuantity?: any;
    databaseId: number;
    attributes: Attributes2;
    image: Image;
    regularPrice: string;
    price: string;
    slug: string;
}
interface Image {
    sourceUrl: string;
}
interface Attributes2 {
    nodes: Node2[];
}
interface Node2 {
    label: string;
    visible:boolean;
    name: string;
    value: string;
}
interface Attributes {
    nodes: Node[];
}
interface Node {
    variation: boolean;
    visible: boolean;
    label: string;
    name: string;
    options: string[];
}
export const GET_PRODUCT_ATTRS = gql`
    query ProductAttr($id: ID!) {
        product(id: $id, idType: DATABASE_ID) {
            databaseId
            name
            slug
            ... on SimpleProduct {
                stockStatus
                stockQuantity
                price
                salePrice
                regularPrice
                attributes(first:100) {
                    nodes {
                        label
                        name
                        options
                        visible
                        variation
                    }
                }
            }
            ... on VariableProduct {
                price
                salePrice
                regularPrice
                attributes(first: 100) {
                    nodes {
                        variation
                        visible
                        label
                        name
                        options
                    }
                }
                variations(first:100) {
                    nodes {
                        stockStatus
                        stockQuantity
                        databaseId
                        attributes {
                            nodes {
                                label
                                name
                                value
                            }
                        }
                        image {
                            sourceUrl
                        }
                        regularPrice
                        price
                        slug
                    }
                }
            }
        }
    }
`
