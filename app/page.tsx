'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Trophy, TrendingUp, Shield, ArrowUpDown, RefreshCw, History, Calendar, LayoutDashboard, Dices } from 'lucide-react';
import DraftLottery from '@/components/DraftLottery';
import CanadiansTab from '@/components/CanadiansTab';

const OWNER_AVATARS: Record<string, string> = {
  Karthik: '/Avatars/Karthik.png',
  James: '/Avatars/James.png',
  Diriye: '/Avatars/Diriye.png',
  Jack: '/Avatars/Jack.png',
  Jash: '/Avatars/Jash.png',
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

// Team name mapping helper to translate between location names and nicknames
const TEAM_NAME_MAP: Record<string, string[]> = {
  'Detroit': ['Detroit', 'Pistons', 'Detroit Pistons'],
  'Toronto': ['Toronto', 'Raptors', 'Toronto Raptors'],
  'Indiana': ['Indiana', 'Pacers', 'Indiana Pacers'],
  'Orlando': ['Orlando', 'Magic', 'Orlando Magic'],
  'Memphis': ['Memphis', 'Grizzlies', 'Memphis Grizzlies'],
  'LA Clippers': ['LA Clippers', 'Clippers', 'Los Angeles Clippers'],
  'Oklahoma City': ['Oklahoma City', 'Thunder', 'Oklahoma City Thunder'],
  'LA Lakers': ['LA Lakers', 'Lakers', 'Los Angeles Lakers'],
  'Denver': ['Denver', 'Nuggets', 'Denver Nuggets'],
  'Dallas': ['Dallas', 'Mavericks', 'Dallas Mavericks'],
  'Golden State': ['Golden State', 'Warriors', 'Golden State Warriors'],
  'Sacramento': ['Sacramento', 'Kings', 'Sacramento Kings'],
  'San Antonio': ['San Antonio', 'Spurs', 'San Antonio Spurs'],
  'Boston': ['Boston', 'Celtics', 'Boston Celtics'],
  'Cleveland': ['Cleveland', 'Cavaliers', 'Cleveland Cavaliers'],
  'Utah': ['Utah', 'Jazz', 'Utah Jazz'],
  'Washington': ['Washington', 'Wizards', 'Washington Wizards'],
  'Brooklyn': ['Brooklyn', 'Nets', 'Brooklyn Nets'],
  'New York': ['New York', 'Knicks', 'New York Knicks'],
  'Houston': ['Houston', 'Rockets', 'Houston Rockets'],
  'Miami': ['Miami', 'Heat', 'Miami Heat'],
  'Atlanta': ['Atlanta', 'Hawks', 'Atlanta Hawks'],
  'Charlotte': ['Charlotte', 'Hornets', 'Charlotte Hornets'],
  'Milwaukee': ['Milwaukee', 'Bucks', 'Milwaukee Bucks'],
  'Philadelphia': ['Philadelphia', '76ers', 'Philadelphia 76ers'],
  'Minnesota': ['Minnesota', 'Timberwolves', 'Minnesota Timberwolves'],
  'Portland': ['Portland', 'Trail Blazers', 'Blazers', 'Portland Trail Blazers'],
  'Phoenix': ['Phoenix', 'Suns', 'Phoenix Suns'],
  'New Orleans': ['New Orleans', 'Pelicans', 'New Orleans Pelicans'],
  'Chicago': ['Chicago', 'Bulls', 'Chicago Bulls'],
};

const DEFAULT_ROSTERS = [
  { draftOrder: 1, owner: 'Diriye', teamNames: ['Oklahoma City', 'LA Lakers', 'Denver', 'Dallas', 'Golden State', 'Sacramento'] },
  { draftOrder: 2, owner: 'Jack', teamNames: ['San Antonio', 'Boston', 'Cleveland', 'Utah', 'Washington', 'Brooklyn'] },
  { draftOrder: 3, owner: 'James', teamNames: ['New York', 'Houston', 'Miami', 'Atlanta', 'Charlotte', 'Milwaukee'] },
  { draftOrder: 4, owner: 'Jash', teamNames: ['Philadelphia', 'Minnesota', 'Portland', 'Phoenix', 'New Orleans', 'Chicago'] },
  { draftOrder: 5, owner: 'Karthik', teamNames: ['Detroit', 'Toronto', 'Indiana', 'Orlando', 'Memphis', 'LA Clippers'] },
];

type TabType = 'live' | 'leagueHistory' | 'draftHistory' | 'pastSeasons' | 'lottery' | 'canadians';
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

  const [draftSortField, setDraftSortField] = useState<string>('team');
  const [draftSortAsc, setDraftSortAsc] = useState<boolean>(true);

  const [seasonMatrixSortField, setSeasonMatrixSortField] = useState<string>('team');
  const [seasonMatrixSortAsc, setSeasonMatrixSortAsc] = useState<boolean>(true);

  const [pastSortField, setPastSortField] = useState<string>('finish');
  const [pastSortAsc, setPastSortAsc] = useState<boolean>(true);

  const [liveWins, setLiveWins] = useState<Record<string, number>>({});
  const [liveLosses, setLiveLosses] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [leagueHistoryData, setLeagueHistoryData] = useState<any>({});
  const [draftHistoryData, setDraftHistoryData] = useState<any[]>([]);

  const [currentRosters, setCurrentRosters] = useState(DEFAULT_ROSTERS);

  const [lotteryState, setLotteryState] = useState<{
    drumPool: any[];
    stage: 'idle' | 'drawing' | 'selecting' | 'complete';
    drawnQueue: any[];
    currentPickerIndex: number;
    availableSlots: number[];
    slotAssignments: { [ownerId: string]: number };
    lastDrawnOwner: any | null;
    isLocked: boolean;
  }>({
    drumPool: [],
    stage: 'idle',
    drawnQueue: [],
    currentPickerIndex: 0,
    availableSlots: [1, 2, 3, 4, 5],
    slotAssignments: {},
    lastDrawnOwner: null,
    isLocked: false,
  });

  const [pastSeasonsData, setPastSeasonsData] = useState<any>({
    "2026-27": [
      { "draftOrder": 1, "owner": "Diriye", "teams": [{ "name": "Oklahoma City", "wins": 0 }, { "name": "LA Lakers", "wins": 0 }, { "name": "Denver", "wins": 0 }, { "name": "Dallas", "wins": 0 }, { "name": "Golden State", "wins": 0 }, { "name": "Sacramento", "wins": 0 }], "totalWins": 0, "winPct": ".000" },
      { "draftOrder": 2, "owner": "Jack", "teams": [{ "name": "San Antonio", "wins": 0 }, { "name": "Boston", "wins": 0 }, { "name": "Cleveland", "wins": 0 }, { "name": "Utah", "wins": 0 }, { "name": "Washington", "wins": 0 }, { "name": "Brooklyn", "wins": 0 }], "totalWins": 0, "winPct": ".000" },
      { "draftOrder": 3, "owner": "James", "teams": [{ "name": "New York", "wins": 0 }, { "name": "Houston", "wins": 0 }, { "name": "Miami", "wins": 0 }, { "name": "Atlanta", "wins": 0 }, { "name": "Charlotte", "wins": 0 }, { "name": "Milwaukee", "wins": 0 }], "totalWins": 0, "winPct": ".000" },
      { "draftOrder": 4, "owner": "Jash", "teams": [{ "name": "Philadelphia", "wins": 0 }, { "name": "Minnesota", "wins": 0 }, { "name": "Portland", "wins": 0 }, { "name": "Phoenix", "wins": 0 }, { "name": "New Orleans", "wins": 0 }, { "name": "Chicago", "wins": 0 }], "totalWins": 0, "winPct": ".000" },
      { "draftOrder": 5, "owner": "Karthik", "teams": [{ "name": "Detroit", "wins": 0 }, { "name": "Toronto", "wins": 0 }, { "name": "Indiana", "wins": 0 }, { "name": "Orlando", "wins": 0 }, { "name": "Memphis", "wins": 0 }, { "name": "LA Clippers", "wins": 0 }], "totalWins": 0, "winPct": ".000" }
    ],
    "2025-26": [
      { "draftOrder": 1, "owner": "Jack", "teams": [{ "name": "Oklahoma City", "wins": 64 }, { "name": "Detroit", "wins": 60 }, { "name": "Golden State", "wins": 37 }, { "name": "Chicago", "wins": 31 }, { "name": "Portland", "wins": 42 }, { "name": "Washington", "wins": 17 }], "totalWins": 251, "winPct": ".510" },
      { "draftOrder": 2, "owner": "Jash", "teams": [{ "name": "Cleveland", "wins": 52 }, { "name": "LA Clippers", "wins": 42 }, { "name": "LA Lakers", "wins": 53 }, { "name": "Philadelphia", "wins": 45 }, { "name": "Boston", "wins": 56 }, { "name": "Utah", "wins": 22 }], "totalWins": 270, "winPct": ".549" },
      { "draftOrder": 3, "owner": "Diriye", "teams": [{ "name": "Denver", "wins": 54 }, { "name": "Atlanta", "wins": 46 }, { "name": "Milwaukee", "wins": 32 }, { "name": "New Orleans", "wins": 26 }, { "name": "Charlotte", "wins": 44 }, { "name": "Brooklyn", "wins": 20 }], "totalWins": 222, "winPct": ".451" },
      { "draftOrder": 4, "owner": "James", "teams": [{ "name": "New York", "wins": 53 }, { "name": "Orlando", "wins": 45 }, { "name": "San Antonio", "wins": 62 }, { "name": "Toronto", "wins": 46 }, { "name": "Miami", "wins": 43 }, { "name": "Phoenix", "wins": 45 }], "totalWins": 294, "winPct": ".598" },
      { "draftOrder": 5, "owner": "Karthik", "teams": [{ "name": "Houston", "wins": 52 }, { "name": "Minnesota", "wins": 49 }, { "name": "Dallas", "wins": 26 }, { "name": "Memphis", "wins": 25 }, { "name": "Indiana", "wins": 19 }, { "name": "Sacramento", "wins": 22 }], "totalWins": 193, "winPct": ".392" }
    ],
    "2024-25": [
      { "draftOrder": 1, "owner": "James", "teams": [{ "name": "Boston", "wins": 61 }, { "name": "Phoenix", "wins": 36 }, { "name": "New Orleans", "wins": 21 }, { "name": "San Antonio", "wins": 34 }, { "name": "LA Clippers", "wins": 50 }, { "name": "Washington", "wins": 18 }], "totalWins": 220, "winPct": ".447" },
      { "draftOrder": 2, "owner": "Karthik", "teams": [{ "name": "Oklahoma City", "wins": 68 }, { "name": "Milwaukee", "wins": 48 }, { "name": "Cleveland", "wins": 64 }, { "name": "Miami", "wins": 37 }, { "name": "Atlanta", "wins": 40 }, { "name": "Portland", "wins": 36 }], "totalWins": 293, "winPct": ".596" },
      { "draftOrder": 3, "owner": "Jack", "teams": [{ "name": "Minnesota", "wins": 49 }, { "name": "Memphis", "wins": 48 }, { "name": "Orlando", "wins": 41 }, { "name": "Houston", "wins": 52 }, { "name": "Detroit", "wins": 44 }, { "name": "Utah", "wins": 17 }], "totalWins": 251, "winPct": ".510" },
      { "draftOrder": 4, "owner": "Diriye", "teams": [{ "name": "New York", "wins": 51 }, { "name": "Philadelphia", "wins": 24 }, { "name": "Indiana", "wins": 50 }, { "name": "Golden State", "wins": 48 }, { "name": "Toronto", "wins": 30 }, { "name": "Brooklyn", "wins": 26 }], "totalWins": 229, "winPct": ".465" },
      { "draftOrder": 5, "owner": "Jash", "teams": [{ "name": "Dallas", "wins": 39 }, { "name": "Denver", "wins": 50 }, { "name": "Sacramento", "wins": 40 }, { "name": "LA Lakers", "wins": 50 }, { "name": "Chicago", "wins": 39 }, { "name": "Charlotte", "wins": 19 }], "totalWins": 237, "winPct": ".482" }
    ],
    "2023-24": [
      { "draftOrder": 1, "owner": "Jack", "teams": [{ "name": "Milwaukee", "wins": 49 }, { "name": "New York", "wins": 50 }, { "name": "Minnesota", "wins": 56 }, { "name": "Charlotte", "wins": 21 }, { "name": "Houston", "wins": 41 }, { "name": "Washington", "wins": 15 }], "totalWins": 232, "winPct": ".472" },
      { "draftOrder": 2, "owner": "Jash", "teams": [{ "name": "Denver", "wins": 57 }, { "name": "Golden State", "wins": 46 }, { "name": "Dallas", "wins": 50 }, { "name": "Oklahoma City", "wins": 57 }, { "name": "Atlanta", "wins": 36 }, { "name": "Detroit", "wins": 14 }], "totalWins": 260, "winPct": ".528" },
      { "draftOrder": 3, "owner": "Diriye", "teams": [{ "name": "Phoenix", "wins": 49 }, { "name": "LA Lakers", "wins": 47 }, { "name": "New Orleans", "wins": 49 }, { "name": "Indiana", "wins": 47 }, { "name": "Orlando", "wins": 47 }, { "name": "San Antonio", "wins": 22 }], "totalWins": 261, "winPct": ".530" },
      { "draftOrder": 4, "owner": "James", "teams": [{ "name": "Boston", "wins": 64 }, { "name": "Memphis", "wins": 27 }, { "name": "Sacramento", "wins": 46 }, { "name": "LA Clippers", "wins": 51 }, { "name": "Chicago", "wins": 39 }, { "name": "Portland", "wins": 21 }], "totalWins": 248, "winPct": ".504" },
      { "draftOrder": 5, "owner": "Karthik", "teams": [{ "name": "Cleveland", "wins": 48 }, { "name": "Philadelphia", "wins": 47 }, { "name": "Toronto", "wins": 25 }, { "name": "Miami", "wins": 46 }, { "name": "Brooklyn", "wins": 32 }, { "name": "Utah", "wins": 31 }], "totalWins": 229, "winPct": ".465" }
    ],
    "2022-23": [
      { "draftOrder": 1, "owner": "James", "teams": [{ "name": "Denver", "wins": 53 }, { "name": "Dallas", "wins": 38 }, { "name": "Toronto", "wins": 41 }, { "name": "Charlotte", "wins": 27 }, { "name": "New York", "wins": 47 }, { "name": "Oklahoma City", "wins": 40 }], "totalWins": 246, "winPct": ".500" },
      { "draftOrder": 2, "owner": "Jack", "teams": [{ "name": "Milwaukee", "wins": 58 }, { "name": "Miami", "wins": 44 }, { "name": "Cleveland", "wins": 51 }, { "name": "Portland", "wins": 33 }, { "name": "Sacramento", "wins": 48 }, { "name": "San Antonio", "wins": 22 }], "totalWins": 256, "winPct": ".520" },
      { "draftOrder": 3, "owner": "Diriye", "teams": [{ "name": "Philadelphia", "wins": 54 }, { "name": "Memphis", "wins": 51 }, { "name": "Phoenix", "wins": 45 }, { "name": "LA Lakers", "wins": 43 }, { "name": "Washington", "wins": 35 }, { "name": "Houston", "wins": 22 }], "totalWins": 250, "winPct": ".508" },
      { "draftOrder": 4, "owner": "Jash", "teams": [{ "name": "Golden State", "wins": 44 }, { "name": "New Orleans", "wins": 42 }, { "name": "Brooklyn", "wins": 45 }, { "name": "Chicago", "wins": 40 }, { "name": "Orlando", "wins": 34 }, { "name": "Indiana", "wins": 35 }], "totalWins": 240, "winPct": ".488" },
      { "draftOrder": 5, "owner": "Karthik", "teams": [{ "name": "LA Clippers", "wins": 44 }, { "name": "Boston", "wins": 57 }, { "name": "Minnesota", "wins": 42 }, { "name": "Atlanta", "wins": 41 }, { "name": "Detroit", "wins": 17 }, { "name": "Utah", "wins": 37 }], "totalWins": 238, "winPct": ".484" }
    ],
    "2021-22": [
      { "draftOrder": 1, "owner": "James", "teams": [{ "name": "Milwaukee", "wins": 51 }, { "name": "Miami", "wins": 53 }, { "name": "Boston", "wins": 51 }, { "name": "Indiana", "wins": 25 }, { "name": "New York", "wins": 37 }, { "name": "Oklahoma City", "wins": 24 }], "totalWins": 241, "winPct": ".490" },
      { "draftOrder": 2, "owner": "Karthik", "teams": [{ "name": "Brooklyn", "wins": 44 }, { "name": "Denver", "wins": 48 }, { "name": "Portland", "wins": 27 }, { "name": "New Orleans", "wins": 36 }, { "name": "Minnesota", "wins": 46 }, { "name": "Houston", "wins": 20 }], "totalWins": 221, "winPct": ".449" },
      { "draftOrder": 3, "owner": "Jash", "teams": [{ "name": "Phoenix", "wins": 64 }, { "name": "Dallas", "wins": 52 }, { "name": "Golden State", "wins": 53 }, { "name": "Memphis", "wins": 56 }, { "name": "Washington", "wins": 35 }, { "name": "Orlando", "wins": 22 }], "totalWins": 282, "winPct": ".573" },
      { "draftOrder": 4, "owner": "Diriye", "teams": [{ "name": "Utah", "wins": 49 }, { "name": "Atlanta", "wins": 43 }, { "name": "LA Clippers", "wins": 42 }, { "name": "Toronto", "wins": 48 }, { "name": "Sacramento", "wins": 30 }, { "name": "Cleveland", "wins": 44 }], "totalWins": 256, "winPct": ".520" },
      { "draftOrder": 5, "owner": "Jack", "teams": [{ "name": "Philadelphia", "wins": 51 }, { "name": "LA Lakers", "wins": 33 }, { "name": "Chicago", "wins": 46 }, { "name": "Charlotte", "wins": 43 }, { "name": "San Antonio", "wins": 34 }, { "name": "Detroit", "wins": 23 }], "totalWins": 230, "winPct": ".467" }
    ],
    "2020-21": [
      { "draftOrder": 1, "owner": "Jash", "teams": [{ "name": "LA Lakers", "wins": 42 }, { "name": "Utah", "wins": 52 }, { "name": "Brooklyn", "wins": 48 }, { "name": "Atlanta", "wins": 41 }, { "name": "San Antonio", "wins": 33 }, { "name": "Cleveland", "wins": 22 }], "totalWins": 238, "winPct": ".551" },
      { "draftOrder": 2, "owner": "Jack", "teams": [{ "name": "Milwaukee", "wins": 46 }, { "name": "Boston", "wins": 36 }, { "name": "Portland", "wins": 42 }, { "name": "Memphis", "wins": 38 }, { "name": "Washington", "wins": 34 }, { "name": "New York", "wins": 41 }], "totalWins": 237, "winPct": ".549" },
      { "draftOrder": 3, "owner": "Diriye", "teams": [{ "name": "Denver", "wins": 47 }, { "name": "Philadelphia", "wins": 49 }, { "name": "Phoenix", "wins": 51 }, { "name": "Minnesota", "wins": 23 }, { "name": "Charlotte", "wins": 33 }, { "name": "Detroit", "wins": 20 }], "totalWins": 223, "winPct": ".516" },
      { "draftOrder": 4, "owner": "Karthik", "teams": [{ "name": "LA Clippers", "wins": 47 }, { "name": "Dallas", "wins": 42 }, { "name": "Houston", "wins": 17 }, { "name": "New Orleans", "wins": 31 }, { "name": "Orlando", "wins": 21 }, { "name": "Oklahoma City", "wins": 22 }], "totalWins": 180, "winPct": ".417" },
      { "draftOrder": 5, "owner": "James", "teams": [{ "name": "Toronto", "wins": 27 }, { "name": "Miami", "wins": 40 }, { "name": "Indiana", "wins": 34 }, { "name": "Golden State", "wins": 39 }, { "name": "Sacramento", "wins": 31 }, { "name": "Chicago", "wins": 31 }], "totalWins": 202, "winPct": ".468" }
    ],
    "2019-20": [
      { "draftOrder": 1, "owner": "Diriye", "teams": [{ "name": "Milwaukee", "wins": 56 }, { "name": "Portland", "wins": 35 }, { "name": "Orlando", "wins": 33 }, { "name": "Sacramento", "wins": 31 }, { "name": "Atlanta", "wins": 20 }, { "name": "Charlotte", "wins": 23 }], "totalWins": 198, "winPct": ".467" },
      { "draftOrder": 2, "owner": "Jash", "teams": [{ "name": "Houston", "wins": 44 }, { "name": "Golden State", "wins": 15 }, { "name": "Boston", "wins": 48 }, { "name": "Indiana", "wins": 45 }, { "name": "Detroit", "wins": 20 }, { "name": "New York", "wins": 21 }], "totalWins": 193, "winPct": ".466" },
      { "draftOrder": 3, "owner": "James", "teams": [{ "name": "LA Clippers", "wins": 49 }, { "name": "Toronto", "wins": 53 }, { "name": "Dallas", "wins": 43 }, { "name": "Oklahoma City", "wins": 44 }, { "name": "Minnesota", "wins": 19 }, { "name": "Cleveland", "wins": 19 }], "totalWins": 227, "winPct": ".540" },
      { "draftOrder": 4, "owner": "Jack", "teams": [{ "name": "Philadelphia", "wins": 43 }, { "name": "Utah", "wins": 44 }, { "name": "Brooklyn", "wins": 35 }, { "name": "San Antonio", "wins": 32 }, { "name": "Chicago", "wins": 22 }, { "name": "Memphis", "wins": 34 }], "totalWins": 210, "winPct": ".493" },
      { "draftOrder": 5, "owner": "Karthik", "teams": [{ "name": "Denver", "wins": 46 }, { "name": "LA Lakers", "wins": 52 }, { "name": "Miami", "wins": 44 }, { "name": "New Orleans", "wins": 30 }, { "name": "Phoenix", "wins": 34 }, { "name": "Washington", "wins": 25 }], "totalWins": 231, "winPct": ".532" }
    ],
    "2018-19": [
      { "draftOrder": 1, "owner": "Diriye", "teams": [{ "name": "Toronto", "wins": 58 }, { "name": "Indiana", "wins": 48 }, { "name": "LA Lakers", "wins": 37 }, { "name": "LA Clippers", "wins": 48 }, { "name": "Brooklyn", "wins": 42 }, { "name": "Atlanta", "wins": 29 }], "totalWins": 262, "winPct": ".533" },
      { "draftOrder": 2, "owner": "James", "teams": [{ "name": "Golden State", "wins": 57 }, { "name": "Milwaukee", "wins": 60 }, { "name": "Portland", "wins": 53 }, { "name": "Charlotte", "wins": 39 }, { "name": "Dallas", "wins": 33 }, { "name": "Sacramento", "wins": 39 }], "totalWins": 281, "winPct": ".571" },
      { "draftOrder": 3, "owner": "Karthik", "teams": [{ "name": "Houston", "wins": 53 }, { "name": "Denver", "wins": 54 }, { "name": "New Orleans", "wins": 33 }, { "name": "Detroit", "wins": 41 }, { "name": "Memphis", "wins": 33 }, { "name": "Orlando", "wins": 42 }], "totalWins": 256, "winPct": ".520" },
      { "draftOrder": 4, "owner": "Jack", "teams": [{ "name": "Boston", "wins": 49 }, { "name": "Oklahoma City", "wins": 49 }, { "name": "San Antonio", "wins": 48 }, { "name": "Minnesota", "wins": 36 }, { "name": "Chicago", "wins": 22 }, { "name": "Phoenix", "wins": 19 }], "totalWins": 223, "winPct": ".453" },
      { "draftOrder": 5, "owner": "Jash", "teams": [{ "name": "Utah", "wins": 50 }, { "name": "Philadelphia", "wins": 51 }, { "name": "Washington", "wins": 32 }, { "name": "Miami", "wins": 39 }, { "name": "Cleveland", "wins": 19 }, { "name": "New York", "wins": 17 }], "totalWins": 208, "winPct": ".423" }
    ]
  });
  const [selectedSeason, setSelectedSeason] = useState<string>('2026-27');

  // Helper to extract wins for a team name regardless of location vs nickname format
  const getTeamStat = (teamName: string, statObj: Record<string, number>): number => {
    if (statObj[teamName] !== undefined) return statObj[teamName];
    const aliases = TEAM_NAME_MAP[teamName] || [];
    for (const alias of aliases) {
      if (statObj[alias] !== undefined) return statObj[alias];
    }
    return 0;
  };

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
      currentRosters.forEach((roster) => {
        const ownerWins = roster.teamNames.reduce((acc, name) => acc + getTeamStat(name, currentWins), 0);
        const ownerLosses = roster.teamNames.reduce((acc, name) => acc + getTeamStat(name, currentLosses), 0);
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
        
        // Record daily snapshot upon successful live score fetch
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
        if (data.pastSeasons && Object.keys(data.pastSeasons).length > 0) {
          setPastSeasonsData((prev: any) => ({ ...data.pastSeasons, ...prev }));
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

  const standingsData = currentRosters.map((roster) => {
    const rounds = roster.teamNames.map((name) => {
      const wins = getTeamStat(name, liveWins);
      const losses = getTeamStat(name, liveLosses);
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

  // Tie-aware Wins Ranking (Standard Competition Rank)
  const uniqueWins = Array.from(new Set(standingsData.map((s) => s.totalWins))).sort((a, b) => b - a);
  standingsData.forEach((item) => {
    item.winsRank = uniqueWins.indexOf(item.totalWins) + 1;
  });

  // Tie-aware Win % Ranking (Standard Competition Rank)
  const uniquePct = Array.from(new Set(standingsData.map((s) => s.winPct))).sort((a, b) => b - a);
  standingsData.forEach((item) => {
    item.pctRank = uniquePct.indexOf(item.winPct) + 1;
  });

  // Baseline Oct 20 setup
  const baselineDate = 'Oct 20';
  let rawHistory = [...history];

  const hasOct20 = rawHistory.some((entry: any) => entry && entry.date === baselineDate);
  if (!hasOct20) {
    const baselineSnapshot: Record<string, any> = { date: baselineDate };
    currentRosters.forEach((roster) => {
      baselineSnapshot[roster.owner] = 0;
      baselineSnapshot[`${roster.owner}_losses`] = 0;
    });
    rawHistory.unshift(baselineSnapshot);
  }

  const finalSnapshotsByDate = rawHistory.reduce<Record<string, any>>((acc, entry) => {
    if (entry && entry.date) {
      acc[entry.date] = entry;
    }
    return acc;
  }, {});

  const deduplicatedHistory = Object.values(finalSnapshotsByDate);

  // Strictly filter out any dates prior to October 20, 2026
  const historyWithRanks = deduplicatedHistory.filter((entry) => {
    if (!entry || !entry.date) return false;
    
    // Explicitly reject pre-season and pre-Oct 20 dates
    const preSeasonDates = [
      'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 
      'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 
      'Sep 30', 'Sep 29', 'Sep 28', 'Sep 27', 'Sep 26', 'Sep 25', 'Sep 24', 'Sep 23', 'Sep 22', 'Sep 21', 'Sep 20'
    ];
    if (preSeasonDates.includes(entry.date)) return false;

    // Reject ISO dates prior to 2026-10-20
    if (entry.date.includes('-') && entry.date < '2026-10-20') return false;

    return true;
  }).map((entry) => {
    const entryCopy = { ...entry };
    const ownersList = currentRosters.map((r) => r.owner);
    
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

    const allWinsVals = ownersList.map((owner) => entry[owner] || 0);
    const uniqueEntryWins = Array.from(new Set(allWinsVals)).sort((a, b) => b - a);
    ownersList.forEach((owner) => {
      const wins = entry[owner] || 0;
      entryCopy[`${owner}_winsRank`] = uniqueEntryWins.indexOf(wins) + 1;
    });

    const allPctVals = ownersList.map((owner) => entryCopy[`${owner}_pct`] || 0);
    const uniqueEntryPct = Array.from(new Set(allPctVals)).sort((a, b) => b - a);
    ownersList.forEach((owner) => {
      const pct = entryCopy[`${owner}_pct`] || 0;
      entryCopy[`${owner}_pctRank`] = uniqueEntryPct.indexOf(pct) + 1;
    });

    return entryCopy;
  });

  const sortedStandings = [...standingsData].sort((a, b) => {
    let aVal: any = 0;
    let bVal: any = 0;

    if (sortField === 'draftOrder') { aVal = a.draftOrder; bVal = b.draftOrder; }
    else if (sortField === 'owner') { aVal = a.owner; bVal = b.owner; }
    else if (sortField === 'rd1') { aVal = a.rounds[0]?.wins || 0; bVal = b.rounds[0]?.wins || 0; }
    else if (sortField === 'rd2') { aVal = a.rounds[1]?.wins || 0; bVal = b.rounds[1]?.wins || 0; }
    else if (sortField === 'rd3') { aVal = a.rounds[2]?.wins || 0; bVal = b.rounds[2]?.wins || 0; }
    else if (sortField === 'rd4') { aVal = a.rounds[3]?.wins || 0; bVal = b.rounds[3]?.wins || 0; }
    else if (sortField === 'rd5') { aVal = a.rounds[4]?.wins || 0; bVal = b.rounds[4]?.wins || 0; }
    else if (sortField === 'rd6') { aVal = a.rounds[5]?.wins || 0; bVal = b.rounds[5]?.wins || 0; }
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

  const handleDraftSort = (field: string) => {
    if (draftSortField === field) {
      setDraftSortAsc(!draftSortAsc);
    } else {
      setDraftSortField(field);
      setDraftSortAsc(field === 'team');
    }
  };

  const handleSeasonMatrixSort = (field: string) => {
    if (seasonMatrixSortField === field) {
      setSeasonMatrixSortAsc(!seasonMatrixSortAsc);
    } else {
      setSeasonMatrixSortField(field);
      setSeasonMatrixSortAsc(field === 'team');
    }
  };

  const handlePastSort = (field: string) => {
    if (pastSortField === field) {
      setPastSortAsc(!pastSortAsc);
    } else {
      setPastSortField(field);
      setPastSortAsc(field === 'owner');
    }
  };

  const sortedDraftFrequencyData = [...(draftHistoryData || [])].sort((a: any, b: any) => {
    let aVal: any = draftSortField === 'team' ? a.team : (a.counts ? a.counts[draftSortField] || 0 : 0);
    let bVal: any = draftSortField === 'team' ? b.team : (b.counts ? b.counts[draftSortField] || 0 : 0);

    if (aVal < bVal) return draftSortAsc ? -1 : 1;
    if (aVal > bVal) return draftSortAsc ? 1 : -1;
    return 0;
  });

  const sortedSeasonMatrixData = [...(draftHistoryData || [])].sort((a: any, b: any) => {
    let aVal: any = seasonMatrixSortField === 'team' ? a.team : (a.seasons ? a.seasons[seasonMatrixSortField] || '' : '');
    let bVal: any = seasonMatrixSortField === 'team' ? b.team : (b.seasons ? b.seasons[seasonMatrixSortField] || '' : '');

    if (aVal < bVal) return seasonMatrixSortAsc ? -1 : 1;
    if (aVal > bVal) return seasonMatrixSortAsc ? 1 : -1;
    return 0;
  });

  const rawPastSeasonData = pastSeasonsData[selectedSeason] || [];
  const pastSeasonWithWinsSorted = [...rawPastSeasonData].sort((a, b) => b.totalWins - a.totalWins);
  
  const processedPastSeasonData = rawPastSeasonData.map((row: any) => {
    const finish = pastSeasonWithWinsSorted.findIndex((item) => item.owner === row.owner) + 1;
    const rawPct = row.winPct;
    const winPctNum = typeof rawPct === 'string' ? parseFloat(rawPct.startsWith('.') ? `0${rawPct}` : rawPct) : (rawPct || 0);

    return {
      ...row,
      draftPosition: row.draftOrder,
      finish,
      winPctNum,
    };
  });

  const sortedPastSeasonData = [...processedPastSeasonData].sort((a: any, b: any) => {
    let aVal: any = 0;
    let bVal: any = 0;

    if (pastSortField === 'draft') { aVal = a.draftPosition; bVal = b.draftPosition; }
    else if (pastSortField === 'finish') { aVal = a.finish; bVal = b.finish; }
    else if (pastSortField === 'owner') { aVal = a.owner; bVal = b.owner; }
    else if (pastSortField === 'rd1') { aVal = a.teams[0]?.wins || 0; bVal = b.teams[0]?.wins || 0; }
    else if (pastSortField === 'rd2') { aVal = a.teams[1]?.wins || 0; bVal = b.teams[1]?.wins || 0; }
    else if (pastSortField === 'rd3') { aVal = a.teams[2]?.wins || 0; bVal = b.teams[2]?.wins || 0; }
    else if (pastSortField === 'rd4') { aVal = a.teams[3]?.wins || 0; bVal = b.teams[3]?.wins || 0; }
    else if (pastSortField === 'rd5') { aVal = a.teams[4]?.wins || 0; bVal = b.teams[4]?.wins || 0; }
    else if (pastSortField === 'rd6') { aVal = a.teams[5]?.wins || 0; bVal = b.teams[5]?.wins || 0; }
    else if (pastSortField === 'totalWins') { aVal = a.totalWins; bVal = b.totalWins; }
    else if (pastSortField === 'winPct') { aVal = a.winPctNum; bVal = b.winPctNum; }

    if (aVal < bVal) return pastSortAsc ? -1 : 1;
    if (aVal > bVal) return pastSortAsc ? 1 : -1;
    return 0;
  });

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

  const allDraftCounts = (draftHistoryData || []).flatMap((item: any) => Object.values(item.counts || {}) as number[]);
  const minDraftCount = allDraftCounts.length > 0 ? Math.min(...allDraftCounts) : 0;
  const maxDraftCount = allDraftCounts.length > 0 ? Math.max(...allDraftCounts) : 5;

  const pastTeamWins = sortedPastSeasonData.flatMap((s: any) => (s.teams || []).map((t: any) => t.wins));
  const minPastWins = pastTeamWins.length > 0 ? Math.min(...pastTeamWins) : 0;
  const maxPastWins = pastTeamWins.length > 0 ? Math.max(...pastTeamWins) : 82;

  const pastTotalWinsArr = sortedPastSeasonData.map((s: any) => s.totalWins);
  const minPastTotalWins = pastTotalWinsArr.length > 0 ? Math.min(...pastTotalWinsArr) : 0;
  const maxPastTotalWins = pastTotalWinsArr.length > 0 ? Math.max(...pastTotalWinsArr) : 300;

  const pastWinPctArr = sortedPastSeasonData.map((s: any) => s.winPctNum);
  const minPastWinPct = pastWinPctArr.length > 0 ? Math.min(...pastWinPctArr) : 0;
  const maxPastWinPct = pastWinPctArr.length > 0 ? Math.max(...pastWinPctArr) : 1;

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

  const allDraftSeasons = draftHistoryData.length > 0 && draftHistoryData[0].seasons
    ? Object.keys(draftHistoryData[0].seasons)
    : ['2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26', '2026-27'];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-[98rem] mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-400 h-8 w-8" /> 2026-27 NBA Wins Pool
          </h1>
          <p className="text-slate-400 mt-1">Live Regular Season Tracker & Historical Archives</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchScores} 
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 transition-all cursor-pointer"
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'live' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" /> Live Dashboard
        </button>
        <button
          onClick={() => setActiveTab('leagueHistory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'leagueHistory' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Trophy className="h-4 w-4" /> League History
        </button>
        <button
          onClick={() => setActiveTab('draftHistory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'draftHistory' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <History className="h-4 w-4" /> Draft History
        </button>
        <button
          onClick={() => setActiveTab('pastSeasons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'pastSeasons' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" /> Past Seasons
        </button>
        <button
          onClick={() => setActiveTab('canadians')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'canadians' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🇨🇦 Canadians
        </button>
        <button
          onClick={() => setActiveTab('lottery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'lottery' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Dices className="h-4 w-4" /> Draft Lottery Simulator
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

          {/* Interactive Chart Section */}
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
                  {currentRosters.map((roster) => (
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

      {/* TAB 2: LEAGUE HISTORY */}
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

      {/* TAB 3: DRAFT HISTORY */}
      {activeTab === 'draftHistory' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <History className="text-blue-400 h-5 w-5" /> Team Selection & Draft Frequency Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm select-none">
                    <th onClick={() => handleDraftSort('team')} className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-200">
                      <div className="flex items-center gap-1">NBA Team <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    {['Diriye', 'Jack', 'James', 'Jash', 'Karthik'].map((owner) => (
                      <th key={owner} onClick={() => handleDraftSort(owner)} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                        <div className="flex items-center justify-center gap-1">{owner} <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {sortedDraftFrequencyData.map((row: any) => {
                    const style = TEAM_COLORS[row.team] || { bg: 'bg-slate-800', text: 'text-slate-200', border: 'border-slate-700' };
                    return (
                      <tr key={row.team} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-semibold text-slate-200">
                          <span className={`px-2.5 py-1 rounded-md border font-medium text-xs ${style.bg} ${style.text} ${style.border}`}>
                            {row.team}
                          </span>
                        </td>
                        {['Diriye', 'Jack', 'James', 'Jash', 'Karthik'].map((owner) => {
                          const count = row.counts ? row.counts[owner] || 0 : 0;
                          const countStyle = getGradientStyle(count, minDraftCount, maxDraftCount);
                          return (
                            <td key={owner} className="py-3 px-4 text-center font-mono">
                              <span className={`inline-block px-3 py-1 rounded-md border text-xs ${countStyle}`}>
                                {count}
                              </span>
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

          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Calendar className="text-blue-400 h-5 w-5" /> Season-by-Season Team Draft Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm select-none">
                    <th onClick={() => handleSeasonMatrixSort('team')} className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-200">
                      <div className="flex items-center gap-1">NBA Team <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    {allDraftSeasons.map((season) => (
                      <th key={season} onClick={() => handleSeasonMatrixSort(season)} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                        <div className="flex items-center justify-center gap-1">{season} <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {sortedSeasonMatrixData.map((row: any) => {
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

      {/* TAB 4: PAST SEASONS ARCHIVE */}
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
                  <tr className="border-b border-slate-800 text-slate-400 text-sm select-none">
                    <th onClick={() => handlePastSort('draft')} className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Draft <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handlePastSort('finish')} className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Finish <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handlePastSort('owner')} className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-200">
                      <div className="flex items-center gap-1">Owner <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    {['Rd 1', 'Rd 2', 'Rd 3', 'Rd 4', 'Rd 5', 'Rd 6'].map((rd, i) => (
                      <th key={rd} onClick={() => handlePastSort(`rd${i + 1}`)} className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-slate-200">
                        <div className="flex items-center justify-center gap-1">{rd} <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                      </th>
                    ))}
                    <th onClick={() => handlePastSort('totalWins')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Total Wins <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                    <th onClick={() => handlePastSort('winPct')} className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-slate-200">
                      <div className="flex items-center justify-center gap-1">Win % <ArrowUpDown className="h-3 w-3 opacity-60" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {sortedPastSeasonData.map((row: any) => {
                    const totalWinsStyle = getGradientStyle(row.totalWins, minPastTotalWins, maxPastTotalWins);
                    const rankStyle = getRankGradientStyle(row.finish);
                    const winPctStyle = getGradientStyle(row.winPctNum, minPastWinPct, maxPastWinPct);

                    return (
                      <tr key={row.owner} className="hover:bg-slate-800/30">
                        <td className="py-4 px-3 font-mono text-slate-400 text-center">#{row.draftPosition}</td>
                        <td className="py-4 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md border text-xs shadow-sm ${rankStyle}`}>
                            #{row.finish}
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
                          <span className={`inline-block px-3 py-1 rounded-md border text-sm shadow-sm ${winPctStyle}`}>
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

      {/* TAB: CANADIANS IN THE NBA */}
      {activeTab === 'canadians' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <CanadiansTab />
          </section>
        </div>
      )}

      {/* TAB 5: DRAFT LOTTERY SIMULATOR */}
      {activeTab === 'lottery' && (
        <div className="space-y-8">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <DraftLottery
              lotteryState={lotteryState}
              setLotteryState={setLotteryState}
              onLockLottery={() => {}}
              onResetLottery={() => {}}
            />
          </section>
        </div>
      )}
    </main>
  );
}