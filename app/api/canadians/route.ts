// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      // Default everyone cleanly to dashes first — strictly factual
      const defaultStats = {
        ...player,
        seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' },
        lastGame: { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' },
      };

      try {
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/overview`,
          { cache: 'no-store' }
        );

        if (!res.ok) return defaultStats;

        const data = await res.json();
        const lastGame = data?.lastGame;

        // If there's a verified recent game entry with actual points recorded, populate it.
        if (lastGame && (lastGame.points !== undefined || lastGame.stats)) {
          const lastPts = lastGame?.points ?? lastGame?.stats?.find((s: any) => s.name === 'points')?.displayValue ?? '-';
          const lastReb = lastGame?.rebounds ?? lastGame?.stats?.find((s: any) => s.name === 'rebounds')?.displayValue ?? '-';
          const lastAst = lastGame?.assists ?? lastGame?.stats?.find((s: any) => s.name === 'assists')?.displayValue ?? '-';
          const opponent = lastGame?.opponent?.abbreviation || lastGame?.vsTeamAbbr || 'N/A';
          const dateStr = lastGame?.gameDate
            ? new Date(lastGame.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'N/A';

          return {
            ...player,
            seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' }, // Kept as dashes until season aggregates fully stabilize
            lastGame: {
              pts: lastPts,
              reb: lastReb,
              ast: lastAst,
              opponent,
              date: dateStr,
            },
          };
        }

        return defaultStats;
      } catch (err) {
        return defaultStats;
      }
    });

    const results = await Promise.all(playerStatsPromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Fatal error in Canadians route:', error);
    return NextResponse.json({ error: 'Failed to fetch Canadian player stats' }, { status: 500 });
  }
}