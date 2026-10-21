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

        // 1. Extract Season Averages from seasonTypes
        const seasonTypes = data?.seasonTypes || [];
        const regSeason = seasonTypes.find(
          (st: any) => String(st?.id) === '2' || st?.name?.toLowerCase().includes('regular')
        );

        if (regSeason?.categories && Array.isArray(regSeason.categories)) {
          const avgCat = regSeason.categories.find(
            (c: any) => c?.name === 'averages' || c?.displayName?.toLowerCase().includes('average')
          ) || regSeason.categories[0];

          if (avgCat && Array.isArray(avgCat.labels) && Array.isArray(avgCat.stats)) {
            const labels = avgCat.labels.map((l: string) => String(l).toUpperCase());
            const stats = avgCat.stats;

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

        // 2. Extract Recent Game Box Score safely
        let lastGame = { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' };
        const rawEvents = data?.events || [];

        // Check if rawEvents actually contains game logs (has gameDate/opponent)
        const gameEvents = rawEvents.filter((e: any) => e?.gameDate || e?.opponent || e?.vsTeamAbbr);

        if (gameEvents.length > 0) {
          const latest = gameEvents[0];
          const labels = (latest?.labels || data?.labels || []).map((l: string) => String(l).toUpperCase());
          const statsValues = latest?.stats || latest?.statsValues || [];

          let lastPts = latest?.points;
          let lastReb = latest?.rebounds;
          let lastAst = latest?.assists;

          if (Array.isArray(labels) && Array.isArray(statsValues) && statsValues.length > 0) {
            const pIdx = labels.indexOf('PTS');
            const rIdx = labels.indexOf('REB');
            const aIdx = labels.indexOf('AST');

            if (pIdx !== -1 && statsValues[pIdx] != null) lastPts = statsValues[pIdx];
            if (rIdx !== -1 && statsValues[rIdx] != null) lastReb = statsValues[rIdx];
            if (aIdx !== -1 && statsValues[aIdx] != null) lastAst = statsValues[aIdx];
          }

          const oppAbbr = latest?.opponent?.abbreviation || latest?.vsTeamAbbr || 'N/A';
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