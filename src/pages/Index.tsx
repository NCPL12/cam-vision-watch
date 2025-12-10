import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import CameraFeed from "@/components/CameraFeed";
import LogsPanel from "@/components/LogsPanel";
import { useWebSocket } from "@/hooks/useWebSocket";

const Index = () => {
  const wsUrl = "ws://localhost:8080";
  const streamBaseUrl = "http://localhost:3001/video";

  const {
    isConnected,
    activeCamera,
    streamUrl,
    logs,
    connect,
    clearLogs,
  } = useWebSocket();

  useEffect(() => {
    connect(wsUrl);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isConnected={isConnected} />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <CameraFeed
            cameraId={activeCamera}
            streamUrl={streamUrl}
            isConnected={isConnected}
          />
          <LogsPanel logs={logs} onClearLogs={clearLogs} />
        </div>
      </main>

      <footer className="glass-card border-t border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>Camera Monitoring System v1.0</span>
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
