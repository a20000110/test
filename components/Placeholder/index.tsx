import Image from "next/legacy/image";
import React, { FC } from "react";

type PlaceholderValue = "blur" | "empty";

type ImgElementStyle = NonNullable<JSX.IntrinsicElements["img"]["style"]>;

export interface PlaceholderProps {
  src: string;
  imageWidth?: number;
  imageHeight?: number;
  alt?: string;
  className?: string;
  quality?: number;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  priority?: boolean;
  fit?: ImgElementStyle["objectFit"];
}

export const Placeholder: FC<PlaceholderProps> = ({
                                                    src,
                                                    quality = 75,
                                                    imageHeight,
                                                    alt = process.env.NEXT_PUBLIC_COMPANY_NAME,
                                                    imageWidth,
                                                    className = "",
                                                    placeholder,
                                                    blurDataURL,
                                                    priority = false,
                                                    fit = "fill"
                                                  }) => {
  return <Image
    src={src || `/image/default-image.webp`}
    alt={alt}
    quality={80}
    width={imageWidth}
    height={imageHeight}
    objectFit={fit}
    style={{
      width: "auto!important",
      height: "auto!important"
    }}
    priority={priority}
    placeholder={placeholder}
    blurDataURL={blurDataURL}
    className={`${className}`}
  />;
};
