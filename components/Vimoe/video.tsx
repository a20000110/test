import { useEffect, useRef } from "react";

export default function VimoeVideo({ videoId, play }: { videoId: string, play: boolean }) {
  const vimeoUrl = `https://player.vimeo.com/video/${videoId}?controls=0&loop=1`;
  const playerRef = useRef<any>(null);

  const initializePlayer = () => {
    const iframe = document.querySelector(`#vimeo-${videoId}`);
    playerRef.current = new window.Vimeo.Player(iframe, {
      id: videoId,
      controls: false,
      loop: true
    });
  };

  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };
  useEffect(() => {
    if (!document.querySelector("script#vimeo-player-script")) {
      const script = document.createElement("script");
      script.src = `https://player.vimeo.com/api/player.js"`;
      script.id = "vimeo-player-script";
      script.onload = () => initializePlayer();
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(script, firstScriptTag);
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.unload();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  useEffect(() => {
    play ? playVideo() : pauseVideo();
  }, [play]);
  return (
    <iframe
      id={`vimeo-${videoId}`}
      className="bg-black"
      src={vimeoUrl}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}
