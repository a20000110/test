export interface GqlGetProductVariationByIdInterface {
  productVariation: ProductVariation;
}

interface ProductVariation {
  databaseId: number;
  image: Image;
  slug: string;
  name: string;
  price: string;
  regularPrice: string;
  stockQuantity: number;
  stockStatus: string;
  salePrice: string;
  parent: {
    node: {
      slug: string;
      databaseId: number;
    }
  };
}

interface Image {
  sourceUrl: string;
}
