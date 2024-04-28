import { GqlProductBySlugNodeInterface, GqlProductVariationsNode3 } from "@/lib/types/gql/product/product-by-slug.type";
import React, { useEffect, useMemo, useState } from "react";
import { GenerateCombinations, generateCombinations } from "@/lib/utils/product-variable";
import { BodyText } from "@/components/BodyText";
import { useProductVariableStore } from "@/lib/store/product-variable.store";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { GqlGetProAttrsInterface } from "@/lib/queries/get-product-attr";
import { Placeholder } from "@/components/Placeholder";

type FilterAttrs = {
  label: string;
  name: string;
  options: string[];
}

type SelectValuesType = {
  [key: string]: string;
};

type DisabledAttributesType = {
  [key: string]: {
    [key: string]: boolean;
  }
}

type OptionalAttrsType = {
  _id: number;
  [key: string]: any
}

const disabledClassNames = (disabled: boolean) => {
  return disabled ? "cursor-no-drop bg-gray-200 text-gray-10" : "cursor-pointer bg-white shadow";
};

/**
 * 如果变量没有价格，那么商店不会显示没有价格的版本和属性
 * 如果是一个可变产品那么就不展示所有属性，而是展示所有可变产品的属性
 * */
function ProductVariable({ product, changeValue }: {
  product: GqlProductBySlugNodeInterface | GqlGetProAttrsInterface["product"]
  changeValue: ({
                  key, value, id, label
                }: { key: string, value: string, id?: number, label: string }) => void
}) {
  const [selectValues, setSelectValues] = useState<SelectValuesType>();
  const { variations: { nodes: variations }, attributes: { nodes: attributes } } = product;
  const router = useRouter();
  /**
   * 组合的产品属性，每一个属性能够匹配的值
   * 子元素的坐标 0 永远是该变体产品的源数据
   * */
  const combinationAttrs: ReturnType<GenerateCombinations> = useMemo(
    () => generateCombinations(variations as GqlProductVariationsNode3[], attributes),
    [variations, attributes]
  );

  const [attrs, setAttrs] = useState<FilterAttrs[]>(); // 展示的产品属性
  const [firstAttr, setFirstAttr] = useState<string>(); // 第一个属性
  const [disabledAttrs, setDisabledAttrs] = useState<DisabledAttributesType>(); // 哪些属性应该被禁用
  const [optionalAttrs, setOptionalAttrs] = useState<OptionalAttrsType>(); // 收集可变的属性
  const [selectAttrId, setSelectAttrId] = useState<number>(); // 收集当前选中的属性的变体id
  const { setCurrentVariableProduct } = useProductVariableStore();
  /**
   * 先收集所有的可变产品的属性并去重
   * */
  const onFilterAttrs = () => {
    const attrs: FilterAttrs[] = []; // 收集所有可变产品的属性
    variations.map(v => {
      if (v?.attributes?.nodes.length) {
        v?.attributes?.nodes.map(a => {
          attrs.push({
            label: a.label,
            name: a.name,
            options: [a.value]
          });
        });
      }
    });
    /**
     * 根据label合并options 返回的是一个数组
     * */
    const mergeAttrs: FilterAttrs[] = attrs.reduce((prev: any, curr: any) => {
      if (prev.find((p: any) => p.label === curr.label)) {
        prev.find((p: any) => p.label === curr.label).options.push(curr.options[0]);
      } else {
        curr && prev.push(curr);
      }
      return prev;
    }, []);
    // 如果options下出现了“”这个值，说明，这个值对应的label 应该设置这个label所有的options
    mergeAttrs.map(m => {
      m.options = [...new Set(m.options)];
      m.options.some((o: string) => {
        if (!o) {
          const options = attributes.find(a => a.label === m.label)?.options;
          options?.length && (m.options = options);
          return true;
        }
      });
    });
    return mergeAttrs;
  };

  const handlerChangeAttribute = (key: string, value: string) => {
    if (disabledAttrs?.[key]?.[value]) return;
    setSelectValues((old) => {
      const newValue = {
        ...old
      };
      if (newValue?.[key] && newValue[key] === value) {
        delete newValue[key];
      } else {
        newValue[key] = value;
      }
      setFirstAttr(oldFirst => {
        const newFirst = oldFirst ? oldFirst === key ? key : oldFirst : key;
        const uniArray: ReturnType<typeof getDisabledAttrs> = getDisabledAttrs(newValue, newFirst);
        setOptionalAttrs(() => {
          // 设置可选属性时，设置可选属性的id
          const id = uniArray.find((attr: OptionalAttrsType) => {
            for (const key in newValue) {
              if (attr[key] !== newValue[key]) {
                return false;
              }
            }
            return Object.keys(attr).length === (Object.keys(newValue).length + 1); // +1 for the _id
          })?._id;
          setSelectAttrId(id);
          return uniArray;
        });
        changeDisabledAttrs(uniArray);
        return newFirst;
      });
      return newValue;
    });
  };

  /**
   * 通过onDisabledAttrs 函数返回的值 设置禁用属性，当selectValues 长度只有一时，就不禁用firstAttr
   * */
  const changeDisabledAttrs = (attrArray: ReturnType<typeof getDisabledAttrs>) => {
    if (!attrArray.length) {
      return initData();
    }
    setDisabledAttrs(oldDisabledAttrs => {
      const enabledAttributes: {
        [key: string]: string[]
      } = {}; // 收集不被禁用的属性
      attrArray.map((item: { _id: any; [key: string]: any }) => {
        Object.keys(item).map(kItem => {
          if (kItem === "_id") return;
          if (!Array.isArray(enabledAttributes[kItem])) enabledAttributes[kItem] = [];
          enabledAttributes[kItem].push(item[kItem]);
          enabledAttributes[kItem] = [...new Set(enabledAttributes[kItem])];
        });
      });
      const disabledAttributes: DisabledAttributesType = JSON.parse(JSON.stringify(oldDisabledAttrs));
      Object.keys(enabledAttributes).forEach(attribute => {
        enabledAttributes[attribute].forEach(value => {
          if (disabledAttributes[attribute]?.hasOwnProperty(value)) {
            disabledAttributes[attribute][value] = false;
          }
        });
      });
      // Set all other attributes to true (disabled)
      Object.keys(disabledAttributes).forEach(attribute => {
        Object.keys(disabledAttributes[attribute]).forEach(value => {
          if (!enabledAttributes[attribute]?.includes(value)) {
            disabledAttributes[attribute][value] = true;
          }
        });
      });
      return disabledAttributes;
    });
  };


  /**
   * 我将选中的key,value 传递给这个函数，这个函数要告诉我哪些属性不被禁用
   * 返回的结果数组中，每一个元素中含有一个firstAttr 是完全相等的
   * */
  const getDisabledAttrs = (value: SelectValuesType, firstKey: string) => {
    let source: GqlProductVariationsNode3;
    let data: any = [];
    Object.keys(value).map(v1Key => {
      combinationAttrs.map(v2 => {
        v2.map((v2Item, v2Index) => {
          if (v2Index === 0) {
            source = v2Item as GqlProductVariationsNode3;
          } else {
            // @ts-ignore
            const v2ItemValue = v2Item[v1Key] === value[v1Key] ? v2Item : null;
            // 如果value存在说明这个可以进行组合
            v2ItemValue && data.push({
              _id: source.databaseId,
              ...v2.slice(1, v2.length)
            });
          }
        });
      });
    });
    data = data.map((item: any) => {
      const newItem: any = { _id: item._id }; // 保留id
      Object.keys(item).forEach(key => {
        if (item[key] instanceof Object && !Array.isArray(item[key])) {
          const subItemKey = Object.keys(item[key])[0];
          newItem[subItemKey] = item[key][subItemKey];
        }
      });
      return newItem;
    });

    let uniqueArray = data;
    if (Object.keys(value).length > 1) {
      // 保留与value相同的key value  并除_id以外的key检查并去重
      const filterByAttributesAndUnique = (array: any[], attributes: SelectValuesType) => {
        const filteredArray = array.filter(item =>
          Object.keys(attributes).every(key => item[key] === attributes[key])
        );
        return filteredArray.reduce((acc: any[], current: any) => {
          const duplicate = acc.find(item => {
            return Object.keys(current).every(key => {
              return key === "_id" || item[key] === current[key];
            });
          });
          if (!duplicate) {
            acc.push(current);
          }
          return acc;
        }, []);
      };
      uniqueArray = filterByAttributesAndUnique(data, value);
    }
    return uniqueArray as {
      _id: number;
      [key: string]: any;
    };
  };

  const initData = () => {
    // 初始所有属性都不被禁用
    setDisabledAttrs(() => {
      const filterAttrs = onFilterAttrs();
      return Object.values(filterAttrs).reduce((prev: any, curr: any) => {
        prev[curr.name] = {};
        curr.options.map((o: string) => {
          prev[curr.name][o] = false;
        });
        return prev;
      }, {});
    });
  };

  const handlerClear = () => {
    selectValues && Object.keys(selectValues).map(k => {
      handlerChangeAttribute(k, selectValues[k]);
    });
  };

  useEffect(() => {
    if (!variations.length) return;
    const filterAttrs = onFilterAttrs();
    initData();
    setAttrs(filterAttrs);
  }, [variations]);

  useEffect(() => {
    // @ts-ignore
    const currProduct = variations.find((item: { databaseId: number }) => item.databaseId === selectAttrId);
    setCurrentVariableProduct(currProduct || null);
    selectAttrId && selectValues && Object.keys(selectValues).map(k => {
      const label: string = attrs?.find(item => item.name === k)?.label || "";
      changeValue(
        {
          key: k,
          value: selectValues[k],
          id: selectAttrId,
          label
        }
      );
    });
  }, [selectAttrId]);
  const t = useTranslations();
  useEffect(() => {
    handlerClear();
  }, [router.asPath]);
  if (!variations.length || attributes.every(a => !a.variation)) return null;
  return <div className="py-4 select-none">
    {
      attrs?.map((v, vIndex) => {
        return <div key={vIndex} className="my-3">
          <BodyText intent={"bold"} size="lg">{v.label.toUpperCase()}</BodyText>
          <div className=" flex flex-wrap items-center gap-2.5">
            {
              v.options.map((item: string, index: number) => (
                item && <div key={index} className="cursor-pointer c-flex">
                  <div onClick={() => {
                    handlerChangeAttribute(v.name, item);
                  }}>
                    <div className="c-flex">
                      <Placeholder src={variations?.[vIndex]?.image?.sourceUrl || ""} imageWidth={50} imageHeight={50}
                                   fit="cover" />
                    </div>
                    <BodyText size="xs" intent="semibold"
                              className={`mt-1 ${selectValues?.[v.name] == item ? "!bg-main text-white border-main" : "text-themeGray"}
                             font-SGL rounded-md text-center border-[1px] py-2 px-4 ${disabledClassNames(!!disabledAttrs?.[v.name][item])}`}>
                      {item}
                    </BodyText>
                  </div>
                  {
                    vIndex === attrs.length - 1 && index === v.options.length - 1 && selectAttrId &&
                    <div className="ml-2" onClick={handlerClear}>
                      <BodyText>X {t("common.Clear")}</BodyText>
                    </div>
                  }
                </div>
              ))
            }
          </div>
        </div>;
      })
    }
  </div>;
}

export default React.memo(ProductVariable);
