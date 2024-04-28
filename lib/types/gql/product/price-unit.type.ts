export interface GqlPriceUnit {
    cart: Cart;
}

interface Cart {
    __typename: string;
    rawSubtotal: string;
}
