import Image from "next/legacy/image";
import React, { FC, useEffect, useState } from "react";
import { PlaceholderProps } from "@/components/Placeholder";

interface ProductZoomProps {
  imgList?: string[];
  setActiveImgIndex?: (index: number) => void;
}

export const ProductZoom: FC<PlaceholderProps & ProductZoomProps> = ({
                                                                       src,
                                                                       quality = 100,
                                                                       imageHeight,
                                                                       alt = process.env.NEXT_PUBLIC_COMPANY_NAME,
                                                                       imageWidth,
                                                                       className = "",
                                                                       placeholder,
                                                                       blurDataURL,
                                                                       fit = "fill",
                                                                       imgList,
                                                                       setActiveImgIndex
                                                                     }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgSrc, setCurrentImgSrc] = useState(src);
  const enlargeLeftRef = React.useRef<HTMLDivElement>(null);
  const enlargeRightRef = React.useRef<HTMLDivElement>(null);
  const enlargeMakeRef = React.useRef<HTMLDivElement>(null);
  let touchStart = 0;
  let touchEnd = 0;
  // 监听输入移入enlarge区域
  const addMoveListener = () => {
    const enlargeLeft = enlargeLeftRef.current;
    const enlargeRight = enlargeRightRef.current;
    const enlargeMake = enlargeMakeRef.current;
    // 遮罩层宽高
    let enlargeMakeWidth = 0;
    let enlargeMakeHeight = 0;

    // 放大区域的背景图片比例
    let enlargeRightRatio = 0;

    if (enlargeLeft) {
      enlargeLeft.addEventListener("mousemove", (e: MouseEvent) => {
        if (window.innerWidth <= 768) return;
        // 显示右侧放大区域
        if (enlargeRight) {
          enlargeRight.classList.remove("hidden");
        }
        // 显示遮罩层
        if (enlargeMake) {
          enlargeMake.classList.remove("hidden");
          enlargeMakeWidth = enlargeMake!.clientWidth;
          enlargeMakeHeight = enlargeMake!.clientHeight;
          enlargeRightRatio = parseInt(String((enlargeLeft.clientWidth / enlargeMakeWidth) * 100));
          // 设置放大区域背景图放大尺寸
          enlargeRight && (enlargeRight.style.backgroundSize = enlargeRightRatio + "%");
        }

        // 获取鼠标坐标位置
        const mousePosition = getMousePosition(e);
        // 让遮罩层中心点移动到鼠标位置
        if (mousePosition.x > enlargeMakeWidth / 2) {
          enlargeMake && (enlargeMake.style.left = `${mousePosition.x - enlargeMakeWidth / 2}px`);
        } else {
          enlargeMake && (enlargeMake.style.left = "0px");
        }
        if (mousePosition.y > enlargeMakeHeight / 2) {
          enlargeMake && (enlargeMake.style.top = `${mousePosition.y - enlargeMakeHeight / 2}px`);
        } else {
          enlargeMake && (enlargeMake.style.top = "0px");
        }

        // 遮罩层不能超出enlargeLeft的范围
        if (mousePosition.x < 0) {
          enlargeMake && (enlargeMake.style.left = "0px");
        }
        if (mousePosition.y < 0) {
          enlargeMake && (enlargeMake.style.top = "0px");
        }
        // 如果遮罩层的X轴超出了enlargeLeft的范围
        if (enlargeMake && enlargeMake.offsetLeft >= enlargeLeft.clientWidth - enlargeMakeWidth) {
          enlargeMake && (enlargeMake.style.left = `${enlargeLeft.clientWidth - enlargeMakeWidth}px`);
        }
        if (enlargeMake && enlargeMake.offsetTop >= enlargeLeft.clientHeight - enlargeMakeHeight) {
          enlargeMake && (enlargeMake.style.top = `${enlargeLeft.clientHeight - enlargeMakeHeight}px`);
        }

        // 通过计算大概是2.7倍的移动距离
        const proportion = 2.7;
        // 获取遮罩层在enlargeLeft中的offsetLeft
        if (enlargeMake) {
          const enlargeMakeLeft = enlargeMake.offsetLeft;
          const enlargeMakeTop = enlargeMake.offsetTop;
          if (enlargeRight) {
            // 获取当前背景的位置
            const currentBackgroundPositionX = +enlargeRight.style.backgroundPositionX.replace("px", "");
            const currentBackgroundPositionY = +enlargeRight.style.backgroundPositionY.replace("px", "");
            const offsetX = enlargeMakeLeft * proportion;
            const offsetY = enlargeMakeTop * proportion;
            if (currentBackgroundPositionX !== offsetX || currentBackgroundPositionY !== offsetY) {
              enlargeRight.style.backgroundPositionX = `-${offsetX}px`;
              enlargeRight.style.backgroundPositionY = `-${offsetY}px`;
            }
          }
        }
      });
      enlargeLeft.addEventListener("mouseleave", (e: MouseEvent) => {
        // 隐藏右侧放大区域
        enlargeRight && enlargeRight.classList.add("hidden");
        // 隐藏遮罩层
        enlargeMake && enlargeMake.classList.add("hidden");
      });
    }
  };

  // 获取鼠标在enlargeLeft中的坐标
  const getMousePosition = (e: MouseEvent) => {
    const enlargeLeft = enlargeLeftRef.current;
    if (enlargeLeft) {
      const rect = enlargeLeft.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  // 监听移动端滑动事件
  const addTouchListener = () => {
    if (enlargeLeftRef.current) {
      enlargeLeftRef.current.addEventListener("touchstart", (e: TouchEvent) => {
        if (window.innerWidth >= 768) return;
        touchStart = e.targetTouches[0].clientX;
      });
      enlargeLeftRef.current.addEventListener("touchmove", (e: TouchEvent) => {
        if (window.innerWidth >= 768) return;
        touchEnd = e.targetTouches[0].clientX;
      });
      enlargeLeftRef.current.addEventListener("touchend", (e: TouchEvent) => {
        if (window.innerWidth >= 768) return;
        if (touchStart - touchEnd > 50) {
          setCurrentImgIndex(val => {
            if (!imgList?.length) return val;
            const index = val >= imgList.length - 1 ? 0 : val + 1;
            setCurrentImgSrc(imgList[index]);
            setActiveImgIndex && setActiveImgIndex(index);
            return index;
          });
        } else if (touchStart - touchEnd < -50) {
          setCurrentImgIndex(val => {
            if (!imgList?.length) return val;
            const index = val === 0 ? imgList.length - 1 : val - 1;
            setCurrentImgSrc(imgList[index]);
            setActiveImgIndex && setActiveImgIndex(index);
            return index;
          });
        }
      });

    }
  };

  useEffect(() => {
    addMoveListener();
    addTouchListener();
  }, []);
  useEffect(() => {
    imgList?.length && setCurrentImgIndex(() => imgList.findIndex(item => item === src));
    src && setCurrentImgSrc(src);
  }, [src]);

  return <div className="relative w-full h-full shadow-md">
    <div ref={enlargeLeftRef} className="w-full cursor-move h-full relative c-flex">
      <Image
        src={currentImgSrc}
        alt={alt}
        quality={100}
        width={imageWidth}
        height={imageHeight}
        layout="intrinsic"
        objectFit={fit}
        priority={false}
        className={`${className || ""}`}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
      <div ref={enlargeMakeRef}
           className="w-[200px] h-[200px] bg-themeSecondary700 opacity-50 border-[1px] absolute z-[1] left-0 top-0 hidden"></div>
    </div>
    <div ref={enlargeRightRef}
         className="enlarge-right border-[1px] absolute left-full top-0 bg-white hidden z-[3] shadow-xl"
         style={{
           width: imageWidth! * 1.2,
           height: imageHeight! * 1.2,
           backgroundImage: `url(${currentImgSrc})`,
           backgroundRepeat: "no-repeat"
         }}></div>
  </div>;
};
