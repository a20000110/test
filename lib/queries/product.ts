import {DocumentNode, gql} from "@apollo/client";

const PRODUCTS: DocumentNode = gql`
query GetProductsByCategorySlug($first: Int, $after: String, $orderby: [ProductsOrderbyInput],
  $featured:Boolean,
  $categorySlug: String,$stockStatus:[StockStatusEnum]) {
  products(
    first: $first
    after: $after
    where: {orderby: $orderby, category: $categorySlug, featured: $featured,status:"PUBLIC",stockStatus:$stockStatus}
  ) {
    pageInfo {
      hasNextPage
      endCursor
      offsetPagination {
        total
      }
    }
    edges {
      node {
        databaseId
        name
        slug
        averageRating
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
          salePrice
          regularPrice
          stockStatus
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
            price
          salePrice
          regularPrice
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          stockStatus
          productCategories {
            edges {
              node {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
}`;
export default PRODUCTS;
