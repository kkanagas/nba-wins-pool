export const TEAM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Hawks: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-700/50' },
  Celtics: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700/50' },
  Nets: { bg: 'bg-zinc-900/90', text: 'text-zinc-200', border: 'border-zinc-700/50' },
  Hornets: { bg: 'bg-teal-950/80', text: 'text-teal-300', border: 'border-teal-700/50' },
  Bulls: { bg: 'bg-red-950/90', text: 'text-red-400', border: 'border-red-800/60' },
  Cavaliers: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-700/50' },
  Mavericks: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Nuggets: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700/50' },
  Pistons: { bg: 'bg-blue-950/90', text: 'text-blue-400', border: 'border-blue-800/60' },
  Warriors: { bg: 'bg-yellow-950/80', text: 'text-yellow-300', border: 'border-yellow-700/50' },
  Rockets: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-700/50' },
  Pacers: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-700/50' },
  Clippers: { bg: 'bg-blue-950/80', text: 'text-cyan-300', border: 'border-cyan-700/50' },
  Lakers: { bg: 'bg-purple-950/80', text: 'text-yellow-300', border: 'border-purple-700/50' },
  Grizzlies: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-700/50' },
  Heat: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-orange-700/50' },
  Bucks: { bg: 'bg-emerald-950/90', text: 'text-emerald-300', border: 'border-emerald-700/50' },
  Timberwolves: { bg: 'bg-slate-900/90', text: 'text-cyan-300', border: 'border-cyan-700/50' },
  Pelicans: { bg: 'bg-blue-950/90', text: 'text-amber-300', border: 'border-blue-700/50' },
  Knicks: { bg: 'bg-orange-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  Thunder: { bg: 'bg-sky-950/80', text: 'text-orange-300', border: 'border-sky-700/50' },
  Magic: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-600/50' },
  '76ers': { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Suns: { bg: 'bg-purple-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  'Trail Blazers': { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  Kings: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-700/50' },
  Spurs: { bg: 'bg-slate-900/90', text: 'text-slate-200', border: 'border-slate-700/50' },
  Raptors: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-red-800/60' },
  Jazz: { bg: 'bg-violet-950/80', text: 'text-violet-300', border: 'border-violet-700/50' },
  Wizards: { bg: 'bg-blue-950/90', text: 'text-red-300', border: 'border-blue-700/50' },
};

export const PLAYER_COLORS: Record<string, string> = {
  Karthik: '#3b82f6',
  James: '#10b981',
  Diriye: '#f59e0b',
  Jack: '#ec4899',
  Jash: '#8b5cf6',
};

export const dailyData = [
  { date: 'Oct 22', Diriye: 0, Jack: 0, James: 0, Jash: 0, Karthik: 0, DiriyeRank: 3, JackRank: 3, JamesRank: 3, JashRank: 3, KarthikRank: 3, DiriyePct: 0.0, JackPct: 0.0, JamesPct: 0.0, JashPct: 0.0, KarthikPct: 0.0, DiriyePctRank: 3, JackPctRank: 3, JamesPctRank: 3, JashPctRank: 3, KarthikPctRank: 3 },
  { date: 'Nov 01', Diriye: 8, Jack: 7, James: 9, Jash: 6, Karthik: 10, DiriyeRank: 3, JackRank: 4, JamesRank: 2, JashRank: 5, KarthikRank: 1, DiriyePct: 0.533, JackPct: 0.467, JamesPct: 0.6, JashPct: 0.4, KarthikPct: 0.667, DiriyePctRank: 3, JackPctRank: 4, JamesPctRank: 2, JashPctRank: 5, KarthikPctRank: 1 },
  { date: 'Nov 15', Diriye: 18, Jack: 15, James: 19, Jash: 14, Karthik: 21, DiriyeRank: 3, JackRank: 4, JamesRank: 2, JashRank: 5, KarthikRank: 1, DiriyePct: 0.545, JackPct: 0.455, JamesPct: 0.576, JashPct: 0.424, KarthikPct: 0.636, DiriyePctRank: 3, JackPctRank: 4, JamesPctRank: 2, JashPctRank: 5, KarthikPctRank: 1 },
  { date: 'Dec 01', Diriye: 30, Jack: 28, James: 32, Jash: 25, Karthik: 34, DiriyeRank: 3, JackRank: 4, JamesRank: 2, JashRank: 5, KarthikRank: 1, DiriyePct: 0.556, JackPct: 0.519, JamesPct: 0.593, JashPct: 0.463, KarthikPct: 0.63, DiriyePctRank: 3, JackPctRank: 4, JamesPctRank: 2, JashPctRank: 5, KarthikPctRank: 1 },
  { date: 'Dec 15', Diriye: 42, Jack: 39, James: 45, Jash: 36, Karthik: 47, DiriyeRank: 3, JackRank: 4, JamesRank: 2, JashRank: 5, KarthikRank: 1, DiriyePct: 0.568, JackPct: 0.527, JamesPct: 0.608, JashPct: 0.486, KarthikPct: 0.635, DiriyePctRank: 3, JackPctRank: 4, JamesPctRank: 2, JashPctRank: 5, KarthikPctRank: 1 },
  { date: 'Jan 01', Diriye: 55, Jack: 50, James: 58, Jash: 48, Karthik: 61, DiriyeRank: 3, JackRank: 4, JamesRank: 2, JashRank: 5, KarthikRank: 1, DiriyePct: 0.579, JackPct: 0.526, JamesPct: 0.611, JashPct: 0.505, KarthikPct: 0.642, DiriyePctRank: 3, JackPctRank: 4, JamesPctRank: 2, JashPctRank: 5, KarthikPctRank: 1 },
];

export const standingsData = [
  { rank: 1, owner: 'Karthik', teams: [{ name: 'Celtics', wins: 15 }, { name: 'Thunder', wins: 14 }, { name: 'Knicks', wins: 11 }, { name: 'Kings', wins: 9 }, { name: 'Magic', wins: 8 }, { name: 'Bulls', wins: 4 }], totalWins: 61, winPct: 0.642, gp: 95, winsRank: 1, pctRank: 1 },
  { rank: 2, owner: 'James', teams: [{ name: 'Nuggets', wins: 13 }, { name: 'Bucks', wins: 12 }, { name: 'Lakers', wins: 11 }, { name: 'Pacers', wins: 9 }, { name: 'Heat', wins: 8 }, { name: 'Rockets', wins: 5 }], totalWins: 58, winPct: 0.611, gp: 95, winsRank: 2, pctRank: 2 },
  { rank: 3, owner: 'Diriye', teams: [{ name: 'Cavaliers', wins: 16 }, { name: 'Suns', wins: 10 }, { name: 'Mavericks', wins: 10 }, { name: 'Timberwolves', wins: 9 }, { name: 'Pelicans', wins: 6 }, { name: 'Spurs', wins: 4 }], totalWins: 55, winPct: 0.579, gp: 95, winsRank: 3, pctRank: 3 },
  { rank: 4, owner: 'Jack', teams: [{ name: '76ers', wins: 11 }, { name: 'Warriors', wins: 11 }, { name: 'Clippers', wins: 10 }, { name: 'Grizzlies', wins: 8 }, { name: 'Hawks', wins: 6 }, { name: 'Raptors', wins: 4 }], totalWins: 50, winPct: 0.526, gp: 95, winsRank: 4, pctRank: 4 },
  { rank: 5, owner: 'Jash', teams: [{ name: 'Pistons', wins: 11 }, { name: 'Nets', wins: 9 }, { name: 'Jazz', wins: 8 }, { name: 'Trail Blazers', wins: 7 }, { name: 'Hornets', wins: 7 }, { name: 'Wizards', wins: 6 }], totalWins: 48, winPct: 0.505, gp: 95, winsRank: 5, pctRank: 5 },
];