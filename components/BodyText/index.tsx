import { cva } from "class-variance-authority";
import React, { FC } from "react";
import { handlerInnerHtml } from "@/lib/utils/util";

const btStyle = cva([""], {
  variants: {
    intent: {
      regular: ["font-normal"],
      medium: ["font-medium"],
      semibold: ["font-semibold"],
      bold: ["font-bold"]
    },
    size: {
      xs: ["text-xs"],
      sm: ["text-xs sm:text-sm"],
      md: ["text-base"],
      lg: ["text-lg"],
      xl: ["text-xl"]
    }
  }
});

export interface BTProps {
  intent?: "regular" | "medium" | "semibold" | "bold";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  innerHTML?: string;
  children?: React.ReactNode;
  fontFamily?: "SGB" | "SGL";
}

export const BodyText: FC<BTProps> = (props) => {
  const {
    intent = "regular",
    size = "sm",
    className = "",
    children = "",
    fontFamily = "SGB",
    innerHTML = ""
  } = props;
  return (
    innerHTML ? <p className={`${btStyle({ intent, size })} ${className}`}
                   dangerouslySetInnerHTML={{ __html: handlerInnerHtml(innerHTML) }}></p> :
      <p
        className={`${btStyle({ intent, size })} ${className} ${fontFamily ? `font-${fontFamily}` : ""}`}>{children}</p>
  );
};
