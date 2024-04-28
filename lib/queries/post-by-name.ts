import {DocumentNode, gql} from "@apollo/client";

export const HEADER_POST_SEARCH: DocumentNode = gql`
query SearchPosts($search: String, $size: Int, $cursor: String,$category:String,$tag:String) {
  posts(first: $size, after: $cursor, where: { search: $search ,categoryName:$category,tag:$tag}) {
    pageInfo{
          hasNextPage
      endCursor
      offsetPagination{
        total
      }
    }
    nodes {
      databaseId
      title
      excerpt
      date
      slug
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
      featuredImage{
        node{
          sourceUrl
        }
      }
    }
  }
}
`;
