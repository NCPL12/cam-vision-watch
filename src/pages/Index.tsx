import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CameraFeed from "@/components/CameraFeed";
import StatusPanel from "@/components/StatusPanel";
import LogsPanel from "@/components/LogsPanel";
import CameraSelector from "@/components/CameraSelector";
import ConnectionSettings from "@/components/ConnectionSettings";
import { useWebSocket } from "@/hooks/useWebSocket";

const Index = () => {
  const [wsUrl, setWsUrl] = useState("ws://localhost:8080");
  const [streamBaseUrl, setStreamBaseUrl] = useState("http://localhost:3001/video");
  const [cameras, setCameras] = useState<string[]>(["cam-01", "cam-02", "cam-03"]);

  const {
    isConnected,
    activeCamera,
    streamUrl,
    logs,
    connect,
    clearLogs,
    setActiveCamera,
    lastUpdate,
  } = useWebSocket();

  useEffect(() => {
    // Auto-connect on mount
    connect(wsUrl);
  }, []);

  const handleUpdateSettings = (newWsUrl: string, newStreamBaseUrl: string) => {
    setWsUrl(newWsUrl);
    setStreamBaseUrl(newStreamBaseUrl);
  };

  const handleReconnect = () => {
    connect(wsUrl);
  };

  const handleSelectCamera = (cameraId: string) => {
    setActiveCamera(cameraId, streamBaseUrl);
  };

  const handleAddCamera = (cameraId: string) => {
    setCameras((prev) => [...prev, cameraId]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isConnected={isConnected} />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Camera Feed */}
            <div className="lg:col-span-2 space-y-6">
              <CameraFeed
                cameraId={activeCamera}
                streamUrl={streamUrl}
                isConnected={isConnected}
              />
              <LogsPanel logs={logs} onClearLogs={clearLogs} />
            </div>

            {/* Sidebar - Controls */}
            <div className="space-y-6">
              <StatusPanel
                isConnected={isConnected}
                activeCamera={activeCamera}
                lastUpdate={lastUpdate}
              />
              <CameraSelector
                cameras={cameras}
                activeCamera={activeCamera}
                onSelectCamera={handleSelectCamera}
                onAddCamera={handleAddCamera}
              />
              <ConnectionSettings
                wsUrl={wsUrl}
                streamBaseUrl={streamBaseUrl}
                onUpdateSettings={handleUpdateSettings}
                onReconnect={handleReconnect}
                isConnected={isConnected}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
