import { gql } from "@apollo/client";

export const POSTS_RECENT = gql`
query GetRecentPosts {
  posts(first: 5, where: { orderby: { field: DATE, order: ASC } }) {
    nodes {
      title
      slug
      date
      featuredImage{
        node{
          sourceUrl
        }
      }
      author{
        node{
          name
        }
      }
    }
  }
}

`;
