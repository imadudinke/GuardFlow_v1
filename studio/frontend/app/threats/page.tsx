"use client";

import { useEffect, useState } from 'react';
import { TelemetryService, TelemetrySchema } from '@/generated';

export default function ThreatFeed() {
  const [threats, setThreats] = useState<TelemetrySchema[]>([]);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const data = await TelemetryService.receiveTelemetryApiV1TelemetryPost();
        setThreats(data);
      } catch (err) {
        console.error("Failed to fetch intelligence:", err);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">SENTINEL_FEED</h1>
          <p className="text-zinc-500 font-mono text-sm">REAL-TIME THREAT INTELLIGENCE // SYSTEM_ACTIVE</p>
        </div>
        <div className="text-right">
          <span className="text-cyan-400 font-mono text-xl">{threats.length}</span>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Intercepted</p>
        </div>
      </header>

      <div className="grid gap-4">
        {threats.map((threat) => (
          <div key={threat.id} className="group relative bg-zinc-950 border border-zinc-900 p-5 rounded-lg hover:border-cyan-900/50 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-white font-mono font-bold">{threat.ip_address}</span>
                  <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase text-zinc-500">
                    {threat.country || 'Unknown Origin'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono italic">{threat.path}</p>
              </div>
              
              <div className="text-right">
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${threat.risk_score > 70 ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                  {threat.risk_score}% RISK
                </div>
                <p className="text-[10px] text-zinc-600 mt-2">{new Date(threat.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
