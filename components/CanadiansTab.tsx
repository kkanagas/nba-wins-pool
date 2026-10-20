// components/CanadiansTab.tsx
'use client';

import { useEffect, useState } from 'react';

export default function CanadiansTab() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/canadians')
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading Canadian NBA stats... 🇨🇦</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          🇨🇦 Canadians in the NBA
        </h2>
        <span className="text-sm text-gray-400">{players.length} Active Players</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-slate-800/80 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Hometown</th>
              <th className="px-4 py-3 text-center border-l border-slate-700">Season PPG</th>
              <th className="px-4 py-3 text-center">RPG</th>
              <th className="px-4 py-3 text-center">APG</th>
              <th className="px-4 py-3 text-center border-l border-slate-700 bg-slate-800/40">Last Game</th>
              <th className="px-4 py-3 text-center bg-slate-800/40">PTS / REB / AST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {players.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-amber-400">
                    {p.team}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{p.hometown}</td>
                <td className="px-4 py-3 text-center font-semibold text-amber-300 border-l border-slate-800">
                  {p.seasonStats?.pts}
                </td>
                <td className="px-4 py-3 text-center">{p.seasonStats?.reb}</td>
                <td className="px-4 py-3 text-center">{p.seasonStats?.ast}</td>
                <td className="px-4 py-3 text-center border-l border-slate-800 text-xs text-gray-400 bg-slate-900/30">
                  vs {p.lastGame?.opponent} ({p.lastGame?.date})
                </td>
                <td className="px-4 py-3 text-center font-mono font-medium text-emerald-400 bg-slate-900/30">
                  {p.lastGame?.pts} / {p.lastGame?.reb} / {p.lastGame?.ast}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}