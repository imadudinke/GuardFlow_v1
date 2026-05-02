import { Shield, AlertTriangle, Globe, Clock, Zap, TrendingUp, Ban, Eye } from "lucide-react";

interface SecurityOverviewProps {
  data?: {
    totalThreats: number;
    blockedAttacks: number;
    uniqueCountries: number;
    uniqueIPs: number;
    recentActivity: number;
    topRiskFactors: Array<{ factor: string; count: number }>;
    systemStatus: 'active' | 'monitoring' | 'offline';
  };
  loading?: boolean;
}

function formatRiskFactor(factor: string) {
  return factor
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function SecurityOverview({ 
  data = {
    totalThreats: 0,
    blockedAttacks: 0,
    uniqueCountries: 0,
    uniqueIPs: 0,
    recentActivity: 0,
    topRiskFactors: [],
    systemStatus: 'monitoring'
  }, 
  loading = false 
}: SecurityOverviewProps) {
  const blockRate = data.totalThreats > 0 ? Math.round((data.blockedAttacks / data.totalThreats) * 100) : 0;
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'THREATS DETECTED', icon: AlertTriangle };
      case 'monitoring':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'MONITORING', icon: Shield };
      case 'offline':
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'OFFLINE', icon: Clock };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'UNKNOWN', icon: Clock };
    }
  };

  const statusConfig = getStatusConfig(data.systemStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="retro-card-static bg-white p-4 relative overflow-hidden sm:p-6 md:col-span-4">
      <div className="absolute inset-0 halftone-subtle"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="text-lg font-bold retro-title">Security Overview</h3>
              <p className="text-xs retro-mono text-gray-500">Real-time protection status</p>
            </div>
          </div>
          
          {/* System Status */}
          <div className={`retro-card-static px-3 py-2 sm:px-4 ${statusConfig.bg}`}>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
              <span className={`text-xs font-black uppercase tracking-[0.2em] retro-mono ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="retro-card-static bg-gray-50 p-4">
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
        ) : (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="retro-card-static bg-gray-50 p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-black retro-title text-red-600">{data.totalThreats}</div>
                <div className="text-xs retro-mono text-gray-600">Total Threats</div>
              </div>
              
              <div className="retro-card-static bg-gray-50 p-4 text-center">
                <Ban className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-black retro-title text-orange-600">{data.blockedAttacks}</div>
                <div className="text-xs retro-mono text-gray-600">Blocked</div>
              </div>
              
              <div className="retro-card-static bg-gray-50 p-4 text-center">
                <Globe className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-black retro-title text-blue-600">{data.uniqueCountries}</div>
                <div className="text-xs retro-mono text-gray-600">Countries</div>
              </div>
              
              <div className="retro-card-static bg-gray-50 p-4 text-center">
                <Eye className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-black retro-title text-green-600">{data.uniqueIPs}</div>
                <div className="text-xs retro-mono text-gray-600">Unique IPs</div>
              </div>
            </div>

            {/* Protection Effectiveness */}
            <div className="retro-card-static bg-gray-900 p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-bold retro-mono text-green-400">PROTECTION EFFECTIVENESS</span>
                </div>
                <span className="text-2xl font-black retro-title text-green-400">{blockRate}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700 h-3 retro-card-static mb-2">
                <div 
                  className="h-full bg-green-400 transition-all duration-1000 ease-out"
                  style={{ width: `${blockRate}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs retro-mono text-gray-300">
                <span>Threats blocked automatically</span>
                <span>{data.blockedAttacks} of {data.totalThreats} threats</span>
              </div>
            </div>

            {/* Top Risk Factors */}
            {data.topRiskFactors.length > 0 && (
              <div>
                <h4 className="text-sm font-bold retro-mono text-gray-600 mb-3 uppercase tracking-[0.2em]">
                  Top Attack Patterns
                </h4>
                <div className="space-y-2">
                  {data.topRiskFactors.slice(0, 4).map((item, index) => (
                    <div key={item.factor} className="flex items-center justify-between retro-card-static bg-gray-50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="retro-card-static bg-white px-2 py-1 text-xs font-black retro-mono text-gray-700">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium retro-mono">
                          {formatRiskFactor(item.factor)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-gray-200 h-2 retro-card-static">
                          <div 
                            className="h-full bg-red-500" 
                            style={{ width: `${(item.count / data.topRiskFactors[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-black retro-mono w-6 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity Summary */}
            <div className="retro-card-static bg-blue-50 p-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-bold retro-mono text-blue-900">Last 24 Hours</div>
                  <div className="text-xs retro-mono text-blue-700">Recent threat activity</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black retro-title text-blue-600">{data.recentActivity}</div>
                <div className="text-xs retro-mono text-blue-700">
                  {data.recentActivity === 0 ? 'All quiet' : 'Threats detected'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="/threats" 
                className="retro-button bg-white p-3 text-center hover:bg-gray-50 block"
              >
                <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-600" />
                <div className="text-xs font-black retro-mono">View All Threats</div>
              </a>
              <a 
                href="/blacklist" 
                className="retro-button bg-white p-3 text-center hover:bg-gray-50 block"
              >
                <Ban className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <div className="text-xs font-black retro-mono">Manage Blacklist</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
