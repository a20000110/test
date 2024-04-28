import { gql } from "@apollo/client";

export const POST_CATEGORIES = gql`
    query GetAllCategories {
        categories(first:9999,where:{language:EN}) {
            nodes {
                id
                name
                slug
                count
            }
        }
    }
`;
