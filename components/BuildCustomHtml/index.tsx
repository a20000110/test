import { handlerInnerHtml } from "@/lib/utils/util";
import React from "react";

type Props = {
  html: string;
  children?: React.ReactNode;
}
export default function BuildCustomHtml(props: Props) {
  return <>
    {
      props.html ? <div
        dangerouslySetInnerHTML={{ __html: handlerInnerHtml(props.html) }} /> : props.children ? props.children : ""
    }
  </>;
}
