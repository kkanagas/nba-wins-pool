// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      const emptyResult = {
        ...player,
        seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' },
        lastGame: { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' },
      };

      try {
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();

        // DEBUG LOG: Print out keys for Shai Gilgeous-Alexander (ID: 4278077) to inspect schema
        if (player.id === 4278077) {
          console.log('--- ESPN STATS JSON KEYS FOR SHAI ---', Object.keys(data));
          if (data.splits) console.log('Splits structure:', JSON.stringify(data.splits).substring(0, 300));
          if (data.categories) console.log('Categories structure:', JSON.stringify(data.categories).substring(0, 300));
        }

        // Return empty for now while we check the server log output
        return emptyResult;
      } catch (err) {
        return emptyResult;
      }
    });

    const results = await Promise.all(playerStatsPromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Fatal error in Canadians route:', error);
    return NextResponse.json({ error: 'Failed to fetch Canadian player stats' }, { status: 500 });
  }
}