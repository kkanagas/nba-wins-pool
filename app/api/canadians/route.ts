// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        const url = `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`;
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
          console.error(`[Canadians API] Failed for ${player.name} (ID: ${player.id}): Status ${res.status}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        // Let's inspect the keys returned by ESPN to ensure our parser matches
        console.log(`[Canadians API] Success fetching ${player.name}`);

        return {
          ...player,
          seasonStats: { pts: '12.0', reb: '4.0', ast: '2.0', fgPct: '45.0%' }, // Temporarily testing structure rendering
          lastGame: { pts: '10', reb: '5', ast: '2', opponent: 'LAL', date: 'Oct 20' },
        };
      } catch (err: any) {
        console.error(`[Canadians API] Error for ${player.name}:`, err.message);
        return {
          ...player,
          seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' },
          lastGame: { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' },
        };
      }
    });

    const results = await Promise.all(playerStatsPromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Fatal error in Canadians route:', error);
    return NextResponse.json({ error: 'Failed to fetch Canadian player stats' }, { status: 500 });
  }
}