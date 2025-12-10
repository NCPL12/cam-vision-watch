import { useState, useEffect, useCallback, useRef } from "react";
import { LogEntry } from "@/components/LogsPanel";

interface WebSocketHookResult {
  isConnected: boolean;
  activeCamera: string | null;
  streamUrl: string | null;
  logs: LogEntry[];
  connect: (wsUrl: string) => void;
  disconnect: () => void;
  addLog: (message: string, type: LogEntry["type"]) => void;
  clearLogs: () => void;
  setActiveCamera: (cameraId: string, baseUrl: string) => void;
  lastUpdate: Date | null;
}

export const useWebSocket = (): WebSocketHookResult => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeCamera, setActiveCameraState] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamBaseUrlRef = useRef<string>("http://localhost:3001/video");

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      message,
      type,
    };
    setLogs((prev) => [...prev.slice(-99), newLog]); // Keep last 100 logs
    setLastUpdate(new Date());
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(
    (wsUrl: string) => {
      disconnect();
      addLog(`Connecting to ${wsUrl}...`, "info");

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          addLog("WebSocket connected successfully", "success");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            addLog(`Received: ${JSON.stringify(data)}`, "info");

            if (data.camera) {
              const newStreamUrl = `${streamBaseUrlRef.current}/${data.camera}`;
              setActiveCameraState(data.camera);
              setStreamUrl(newStreamUrl);
              addLog(`Switched to camera: ${data.camera}`, "success");
            }
          } catch {
            addLog(`Received non-JSON message: ${event.data}`, "warning");
          }
        };

        ws.onerror = (error) => {
          addLog(`WebSocket error occurred`, "error");
          console.error("WebSocket error:", error);
        };

        ws.onclose = (event) => {
          setIsConnected(false);
          addLog(
            `WebSocket disconnected (Code: ${event.code})`,
            event.wasClean ? "warning" : "error"
          );

          // Auto-reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            addLog("Attempting to reconnect...", "info");
            connect(wsUrl);
          }, 3000);
        };
      } catch (error) {
        addLog(`Failed to create WebSocket: ${error}`, "error");
      }
    },
    [disconnect, addLog]
  );

  const setActiveCamera = useCallback(
    (cameraId: string, baseUrl: string) => {
      streamBaseUrlRef.current = baseUrl;
      setActiveCameraState(cameraId);
      setStreamUrl(`${baseUrl}/${cameraId}`);
      addLog(`Manually selected camera: ${cameraId}`, "success");

      // Send to WebSocket if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ selectCamera: cameraId }));
      }
    },
    [addLog]
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Add initial log
  useEffect(() => {
    addLog("System initialized. Waiting for connection...", "info");
  }, [addLog]);

  return {
    isConnected,
    activeCamera,
    streamUrl,
    logs,
    connect,
    disconnect,
    addLog,
    clearLogs,
    setActiveCamera,
    lastUpdate,
  };
};
