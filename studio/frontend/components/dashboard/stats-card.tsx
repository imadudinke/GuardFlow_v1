import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon | ComponentType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="retro-card-static p-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 halftone-subtle"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium retro-mono text-gray-600">{title}</h3>
          <div className="retro-card-static p-2 bg-gray-50">
            <Icon className="h-4 w-4 text-black" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold retro-title">{value}</div>
          
          {description && (
            <p className="text-xs text-gray-500 retro-mono">{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-medium retro-mono ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400 retro-mono">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
