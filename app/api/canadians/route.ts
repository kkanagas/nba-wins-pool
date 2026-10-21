// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        // Fetch real player profile data from ESPN's public API
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/overview`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error(`ESPN returned status ${res.status}`);
        }

        const data = await res.json();
        
        // Extract real season stats from ESPN response
        const statsSummary = data?.statistics?.splits?.[0]?.stats || [];
        // Typically ESPN indexes: PPG, RPG, APG, FG%
        const pts = statsSummary[0]?.displayValue ?? '-';
        const reb = statsSummary[1]?.displayValue ?? '-';
        const ast = statsSummary[2]?.displayValue ?? '-';
        const fgPct = statsSummary[3]?.displayValue ?? '-';

        // Extract last game stats
        const lastGameData = data?.lastGame || {};
        const lastPts = lastGameData?.points ?? '-';
        const lastReb = lastGameData?.rebounds ?? '-';
        const lastAst = lastGameData?.assists ?? '-';
        const opponent = lastGameData?.opponent?.abbreviation || 'N/A';
        const gameDate = lastGameData?.gameDate 
          ? new Date(lastGameData.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        return {
          ...player,
          seasonStats: { pts, reb, ast, fgPct },
          lastGame: { pts: lastPts, reb: lastReb, ast: lastAst, opponent, date: gameDate },
        };
      } catch (err) {
        // Fallback to dashes on failure or missing data
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