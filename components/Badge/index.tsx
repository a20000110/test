import React from "react";
import { BodyText } from "@/components/BodyText";

export default function Badge({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <BodyText intent={"semibold"} size={"sm"}
                   className={`leading-5 px-3 py-1 select-none bg-main text-white rounded-full ${className}`}>
    {children}
  </BodyText>;
}