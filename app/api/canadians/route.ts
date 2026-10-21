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
        // Switch to ESPN's athlete overview endpoint which reliably contains current season stats & last game info
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/overview`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = vawait res.json();
        
        // Extract statistics from overview payload structure
        const statsSummary = data?.statisticsSummary || data?.seasonStatistics || {};
        const categories = statsSummary?.categories || data?.categories || [];

        let ppg = '-';
        let rpg = '-';
        let apg = '-';
        let fgPct = '-';

        categories.forEach((cat: any) => {
          cat?.stats?.forEach((stat: any) => {
            const name = stat?.name?.toLowerCase() || '';
            const abbrev = stat?.abbreviation?.toUpperCase() || '';
            const val = stat?.displayValue || stat?.value;

            if (name === 'pointspergame' || name === 'avgpoints' || abbrev === 'PTS') ppg = val ?? ppg;
            if (name === 'reboundspergame' || name === 'avgrebounds' || abbrev === 'REB') rpg = val ?? rpg;
            if (name === 'assistspergame' || name === 'avgassists' || abbrev === 'AST') apg = val ?? apg;
            if (name === 'fieldgoalpercentage' || name === 'fieldgoalpct' || abbrev === 'FG%') {
              fgPct = val ? (String(val).includes('%') ? String(val) : `${val}%`) : fgPct;
            }
          });
        });

        // Fallback check if top-level averages exist in overview
        if (ppg === '-' && data?.generals) {
          // parse from generals if available
        }

        const lastGame = data?.lastGame || data?.events?.[0] || {};
        const lastPts = lastGame?.points ?? lastGame?.statWins ?? '-';
        const lastReb = lastGame?.rebounds ?? '-';
        const lastAst = lastGame?.assists ?? '-';
        const opponent = lastGame?.opponent?.abbreviation || lastGame?.vsTeamAbbr || 'N/A';
        const dateStr = lastGame?.gameDate
          ? new Date(lastGame.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        return {
          ...player,
          seasonStats: { 
            pts: ppg, 
            reb: rpg, 
            ast: apg, 
            fgPct: fgPct !== '-' && !String(fgPct).includes('%') ? `${fgPct}%` : fgPct 
          },
          lastGame: { 
            pts: lastPts, 
            reb: lastReb, 
            ast: lastAst, 
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