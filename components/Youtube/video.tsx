import { useEffect, useRef } from "react";

export default function YoutubeVideo({ videoId, play }: { videoId: string, play: boolean }) {
  const playerRef = useRef<any>(null);
  const playerEvent = useRef<any>(null);
  const onPlayerReady = (event: any) => {
    playerEvent.current = event.target;
    // 当视频播放器准备就绪时，API将调用此函数
    // 您还可以通过调用event.target.playVideo（）、event.target_pauseVideo（）等来控制播放器。
  };
  useEffect(() => {
    if (videoId) {
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          videoId: videoId,
          events: {
            onReady: onPlayerReady
          },
          playerVars: {
            autoplay: 0,
            controls: 0 // 设置为0以隐藏所有控件
          }
        });
      };
      if (!document.querySelector("script#youtube-player-script")) {
        const script = document.createElement("script");
        script.src = `https://www.youtube.com/iframe_api?ver=7.3.2`;
        script.id = "youtube-player-script";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(script, firstScriptTag);
      }
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        window.onYouTubeIframeAPIReady = () => {
        };
      }
    };
  }, [videoId]);
  useEffect(() => {
    if (playerEvent.current) {
      if (play) {
        playerEvent.current?.playVideo && playerEvent.current.playVideo();
      } else {
        playerEvent.current?.pauseVideo && playerEvent.current.pauseVideo();
      }
    }
  }, [play, playerEvent]);

  return <div className="w-full h-full" id="youtube-player"></div>;
}
