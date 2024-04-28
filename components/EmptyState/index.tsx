import { Placeholder } from "@/components/Placeholder";
import { BodyText } from "@/components/BodyText";
import React from "react";
import { useTranslations } from "next-intl";

type Props = {
  text?: string;
  className?: string;
  children?: React.ReactNode;
}
export default function EmptyState({ text = "", className = "", children }: Props) {
  const t = useTranslations();
  const context = text || t("common.NO_DATA");
  return <div className={`c-flex flex-col my-6 ${className} select-none`}>
    <Placeholder src="/image/empty-state.svg" imageWidth={400} imageHeight={400} quality={50}
                 alt={context}></Placeholder>
    <BodyText size={"xl"} className="text-gray-500">
      {context}
    </BodyText>
    {children}
  </div>;
}
