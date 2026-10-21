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
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/gamelog?season=2027`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();

        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        // 1. Season Averages Parsing (handles Averages, Totals, or top-level statistics)
        const seasonTypes = data?.seasonTypes || [];
        const regSeason = seasonTypes.find(
          (st: any) => String(st?.id) === '2' || st?.name?.toLowerCase().includes('regular')
        ) || seasonTypes[0];

        // Search categories inside seasonTypes or fallback to top-level categories/statistics
        const categories = regSeason?.categories || data?.categories || [];
        
        if (Array.isArray(categories) && categories.length > 0) {
          // Find Averages first, then Totals, or take the first category
          const statCat =
            categories.find((c: any) => c?.name === 'averages' || c?.displayName?.toLowerCase().includes('average')) ||
            categories.find((c: any) => c?.name === 'totals' || c?.displayName?.toLowerCase().includes('total')) ||
            categories[0];

          if (statCat && Array.isArray(statCat.labels) && Array.isArray(statCat.stats)) {
            const labels = statCat.labels.map((l: string) => String(l).toUpperCase());
            const stats = statCat.stats;

            const pIdx = labels.indexOf('PTS');
            const rIdx = labels.indexOf('REB');
            const aIdx = labels.indexOf('AST');
            const fgIdx = labels.indexOf('FG%');

            if (pIdx !== -1 && stats[pIdx] != null) pts = String(stats[pIdx]);
            if (rIdx !== -1 && stats[rIdx] != null) reb = String(stats[rIdx]);
            if (aIdx !== -1 && stats[aIdx] != null) ast = String(stats[aIdx]);
            if (fgIdx !== -1 && stats[fgIdx] != null) fgPct = String(stats[fgIdx]);
          }
        }

        // 2. Recent Game Box Score Parsing
        let lastGame = { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' };
        const rawEvents = data?.events || regSeason?.events || [];

        if (Array.isArray(rawEvents) && rawEvents.length > 0) {
          const latest = rawEvents[0];

          let lastPts = latest?.points ?? latest?.pts;
          let lastReb = latest?.rebounds ?? latest?.reb;
          let lastAst = latest?.assists ?? latest?.ast;

          const labels = (latest?.labels || data?.labels || []).map((l: string) => String(l).toUpperCase());
          const statsValues = latest?.stats || latest?.statsValues || [];

          if (Array.isArray(labels) && Array.isArray(statsValues)) {
            const pIdx = labels.indexOf('PTS');
            const rIdx = labels.indexOf('REB');
            const aIdx = labels.indexOf('AST');

            if (lastPts == null && pIdx !== -1 && statsValues[pIdx] != null) lastPts = statsValues[pIdx];
            if (lastReb == null && rIdx !== -1 && statsValues[rIdx] != null) lastReb = statsValues[rIdx];
            if (lastAst == null && aIdx !== -1 && statsValues[aIdx] != null) lastAst = statsValues[aIdx];
          }

          const oppAbbr =
            latest?.opponent?.abbreviation ||
            latest?.opponent?.displayName ||
            latest?.vsTeamAbbr ||
            'N/A';
          const gameDateRaw = latest?.gameDate || latest?.date;
          const formattedDate = gameDateRaw
            ? new Date(gameDateRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'N/A';

          lastGame = {
            pts: lastPts != null ? String(lastPts) : '-',
            reb: lastReb != null ? String(lastReb) : '-',
            ast: lastAst != null ? String(lastAst) : '-',
            opponent: oppAbbr,
            date: formattedDate,
          };
        }

        // Fallback: If seasonStats are still dashes but lastGame has stats, use lastGame as season baseline
        if (pts === '-' && lastGame.pts !== '-') {
          pts = lastGame.pts;
          reb = lastGame.reb;
          ast = lastGame.ast;
        }

        return {
          ...player,
          seasonStats: { pts, reb, ast, fgPct },
          lastGame,
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