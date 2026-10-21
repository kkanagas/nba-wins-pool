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
        const categories = data?.categories || [];

        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        // Find the specific 'averages' category to ensure we get per-game numbers, not cumulative totals
        const averagesCat = categories.find((cat: any) => cat?.name === 'averages');

        if (averagesCat && Array.isArray(averagesCat.labels) && Array.isArray(averagesCat.stats)) {
          const labels = averagesCat.labels.map((l: string) => l.toUpperCase());
          const stats = averagesCat.stats;

          const ptsIndex = labels.indexOf('PTS');
          const rebIndex = labels.indexOf('REB');
          const astIndex = labels.indexOf('AST');
          const fgIndex = labels.indexOf('FG%');

          if (ptsIndex !== -1 && stats[ptsIndex] != null) pts = String(stats[ptsIndex]);
          if (rebIndex !== -1 && stats[rebIndex] != null) reb = String(stats[rebIndex]);
          if (astIndex !== -1 && stats[astIndex] != null) ast = String(stats[astIndex]);
          if (fgIndex !== -1 && stats[fgIndex] != null) fgPct = String(stats[fgIndex]);
        }

        // Parse last game summary if available
        const lastGame = data?.lastGame || {};
        const lastPts = lastGame?.points ?? '-';
        const lastReb = lastGame?.rebounds ?? '-';
        const lastAst = lastGame?.assists ?? '-';
        const opponent = lastGame?.opponent?.abbreviation || 'N/A';
        const dateStr = lastGame?.gameDate
          ? new Date(lastGame.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        return {
          ...player,
          seasonStats: { pts, reb, ast, fgPct },
          lastGame: { 
            pts: String(lastPts), 
            reb: String(lastReb), 
            ast: String(lastAst), 
            opponent, 
            date: dateStr 
          },
        };
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