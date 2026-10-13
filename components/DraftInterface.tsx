'use client';

import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, CheckCircle2, Shield, AlertCircle, ChevronRight, RefreshCw, LayoutGrid } from 'lucide-react';

const ALL_30_TEAMS = [
  { name: 'Hawks', city: 'Atlanta', conf: 'East' },
  { name: 'Celtics', city: 'Boston', conf: 'East' },
  { name: 'Nets', city: 'Brooklyn', conf: 'East' },
  { name: 'Hornets', city: 'Charlotte', conf: 'East' },
  { name: 'Bulls', city: 'Chicago', conf: 'East' },
  { name: 'Cavaliers', city: 'Cleveland', conf: 'East' },
  { name: 'Mavericks', city: 'Dallas', conf: 'West' },
  { name: 'Nuggets', city: 'Denver', conf: 'West' },
  { name: 'Pistons', city: 'Detroit', conf: 'East' },
  { name: 'Warriors', city: 'Golden State', conf: 'West' },
  { name: 'Rockets', city: 'Houston', conf: 'West' },
  { name: 'Pacers', city: 'Indiana', conf: 'East' },
  { name: 'Clippers', city: 'LA Clippers', conf: 'West' },
  { name: 'Lakers', city: 'LA Lakers', conf: 'West' },
  { name: 'Grizzlies', city: 'Memphis', conf: 'West' },
  { name: 'Heat', city: 'Miami', conf: 'East' },
  { name: 'Bucks', city: 'Milwaukee', conf: 'East' },
  { name: 'Timberwolves', city: 'Minnesota', conf: 'West' },
  { name: 'Pelicans', city: 'New Orleans', conf: 'West' },
  { name: 'Knicks', city: 'New York', conf: 'East' },
  { name: 'Thunder', city: 'Oklahoma City', conf: 'West' },
  { name: 'Magic', city: 'Orlando', conf: 'East' },
  { name: '76ers', city: 'Philadelphia', conf: 'East' },
  { name: 'Suns', city: 'Phoenix', conf: 'West' },
  { name: 'Trail Blazers', city: 'Portland', conf: 'West' },
  { name: 'Kings', city: 'Sacramento', conf: 'West' },
  { name: 'Spurs', city: 'San Antonio', conf: 'West' },
  { name: 'Raptors', city: 'Toronto', conf: 'East' },
  { name: 'Jazz', city: 'Utah', conf: 'West' },
  { name: 'Wizards', city: 'Washington', conf: 'East' },
];

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

const OWNER_AVATARS: Record<string, string> = {
  Karthik: '/avatars/karthik.png',
  James: '/avatars/james.png',
  Diriye: '/avatars/diriye.png',
  Jack: '/avatars/jack.png',
  Jash: '/avatars/jash.png',
};

export interface PickRecord {
  overallPick: number;
  round: number;
  pickInRound: number;
  owner: string;
  team: string;
  timeTakenSec: number;
}

interface DraftInterfaceProps {
  draftOrder?: string[];
  draftPicks: PickRecord[];
  setDraftPicks: React.Dispatch<React.SetStateAction<PickRecord[]>>;
  onFinalizeDraft: (rosters: Record<string, string[]>) => void;
}

export default function DraftInterface({ 
  draftOrder = ['Karthik', 'James', 'Diriye', 'Jack', 'Jash'], 
  draftPicks = [], 
  setDraftPicks, 
  onFinalizeDraft 
}: DraftInterfaceProps) {
  const TOTAL_ROUNDS = 6;
  const TOTAL_PICKS = draftOrder.length * TOTAL_ROUNDS;

  const [pickTimer, setPickTimer] = useState<number>(0);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  useEffect(() => {
    if (draftPicks.length >= TOTAL_PICKS || isFinalized) return;
    const interval = setInterval(() => {
      setPickTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [draftPicks.length, TOTAL_PICKS, isFinalized]);

  const currentPickIndex = draftPicks.length;
  const currentRound = Math.floor(currentPickIndex / draftOrder.length) + 1;
  const pickInRound = (currentPickIndex % draftOrder.length) + 1;

  const isReverseRound = currentRound % 2 === 0;
  const currentOwnerIndex = isReverseRound
    ? draftOrder.length - pickInRound
    : pickInRound - 1;
  const currentOwner = draftOrder[currentOwnerIndex] || draftOrder[0];

  const selectedTeamNames = new Set(draftPicks.map((p) => p.team));

  const handleSelectTeam = (teamName: string) => {
    if (selectedTeamNames.has(teamName) || currentPickIndex >= TOTAL_PICKS) return;

    const newPick: PickRecord = {
      overallPick: currentPickIndex + 1,
      round: currentRound,
      pickInRound,
      owner: currentOwner,
      team: teamName,
      timeTakenSec: pickTimer,
    };

    setDraftPicks((prev) => [...prev, newPick]);
    setPickTimer(0);
  };

  const handleUndoPick = () => {
    if (draftPicks.length === 0 || isFinalized) return;
    setDraftPicks((prev) => prev.slice(0, -1));
    setPickTimer(0);
  };

  const handleResetDraft = () => {
    if (window.confirm('Are you sure you want to reset the draft? All selected picks will be cleared.')) {
      setDraftPicks([]);
      setPickTimer(0);
      setIsFinalized(false);
    }
  };

  const handleFinalize = () => {
    const rosterMap: Record<string, string[]> = {};
    draftOrder.forEach((owner) => { rosterMap[owner] = []; });

    draftPicks.forEach((pick) => {
      if (rosterMap[pick.owner]) {
        rosterMap[pick.owner].push(pick.team);
      }
    });

    setIsFinalized(true);
    onFinalizeDraft(rosterMap);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ownerRosters: Record<string, string[]> = {};
  draftOrder.forEach((owner) => {
    ownerRosters[owner] = Array(TOTAL_ROUNDS).fill('');
  });

  draftPicks.forEach((pick) => {
    if (ownerRosters[pick.owner]) {
      const roundIndex = pick.round - 1;
      ownerRosters[pick.owner][roundIndex] = pick.team;
    }
  });

  return (
    <div className="space-y-8 max-w-[98rem] mx-auto">
      {/* On The Clock Header */}
      {!isFinalized && currentPickIndex < TOTAL_PICKS ? (
        <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 bg-slate-800 shadow-lg relative shrink-0">
              <img
                src={OWNER_AVATARS[currentOwner]}
                alt={currentOwner}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-400 font-bold">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                On The Clock • Round {currentRound}, Pick #{pickInRound}
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-0.5">{currentOwner}</h2>
              <p className="text-slate-400 text-sm">Overall Pick #{currentPickIndex + 1} of {TOTAL_PICKS}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-950/80 px-5 py-3 rounded-xl border border-slate-800 shadow-inner">
              <Clock className="h-6 w-6 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Time Elapsed</div>
                <div className="text-2xl font-mono font-bold text-amber-300">{formatTimer(pickTimer)}</div>
              </div>
            </div>

            {draftPicks.length > 0 && (
              <button
                onClick={handleUndoPick}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-amber-400" /> Undo Pick
              </button>
            )}

            <button
              onClick={handleResetDraft}
              className="flex items-center gap-2 bg-rose-950/80 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-rose-400" /> Reset Draft
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/60 border border-emerald-600/50 rounded-2xl p-6 shadow-xl text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-emerald-200">Draft Complete!</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            All 30 NBA teams have been selected across 6 rounds. Finalize the draft results below to send these rosters directly to the 2026–27 Live Dashboard!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleFinalize}
              disabled={isFinalized}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              {isFinalized ? 'Draft Finalized & Pushed to Live Dashboard!' : 'Finalize Draft Results'}
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleResetDraft}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl transition-all cursor-pointer"
            >
              Reset & Redraft
            </button>
          </div>
        </div>
      )}

      {/* FULL DRAFT OVERVIEW CHART (Matrix Grid) */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <LayoutGrid className="h-5 w-5 text-blue-400" /> Full Draft Board Overview
          </h3>
          <span className="text-xs text-slate-400">Snake Order (1-5, 5-1)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-sm select-none">
                <th className="py-3 px-3 font-semibold text-center w-20">Draft</th>
                <th className="py-3 px-4 font-semibold">Owner</th>
                {[1, 2, 3, 4, 5, 6].map((rd) => (
                  <th key={rd} className="py-3 px-3 font-semibold text-center">
                    Round {rd}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {draftOrder.map((owner, idx) => {
                const rosterTeams = ownerRosters[owner] || [];
                const isCurrent = !isFinalized && currentPickIndex < TOTAL_PICKS && currentOwner === owner;

                return (
                  <tr key={owner} className={`hover:bg-slate-800/30 transition-colors ${isCurrent ? 'bg-blue-950/20' : ''}`}>
                    <td className="py-4 px-3 font-mono text-slate-400 text-center">#{idx + 1}</td>
                    <td className="py-4 px-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0 shadow-sm relative">
                          <img 
                            src={OWNER_AVATARS[owner]} 
                            alt="" 
                            className="w-full h-full object-cover relative z-10"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <span className={isCurrent ? 'text-blue-400 font-bold underline' : ''}>{owner}</span>
                        {isCurrent && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">Picking</span>}
                      </div>
                    </td>
                    {rosterTeams.map((teamName, rdIdx) => {
                      const style = TEAM_COLORS[teamName] || { bg: 'bg-slate-950/60', text: 'text-slate-500', border: 'border-slate-800' };
                      return (
                        <td key={rdIdx} className="py-4 px-2 text-center">
                          {teamName ? (
                            <span className={`inline-block px-3 py-1.5 rounded-lg border font-medium text-xs shadow-sm ${style.bg} ${style.text} ${style.border}`}>
                              {teamName}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs italic">—</span>
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

      {/* Main Grid: 30 Available Teams & Live Draft Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: 30 Teams Selection Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <Shield className="h-5 w-5 text-blue-400" /> NBA Teams Board ({30 - selectedTeamNames.size} Available)
            </h3>
            <span className="text-xs text-slate-400">Click any available team to draft</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ALL_30_TEAMS.map((team) => {
              const isSelected = selectedTeamNames.has(team.name);
              const draftedByPick = draftPicks.find((p) => p.team === team.name);

              return (
                <button
                  key={team.name}
                  onClick={() => handleSelectTeam(team.name)}
                  disabled={isSelected || isFinalized || currentPickIndex >= TOTAL_PICKS}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between h-24 select-none ${
                    isSelected
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-35 cursor-not-allowed grayscale'
                      : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-blue-500/60 shadow-md cursor-pointer hover:scale-[1.02]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{team.city}</span>
                    <h4 className="text-sm font-bold text-slate-100 leading-tight">{team.name}</h4>
                  </div>

                  {isSelected && draftedByPick && (
                    <div className="mt-auto">
                      <span className="text-[11px] font-semibold text-blue-400 block truncate">
                        ✓ {draftedByPick.owner}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">Pick #{draftedByPick.overallPick}</span>
                    </div>
                  )}

                  {!isSelected && (
                    <span className="text-[10px] text-emerald-400 font-semibold self-end">Available</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Draft Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-200">Draft Log ({draftPicks.length}/30)</h3>
            {draftPicks.length > 0 && !isFinalized && (
              <button onClick={handleUndoPick} className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer">
                <RotateCcw className="h-3 w-3" /> Undo Last
              </button>
            )}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 h-[32rem] overflow-y-auto space-y-2.5 shadow-inner">
            {draftPicks.length === 0 ? (
              <div className="text-center text-slate-500 py-20 text-sm flex flex-col items-center gap-2">
                <AlertCircle className="h-8 w-8 opacity-40" />
                No picks made yet. Select a team to begin!
              </div>
            ) : (
              [...draftPicks].reverse().map((pick) => (
                <div
                  key={pick.overallPick}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 w-8">#{pick.overallPick}</span>
                    <div>
                      <span className="font-bold text-slate-200">{pick.team}</span>
                      <span className="text-xs text-slate-400 block">Round {pick.round} • Pick {pick.pickInRound}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-blue-400 text-xs block">{pick.owner}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{formatTimer(pick.timeTakenSec)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}