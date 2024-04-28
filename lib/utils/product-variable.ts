import { GqlProductVariationsNode3 } from "@/lib/types/gql/product/product-by-slug.type";

interface VariationAttribute {
  label: string;
  name: string;
  value: string;
}


interface ProductAttribute {
  label: string;
  name: string;
  options: string[];
}

function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, array) => acc.flatMap((x) => array.map((y) => [...x, y])),
    [[] as T[]]
  );
}

export type GenerateCombinations = (
  variations: GqlProductVariationsNode3[],
  attributes: ProductAttribute[]
) => (GenerateCombinationsResult | GqlProductVariationsNode3)[][];

export type GenerateCombinationsResult = {
  [key: string]: string;
}

export function generateCombinations(
  variations: GqlProductVariationsNode3[],
  attributes: ProductAttribute[]
): ReturnType<GenerateCombinations> {

  function convertToSlug(str: string): string {
    return str.toLowerCase().split(/\s+&\s+|\s+/).join("-");
  }

  let combinations: ReturnType<GenerateCombinations> = [];

  for (const variation of variations) {
    let currentCombination: any[] = [];

    for (const attr of attributes) {
      const variationAttribute = variation?.attributes?.nodes.find(
        (node) => {
          const slug = node.name.toLowerCase();
          return slug === convertToSlug(attr.name.toLowerCase());
        }
      );
      if (variationAttribute && variationAttribute.value) {
        currentCombination.push([{
          [variationAttribute.name]: variationAttribute.value
        }]);
      } else {
        currentCombination.push(attr.options.map(a => {
          return {
            [attr.name.toLowerCase()]: a
          };
        }));
      }
    }

    const productCombinations = cartesianProduct<{
      [key: string]: string;
    }>(currentCombination);
    const fullCombinations = productCombinations.map((combo) => [variation, ...combo]);
    combinations = combinations.concat(fullCombinations);
  }
  return combinations;
}


