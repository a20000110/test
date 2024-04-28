import React, { FC, useState } from "react";
import { cva } from "class-variance-authority";
import Image from "next/legacy/image";

const AvatarStyle = cva(["rounded-full"], {
  variants: {
    size: {
      sm: ["w-8", "h-8"],
      md: ["w-9", "h-9"],
      lg: ["w-10", "h-10"],
      xl: ["w-12", "h-12"],
      xxl: ["w-14", "h-14"],
      xxxl: ["w-16", "h-16"]
    },
    defaultVariants: {
      size: "md"
    }
  }
});

export interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
  src?: string;
  alt?: string;
}

export const Avatar: FC<AvatarProps> = ({ size = "md", src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const handleError = () => {
    setImageSrc("/image/avatar.webp");
  };
  return (
    <div className={`relative ${AvatarStyle({ size })}`}>
      <Image src={imageSrc ? imageSrc : "/image/avatar.webp"} onError={handleError} alt={alt ? alt : "image"} width={50}
             height={50} />
    </div>
  );
};

