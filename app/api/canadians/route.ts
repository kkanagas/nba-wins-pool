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
        // Fetch from ESPN's public athlete endpoint
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/overview`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();
        
        // Parse statistics dynamically from the overview payload
        const statistics = data?.statistics || data?.seasonStatistics || {};
        const splits = statistics?.splits || data?.splits || [];
        
        // Find regular season split or default to the first available split
        const currentSplit = splits.find((s: any) => s.type === 'regular' || s.name?.includes('Regular')) || splits[0] || {};
        const statsList = currentSplit?.stats || currentSplit?.categories || [];

        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        // Helper to map stats dynamically
        const extractStats = (statObj: any) => {
          const name = (statObj?.name || statObj?.abbreviation || '').toLowerCase();
          const val = statObj?.displayValue || statObj?.value;
          if (val !== undefined) {
            if (name === 'pts' || name === 'points' || name === 'pointspergame') pts = String(val);
            if (name === 'reb' || name === 'rebounds' || name === 'reboundspergame') reb = String(val);
            if (name === 'ast' , name === 'assists' || name === 'assistspergame') ast = String(val);
            if (name === 'fgpct' || name === 'fieldgoalpercentage') fgPct = String(val);
          }
        };

        if (Array.isArray(statsList)) {
          statsList.forEach((item: any) => {
            if (item?.stats) {
              item.stats.forEach(extractStats);
            } else {
              extractStats(item);
            }
          });
        }

        // Parse last game info if present in overview
        const lastGameData = data?.lastGame || data?.events?.[0] || {};
        const lastPts = lastGameData?.points ?? lastGameData?.statValue ?? '-';
        const lastReb = lastGameData?.rebounds ?? '-';
        const lastAst = lastGameData?.assists ?? '-';
        const opponent = lastGameData?.opponent?.abbreviation || lastGameData?.vsTeamAbbr || 'N/A';
        const dateStr = lastGameData?.gameDate
          ? new Date(lastGameData.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        return {
          ...player,
          seasonStats: { pts, reb, ast, fgPct },
          lastGame: { pts: String(lastPts), reb: String(lastReb), ast: String(lastAst), opponent, date: dateStr },
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