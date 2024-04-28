import {DocumentNode, gql} from "@apollo/client";

const PRODUCTS_BY_ID: DocumentNode = gql`
query GetProductsByIds($first: Int,$ids: [Int]) {
  products(first: $first,where: { include: $ids }) {
    nodes {
      databaseId
      name
      averageRating
      sku
      slug
      image {
        sourceUrl
      }
        metaData(keysIn:["min_quantity"]){
            value
            id
            key
        }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockQuantity
        stockStatus
      }... on VariableProduct {
        price
        regularPrice
        salePrice
        stockQuantity
        stockStatus
      }
    }
  }
}
`;
export default PRODUCTS_BY_ID;
