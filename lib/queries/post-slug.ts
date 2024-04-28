import {gql} from "@apollo/client";

export const POST_SLUG = gql`
 query GetGetPostSlug($first:Int,$after:String){
  posts(first:$first,after:$after,where:{orderby:[{field: DATE,order: DESC}]}){
    pageInfo{
      offsetPagination{
        total
      }
      hasNextPage
      endCursor
    }
    nodes{
    id
     slug
    }
  }
}
`
