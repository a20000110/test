import clsx from "clsx";
import { StockStatus } from "@/lib/types/gql/product/product-by-slug.type";
import { useCart } from "@/lib/hooks/cart/useCart";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import { useRouter } from "next/router";
import { useUserStore } from "@/lib/store/user.store";

export type ProductTypeName = "SimpleProduct" | "VariableProduct";


type Attribute = {
  variation: boolean | undefined; // 如果是单个产品这个一定要传入undefined
  visible: boolean; // 后台设置是否显示这个属性 如果为false 那么这个属性不可添加
  label: string;
  name: string; // 属性名称
  options: string[]; // 属性值
}

type SimpleAndVariable = {
  databaseId: string; // 产品id
  quantity: string; // 加入购物车的数量
  stockStatus: StockStatus;// 库存状态
  stockQuantity: number; // 库存数量 库存数量不能小于quantity
  attributes: Attribute[]; // 产品原始数据的选项 用于添加购物车前端逻辑校验
}

type Simple = SimpleAndVariable & { // 单个产品需要传入的数据
  item_data?: Record<string, string>;// 选中的产品属性 键值对 如果原始数据产品没有属性可以不传
}


type Variable = SimpleAndVariable & { // 变体产品需要传入得数据
  variation: { // 对应选中得databaseId的attributes
    label: string;
    name: string;
    value: string;
  }[]
}

type ProductType = {
  SimpleProduct: Simple;
  VariableProduct: Variable;
}

type AddToCartButtonProps<T extends ProductTypeName> = {
  className?: string;
  disabled?: boolean;
  __typename: T;
  buyNow?: boolean;
  product: ProductType[T];
}

const quantityVerification = (quantity: number, stockQuantity: number) => {
  // 如果添加的数量小于1
  if (quantity < 1) {
    return "message.9d9d8c446e248944dea8d516df4a07431e9f";
  }
  // 如果添加的数量大于库存数量
  if (quantity > stockQuantity) {
    return "message.dce28a7e0f46ad449fe80b933f468a29a932";
  }
  // 如果通过
  return true;
};

// 校验单个产品的item_data和attributes是否匹配
const itemDataVerification = (item_data: Record<string, string> | undefined, attributes: Attribute[]): true | string => {
  let flag: true | string = true;
  if (!item_data) {
    flag = "message.55d774aba327d34f941843270fb2ba14d58e";
    throw new Error("item_data 是必需的");
  }
  try {
    // 遍历item_data
    Object.keys(item_data).map(k => {
      // 判断k是否存在attributes的name
      const atr = attributes.find(a => a.name === k);
      // 如果存在判断这个属性是否设置了在前端显示
      if (!atr || !atr.visible) {
        flag = "message.f78ac9708d713e4964d86a32771ff9d31d2e";
        throw new Error("不存在的key");
      }
      // 判断value是否存在
      if (!atr.options.includes(item_data[k])) {
        flag = "message.a85978fd8b0c124f18798f7781a4bcc65eea";
        throw new Error("不存在的value");
      }
    });
  } catch (e: any) {
    console.error(e);
  }
  return flag;
};

// 校验可变产品的variation是否匹配
const variationVerification = (variation: Variable["variation"], attributes: Attribute[]): true | string => {
  let flag: true | string = true;
  try {
    variation.map(item => {
      const { name, value } = item;
      // 找到对应的属性
      const atr = attributes.find(a => a.name === name);
      // 如果找不到说明key错误 或者 判断是否显示变量
      if (!atr || !atr.visible) {
        flag = "message.f78ac9708d713e4964d86a32771ff9d31d2e";
        throw new Error("不存在的key");
      }
      // 找到之后判断value是否是该属性中
      if (!atr.options.includes(value)) {
        flag = "message.a85978fd8b0c124f18798f7781a4bcc65eea";
        throw new Error("不存在的value");
      }
      // 都存在判断是否是否用于变体
      if (!atr.variation) {
        flag = "message.e7fce0b6b83dc54035bbc0e48e175415fc89";
        throw new Error("不是变体属性");
      }
    });
  } catch (e) {
    console.error(e);
  }
  return flag;
};

// 校验所有参数
const verification = <T extends ProductTypeName>(props: AddToCartButtonProps<T>): true | string => {
  let flag: string | true = true;
  // 校验数量和库存
  const quantityFlag = quantityVerification(+props.product.quantity, props.product.stockQuantity);
  if (quantityFlag !== true) return quantityFlag;

  if (props.__typename === "SimpleProduct") {
    // 校验item_data 是否 与 attributes 匹配
    const simple = props.product as Simple;
    const itemDataFlag = itemDataVerification(simple?.item_data, simple.attributes);
    // 不匹配则提示错误
    if (itemDataFlag !== true) {
      flag = itemDataFlag;
    }
  } else {
    // 校验variation 是否与 attributes 匹配
    const variable = props.product as Variable;
    const variableFlag = variationVerification(variable.variation, variable.attributes);
    // 不匹配则提示错误
    if (variableFlag !== true) {
      flag = variableFlag;
    }
  }
  return flag;
};


export const AddToCartButton = <T extends ProductTypeName>(props: AddToCartButtonProps<T>) => {
  const productType = props.__typename === "SimpleProduct" ? 1 : 2; // 1是单个产品 2是可变产品
  const [disabled, setDisabled] = useState(!!props?.disabled);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useUserStore();
  const { addToCart } = useCart();
  const router = useRouter();
  const t = useTranslations();
  const handleClick = async () => {
    if (!userInfo) {
      const login = document.querySelector("#web-login") as HTMLLIElement;
      login.click();
      return;
    }
    if (disabled || loading) return;
    const flag = verification<T>(props); // 校验是否通过
    if (flag !== true) return toast.error(t(flag));

    if (productType === 1) {
      const simple = props.product as Simple;
      const where = {
        id: simple.databaseId.toString(),
        quantity: simple.quantity,
        item_data: simple?.item_data || undefined
      };
      const res = await addToCart(where, setLoading);
      if (props?.buyNow) {
        await router.push("/checkout");
      }
    } else {
      const variable = props.product as Variable;
      const variation: Record<string, string> = {};
      variable.variation.map(item => {
        variation["attribute_" + item.name] = item.value;
      });
      const where = {
        id: variable.databaseId.toString(),
        quantity: variable.quantity,
        variation
      };
      const res = await addToCart(where, setLoading);
    }
  };

  useEffect(() => {
    setDisabled(!!props?.disabled);
  }, [props]);

  return <div className="s-flex gap-x-4">
    <div onClick={() => {
      handleClick();
    }}
         className={clsx("px-3 py-2 b-flex rounded-[5px] inline-block text-white bg-main cursor-pointer duration-300", props?.className,
           disabled || loading ? "!cursor-not-allowed opacity-50" : "hover:opacity-90")}>
      <span className="whitespace-nowrap">{t("common.335ce3a24d8c804001f8cb7619a736751c5f")}</span>
      {
        loading && <RingLoader color={"#fff"} size={"20"} className="ml-1" />
      }
    </div>
    {
      !!props?.buyNow && <div onClick={() => {
        handleClick();
      }}
                              className={clsx("px-3 py-2 b-flex rounded-[5px] inline-block text-white bg-main cursor-pointer duration-300", props?.className,
                                disabled || loading ? "!cursor-not-allowed opacity-50" : "hover:opacity-90")}>
        <span className="whitespace-nowrap">{t("common.Buy_Now")}</span>
        {
          loading && <RingLoader color={"#fff"} size={"20"} className="ml-1" />
        }
      </div>
    }
  </div>;
};
