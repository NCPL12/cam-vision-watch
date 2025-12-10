import { Terminal, Trash2, Download } from "lucide-react";
import { useRef, useEffect } from "react";

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface LogsPanelProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

const LogsPanel = ({ logs, onClearLogs }: LogsPanelProps) => {
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const exportLogs = () => {
    const logText = logs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] [${log.type.toUpperCase()}] ${log.message}`
      )
      .join("\n");
    
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `camera-logs-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  const getTypeBadge = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "bg-success/10 text-success border-success/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Activity Logs</h3>
          <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
            {logs.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportLogs}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title="Export Logs"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div
        ref={logsRef}
        className="h-48 overflow-y-auto p-3 bg-muted/30 font-mono text-xs space-y-1"
      >
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No activity logs yet...
          </p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="log-entry flex items-start gap-2 py-1 px-2 rounded hover:bg-secondary/30 transition-colors"
            >
              <span className="text-muted-foreground shrink-0">
                [{log.timestamp.toLocaleTimeString()}]
              </span>
              <span
                className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase border ${getTypeBadge(
                  log.type
                )}`}
              >
                {log.type}
              </span>
              <span className={getTypeColor(log.type)}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogsPanel;
