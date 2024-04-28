import {gql} from "@apollo/client";

export const POST = gql`
query GetPosts($first: Int, $after: String,
  $categoryName: String) {
 posts(first:$first,after:$after,where:{ categoryName: $categoryName,status:PUBLISH}){
  pageInfo{
    hasNextPage
    endCursor
    offsetPagination{
      total
    }
  }
  nodes{
    databaseId
    slug
    excerpt
    title
    date
    commentCount
    featuredImage{
      node{
        sourceUrl
      }
    }
    author{
      node{
        name
        databaseId
      }
    }
      categories {
        nodes {
          name
          slug
        }
      }
  }
}
}`
