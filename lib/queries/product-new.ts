import { gql } from "@apollo/client";

const productQuery = `edges{
      node{
        databaseId
        name
        averageRating
        slug
        metaData(keysIn:["min_quantity"]){
                         value
                         id
                         key
         }
        ... on SimpleProduct{
          price
          regularPrice
          stockStatus
        }
        sku
        image{
          sourceUrl
        }
        ... on VariableProduct{
          price
          regularPrice
          stockStatus
        }
      }
    }`;
export const NEW_PRODUCTS = gql`
    {
        newProducts: products(first: 10, where: {orderby:{field:DATE,order:DESC}}) {
            ${productQuery}
        }
    }
`
