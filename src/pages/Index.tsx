import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import CameraFeed from "@/components/CameraFeed";
import LogsPanel from "@/components/LogsPanel";
import { useWebSocket } from "@/hooks/useWebSocket";

const Index = () => {
  const wsUrl = "ws://localhost:8080";

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
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar isConnected={isConnected} />

      <main className="flex-1 flex p-4 gap-4 min-h-0">
        {/* Logs - Left Side */}
        <div className="w-1/3 min-w-[280px] max-w-[400px]">
          <LogsPanel logs={logs} onClearLogs={clearLogs} />
        </div>

        {/* Camera Feed - Right Side */}
        <div className="flex-1">
          <CameraFeed
            cameraId={activeCamera}
            streamUrl={streamUrl}
            isConnected={isConnected}
          />
        </div>
      </main>

      <footer className="glass-card border-t border-border px-4 py-2 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>Camera Monitoring System v1.0</span>
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="sm:hidden">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
