import { Camera, Wifi, WifiOff, Settings } from "lucide-react";

interface NavbarProps {
  isConnected: boolean;
}

const Navbar = ({ isConnected }: NavbarProps) => {
  return (
    <nav className="glass-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Live Camera Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-time surveillance monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
            {isConnected ? (
              <>
                <div className="w-2 h-2 rounded-full bg-success status-pulse" />
                <Wifi className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Online</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-destructive status-pulse" />
                <WifiOff className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Offline</span>
              </>
            )}
          </div>

          <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
