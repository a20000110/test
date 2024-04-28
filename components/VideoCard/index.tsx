import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import Modals from "@/components/Modals";

type Props = {
  backgroundUrl: string,
  subTitle: string,
  title: string,
  videoUrl: string,
  className?: string,
}
export default function VideoCard(props: Props) {
  const t = useTranslations();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const close = (val: boolean) => {
    setOpen(val);
  };
  const playOrPause = (state: boolean) => {
    if (videoRef.current) {
      if (state) {
        // 加载完成之后播放
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  useEffect(() => {
    playOrPause(open);
  }, [open]);
  return <>
    <Modals open={open} setOpen={close}>
      <div className="mt-8 w-[500px] c-flex max-md:w-[320px]">
        <video src={props.videoUrl} controls={true} ref={videoRef} autoPlay={true} />
      </div>
    </Modals>
    <div
      className={
        clsx("text-white gap-y-4 w-full h-[350px] max-md:h-[320px] bg-no-repeat max-md:w-[320px] max-md:mx-auto max-md:rounded-full rounded-[180px] overflow-hidden relative mt-10 c-flex flex-col", props?.className || "")
      } style={{
      backgroundImage: `url(${props.backgroundUrl})`,backgroundSize:"cover",
    }}>
      <p className="text-black">{t(props.subTitle)}</p>
      <p
        className="text-4xl max-md:text-2xl font-bold  max-md: text-center">{t(props.title)}</p>
      <i className="ri-play-circle-line ri-4x font-medium cursor-pointer" onClick={() => setOpen(true)}></i>
    </div>
  </>;
}
