
import {DocumentNode, gql} from "@apollo/client";

const PRODUCT_BY_SLUGS:DocumentNode = gql`
    query GetProductBySlug($slug: [String]!) {
        products(where: {slugIn: $slug}) {
            edges {
                node {
                    databaseId
                    name
                    slug
                    reviewCount
                    averageRating
                    image {
                        sourceUrl
                    }
                    shortDescription
                    description
                    sku
                    metaData(keysIn:["woodmart_wc_video_gallery","min_quantity"]){
                        value
                        id
                        key
                    }
                    ... on SimpleProduct {
                        link
                        weight
                        length
                        width
                        height
                        price
                        stockStatus
                        stockQuantity
                        salePrice
                        regularPrice
                        attributes(first:100){
                            nodes{
                                attributeId
                                visible
                                label
                                name
                                options
                            }
                        }
                        galleryImages {
                            nodes {
                                sourceUrl
                            }
                        }
                        productCategories {
                            edges {
                                node {
                                    name
                                    slug
                                }
                            }
                        }
                    }

                    ... on VariableProduct {
                        attributes(first:100){
                            nodes{
                                variation
                                visible
                                label
                                name
                                options
                            }
                        }
                        variations(first:100){
                            nodes{
                                stockStatus
                                stockQuantity
                                databaseId
                                attributes(first:100){
                                    nodes{
                                        label
                                        name
                                        value
                                    }
                                }
                                image{
                                    sourceUrl
                                }
                                regularPrice
                                price
                                slug
                                price
                            }
                        }
                        link
                        weight
                        length
                        width
                        height
                        price
                        stockStatus
                        stockQuantity
                        salePrice
                        regularPrice
                        productTags{
                            nodes{
                                name
                                databaseId
                            }
                        }
                        galleryImages {
                            nodes {
                                sourceUrl
                            }
                        }
                        productCategories {
                            edges {
                                node {
                                    name
                                    slug
                                    parent{
                                        node{
                                            slug
                                            name
                                            parent{
                                                node{
                                                    slug
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`
export default PRODUCT_BY_SLUGS
