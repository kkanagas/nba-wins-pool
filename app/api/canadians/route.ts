// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error(`ESPN API returned ${res.status}`);
        }

        const data = await res.json();
        const athlete = data?.athlete || {};
        const statsObj = athlete?.statsSummary?.statistics || [];
        
        const ppg = statsObj.find((s: any) => s.name === 'avgPoints' || s.abbreviation === 'PTS')?.displayValue ?? '-';
        const rpg = statsObj.find((s: any) => s.name === 'avgRebounds' || s.abbreviation === 'REB')?.displayValue ?? '-';
        const apg = statsObj.find((s: any) => s.name === 'avgAssists' || s.abbreviation === 'AST')?.displayValue ?? '-';
        const fgPct = statsObj.find((s: any) => s.name === 'fieldGoalPct' || s.abbreviation === 'FG%')?.displayValue ?? '-';

        const lastGame = athlete?.lastGame || {};
        const lastPts = lastGame?.status?.period ? (lastGame?.points ?? '-') : '-';
        const lastReb = lastGame?.status?.period ? (lastGame?.rebounds ?? '-') : '-';
        const lastAst = lastGame?.status?.period ? (lastGame?.assists ?? '-') : '-';
        const opponent = lastGame?.opponent?.abbreviation || 'N/A';
        const dateStr = lastGame?.gameDate
          ? new Date(lastGame.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        return {
          ...player,
          seasonStats: {
            pts: ppg,
            reb: rpg,
            ast: apg,
            fgPct: fgPct !== '-' && !fgPct.includes('%') ? `${fgPct}%` : fgPct,
          },
          lastGame: {
            pts: lastPts,
            reb: lastReb,
            ast: lastAst,
            opponent,
            date: dateStr,
          },
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
    console.error('Fatal error in Canadians route:', error);
    return NextResponse.json({ error: 'Failed to fetch Canadian player stats' }, { status: 500 });
  }
}