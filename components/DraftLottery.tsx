'use client';

import React from 'react';
import { Lock, CheckCircle2, RotateCcw } from 'lucide-react';

interface Owner {
  id: string;
  name: string;
  rank: number;
  balls: number;
  avatar: string;
}

const INITIAL_LOTTERY_DATA: Owner[] = [
  { id: 'james', name: 'James', rank: 1, balls: 5, avatar: '/avatars/james.png' },
  { id: 'jash', name: 'Jash', rank: 2, balls: 4, avatar: '/avatars/jash.png' },
  { id: 'jack', name: 'Jack', rank: 3, balls: 3, avatar: '/avatars/jack.png' },
  { id: 'diriye', name: 'Diriye', rank: 4, balls: 2, avatar: '/avatars/diriye.png' },
  { id: 'karthik', name: 'Karthik', rank: 5, balls: 1, avatar: '/avatars/karthik.png' },
];

interface DraftLotteryProps {
  lotteryState: {
    drumPool: Owner[];
    stage: 'idle' | 'drawing' | 'selecting' | 'complete';
    drawnQueue: Owner[];
    currentPickerIndex: number;
    availableSlots: number[];
    slotAssignments: { [ownerId: string]: number };
    lastDrawnOwner: Owner | null;
    isLocked: boolean;
  };
  setLotteryState: React.Dispatch<React.SetStateAction<any>>;
  onLockLottery?: (results: string[]) => void;
  onResetLottery?: () => void;
}

export default function DraftLottery({ lotteryState, setLotteryState, onLockLottery, onResetLottery }: DraftLotteryProps) {
  const {
    drumPool,
    stage,
    drawnQueue,
    currentPickerIndex,
    availableSlots,
    slotAssignments,
    isLocked,
  } = lotteryState;

  const startLottery = () => {
    let pool: Owner[] = [];
    INITIAL_LOTTERY_DATA.forEach((owner) => {
      for (let i = 0; i < owner.balls; i++) {
        pool.push(owner);
      }
    });

    setLotteryState({
      drumPool: pool,
      stage: 'drawing',
      drawnQueue: [],
      currentPickerIndex: 0,
      availableSlots: [1, 2, 3, 4, 5],
      slotAssignments: {},
      lastDrawnOwner: null,
      isLocked: false,
    });

    if (onResetLottery) onResetLottery();
  };

  const drawNextOwner = () => {
    if (drumPool.length === 0) return;

    let pool = [...drumPool];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedOwner = pool[randomIndex];
    const remainingPool = pool.filter((o) => o.id !== selectedOwner.id);
    
    setLotteryState((prev: any) => ({
      ...prev,
      drumPool: remainingPool,
      lastDrawnOwner: selectedOwner,
      drawnQueue: [...prev.drawnQueue, selectedOwner],
      stage: 'selecting',
    }));
  };

  const handleSelectSlot = (slot: number) => {
    const currentOwner = drawnQueue[currentPickerIndex];
    if (!currentOwner) return;

    const updatedAssignments = { ...slotAssignments, [currentOwner.id]: slot };
    const updatedAvailableSlots = availableSlots.filter((s) => s !== slot);
    const nextStage = drumPool.length > 0 ? 'drawing' : 'complete';

    setLotteryState((prev: any) => ({
      ...prev,
      slotAssignments: updatedAssignments,
      availableSlots: updatedAvailableSlots,
      stage: nextStage,
      currentPickerIndex: prev.currentPickerIndex + 1,
    }));
  };

  const handleLockOrder = () => {
    setLotteryState((prev: any) => ({ ...prev, isLocked: true }));
    
    const finalOrder: string[] = [];
    for (let slot = 1; slot <= 5; slot++) {
      const ownerEntry = Object.entries(slotAssignments).find(([_, s]) => s === slot);
      if (ownerEntry) {
        const ownerObj = INITIAL_LOTTERY_DATA.find((o) => o.id === ownerEntry[0]);
        if (ownerObj) finalOrder.push(ownerObj.name);
      }
    }

    if (onLockLottery && finalOrder.length === 5) {
      onLockLottery(finalOrder);
    }
  };

  const totalBalls = INITIAL_LOTTERY_DATA.reduce((acc, curr) => acc + curr.balls, 0);
  const currentPicker = drawnQueue[currentPickerIndex];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 bg-slate-900 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Draft Lottery Simulator</h2>
          <p className="text-sm text-slate-400">
            Draw order determines selection priority for available draft slots.
          </p>
        </div>
        {stage === 'idle' && (
          <button
            onClick={startLottery}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            Start Lottery
          </button>
        )}
        {stage !== 'idle' && (
          <button
            onClick={startLottery}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition text-sm flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Reset Lottery
          </button>
        )}
      </div>

      {/* Odds Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {INITIAL_LOTTERY_DATA.map((owner) => {
          const odds = ((owner.balls / totalBalls) * 100).toFixed(1);
          const assignedSlot = slotAssignments[owner.id];
          return (
            <div 
              key={owner.id} 
              className={`border rounded-xl p-4 text-center shadow-sm flex flex-col items-center transition ${
                assignedSlot ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800 bg-slate-800/60'
              }`}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-slate-700 border border-slate-600 flex items-center justify-center relative">
                <img 
                  src={owner.avatar} 
                  alt={owner.name} 
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {assignedSlot && (
                  <div className="absolute inset-0 bg-emerald-900/80 flex items-center justify-center text-white font-bold text-lg">
                    #{assignedSlot}
                  </div>
                )}
              </div>
              <div className="font-bold text-lg text-white">{owner.name}</div>
              <div className="text-xs text-slate-400 font-medium">Rank #{owner.rank}</div>
              <div className="mt-2 text-xl font-extrabold text-blue-400">
                {owner.balls} <span className="text-xs font-normal text-slate-400">balls ({odds}%)</span>
              </div>
              {assignedSlot && (
                <div className="mt-2 text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Drafts Pick #{assignedSlot}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Lottery Control Area */}
      {stage === 'drawing' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 text-center space-y-4 shadow-xl">
          <h3 className="text-xl font-bold text-white">Drum Ready</h3>
          <p className="text-slate-300 text-sm">
            {drumPool.length} balls remaining in the drum. Draw the next owner to determine picking order.
          </p>
          <button
            onClick={drawNextOwner}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition text-lg cursor-pointer"
          >
            Draw Next Ball From Drum
          </button>
        </div>
      )}

      {stage === 'selecting' && currentPicker && (
        <div className="bg-blue-950/40 border border-blue-600/50 rounded-xl p-6 text-center space-y-4 shadow-lg">
          <div className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-1">
            Winner Drawn!
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {currentPicker.name} has been drawn!
          </h3>
          <p className="text-blue-200 text-sm">
            {currentPicker.name}, please select your desired draft position from the remaining available spots:
          </p>

          <div className="flex justify-center gap-3 pt-2">
            {[1, 2, 3, 4, 5].map((slot) => {
              const isAvailable = availableSlots.includes(slot);
              return (
                <button
                  key={slot}
                  onClick={() => handleSelectSlot(slot)}
                  disabled={!isAvailable}
                  className={`w-14 h-14 rounded-xl font-bold text-lg flex items-center justify-center transition shadow ${
                    isAvailable 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transform hover:scale-105' 
                      : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed opacity-40'
                  }`}
                >
                  #{slot}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="bg-slate-800/80 border border-emerald-500/50 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-emerald-400">Draft Order Finalized!</h3>
            {isLocked && (
              <span className="flex items-center gap-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                <CheckCircle2 className="h-4 w-4" /> Locked & Sent to Live Draft
              </span>
            )}
          </div>

          <ol className="divide-y divide-slate-700">
            {[1, 2, 3, 4, 5].map((slot) => {
              const ownerEntry = Object.entries(slotAssignments).find(([id, s]) => s === slot);
              const owner = INITIAL_LOTTERY_DATA.find((o) => o.id === ownerEntry?.[0]);

              return (
                <li key={slot} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      #{slot}
                    </span>
                    <span className="font-bold text-lg text-white">{owner?.name || '---'}</span>
                  </div>
                  <span className="text-sm text-slate-400">Rank #{owner?.rank} last season</span>
                </li>
              );
            })}
          </ol>

          {!isLocked ? (
            <div className="pt-2">
              <button
                onClick={handleLockOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="h-5 w-5" /> Lock In Draft Order & Start Live Draft
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onLockLottery) {
                    const finalOrder: string[] = [];
                    for (let slot = 1; slot <= 5; slot++) {
                      const ownerEntry = Object.entries(slotAssignments).find(([_, s]) => s === slot);
                      if (ownerEntry) {
                        const ownerObj = INITIAL_LOTTERY_DATA.find((o) => o.id === ownerEntry[0]);
                        if (ownerObj) finalOrder.push(ownerObj.name);
                      }
                    }
                    onLockLottery(finalOrder);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-xl shadow transition cursor-pointer"
              >
                Go to Live Draft Tab ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}