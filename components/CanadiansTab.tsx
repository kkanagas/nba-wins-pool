// components/CanadiansTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

// Reusing your exact dashboard team color mapping
const TEAM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Hawks: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-700/50' },
  Atlanta: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-700/50' },
  Celtics: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700/50' },
  Boston: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700/50' },
  Nets: { bg: 'bg-zinc-900/90', text: 'text-zinc-200', border: 'border-zinc-700/50' },
  Brooklyn: { bg: 'bg-zinc-900/90', text: 'text-zinc-200', border: 'border-zinc-700/50' },
  Hornets: { bg: 'bg-teal-950/80', text: 'text-teal-300', border: 'border-teal-700/50' },
  Charlotte: { bg: 'bg-teal-950/80', text: 'text-teal-300', border: 'border-teal-700/50' },
  Bulls: { bg: 'bg-red-950/90', text: 'text-red-400', border: 'border-red-800/60' },
  Chicago: { bg: 'bg-red-950/90', text: 'text-red-400', border: 'border-red-800/60' },
  Cavaliers: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-700/50' },
  Cleveland: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-700/50' },
  Mavericks: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Dallas: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Nuggets: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700/50' },
  Denver: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700/50' },
  Pistons: { bg: 'bg-blue-950/90', text: 'text-blue-400', border: 'border-blue-800/60' },
  Detroit: { bg: 'bg-blue-950/90', text: 'text-blue-400', border: 'border-blue-800/60' },
  Warriors: { bg: 'bg-yellow-950/80', text: 'text-yellow-300', border: 'border-yellow-700/50' },
  'Golden State': { bg: 'bg-yellow-950/80', text: 'text-yellow-300', border: 'border-yellow-700/50' },
  Rockets: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-700/50' },
  Houston: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-700/50' },
  Pacers: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-700/50' },
  Indiana: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-700/50' },
  Clippers: { bg: 'bg-blue-950/80', text: 'text-cyan-300', border: 'border-cyan-700/50' },
  'LA Clippers': { bg: 'bg-blue-950/80', text: 'text-cyan-300', border: 'border-cyan-700/50' },
  Lakers: { bg: 'bg-purple-950/80', text: 'text-yellow-300', border: 'border-purple-700/50' },
  'LA Lakers': { bg: 'bg-purple-950/80', text: 'text-yellow-300', border: 'border-purple-700/50' },
  Grizzlies: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-700/50' },
  Memphis: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-700/50' },
  Heat: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-orange-700/50' },
  Miami: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-orange-700/50' },
  Bucks: { bg: 'bg-emerald-950/90', text: 'text-emerald-300', border: 'border-emerald-700/50' },
  Milwaukee: { bg: 'bg-emerald-950/90', text: 'text-emerald-300', border: 'border-emerald-700/50' },
  Timberwolves: { bg: 'bg-slate-900/90', text: 'text-cyan-300', border: 'border-cyan-700/50' },
  Minnesota: { bg: 'bg-slate-900/90', text: 'text-cyan-300', border: 'border-cyan-700/50' },
  Pelicans: { bg: 'bg-blue-950/90', text: 'text-amber-300', border: 'border-blue-700/50' },
  'New Orleans': { bg: 'bg-blue-950/90', text: 'text-amber-300', border: 'border-blue-700/50' },
  Knicks: { bg: 'bg-orange-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  'New York': { bg: 'bg-orange-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  Thunder: { bg: 'bg-sky-950/80', text: 'text-orange-300', border: 'border-sky-700/50' },
  'Oklahoma City': { bg: 'bg-sky-950/80', text: 'text-orange-300', border: 'border-sky-700/50' },
  OKC: { bg: 'bg-sky-950/80', text: 'text-orange-300', border: 'border-sky-700/50' },
  Magic: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-600/50' },
  Orlando: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-600/50' },
  '76ers': { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Philadelphia: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Suns: { bg: 'bg-purple-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  Phoenix: { bg: 'bg-purple-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  PHX: { bg: 'bg-purple-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  'Trail Blazers': { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  Blazers: { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  Portland: { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  POR: { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  Kings: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-700/50' },
  Sacramento: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-700/50' },
  Spurs: { bg: 'bg-slate-900/90', text: 'text-slate-200', border: 'border-slate-700/50' },
  'San Antonio': { bg: 'bg-slate-900/90', text: 'text-slate-200', border: 'border-slate-700/50' },
  Raptors: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-red-800/60' },
  Toronto: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-red-800/60' },
  TOR: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-red-800/60' },
  Jazz: { bg: 'bg-violet-950/80', text: 'text-violet-300', border: 'border-violet-700/50' },
  Utah: { bg: 'bg-violet-950/80', text: 'text-violet-300', border: 'border-violet-700/50' },
  Wizards: { bg: 'bg-blue-950/90', text: 'text-red-300', border: 'border-blue-700/50' },
  Washington: { bg: 'bg-blue-950/90', text: 'text-red-300', border: 'border-blue-700/50' },
  MEM: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-700/50' },
  IND: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-700/50' },
  MIA: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-orange-700/50' },
  ATL: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-700/50' },
  NOP: { bg: 'bg-blue-950/90', text: 'text-amber-300', border: 'border-blue-700/50' },
  WAS: { bg: 'bg-blue-950/90', text: 'text-red-300', border: 'border-blue-700/50' },
  DAL: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  CHI: { bg: 'bg-red-950/90', text: 'text-red-400', border: 'border-red-800/60' },
  MIN: { bg: 'bg-slate-900/90', text: 'text-cyan-300', border: 'border-cyan-700/50' },
  DEN: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700/50' },
};

type SortField = 'name' | 'team' | 'hometown' | 'pts' | 'reb' | 'ast' | 'fgPct' | 'lastPts';

export default function CanadiansTab() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('pts');
  const [sortAsc, setSortAsc] = useState(false); // Default to highest points first

  useEffect(() => {
    fetch('/api/canadians')
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'team' || field === 'hometown');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    let aVal: any = 0;
    let bVal: any = 0;

    if (sortField === 'name') {
      aVal = a.name;
      bVal = b.name;
    } else if (sortField === 'team') {
      aVal = a.team;
      bVal = b.team;
    } else if (sortField === 'hometown') {
      aVal = a.hometown;
      bVal = b.hometown;
    } else if (sortField === 'pts') {
      aVal = parseFloat(a.seasonStats?.pts) || 0;
      bVal = parseFloat(b.seasonStats?.pts) || 0;
    } else if (sortField === 'reb') {
      aVal = parseFloat(a.seasonStats?.reb) || 0;
      bVal = parseFloat(b.seasonStats?.reb) || 0;
    } else if (sortField === 'ast') {
      aVal = parseFloat(a.seasonStats?.ast) || 0;
      bVal = parseFloat(b.seasonStats?.ast) || 0;
    } else if (sortField === 'fgPct') {
      aVal = parseFloat(a.seasonStats?.fgPct) || 0;
      bVal = parseFloat(b.seasonStats?.fgPct) || 0;
    } else if (sortField === 'lastPts') {
      aVal = parseFloat(a.lastGame?.pts) || 0;
      bVal = parseFloat(b.lastGame?.pts) || 0;
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

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
          <thead className="bg-slate-800/80 text-xs uppercase text-gray-400 select-none">
            <tr>
              <th onClick={() => handleSort('name')} className="px-4 py-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">Player <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
              <th onClick={() => handleSort('team')} className="px-4 py-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">Team <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
              <th onClick={() => handleSort('hometown')} className="px-4 py-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">Hometown <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
              <th onClick={() => handleSort('pts')} className="px-4 py-3 text-center border-l border-slate-700 cursor-pointer hover:text-white">
                <div className="flex items-center justify-center gap-1">PPG <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
              <th onClick={() => handleSort('reb')} className="px-4 py-3 text-center cursor-pointer hover:text-white">
                <div className="flex items-center justify-center gap-1">RPG <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
              <th onClick={() => handleSort('ast')} className="px-4 py-3 text-center cursor-pointer hover:text-white">
                <div className="flex items-center justify-center gap-1">APG <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
              <th onClick={() => handleSort('fgPct')} className="px-4 py-3 text-center cursor-pointer hover:text-white">
                <div className="flex items-center justify-center gap-1">FG% <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
              <th className="px-4 py-3 text-center border-l border-slate-700 bg-slate-800/40">Last Game</th>
              <th onClick={() => handleSort('lastPts')} className="px-4 py-3 text-center bg-slate-800/40 cursor-pointer hover:text-white">
                <div className="flex items-center justify-center gap-1">PTS / REB / AST <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedPlayers.map((p) => {
              const teamStyle = TEAM_COLORS[p.team] || { bg: 'bg-slate-800', text: 'text-slate-200', border: 'border-slate-700' };
              return (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md border font-mono text-xs font-medium ${teamStyle.bg} ${teamStyle.text} ${teamStyle.border}`}>
                      {p.team}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.hometown}</td>
                  <td className="px-4 py-3 text-center font-semibold text-amber-300 border-l border-slate-800 font-mono">
                    {p.seasonStats?.pts}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">{p.seasonStats?.reb}</td>
                  <td className="px-4 py-3 text-center font-mono">{p.seasonStats?.ast}</td>
                  <td className="px-4 py-3 text-center font-mono text-gray-300">{p.seasonStats?.fgPct}</td>
                  <td className="px-4 py-3 text-center border-l border-slate-800 text-xs text-gray-400 bg-slate-900/30">
                    vs {p.lastGame?.opponent} ({p.lastGame?.date})
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-medium text-emerald-400 bg-slate-900/30">
                    {p.lastGame?.pts} / {p.lastGame?.reb} / {p.lastGame?.ast}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}