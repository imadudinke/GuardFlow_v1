import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Info, Clock } from "lucide-react";

interface Threat {
  id: string;
  ip_address: string;
  path: string;
  risk_score: number;
  risk_factors?: string[];
  country?: string;
  created_at: string;
}

interface RecentThreatsProps {
  threats?: Threat[];
  loading?: boolean;
}

function getRiskLevel(score: number) {
  if (score >= 90) return { level: 'critical', color: 'destructive', icon: AlertTriangle };
  if (score >= 70) return { level: 'high', color: 'destructive', icon: AlertTriangle };
  if (score >= 40) return { level: 'medium', color: 'secondary', icon: Shield };
  return { level: 'low', color: 'outline', icon: Info };
}

function formatRiskFactor(factor: string) {
  return factor
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getTimeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function RecentThreats({ threats = [], loading = false }: RecentThreatsProps) {
  return (
    <div className="col-span-3 retro-card-static p-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 halftone-subtle"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-bold retro-title">Recent Threats</h3>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="retro-card-static p-4 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : threats.length === 0 ? (
          <div className="text-center py-12">
            <div className="retro-card-static bg-gray-100 p-8 mx-auto max-w-sm">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-bold retro-mono text-gray-600 mb-2">All Clear</p>
              <p className="text-xs retro-mono text-gray-500">No recent threats detected</p>
              <p className="text-xs retro-mono text-gray-400 mt-2">Your systems are secure</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {threats.map((threat, index) => {
              const riskConfig = getRiskLevel(threat.risk_score || 0);
              const Icon = riskConfig.icon;
              const primaryFactor = threat.risk_factors?.[0] || 'unknown_threat';
              const isRecent = index < 2; // Highlight first 2 as most recent
              
              return (
                <div
                  key={threat.id}
                  className={`retro-card-static p-4 transition-all hover:shadow-lg ${
                    isRecent ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon and severity */}
                    <div className={`retro-card-static p-2 shrink-0 ${
                      riskConfig.level === 'critical' ? 'bg-red-100' :
                      riskConfig.level === 'high' ? 'bg-orange-100' :
                      riskConfig.level === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        riskConfig.level === 'critical' ? 'text-red-600' :
                        riskConfig.level === 'high' ? 'text-orange-600' :
                        riskConfig.level === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold retro-mono text-sm truncate">
                            {formatRiskFactor(primaryFactor)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs retro-mono text-gray-600 font-medium">
                              {threat.ip_address}
                            </span>
                            {threat.country && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-xs retro-mono text-gray-500">
                                  {threat.country}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-xs retro-mono text-gray-400 mt-1 truncate">
                            {threat.path}
                          </p>
                        </div>
                        
                        {/* Risk score and time */}
                        <div className="text-right shrink-0">
                          <Badge 
                            variant={riskConfig.color as any}
                            className="text-xs font-bold"
                          >
                            {threat.risk_score || 0}%
                          </Badge>
                          <div className="text-xs text-gray-500 retro-mono mt-1">
                            {getTimeAgo(threat.created_at)}
                          </div>
                          {isRecent && (
                            <div className="text-[10px] retro-mono text-yellow-600 font-bold mt-1">
                              RECENT
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Additional risk factors */}
                      {threat.risk_factors && threat.risk_factors.length > 1 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {threat.risk_factors.slice(1, 3).map((factor) => (
                            <span
                              key={factor}
                              className="retro-card-static bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 retro-mono"
                            >
                              {formatRiskFactor(factor)}
                            </span>
                          ))}
                          {threat.risk_factors.length > 3 && (
                            <span className="text-[10px] retro-mono text-gray-400">
                              +{threat.risk_factors.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {threats.length > 0 && (
          <div className="mt-4 text-center">
            <a 
              href="/threats" 
              className="text-sm retro-mono text-blue-600 hover:text-blue-800"
            >
              View all threats →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}