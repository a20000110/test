import {DocumentNode, gql} from "@apollo/client";

export const PRODUCT_CATEGORIES: DocumentNode = gql`
query ProductCategory($after:String,$slugs:[String]){
    productCategories(first:100,after:$after,where:{slug:$slugs}) {
    pageInfo{
      hasNextPage
      endCursor
    }
    nodes {
        id
        databaseId
        name
        slug
        description
        image {
            sourceUrl
        }
    }
}
}
`;

export const PRODUCT_CATEGORIES2: DocumentNode = gql`
query ProductCategory($first:Int,$after:String,$slugs:[String]){
    productCategories(first:$first,after:$after,where:{slug:$slugs,parent:0}) {
    pageInfo{
      hasNextPage
      endCursor
    }
    nodes {
        count
        id
        databaseId
        name
        slug
        description
        image {
            sourceUrl
        }
    }
}
}
`;
