import { useState } from "react";
import { Settings, Server, RefreshCw, AlertCircle } from "lucide-react";
import { z } from "zod";

const settingsSchema = z.object({
  wsUrl: z
    .string()
    .min(1, "WebSocket URL is required")
    .regex(/^wss?:\/\//, "Must be a valid WebSocket URL (ws:// or wss://)"),
  streamBaseUrl: z
    .string()
    .min(1, "Stream base URL is required")
    .regex(/^https?:\/\//, "Must be a valid HTTP URL"),
});

interface ConnectionSettingsProps {
  wsUrl: string;
  streamBaseUrl: string;
  onUpdateSettings: (wsUrl: string, streamBaseUrl: string) => void;
  onReconnect: () => void;
  isConnected: boolean;
}

const ConnectionSettings = ({
  wsUrl,
  streamBaseUrl,
  onUpdateSettings,
  onReconnect,
  isConnected,
}: ConnectionSettingsProps) => {
  const [localWsUrl, setLocalWsUrl] = useState(wsUrl);
  const [localStreamUrl, setLocalStreamUrl] = useState(streamBaseUrl);
  const [errors, setErrors] = useState<{ wsUrl?: string; streamBaseUrl?: string }>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const result = settingsSchema.safeParse({
      wsUrl: localWsUrl,
      streamBaseUrl: localStreamUrl,
    });

    if (!result.success) {
      const fieldErrors: { wsUrl?: string; streamBaseUrl?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field as keyof typeof fieldErrors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onUpdateSettings(localWsUrl, localStreamUrl);
    setIsOpen(false);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.25s" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Connection Settings</h3>
        </div>
        <div
          className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4 animate-scale-in">
          <div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Server className="w-3 h-3" />
              WebSocket URL
            </label>
            <input
              type="text"
              value={localWsUrl}
              onChange={(e) => {
                setLocalWsUrl(e.target.value);
                if (errors.wsUrl) setErrors((prev) => ({ ...prev, wsUrl: undefined }));
              }}
              className={`w-full px-3 py-2 rounded-lg bg-secondary/50 border text-sm font-mono text-foreground focus:outline-none focus:ring-2 transition-all ${
                errors.wsUrl
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-border focus:ring-primary/30 focus:border-primary"
              }`}
            />
            {errors.wsUrl && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.wsUrl}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Server className="w-3 h-3" />
              Stream Base URL
            </label>
            <input
              type="text"
              value={localStreamUrl}
              onChange={(e) => {
                setLocalStreamUrl(e.target.value);
                if (errors.streamBaseUrl)
                  setErrors((prev) => ({ ...prev, streamBaseUrl: undefined }));
              }}
              className={`w-full px-3 py-2 rounded-lg bg-secondary/50 border text-sm font-mono text-foreground focus:outline-none focus:ring-2 transition-all ${
                errors.streamBaseUrl
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-border focus:ring-primary/30 focus:border-primary"
              }`}
            />
            {errors.streamBaseUrl && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.streamBaseUrl}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Save Settings
            </button>
            <button
              onClick={onReconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${!isConnected ? "animate-spin" : ""}`} />
              Reconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionSettings;
