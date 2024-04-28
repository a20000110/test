import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import React from "react";
import NextLink from "next/link";

export const Link = React.forwardRef(function Link(
  props: { href: string } & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <HeadlessDataInteractive>
      <NextLink {...props} ref={ref} className={`hover:opacity-90 hover:underline duration-300 ${props?.className || ""}`} />
    </HeadlessDataInteractive>
  );
});
