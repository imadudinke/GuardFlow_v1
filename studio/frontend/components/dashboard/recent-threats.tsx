import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { AlertTriangle, Shield, Info } from "lucide-react";
import type { ThreatLog } from "@/generated/models/ThreatLog";

const severityConfig = {
  high: { variant: "destructive" as BadgeProps["variant"], icon: AlertTriangle },
  medium: { variant: "secondary" as BadgeProps["variant"], icon: Shield },
  low: { variant: "outline" as BadgeProps["variant"], icon: Info },
};

interface RecentThreatsProps {
  threats: ThreatLog[];
  loading?: boolean;
}

function getSeverity(riskScore: number) {
  if (riskScore >= 75) {
    return "high";
  }
  if (riskScore >= 30) {
    return "medium";
  }
  return "low";
}

export function RecentThreats({ threats, loading = false }: RecentThreatsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Threats</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading recent threats...</p>
        ) : threats.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No threats recorded for your projects yet.
          </p>
        ) : (
          <div className="space-y-4">
            {threats.map((threat) => {
              const severity = getSeverity(threat.risk_score);
              const config = severityConfig[severity];
              const detectedAt = new Date(threat.created_at).toLocaleString();
              const label =
                threat.risk_score >= 75
                  ? "High Risk"
                  : threat.risk_score >= 30
                  ? "Medium Risk"
                  : "Low Risk";
              const Icon = config.icon;

              return (
                <div
                  key={`${threat.id}-${threat.created_at}`}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{threat.path}</p>
                      <p className="text-sm text-muted-foreground">
                        IP: {threat.ip_address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={config.variant}>
                      {label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {detectedAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
