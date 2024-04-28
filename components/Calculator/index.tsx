import { useEffect, useState } from "react";

type Props = {
  minCount?: number;
  maxCount?: number;
  initCount?: number;
  changeCount?: (count: number) => void;
  className?: string;
  disabled?: boolean;
}
export default function Calculator({
                                     disabled = false,
                                     initCount = 1,
                                     minCount = 1,
                                     maxCount,
                                     className = "",
                                     changeCount = (val) => {
                                     }
                                   }: Props) {

  const [count, setCount] = useState(initCount);
  const handleChange = (val: number) => {
    if (disabled) {
      return;
    }
    setCount(() => {
      let value = 0;
      if (val <= minCount) {
        value = minCount;
      } else if (maxCount && val >= maxCount) {
        value = maxCount;
      } else {
        value = val;
      }
      changeCount(+value);
      return +value;
    });
  };
  useEffect(() => {
    setCount(initCount);
  }, [initCount]);
  return <div
    className={`flex my-2 w-fit ${disabled ? "bg-gray-100" : ""} sm:mx-0 items-center h-10 border border-themeSecondary300 p-2 rounded-full`}>
    <button
      disabled={count === 1}
      onClick={() => handleChange(count - 1)}
      className="rounded-md flex items-center justify-center cursor-pointer relative"
    >
      <i className="ri-subtract-line ri-lg"></i>
    </button>

    <input
      className={`mx-2 text-center  ${disabled ? "bg-gray-100" : ""} max-w-[100px] focus:outline-none border-none text-lg font-semibold text-themeSecondary800 ${className}`}
      type="number"
      value={count}
      onChange={(e: any) => handleChange(e.target.value)}
    />

    <button
      onClick={() => handleChange(count + 1)}
      className="flex items-center justify-center cursor-pointer relative ">
      <i className="ri-add-line ri-lg"></i>
    </button>
  </div>;
}
