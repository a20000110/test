import { gql } from "@apollo/client";

export const SEARCH_POST_PRODUCT = gql`
query GetProductsAndPost($search: String) {
  products(first:10, where: { search: $search }) {
      nodes {
        databaseId
        name
        slug
          image{
            sourceUrl
          }
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
      }
  },
  posts(first: 10, where: { search: $search}) {
    nodes {
      databaseId
      title
      excerpt
      date
      slug
      featuredImage{
        node{
          sourceUrl
        }
      }
    }
  }
}
`
