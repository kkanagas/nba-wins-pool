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
        
        // ESPN stores per-season splits under seasonTypes[].categories[] or directly under categories[]
        let categories: any[] = [];
        if (Array.isArray(data?.seasonTypes)) {
          // Flatten categories from all active season types (Regular Season preferred)
          for (const st of data.seasonTypes) {
            if (Array.isArray(st?.categories)) {
              categories.push(...st.categories);
            }
          }
        }
        if (categories.length === 0 && Array.isArray(data?.categories)) {
          categories = data.categories;
        }

        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        // Find category containing per-game averages
        const avgCat = categories.find((c: any) => {
          const name = (c?.name || c?.displayName || '').toLowerCase();
          return name.includes('average') || name === 'averages';
        }) || categories[0];

        if (avgCat && Array.isArray(avgCat.labels)) {
          const labels = avgCat.labels.map((l: string) => l.toUpperCase());
          // Stats values can be in avgCat.stats or inside a totals/values array
          const statsValues = Array.isArray(avgCat.stats) ? avgCat.stats : (avgCat.totals || []);

          const ptsIdx = labels.indexOf('PTS');
          const rebIdx = labels.indexOf('REB');
          const astIdx = labels.indexOf('AST');
          const fgIdx = labels.indexOf('FG%');

          if (ptsIdx !== -1 && statsValues[ptsIdx] !== undefined) pts = String(statsValues[ptsIdx]);
          if (rebIdx !== -1 && statsValues[rebIdx] !== undefined) reb = String(statsValues[rebIdx]);
          if (astIdx !== -1 && statsValues[astIdx] !== undefined) ast = String(statsValues[astIdx]);
          if (fgIdx !== -1 && statsValues[fgIdx] !== undefined) fgPct = String(statsValues[fgIdx]);
        }

        // Parse last game boxscore summary if present
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