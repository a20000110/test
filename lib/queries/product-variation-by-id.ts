import {gql} from "@apollo/client";

export const PRODUCT_VARIATION_BY_ID = gql`
query GetProductVariations($id: ID!) {
  productVariation(id: $id, idType: DATABASE_ID) {
    databaseId
    image{
        sourceUrl
      }
    slug
    name
    price
    regularPrice
    stockQuantity
    stockStatus
    salePrice
    parent{
      node{
        slug
        databaseId
      }
    }
  }
}
  `
