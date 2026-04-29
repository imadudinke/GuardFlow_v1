interface ActivityChartDatum {
  day: string;
  threats: number;
}

interface ActivityChartProps {
  data?: ActivityChartDatum[];
  loading?: boolean;
}

export function ActivityChart({ 
  data = [
    { day: "Mon", threats: 12 },
    { day: "Tue", threats: 19 },
    { day: "Wed", threats: 8 },
    { day: "Thu", threats: 15 },
    { day: "Fri", threats: 22 },
    { day: "Sat", threats: 5 },
    { day: "Sun", threats: 7 },
  ], 
  loading = false 
}: ActivityChartProps) {
  const maxThreats = Math.max(...data.map((d) => d.threats));

  return (
    <div className="col-span-4 retro-card p-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 halftone-subtle"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold retro-title mb-6">Threat Activity (Last 7 Days)</h3>
        
        {loading ? (
          <p className="text-sm font-medium retro-mono text-gray-500">
            Loading threat activity...
          </p>
        ) : (
          <div className="flex h-[200px] items-end justify-between gap-3">
            {data.map((item) => (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
                <div className="relative w-full flex justify-center">
                  <div
                    className="w-8 bg-black retro-card transition-all hover:bg-gray-800"
                    style={{
                      height: `${maxThreats === 0 ? 0 : (item.threats / maxThreats) * 160}px`,
                    }}
                  />
                </div>
                <div className="text-xs font-medium retro-mono">{item.day}</div>
                <div className="text-xs text-gray-500 retro-mono">{item.threats}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
