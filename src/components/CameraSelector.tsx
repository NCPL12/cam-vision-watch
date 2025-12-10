import { useState } from "react";
import { Camera, Plus, Check, AlertCircle } from "lucide-react";
import { z } from "zod";

const cameraSchema = z.object({
  cameraId: z
    .string()
    .min(1, "Camera ID is required")
    .max(50, "Camera ID must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens, and underscores allowed"),
});

interface CameraSelectorProps {
  cameras: string[];
  activeCamera: string | null;
  onSelectCamera: (cameraId: string) => void;
  onAddCamera: (cameraId: string) => void;
}

const CameraSelector = ({
  cameras,
  activeCamera,
  onSelectCamera,
  onAddCamera,
}: CameraSelectorProps) => {
  const [newCameraId, setNewCameraId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCamera = () => {
    const result = cameraSchema.safeParse({ cameraId: newCameraId });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    if (cameras.includes(newCameraId)) {
      setError("Camera ID already exists");
      return;
    }

    onAddCamera(newCameraId);
    setNewCameraId("");
    setError(null);
    setIsAdding(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCameraId(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="glass-card rounded-xl p-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          Camera Selection
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`p-1.5 rounded-md transition-colors ${
            isAdding
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary text-muted-foreground"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 animate-scale-in">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newCameraId}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleAddCamera()}
                placeholder="Enter camera ID..."
                className={`w-full px-3 py-2 rounded-lg bg-secondary/50 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-destructive focus:ring-destructive/30"
                    : "border-border focus:ring-primary/30 focus:border-primary"
                }`}
              />
              {error && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                </div>
              )}
            </div>
            <button
              onClick={handleAddCamera}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {cameras.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No cameras configured. Add one to get started.
          </p>
        ) : (
          cameras.map((camera) => (
            <button
              key={camera}
              onClick={() => onSelectCamera(camera)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                activeCamera === camera
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-secondary/30 border-border hover:border-primary/30 text-foreground hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">{camera}</span>
              </div>
              {activeCamera === camera && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CameraSelector;
