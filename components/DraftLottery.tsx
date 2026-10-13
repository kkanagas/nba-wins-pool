import React, { useState } from 'react';

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

export default function DraftLottery() {
  const [drumPool, setDrumPool] = useState<Owner[]>([]);
  const [stage, setStage] = useState<'idle' | 'drawing' | 'selecting' | 'complete'>('idle');
  
  const [drawnQueue, setDrawnQueue] = useState<Owner[]>([]);
  const [currentPickerIndex, setCurrentPickerIndex] = useState<number>(0);
  const [availableSlots, setAvailableSlots] = useState<number[]>([1, 2, 3, 4, 5]);
  const [slotAssignments, setSlotAssignments] = useState<{ [ownerId: string]: number }>({});
  const [lastDrawnOwner, setLastDrawnOwner] = useState<Owner | null>(null);

  const startLottery = () => {
    let pool: Owner[] = [];
    INITIAL_LOTTERY_DATA.forEach((owner) => {
      for (let i = 0; i < owner.balls; i++) {
        pool.push(owner);
      }
    });

    setDrumPool(pool);
    setDrawnQueue([]);
    setSlotAssignments({});
    setAvailableSlots([1, 2, 3, 4, 5]);
    setCurrentPickerIndex(0);
    setLastDrawnOwner(null);
    setStage('drawing');
  };

  const drawNextOwner = () => {
    if (drumPool.length === 0) return;

    let pool = [...drumPool];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedOwner = pool[randomIndex];
    const remainingPool = pool.filter((o) => o.id !== selectedOwner.id);
    
    setDrumPool(remainingPool);
    setLastDrawnOwner(selectedOwner);
    setDrawnQueue((prev) => [...prev, selectedOwner]);
    setStage('selecting');
  };

  const handleSelectSlot = (slot: number) => {
    const currentOwner = drawnQueue[currentPickerIndex];
    if (!currentOwner) return;

    const updatedAssignments = { ...slotAssignments, [currentOwner.id]: slot };
    setSlotAssignments(updatedAssignments);
    setAvailableSlots(availableSlots.filter((s) => s !== slot));

    if (drumPool.length > 0) {
      setStage('drawing');
    } else {
      setStage('complete');
    }

    setCurrentPickerIndex((prev) => prev + 1);
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
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
          >
            Start Lottery
          </button>
        )}
        {stage !== 'idle' && (
          <button
            onClick={startLottery}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition text-sm"
          >
            Reset Lottery
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
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Drum Ready</h3>
          <p className="text-slate-300 text-sm">
            {drumPool.length} balls remaining in the drum. Draw the next owner to determine picking order.
          </p>
          <button
            onClick={drawNextOwner}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition text-lg"
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
        <div className="bg-slate-800/80 border border-emerald-500/50 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-emerald-400">Draft Order Finalized!</h3>
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
        </div>
      )}
    </div>
  );
}