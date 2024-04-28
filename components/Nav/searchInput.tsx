import { Input } from "@/components/CatalystUi/input";
import React from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

type Props = {
  onSearch: (value: string) => void;
  className?: string;
}
export default function SearchInput(
  {
    onSearch,
    className
  }: Props) {
  const t = useTranslations();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(e.currentTarget.value);
    }
  };
  return <div
    className={clsx("w-full h-fit s-flex border-[1px] border-[#e7e7e8] shadow rounded-[15px]", className || "")}>
    <i className="ri-search-line !text-mainText ml-3 mr-1"></i>
    <Input onKeyDown={handleKeyDown} className="!text-mainText !pl-1 py-0.5"
           placeholder={t("nav.ad8d8f7c87536e4e4c78da5aeb22c0d3d902")} />
  </div>;
}
