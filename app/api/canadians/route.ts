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
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        // Extract stats from standard overview splits if available
        const seasonStatsObj = data?.statistics?.splits?.[0]?.stats || [];
        const ppg = seasonStatsObj.find((s: any) => s.name === 'points' || s.abbreviation === 'PTS')?.displayValue ?? '-';
        const rpg = seasonStatsObj.find((s: any) => s.name === 'rebounds' || s.abbreviation === 'REB')?.displayValue ?? '-';
        const apg = seasonStatsObj.find((s: any) => s.name === 'assists' || s.abbreviation === 'AST')?.displayValue ?? '-';
        const fgPct = seasonStatsObj.find((s: any) => s.name === 'fieldGoalPct' || s.abbreviation === 'FG%')?.displayValue ?? '-';

        // Extract last game details safely
        const lastGame = data?.lastGame || {};
        const lastPts = lastGame?.points ?? '-';
        const lastReb = lastGame?.rebounds ?? '-';
        const lastAst = lastGame?.assists ?? '-';
        const opponent = lastGame?.opponent?.abbreviation || lastGame?.vsTeamAbbr || 'N/A';
        const gameDate = lastGame?.gameDate 
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
            date: gameDate,
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