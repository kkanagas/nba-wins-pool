// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/overview`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error(`ESPN status ${res.status}`);
        }

        const data = await res.json();
        
        // Safely extract statistics categories if present
        const categories = data?.statistics?.splits?.[0]?.categories || [];
        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        categories.forEach((cat: any) => {
          if (cat.name === 'general' || cat.stats) {
            cat.stats?.forEach((stat: any) => {
              if (stat.name === 'avgPoints') pts = stat.displayValue;
              if (stat.name === 'avgRebounds') reb = stat.displayValue;
              if (stat.name === 'avgAssists') ast = stat.displayValue;
              if (stat.name === 'fieldGoalPct') fgPct = stat.displayValue + '%';
            });
          }
        });

        // Safely extract last game info if present
        const lg = data?.lastGame;
        const lastPts = lg?.stats?.find((s: any) => s.name === 'points')?.displayValue ?? lg?.points ?? '-';
        const lastReb = lg?.stats?.find((s: any) => s.name === 'rebounds')?.displayValue ?? lg?.rebounds ?? '-';
        const lastAst = lg?.stats?.find((s: any) => s.name === 'assists')?.displayValue ?? lg?.assists ?? '-';
        const opponent = lg?.opponent?.abbreviation || lg?.vsTeamAbbr || 'N/A';
        const gameDate = lg?.gameDate ? new Date(lg.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';

        return {
          ...player,
          seasonStats: { pts, reb, ast, fgPct },
          lastGame: { pts: lastPts, reb: lastReb, ast: lastAst, opponent, date: gameDate },
        };
      } catch (err) {
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
    console.error('Fatal error in Canadians API route:', error);
    return NextResponse.json({ error: 'Failed to fetch Canadian player stats' }, { status: 500 });
  }
}