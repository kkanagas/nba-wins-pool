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
        // Query gamelog with explicit 2026-27 season parameter (season=2027)
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/gamelog?season=2027&seasonType=2`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();

        // 1. Extract 2026-27 Regular Season per-game averages
        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        const seasonTypes = data?.seasonTypes || [];
        const regSeason = seasonTypes.find((st: any) => st?.id === '2' || st?.name?.toLowerCase().includes('regular')) || seasonTypes[0];
        
        const avgCategory = regSeason?.categories?.find((c: any) => c?.name === 'averages' || c?.displayName?.toLowerCase().includes('average'));

        if (avgCategory && Array.isArray(avgCategory.labels) && Array.isArray(avgCategory.stats)) {
          const labels = avgCategory.labels.map((l: string) => l.toUpperCase());
          const stats = avgCategory.stats;

          const pIdx = labels.indexOf('PTS');
          const rIdx = labels.indexOf('REB');
          const aIdx = labels.indexOf('AST');
          const fgIdx = labels.indexOf('FG%');

          if (pIdx !== -1 && stats[pIdx] != null) pts = String(stats[pIdx]);
          if (rIdx !== -1 && stats[rIdx] != null) reb = String(stats[rIdx]);
          if (aIdx !== -1 && stats[aIdx] != null) ast = String(stats[aIdx]);
          if (fgIdx !== -1 && stats[fgIdx] != null) fgPct = String(stats[fgIdx]);
        }

        // 2. Extract Last Game entry from events array
        let lastGame = { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' };
        const events = data?.events || [];

        if (events.length > 0) {
          const latestEvent = events[0];
          const statsValues = latestEvent?.stats || latestEvent?.statsValues || [];
          const labels = latestEvent?.labels || data?.labels || [];

          let lastPts = latestEvent?.points;
          let lastReb = latestEvent?.rebounds;
          let lastAst = latestEvent?.assists;

          if (Array.isArray(labels) && Array.isArray(statsValues)) {
            const labelsUpper = labels.map((l: string) => l.toUpperCase());
            const pIdx = labelsUpper.indexOf('PTS');
            const rIdx = labelsUpper.indexOf('REB');
            const aIdx = labelsUpper.indexOf('AST');

            if (pIdx !== -1 && statsValues[pIdx] != null) lastPts = statsValues[pIdx];
            if (rIdx !== -1 && statsValues[rIdx] != null) lastReb = statsValues[rIdx];
            if (aIdx !== -1 && statsValues[aIdx] != null) lastAst = statsValues[aIdx];
          }

          const oppAbbr = latestEvent?.opponent?.abbreviation || latestEvent?.vsTeamAbbr || 'N/A';
          const gameDateRaw = latestEvent?.gameDate || latestEvent?.date;
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