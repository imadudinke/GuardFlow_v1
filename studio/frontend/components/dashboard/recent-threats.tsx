import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Info } from "lucide-react";

const threats = [
  {
    id: 1,
    type: "SQL Injection",
    severity: "high",
    ip: "192.168.1.100",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "Rate Limit Exceeded",
    severity: "medium",
    ip: "10.0.0.45",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "Suspicious Activity",
    severity: "low",
    ip: "172.16.0.23",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "XSS Attempt",
    severity: "high",
    ip: "192.168.1.200",
    time: "2 hours ago",
  },
];

const severityConfig = {
  high: { color: "destructive", icon: AlertTriangle },
  medium: { color: "secondary", icon: Shield },
  low: { color: "outline", icon: Info },
};

export function RecentThreats() {
  return (
    <div className="col-span-3 retro-card p-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 halftone-subtle"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold retro-title mb-6">Recent Threats</h3>
        
        <div className="space-y-4">
          {threats.map((threat) => {
            const config =
              severityConfig[threat.severity as keyof typeof severityConfig];
            const Icon = config.icon;
            return (
              <div
                key={threat.id}
                className="flex items-center justify-between retro-card p-4 bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="retro-card p-2 bg-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium retro-mono">{threat.type}</p>
                    <p className="text-sm text-gray-500 retro-mono">
                      IP: {threat.ip}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={config.color as any}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-500 retro-mono">
                    {threat.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}