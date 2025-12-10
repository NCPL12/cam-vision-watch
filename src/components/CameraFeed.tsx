import { Video, VideoOff, Maximize2, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface CameraFeedProps {
  cameraId: string | null;
  streamUrl: string | null;
  isConnected: boolean;
}

const CameraFeed = ({ cameraId, streamUrl, isConnected }: CameraFeedProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.getElementById("camera-container");
    if (element) {
      if (!document.fullscreenElement) {
        element.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-slide-up h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Video className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Live Feed</h2>
            <p className="text-xs text-muted-foreground">
              {cameraId ? `Camera: ${cameraId}` : "No camera selected"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected && (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-success/10 border border-success/20">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">LIVE</span>
            </span>
          )}
        </div>
      </div>

      <div
        id="camera-container"
        className="relative flex-1 bg-muted/50 overflow-hidden"
      >
        {streamUrl && isConnected ? (
          <>
            <img
              src={streamUrl}
              alt="Camera Stream"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 scan-effect pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-muted/50 border border-border">
              <VideoOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {!isConnected ? "Connection Lost" : "No Camera Feed"}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {!isConnected
                  ? "Attempting to reconnect..."
                  : "Select a camera to view stream"}
              </p>
            </div>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors border border-border"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-foreground" />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors border border-border"
              >
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
