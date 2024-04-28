export interface PageInfoInterface {
    hasNextPage: boolean;
    endCursor: string;
    offsetPagination: {
        hasMore: boolean;
        total: number
    };
    __typename: string;
}

export interface ExtensionsInterface {
    debug: {
        type: string;
        message: string;
    }[];
}
