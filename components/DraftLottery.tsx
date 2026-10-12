import React, { useState } from 'react';

interface OwnerStanding {
  name: string;
  rank: number;
  balls: number;
}

// Default based on previous season's standings / ball distribution
const INITIAL_STANDINGS: OwnerStanding[] = [
  { name: 'James', rank: 1, balls: 5 },
  { name: 'Diriye', rank: 2, balls: 4 },
  { name: 'Karthik', rank: 3, balls: 3 },
  { name: 'Jack', rank: 4, balls: 2 },
  { name: 'Jash', rank: 5, balls: 1 },
];

export default function DraftLottery({ onLotteryComplete }: { onLotteryComplete?: (results: { owner: string; draftSpot: number }[]) => void }) {
  const [standings, setStandings] = useState<OwnerStanding[]>(INITIAL_STANDINGS);
  const [availableSpots, setAvailableSpots] = useState<number[]>([1, 2, 3, 4, 5]);
  const [draftSelections, setDraftSelections] = useState<{ owner: string; draftSpot: number }[]>([]);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Build the weighted ball pool based on remaining owners
  const getWeightedPool = () => {
    const pool: string[] = [];
    standings.forEach(s => {
      // Check if owner has already selected a draft spot
      const alreadyPicked = draftSelections.some(ds => ds.owner === s.name);
      if (!alreadyPicked) {
        for (let i = 0; i < s.balls; i++) {
          pool.push(s.name);
        }
      }
    });
    return pool;
  };

  const drawNextWinner = () => {
    const pool = getWeightedPool();
    if (pool.length === 0) return;

    setIsDrawing(true);
    setCurrentWinner(null);

    // Theatrical shuffle effect
    let counter = 0;
    const interval = setInterval(() => {
      const randomTempWinner = pool[Math.floor(Math.random() * pool.length)];
      setCurrentWinner(randomTempWinner);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        // Final draw
        const finalWinner = pool[Math.floor(Math.random() * pool.length)];
        setCurrentWinner(finalWinner);
        setIsDrawing(false);
      }
    }, 100);
  };

  const assignDraftSpot = (spot: number) => {
    if (!currentWinner) return;

    const newSelections = [...draftSelections, { owner: currentWinner, draftSpot: spot }];
    setDraftSelections(newSelections);
    setAvailableSpots(availableSpots.filter(s => s !== spot));
    setCurrentWinner(null);

    if (newSelections.length === INITIAL_STANDINGS.length) {
      setIsComplete(true);
      // Sort by draft spot
      const sorted = newSelections.sort((a, b) => a.draftSpot - b.draftSpot);
      if (onLotteryComplete) {
        onLotteryComplete(sorted);
      }
    }
  };

  const resetLottery = () => {
    setDraftSelections([]);
    setAvailableSpots([1, 2, 3, 4, 5]);
    setCurrentWinner(null);
    setIsComplete(false);
  };

  const totalBalls = getWeightedPool().length;

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">🎲 Weighted Draft Lottery Simulator</h2>
        <p className="text-slate-400 text-sm">
          Balls allocated by previous finish (1st: 5, 2nd: 4, 3rd: 3, 4th: 2, 5th: 1). Draw a winner to select their draft spot!
        </p>
      </div>

      {/* Standings & Ball Count Overview */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {standings.map(s => {
          const hasPicked = draftSelections.some(ds => ds.owner === s.name);
          const pickedSpot = draftSelections.find(ds => ds.owner === s.name)?.draftSpot;

          return (
            <div key={s.name} className={`p-3 rounded-lg border text-center ${
              hasPicked ? 'bg-slate-950/40 border-slate-800 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}>
              <div className="font-bold text-sm">{s.name}</div>
              <div className="text-xs text-slate-400 mt-1">{s.balls} balls</div>
              {hasPicked ? (
                <div className="mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Spot #{pickedSpot}
                </div>
              ) : (
                <div className="mt-2 text-xs text-indigo-400 font-medium">
                  {Math.round((s.balls / totalBalls) * 100)}% odds
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Draw Section */}
      {!isComplete && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center mb-6">
          {!currentWinner ? (
            <div>
              <button
                onClick={drawNextWinner}
                disabled={isDrawing || totalBalls === 0}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isDrawing ? 'Drawing Ball...' : 'Draw Next Lottery Winner'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="text-sm uppercase tracking-wider text-indigo-400 font-semibold">Lottery Winner Drawn!</div>
              <div className="text-3xl font-extrabold text-white">{currentWinner}</div>
              <p className="text-sm text-slate-300">Choose your draft slot from the remaining available spots:</p>
              
              <div className="flex justify-center gap-3 mt-4">
                {availableSpots.map(spot => (
                  <button
                    key={spot}
                    onClick={() => assignDraftSpot(spot)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-lg text-white shadow transition-all active:scale-95"
                  >
                    Draft Spot #{spot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results / Final Order */}
      {draftSelections.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Draft Order Results</h3>
          {draftSelections.sort((a, b) => a.draftSpot - b.draftSpot).map((item) => (
            <div key={item.draftSpot} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="text-sm font-bold text-indigo-400">Draft Slot #{item.draftSpot}</span>
              <span className="text-base font-semibold text-white">{item.owner}</span>
            </div>
          ))}
        </div>
      )}

      {isComplete && (
        <div className="mt-6 text-center">
          <button
            onClick={resetLottery}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg text-slate-300 border border-slate-700 transition-all"
          >
            Reset Lottery
          </button>
        </div>
      )}
    </div>
  );
}