// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error(`ESPN API returned ${res.status}`);
        }

        const data = await res.json();
        
        // ESPN stats endpoint stores metrics within category groups (e.g., general stats)
        const categories = data?.categories || data?.splits?.[0]?.categories || [];
        let ppg = '-';
        let rpg = '-';
        let apg = '-';
        let fgPct = '-';

        categories.forEach((cat: any) => {
          cat?.stats?.forEach((stat: any) => {
            const name = stat?.name?.toLowerCase() || '';
            const abbrev = stat?.abbreviation?.toUpperCase() || '';
            const val = stat?.displayValue;

            if (name === 'pointspergame' || abbrev === 'PTS') ppg = val ?? ppg;
            if (name === 'reboundspergame' || abbrev === 'REB') rpg = val ?? rpg;
            if (name === 'assistspergame' || abbrev === 'AST') apg = val ?? apg;
            if (name === 'fieldgoalpercentage' || abbrev === 'FG%') fgPct = val ? (val.includes('%') ? val : `${val}%`) : fgPct;
          });
        });

        // Fetch last game / log if available
        const lastGame = data?.lastGame || {};
        const lastPts = lastGame?.points ?? '-';
        const lastReb = lastGame?.rebounds ?? '-';
        const lastAst = lastGame?.assists ?? '-';
        const opponent = lastGame?.opponent?.abbreviation || lastGame?.vsTeamAbbr || 'N/A';
        const dateStr = lastGame?.gameDate
          ? new Date(lastGame.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        return {
          ...player,
          seasonStats: { pts: ppg, reb: rpg, ast: apg, fgPct },
          lastGame: { pts: lastPts, reb: lastReb, ast: lastAst, opponent, date: dateStr },
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