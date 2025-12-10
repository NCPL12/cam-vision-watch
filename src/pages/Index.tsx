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
    <div className="min-h-screen flex flex-col">
      <Navbar isConnected={isConnected} />

      <main className="flex-1 flex items-start justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-5xl space-y-4 md:space-y-6">
          <CameraFeed
            cameraId={activeCamera}
            streamUrl={streamUrl}
            isConnected={isConnected}
          />
          <LogsPanel logs={logs} onClearLogs={clearLogs} />
        </div>
      </main>

      <footer className="glass-card border-t border-border px-4 md:px-6 py-3 md:py-4 mt-auto">
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
