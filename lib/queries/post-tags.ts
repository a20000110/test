import {gql} from "@apollo/client";

export const POST_TAGS = gql`
query GetAllTags {
  tags(first:9999) {
    nodes {
      id
      name
      slug
    }
  }
}
`
