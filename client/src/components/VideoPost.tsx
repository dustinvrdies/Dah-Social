import { useRef } from "react";
import { Card } from "@/components/ui/card";

interface VideoPostProps {
  src: string;
  user: string;
  caption?: string;
}

export function VideoPost({ src, user, caption }: VideoPostProps) {
  const ref = useRef<HTMLVideoElement>(null);

  const toggle = async () => {
    if (!ref.current) return;
    if (ref.current.paused) await ref.current.play();
    else ref.current.pause();
  };

  return (
    <Card className="relative w-full aspect-[9/16] max-h-[70vh] overflow-hidden" data-testid={`card-video-${user}`}>
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted
        playsInline
        onClick={toggle}
        data-testid="video-player"
      />
      <div className="absolute bottom-3 left-3 space-y-1 text-white drop-shadow-lg">
        <div className="font-semibold" data-testid="text-video-user">@{user}</div>
        {caption && (
          <div className="text-sm opacity-90" data-testid="text-video-caption">
            {caption}
          </div>
        )}
        <div className="text-xs opacity-60">Tap video to play/pause</div>
      </div>
    </Card>
  );
}
