import { GqlProductAttributeNodeInterface } from "@/lib/types/gql/product/product-by-slug.type";
import { BodyText } from "@/components/BodyText";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { ChangeValueType } from "@/components/Product/information";
import { Placeholder } from "@/components/Placeholder";

type Props = {
  changeValue: (params: ChangeValueType) => void
} & GqlProductAttributeNodeInterface;

export default function ProductAttributes(props: Props) {
  const label = props.label.toUpperCase();
  const [itemValue, setItemValue] = useState<string>("");
  const handleOnchange = (value: string) => {
    setItemValue(value);
  };

  useEffect(() => {
    itemValue && props?.changeValue({
      key: props.name,
      value: itemValue,
      label: props.label
    });
  }, [itemValue]);
  if (!props.visible) return null;
  return <div className="py-4 select-none">
    {props ?
      <BodyText intent={"bold"} size="lg">{label}</BodyText>
      : <Skeleton width={120} height={28} />}
    <div className=" flex flex-wrap items-center gap-2.5 mt-3">
      {
        props.options.map((item: any, index: number) => (
          <div key={index} className="cursor-pointer" onClick={() => {
            handleOnchange(item);
          }}>
            <BodyText size="xs" intent="semibold"
                      className={`mt-1 ${itemValue == item ? "!bg-main text-white border-main" : "text-themeGray"} font-SGL cursor-pointer bg-white rounded-md border-[1px] py-2 px-4 shadow`}>
              {item}
            </BodyText>
          </div>
        ))
      }
    </div>
  </div>;
}
