import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityChartDatum {
  day: string;
  threats: number;
}

interface ActivityChartProps {
  data: ActivityChartDatum[];
  loading?: boolean;
}

export function ActivityChart({ data, loading = false }: ActivityChartProps) {
  const maxThreats = Math.max(...data.map((d) => d.threats));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Threat Activity (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading threat activity...
          </p>
        ) : (
          <div className="flex h-[200px] items-end justify-between gap-2">
            {data.map((item) => (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full">
                  <div
                    className="w-full rounded-t-md bg-zinc-900 transition-all hover:opacity-80 dark:bg-zinc-50"
                    style={{
                      height: `${maxThreats === 0 ? 0 : (item.threats / maxThreats) * 160}px`,
                    }}
                  />
                </div>
                <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                  <div>{item.day}</div>
                  <div>{item.threats}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
