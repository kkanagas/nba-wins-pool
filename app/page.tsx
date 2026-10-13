'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Trophy, TrendingUp, Shield, ArrowUpDown, RefreshCw, History, Calendar, LayoutDashboard, Dices } from 'lucide-react';
import DraftLottery from '@/components/DraftLottery';

const OWNER_AVATARS: Record<string, string> = {
  Karthik: '/avatars/karthik.png',
  James: '/avatars/james.png',
  Diriye: '/avatars/diriye.png',
  Jack: '/avatars/jack.png',
  Jash: '/avatars/jash.png',
};

const PLAYER_COLORS: Record<string, string> = {
  Karthik: '#ef4444',
  James: '#3b82f6',
  Diriye: '#10b981',
  Jash: '#f97316',
  Jack: '#eab308',
};

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
  Magic: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-600/50' },
  Orlando: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-600/50' },
  '76ers': { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Philadelphia: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/50' },
  Suns: { bg: 'bg-purple-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  Phoenix: { bg: 'bg-purple-950/80', text: 'text-orange-300', border: 'border-orange-700/50' },
  'Trail Blazers': { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  Blazers: { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  Portland: { bg: 'bg-stone-900/90', text: 'text-red-400', border: 'border-red-800/60' },
  Kings: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-700/50' },
  Sacramento: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-700/50' },
  Spurs: { bg: 'bg-slate-900/90', text: 'text-slate-200', border: 'border-slate-700/50' },
  'San Antonio': { bg: 'bg-slate-900/90', text: 'text-slate-200', border: 'border-slate-700/50' },
  Raptors: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-red-800/60' },
  Toronto: { bg: 'bg-red-950/90', text: 'text-red-300', border: 'border-red-800/60' },
  Jazz: { bg: 'bg-violet-950/80', text: 'text-violet-300', border: 'border-violet-700/50' },
  Utah: { bg: 'bg-violet-950/80', text: 'text-violet-300', border: 'border-violet-700/50' },
  Wizards: { bg: 'bg-blue-950/90', text: 'text-red-300', border: 'border-blue-700/50' },
  Washington: { bg: 'bg-blue-950/90', text: 'text-red-300', border: 'border-blue-700/50' },
};

const BASE_ROSTERS = [
  { draftOrder: 1, owner: 'Karthik', teamNames: ['Celtics', 'Thunder', 'Knicks', 'Kings', 'Magic', 'Bulls'] },
  { draftOrder: 2, owner: 'James', teamNames: ['Nuggets', 'Bucks', 'Lakers', 'Pacers', 'Heat', 'Rockets'] },
  { draftOrder: 3, owner: 'Diriye', teamNames: ['Cavaliers', 'Suns', 'Mavericks', 'Timberwolves', 'Pelicans', 'Spurs'] },
  { draftOrder: 4, owner: 'Jack', teamNames: ['76ers', 'Warriors', 'Clippers', 'Grizzlies', 'Hawks', 'Raptors'] },
  { draftOrder: 5, owner: 'Jash', teamNames: ['Pistons', 'Nets', 'Jazz', 'Trail Blazers', 'Hornets', 'Wizards'] },
];

type TabType = 'live' | 'lottery' | 'leagueHistory' | 'draftHistory' | 'pastSeasons';
type SortField = 'draftOrder' | 'owner' | 'rd1' | 'rd2' | 'rd3' | 'rd4' | 'rd5' | 'rd6' | 'totalWins' | 'winPct' | 'winsRank' | 'pctRank';
type HistorySortField = 'owner' | 'points' | 'wins' | 'winPct' | 'rings';
type ChartType = 'wins' | 'winsRank' | 'winPct' | 'winPctRank';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [selectedChart, setSelectedChart] = useState<ChartType>('wins');
  const [sortField, setSortField] = useState<SortField>('draftOrder');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  
  const [historySortField, setHistorySortField] = useState<HistorySortField>('points');
  const [historySortAsc, setHistorySortAsc] = useState<boolean>(false);

  const [liveWins, setLiveWins] = useState<Record<string, number>>({});
  const [liveLosses, setLiveLosses] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [leagueHistoryData, setLeagueHistoryData] = useState<any>({});
  const [draftHistoryData, setDraftHistoryData] = useState<any[]>([]);
  const [pastSeasonsData, setPastSeasonsData] = useState<any>({});
  const [selectedSeason, setSelectedSeason] = useState<string>('2025-26');

  const recordDailySnapshot = async (currentWins: Record<string, number>, currentLosses: Record<string, number>) => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    try {
      const res = await fetch('/api/history');
      const existingHistory = await res.json();

      if (Array.isArray(existingHistory)) {
        const alreadyRecorded = existingHistory.some((entry: any) => entry.date === todayStr);
        if (alreadyRecorded) {
          setHistory(existingHistory);
          return;
        }
      }

      const snapshot: Record<string, any> = { date: todayStr };
      BASE_ROSTERS.forEach((roster) => {
        const ownerWins = roster.teamNames.reduce((acc, name) => acc + (currentWins[name] || 0), 0);
        const ownerLosses = roster.teamNames.reduce((acc, name) => acc + (currentLosses[name] || 0), 0);
        snapshot[roster.owner] = ownerWins;
        snapshot[`${roster.owner}_losses`] = ownerLosses;
      });

      const postRes = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot }),
      });
      const data = await postRes.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Failed to auto-record daily snapshot', err);
    }
  };

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fetch-scores');
      const data = await res.json();
      if (data.success && data.wins) {
        setLiveWins(data.wins);
        setLiveLosses(data.losses || {});
        setLastUpdated(new Date().toLocaleTimeString());
        await recordDailySnapshot(data.wins, data.losses || {});
      }
    } catch (err) {
      console.error('Failed to fetch live scores', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const res = await fetch('/api/league-history');
      const data = await res.json();
      if (data.success) {
        setLeagueHistoryData(data.leagueHistory || {});
        setDraftHistoryData(data.draftHistory || []);
        setPastSeasonsData(data.pastSeasons || {});
        if (data.pastSeasons && Object.keys(data.pastSeasons).length > 0) {
          setSelectedSeason(Object.keys(data.pastSeasons)[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch historical archives', err);
    }
  };

  useEffect(() => {
    fetchScores();
    fetchHistoricalData();
  }, []);

  const standingsData = BASE_ROSTERS.map((roster) => {
    const rounds = roster.teamNames.map((name) => {
      const wins = liveWins[name] !== undefined ? liveWins[name] : 0;
      const losses = liveLosses[name] !== undefined ? liveLosses[name] : 0;
      return { name, wins, losses };
    });

    const totalWins = rounds.reduce((acc, r) => acc + r.wins, 0);
    const totalLosses = rounds.reduce((acc, r) => acc + r.losses, 0);
    const totalGames = totalWins + totalLosses;
    const winPct = totalGames > 0 ? totalWins / totalGames : 0;

    return {
      draftOrder: roster.draftOrder,
      owner: roster.owner,
      rounds,
      totalWins,
      totalLosses,
      winPct,
      winsRank: 1,
      pctRank: 1,
    };
  });

  const sortedByWins = [...standingsData].sort((a, b) => b.totalWins - a.totalWins);
  sortedByWins.forEach((item, index) => { item.winsRank = index + 1; });

  const sortedByPct = [...standingsData].sort((a, b) => b.winPct - a.winPct);
  sortedByPct.forEach((item, index) => { item.pctRank = index + 1; });

  const finalSnapshotsByDate = history.reduce<Record<string, any>>((acc, entry) => {
    if (entry && entry.date) {
      acc[entry.date] = entry;
    }
    return acc;
  }, {});

  const deduplicatedHistory = Object.values(finalSnapshotsByDate);

  const historyWithRanks = deduplicatedHistory.map((entry) => {
    const entryCopy = { ...entry };
    const ownersList = BASE_ROSTERS.map((r) => r.owner);
    
    ownersList.forEach((owner) => {
      const wins = entry[owner] || 0;
      let losses = entry[`${owner}_losses`];

      if (losses === undefined) {
        const liveMatch = standingsData.find((s) => s.owner === owner);
        if (liveMatch && liveMatch.totalWins > 0) {
          const totalGamesInferred = Math.round(wins / liveMatch.winPct);
          losses = Math.max(0, totalGamesInferred - wins);
        } else {
          losses = 0;
        }
      }

      const totalGames = wins + losses;
      entryCopy[`${owner}_pct`] = totalGames > 0 ? wins / totalGames : 0;
    });

    const sortedByWinEntry = [...ownersList].sort((a, b) => (entry[b] || 0) - (entry[a] || 0));
    sortedByWinEntry.forEach((owner, idx) => {
      entryCopy[`${owner}_winsRank`] = idx + 1;
    });

    const sortedByPctEntry = [...ownersList].sort((a, b) => (entryCopy[`${b}_pct`] || 0) - (entryCopy[`${a}_pct`] || 0));
    sortedByPctEntry.forEach((owner, idx) => {
      entryCopy[`${owner}_pctRank`] = idx + 1;
    });

    return entryCopy;
  });

  const sortedStandings = [...standingsData].sort((a, b) => {
    let aVal: any = 0;
    let bVal: any = 0;

    if (sortField === 'draftOrder') { aVal = a.draftOrder; bVal = b.draftOrder; }
    else if (sortField === 'owner') { aVal = a.owner; bVal = b.owner; }
    else if (sortField === 'rd1') { aVal = a.rounds[0].wins; bVal = b.rounds[0].wins; }
    else if (sortField === 'rd2') { aVal = a.rounds[1].wins; bVal = b.rounds[1].wins; }
    else if (sortField === 'rd3') { aVal = a.rounds[2].wins; bVal = b.rounds[2].wins; }
    else if (sortField === 'rd4') { aVal = a.rounds[3].wins; bVal = b.rounds[3].wins; }
    else if (sortField === 'rd5') { aVal = a.rounds[4].wins; bVal = b.rounds[4].wins; }
    else if (sortField === 'rd6') { aVal = a.rounds[5].wins; bVal = b.rounds[5].wins; }
    else if (sortField === 'totalWins') { aVal = a.totalWins; bVal = b.totalWins; }
    else if (sortField === 'winPct') { aVal = a.winPct; bVal = b.winPct; }
    else if (sortField === 'winsRank') { aVal = a.winsRank; bVal = b.winsRank; }
    else if (sortField === 'pctRank') { aVal = a.pctRank; bVal = b.pctRank; }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleHistorySort = (field: HistorySortField) => {
    if (historySortField === field) {
      setHistorySortAsc(!historySortAsc);
    } else {
      setHistorySortField(field);
      setHistorySortAsc(false);
    }
  };

  const combinedAllTimeStats = (leagueHistoryData.allTimeStats || []).map((stat: any) => {
    const liveOwner = standingsData.find((s) => s.owner === stat.owner);
    const liveWinsCount = liveOwner ? liveOwner.totalWins : 0;
    const liveLossesCount = liveOwner ? liveOwner.totalLosses : 0;

    const historicalWins = stat.wins || 0;
    const historicalGames = Math.round(historicalWins / (parseFloat(stat.winPct) || 0.5));
    
    const combinedWins = historicalWins + liveWinsCount;
    const combinedGames = historicalGames + liveWinsCount + liveLossesCount;
    const combinedWinPct = combinedGames > 0 ? (combinedWins / combinedGames).toFixed(3) : stat.winPct;
    const formattedWinPct = combinedWinPct.startsWith('0') ? combinedWinPct.substring(1) : combinedWinPct;

    return {
      ...stat,
      wins: combinedWins,
      winPct: formattedWinPct,
      rawWinPct: parseFloat(combinedWinPct),
    };
  });

  const sortedAllTimeStats = [...combinedAllTimeStats].sort((a, b) => {
    let aVal: any = a[historySortField];
    let bVal: any = b[historySortField];

    if (historySortField === 'winPct') {
      aVal = a.rawWinPct;
      bVal = b.rawWinPct;
    }

    if (aVal < bVal) return historySortAsc ? -1 : 1;
    if (aVal > bVal) return historySortAsc ? 1 : -1;
    return 0;
  });

  const allTeamWins = standingsData.flatMap((s) => s.rounds.map((r) => r.wins));
  const minWins = Math.min(...allTeamWins);
  const maxWins = Math.max(...allTeamWins);

  const totalWinsArr = standingsData.map((s) => s.totalWins);
  const minTotalWins = Math.min(...totalWinsArr);
  const maxTotalWins = Math.max(...totalWinsArr);

  const winPctArr = standingsData.map((s) => s.winPct);
  const minWinPct = Math.min(...winPctArr);
  const maxWinPct = Math.max(...winPctArr);

  function formatWinPct(pct: number) {
    const formatted = pct.toFixed(3);
    return formatted.startsWith('0') ? formatted.substring(1) : formatted;
  }

  function getGradientStyle(value: number, min: number, max: number) {
    if (max === min) return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50 font-bold';
    const ratio = (value - min) / (max - min);
    if (ratio >= 0.75) return 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70 font-bold';
    if (ratio >= 0.5) return 'bg-lime-950/80 text-lime-300 border-lime-700/50 font-semibold';
    if (ratio >= 0.25) return 'bg-amber-950/80 text-amber-300 border-amber-700/50 font-medium';
    return 'bg-rose-950/90 text-rose-300 border-rose-800/70 font-semibold';
  }

  function getRankGradientStyle(rank: number) {
    switch (rank) {
      case 1: return 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70 font-bold';
      case 2: return 'bg-lime-950/80 text-lime-300 border-lime-700/50 font-semibold';
      case 3: return 'bg-amber-950/80 text-amber-300 border-amber-700/50 font-medium';
      case 4: return 'bg-orange-950/80 text-orange-300 border-orange-800/70 font-medium';
      case 5: default: return 'bg-rose-950/90 text-rose-300 border-rose-800/70 font-semibold';
    }
  }

  const getChartDataKey = (owner: string) => {
    switch (selectedChart) {
      case 'winsRank': return `${owner}_winsRank`;
      case 'winPct': return `${owner}_pct`;
      case 'winPctRank': return `${owner}_pctRank`;
      case 'wins':
      default:
        return owner;
    }
  };

  const currentPastSeasonData = pastSeasonsData[selectedSeason] || [];
  const pastSeasonTeamWins = currentPastSeasonData.flatMap((r: any) => (r.teams || []).map((t: any) => t.wins));
  const minPastWins = pastSeasonTeamWins.length > 0 ? Math.min(...pastSeasonTeamWins) : 0;
  const maxPastWins = pastSeasonTeamWins.length > 0 ? Math.max(...pastSeasonTeamWins) : 60;

  const pastSeasonTotals = currentPastSeasonData.map((r: any) => r.totalWins);
  const minPastTotalWins = pastSeasonTotals.length > 0 ? Math.min(...pastSeasonTotals) : 100;
  const maxPastTotalWins = pastSeasonTotals.length > 0 ? Math.max(...pastSeasonTotals) : 300;

  // Extract all unique seasons from draftHistoryData for the column headers
  const allDraftSeasons = draftHistoryData.length > 0 && draftHistoryData[0].seasons
    ? Object.keys(draftHistoryData[0].seasons)
    : ['2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-[98rem] mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-400 h-8 w-8" /> NBA Chat Wins Pool
          </h1>
          <p className="text-slate-400 mt-1">Live Dashboard & Historical Archives</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchScores} 
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 transition-all"
          >
            <RefreshCw className={`h-4 w-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Live Wins'}
          </button>
          {lastUpdated && (
            <span className="text-xs text-slate-500 font-mono">Updated: {lastUpdated}</span>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'live' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" /> 2026-27 Live Dashboard
        </button>
        <button
          onClick={() => setActiveTab('lottery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'lottery' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Dices className="h-4 w-4" /> Draft Lottery
        </button>
        <button
          onClick={() => setActiveTab('leagueHistory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'leagueHistory' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Trophy className="h-4 w-4" /> League History
        </button>
        <button
          onClick={() => setActiveTab('draftHistory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'draftHistory' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <History className="h-4 w-4" /> Draft History
        </button>
        <button
          onClick={() => setActiveTab('pastSeasons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'pastSeasons' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" /> Past Seasons
        </button>
      </div>

      {/* TAB 1: LIVE DASHBOARD */}
      {activeTab === 'live' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="text-blue-400 h-5 w-5" /> Current League Standings & Draft Board
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm select-none">
                    <th onClick={() => handleSort('draftOrder')} className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-200">
                      <div className="flex items-center gap-1">Draft <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleSort('owner')} className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-200">
                      <div className="flex items-center gap-1">Owner <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    {['Rd 1', 'Rd 2', 'Rd 3', 'Rd 4', 'Rd 5', 'Rd 6'].map((rd, i) => (
                      <th key={rd} onClick={() => handleSort(`rd${i + 1}` as SortField)} className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-slate-200">
                        <div className="flex items-center justify-center gap-1">{rd} <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                      </th>
                    ))}
                    <th onClick={() => handleSort('totalWins')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Total Wins <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleSort('winPct')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Win % <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleSort('winsRank')} className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Wins Rank <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleSort('pctRank')} className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Win % Rank <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {sortedStandings.map((row) => {
                    const totalWinsStyle = getGradientStyle(row.totalWins, minTotalWins, maxTotalWins);
                    const winPctStyle = getGradientStyle(row.winPct, minWinPct, maxWinPct);
                    const winsRankStyle = getRankGradientStyle(row.winsRank);
                    const pctRankStyle = getRankGradientStyle(row.pctRank);

                    return (
                      <tr key={row.owner} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-3 font-mono text-slate-400 text-center">#{row.draftOrder}</td>
                        <td className="py-4 px-4 font-semibold text-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0 shadow-sm relative">
                              <img 
                                src={OWNER_AVATARS[row.owner]} 
                                alt="" 
                                className="w-full h-full object-cover relative z-10"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            </div>
                            <span>{row.owner}</span>
                          </div>
                        </td>
                        {row.rounds.map((team, idx) => {
                          const style = TEAM_COLORS[team.name] || { bg: 'bg-slate-800', text: 'text-slate-200', border: 'border-slate-700' };
                          const teamWinStyle = getGradientStyle(team.wins, minWins, maxWins);
                          return (
                            <td key={idx} className="py-4 px-2 text-center">
                              <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/60 border border-slate-800/80 shadow-sm">
                                <span className={`px-2 py-0.5 rounded-md border font-medium text-xs ${style.bg} ${style.text} ${style.border}`}>
                                  {team.name}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md border font-mono text-xs ${teamWinStyle}`}>
                                  {team.wins}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-md border text-sm shadow-sm ${totalWinsStyle}`}>
                            {row.totalWins}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-mono">
                          <span className={`inline-block px-3 py-1 rounded-md border text-sm shadow-sm ${winPctStyle}`}>
                            {formatWinPct(row.winPct)}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md border text-xs shadow-sm ${winsRankStyle}`}>
                            #{row.winsRank}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md border text-xs shadow-sm ${pctRankStyle}`}>
                            #{row.pctRank}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive Chart Section with Dropdown Selection */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="text-emerald-400 h-5 w-5" /> Progression Tracker
              </h2>
              <div className="flex items-center gap-3">
                <label htmlFor="chart-select" className="text-sm font-medium text-slate-400">
                  Select Metric:
                </label>
                <select
                  id="chart-select"
                  value={selectedChart}
                  onChange={(e) => setSelectedChart(e.target.value as ChartType)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="wins">Wins by Date</option>
                  <option value="winsRank">Win Rank by Date</option>
                  <option value="winPct">Winning Percentage by Date</option>
                  <option value="winPctRank">Winning Percentage Rank by Date</option>
                </select>
              </div>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyWithRanks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94a3b8" allowDuplicatedCategory={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    reversed={selectedChart === 'winsRank' || selectedChart === 'winPctRank'}
                    domain={selectedChart === 'winsRank' || selectedChart === 'winPctRank' ? [1, 5] : selectedChart === 'winPct' ? [0, 1] : ['auto', 'auto']}
                    ticks={selectedChart === 'winsRank' || selectedChart === 'winPctRank' ? [1, 2, 3, 4, 5] : undefined}
                    tickFormatter={selectedChart === 'winPct' ? (v) => `${(v * 100).toFixed(0)}%` : undefined}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                    formatter={(val: any, name: any) => {
                      const cleanName = String(name).split('_')[0];
                      if (selectedChart === 'winPct') return [`${(Number(val) * 100).toFixed(1)}%`, cleanName];
                      if (selectedChart === 'winsRank' || selectedChart === 'winPctRank') return [`#${val}`, cleanName];
                      return [val, cleanName];
                    }}
                  />
                  <Legend formatter={(value) => String(value).split('_')[0]} />
                  {BASE_ROSTERS.map((roster) => (
                    <Line
                      key={roster.owner}
                      type="monotone"
                      name={roster.owner}
                      dataKey={getChartDataKey(roster.owner)}
                      stroke={PLAYER_COLORS[roster.owner]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: DRAFT LOTTERY SIMULATOR */}
      {activeTab === 'lottery' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <DraftLottery
              onLotteryComplete={(results) => {
                console.log('Lottery finished with results:', results);
              }}
            />
          </section>
        </div>
      )}

      {/* TAB 3: LEAGUE HISTORY */}
      {activeTab === 'leagueHistory' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Trophy className="text-amber-400 h-5 w-5" /> All-Time Owner Leaderboard (Includes 2026-27 Live Wins)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm select-none">
                    <th onClick={() => handleHistorySort('owner')} className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-200">
                      <div className="flex items-center gap-1">Owner <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleHistorySort('points')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Points (5-1) <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleHistorySort('wins')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Total Wins <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleHistorySort('winPct')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Win % <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handleHistorySort('rings')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Championship Rings <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {sortedAllTimeStats.map((row: any) => (
                    <tr key={row.owner} className="hover:bg-slate-800/30">
                      <td className="py-4 px-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0 shadow-sm relative">
                            <img src={OWNER_AVATARS[row.owner]} alt="" className="w-full h-full object-cover relative z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                          <span>{row.owner}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-amber-400">{row.points}</td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-blue-400">{row.wins}</td>
                      <td className="py-4 px-4 text-center font-mono">{row.winPct}</td>
                      <td className="py-4 px-4 text-center font-bold text-emerald-400">
                        {'🏆'.repeat(row.rings || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Calendar className="text-blue-400 h-5 w-5" /> Year-By-Year League Finishes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="py-3 px-4 font-semibold">Season</th>
                    <th className="py-3 px-4 font-semibold text-center text-amber-300">1st Place 🏆</th>
                    <th className="py-3 px-4 font-semibold text-center text-slate-300">2nd Place 🥈</th>
                    <th className="py-3 px-4 font-semibold text-center text-amber-600">3rd Place 🥉</th>
                    <th className="py-3 px-4 font-semibold text-center text-slate-400">4th Place</th>
                    <th className="py-3 px-4 font-semibold text-center text-slate-500">5th Place</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {(leagueHistoryData.yearlyFinishes || []).map((row: any) => (
                    <tr key={row.season} className="hover:bg-slate-800/30">
                      <td className="py-4 px-4 font-bold text-slate-200">{row.season}</td>
                      <td className="py-4 px-4 text-center font-semibold text-amber-300">{row.first}</td>
                      <td className="py-4 px-4 text-center font-semibold text-slate-300">{row.second}</td>
                      <td className="py-4 px-4 text-center font-semibold text-amber-600">{row.third}</td>
                      <td className="py-4 px-4 text-center text-slate-400">{row.fourth}</td>
                      <td className="py-4 px-4 text-center text-slate-500">{row.fifth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: DRAFT HISTORY */}
      {activeTab === 'draftHistory' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <History className="text-blue-400 h-5 w-5" /> Season-by-Season Team Draft Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="py-3 px-4 font-semibold">NBA Team</th>
                    {allDraftSeasons.map((season) => (
                      <th key={season} className="py-3 px-4 font-semibold text-center">{season}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {(draftHistoryData || []).map((row: any) => {
                    const style = TEAM_COLORS[row.team] || { bg: 'bg-slate-800', text: 'text-slate-200', border: 'border-slate-700' };
                    return (
                      <tr key={row.team} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-semibold text-slate-200">
                          <span className={`px-2.5 py-1 rounded-md border font-medium text-xs ${style.bg} ${style.text} ${style.border}`}>
                            {row.team}
                          </span>
                        </td>
                        {allDraftSeasons.map((season) => {
                          const owner = row.seasons ? row.seasons[season] : null;
                          return (
                            <td key={season} className="py-3 px-4 text-center font-medium text-slate-300">
                              {owner ? (
                                <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
                                  {owner}
                                </span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 5: PAST SEASONS ARCHIVE */}
      {activeTab === 'pastSeasons' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-400 h-5 w-5" /> Historical Season Archive
              </h2>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-400">Select Season:</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {Object.keys(pastSeasonsData).map((season) => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="py-3 px-3 font-semibold">Finish</th>
                    <th className="py-3 px-4 font-semibold">Owner</th>
                    {['Rd 1', 'Rd 2', 'Rd 3', 'Rd 4', 'Rd 5', 'Rd 6'].map((rd) => (
                      <th key={rd} className="py-3 px-3 font-semibold text-center">{rd}</th>
                    ))}
                    <th className="py-3 px-4 font-semibold text-center">Total Wins</th>
                    <th className="py-3 px-4 font-semibold text-center">Win %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {(currentPastSeasonData || []).map((row: any, idx: number) => {
                    const totalWinsStyle = getGradientStyle(row.totalWins, minPastTotalWins, maxPastTotalWins);
                    const rankStyle = getRankGradientStyle(idx + 1);

                    return (
                      <tr key={row.owner} className="hover:bg-slate-800/30">
                        <td className="py-4 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md border text-xs shadow-sm ${rankStyle}`}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0 shadow-sm relative">
                              <img src={OWNER_AVATARS[row.owner]} alt="" className="w-full h-full object-cover relative z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                            <span>{row.owner}</span>
                          </div>
                        </td>
                        {(row.teams || []).map((team: any, tIdx: number) => {
                          const style = TEAM_COLORS[team.name] || { bg: 'bg-slate-800', text: 'text-slate-200', border: 'border-slate-700' };
                          const teamWinStyle = getGradientStyle(team.wins, minPastWins, maxPastWins);
                          return (
                            <td key={tIdx} className="py-4 px-2 text-center">
                              <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/60 border border-slate-800/80 shadow-sm">
                                <span className={`px-2 py-0.5 rounded-md border font-medium text-xs ${style.bg} ${style.text} ${style.border}`}>
                                  {team.name}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md border font-mono text-xs ${teamWinStyle}`}>
                                  {team.wins}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-md border text-sm shadow-sm ${totalWinsStyle}`}>
                            {row.totalWins}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-mono">
                          <span className="text-slate-300 font-semibold">
                            {row.winPct}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}