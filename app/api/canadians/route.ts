// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        const res = await fetch(
          `https://cdn.nba.com/static/json/liveData/playerprofile/playerprofile_${player.id}.json`,
          { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!res.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await res.json();
        const seasonStats = data?.stats?.regularSeason?.seasonTotals?.[0] || {};
        const lastGame = data?.stats?.regularSeason?.latestGame || {};

        return {
          ...player,
          seasonStats: {
            pts: seasonStats.pts ?? 0,
            reb: seasonStats.reb ?? 0,
            ast: seasonStats.ast ?? 0,
            fgPct: seasonStats.fgPct ? (seasonStats.fgPct * 100).toFixed(1) + '%' : '-',
          },
          lastGame: {
            pts: lastGame.pts ?? 0,
            reb: lastGame.reb ?? 0,
            ast: lastGame.ast ?? 0,
            opponent: lastGame.vsTeamAbbr || 'N/A',
            date: lastGame.gameDate ? new Date(lastGame.gameDate).toLocaleDateString() : 'N/A',
          },
        };
      } catch (err) {
        // Fallback for players without data yet or network drops
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
    return NextResponse.json({ error: 'Failed to fetch Canadian player stats' }, { status: 500 });
  }
}