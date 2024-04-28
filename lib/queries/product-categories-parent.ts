import {gql} from "@apollo/client";

// 获取分类等级
export const GET_PRODUCT_CATEGORIES_PARENT = gql`
    query GetProductCategoriesParent($parent: Int!, $first: Int, $after: String) {
        productCategories(first:$first,after:$after,where: {parent: $parent, order: ASC, orderby: TERM_ORDER,language:EN}) {
            pageInfo {
                hasNextPage
                endCursor
                offsetPagination {
                    total
                }
            }
            nodes {
                menuOrder
                databaseId
                name
                slug
                count
                ... on ProductCategory{
                    children{
                        nodes{
                            menuOrder
                            databaseId
                            name
                            slug
                            count
                            children{
                                nodes{
                                    menuOrder
                                    databaseId
                                    name
                                    slug
                                    count
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
