import { Wifi, WifiOff, Camera, Activity, Clock } from "lucide-react";

interface StatusPanelProps {
  isConnected: boolean;
  activeCamera: string | null;
  lastUpdate: Date | null;
}

const StatusPanel = ({ isConnected, activeCamera, lastUpdate }: StatusPanelProps) => {
  const statusItems = [
    {
      icon: isConnected ? Wifi : WifiOff,
      label: "WebSocket Status",
      value: isConnected ? "Connected" : "Disconnected",
      status: isConnected ? "success" : "error",
    },
    {
      icon: Camera,
      label: "Active Camera",
      value: activeCamera || "None",
      status: activeCamera ? "success" : "neutral",
    },
    {
      icon: Activity,
      label: "Stream Status",
      value: isConnected && activeCamera ? "Streaming" : "Idle",
      status: isConnected && activeCamera ? "success" : "neutral",
    },
    {
      icon: Clock,
      label: "Last Update",
      value: lastUpdate ? lastUpdate.toLocaleTimeString() : "Never",
      status: "neutral",
    },
  ];

  return (
    <div className="glass-card rounded-xl p-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        System Status
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {statusItems.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon
                className={`w-4 h-4 ${
                  item.status === "success"
                    ? "text-success"
                    : item.status === "error"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <p
              className={`text-sm font-medium ${
                item.status === "success"
                  ? "text-success"
                  : item.status === "error"
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPanel;
