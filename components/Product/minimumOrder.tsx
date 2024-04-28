import { GqlProductMetaDatum } from "@/lib/types/gql/product/product-by-slug.type";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  productMeta: GqlProductMetaDatum[] | null;
  setMinQuantity?: (value: string) => void;
}

export const getMinQuantity = (meta: GqlProductMetaDatum[] | null | undefined) => {
  if (!meta) return null;
  const quantity = meta.find((item) => item.key === "min_quantity");
  if (quantity) {
    return quantity.value;
  } else {
    return null;
  }
};
export const MinimumOrder = (props: Props) => {
  const t = useTranslations("message");
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(getMinQuantity(props?.productMeta) as string);
  }, [
    props?.productMeta
  ]);
  useEffect(() => {
    if (value) {
      props?.setMinQuantity?.(value);
    }
  }, [value]);
  if (!value) return null;
  return <p
    className={clsx("text-sm", props.className)}>{t("4e4d2f8893235b425b7877f609b7539103c5", { value: value })}</p>;
};
