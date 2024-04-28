import {gql} from "@apollo/client";

export const PRODUCT_SLUG = gql`
 query GetProductBlug($first:Int,$after:String){
  products(first:$first,after:$after,where:{orderby:[{field: DATE,order: DESC}]}){
    pageInfo{
      offsetPagination{
        total
      }
      hasNextPage
      endCursor
    }
    edges{
      node{
        slug
      }
    }
  }
}
`
