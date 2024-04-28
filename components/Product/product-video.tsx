import { getVimeoLink, getYoutubeLink } from "@/lib/utils/util";
import YoutubeVideo from "@/components/Youtube/video";
import VimoeVideo from "@/components/Vimoe/video";
import { useEffect, useRef } from "react";

type Props = {
  type: string;
  url: string;
  play: boolean;
  className?: string;
}
export default function ProductVideo({ type, url, play, className }: Props) {
  const playRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playRef.current && play) {
      playRef.current.play();
    }
    if (playRef.current && !play) {
      playRef.current.pause();
    }
  }, [play]);
  return <>
    {
      <div className={`${className || ""} w-full h-full`}>
        {
          type === "youtube" && url &&
          <YoutubeVideo videoId={getYoutubeLink(url)} play={play} />
        }
        {
          type === "vimeo" && url &&
          <VimoeVideo videoId={getVimeoLink(url)} play={play} />
        }
        {
          type === "mp4" && url &&
          <video className="w-full h-full bg-black" controls={false} ref={playRef}>
            <source src={url} type="video/mp4" />
          </video>
        }
      </div>
    }
  </>;
}
