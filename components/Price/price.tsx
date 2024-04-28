import { useProductStore } from "@/lib/store/product.store";
import { formatPrice } from "@/lib/utils/util";

type Props = {
  price: string | number;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
export default function Price(props: Props) {
  const { price, className = "", size = "md" } = props;
  const { currencyUnit } = useProductStore();
  if (!price) return null;
  let pce: Props["price"];
  if (typeof price === "string") {
    if (price.includes("-")) {
      pce = price;
    } else {
      pce = price?.startsWith(currencyUnit) ? price : `${currencyUnit}${formatPrice(price.toString())}`;
    }
  } else {
    pce = price?.toString().startsWith(currencyUnit) ? price : `${currencyUnit}${formatPrice(price.toString())}`;
  }
  return <span className={`${className} text-${size} text-main py-2`}>
        {pce}
    </span>;
}
