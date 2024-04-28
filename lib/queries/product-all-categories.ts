import {gql} from "@apollo/client";

export const GET_ALL_PRODUCT_CATEGORIES = gql`
query GetAllProductCate($first: Int, $after: String){
  productCategories(first:$first,after:$after){
    pageInfo {
      hasNextPage
      endCursor
      offsetPagination {
        total
      }
    }
    nodes{
      databaseId
      name
      slug
      count
      parent {
        node {
          databaseId
        }
      }
    }
  }
}
`;
