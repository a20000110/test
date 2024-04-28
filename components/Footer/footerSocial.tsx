import { ContactFooterSocialMedia } from "@/lib/constants/contact";
import Link from "next/link";
import clsx from "clsx";
import React from "react";

type Props = {
  className?: string
}

const switchColor = (name: string) => {
  return {
    facebook: "#365493",
    twitter: "#33ccff",
    instagram: "#fd334e",
    youtube: "#ff0000",
    pinterest: "#da0123",
    linkedin: "#0274b3"
  }[name];
};
export default function FooterSocial(props: Props) {
  return <div className={clsx("s-flex gap-x-2", props?.className || "")}>
    {
      ContactFooterSocialMedia.map((item, index) => {
        return <Link href={item.link}
                     target={"_blank"}
                     className={clsx(item.icon, "text-white ri-xl w-[30px] h-[30px] rounded-full c-flex")}
                     key={index} style={{
          backgroundColor: switchColor(item.name)
        }} />;
      })
    }
  </div>;
}
