// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        // Fetching the explicit stats endpoint with season specifier if needed
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error(`ESPN API returned ${res.status}`);
        }

        const data = await res.json();
        
        // Locate current season categories safely 
        // ESPN groups stats by splits (e.g. regular season vs preseason)
        const splits = data?.splits || data?.statistics?.splits || [];
        const currentSplit = splits.find((s: any) => s.season?.year === 2027 || s.name?.includes('Regular Season')) || splits[0];
        const categories = currentSplit?.categories || data?.categories || [];

        let ppg = '-';
        let rpg = '-';
        let apg = '-';
        let fgPct = '-';

        categories.forEach((cat: any) => {
          cat?.stats?.forEach((stat: any) => {
            const name = stat?.name?.toLowerCase() || '';
            const abbrev = stat?.abbreviation?.toUpperCase() || '';
            const val = stat?.displayValue;

            if (name === 'pointspergame' || name === 'avgpoints' || abbrev === 'PTS') ppg = val ?? ppg;
            if (name === 'reboundspergame' || name === 'avgrebounds' || abbrev === 'REB') rpg = val ?? rpg;
            if (name === 'assistspergame' || name === 'avgassists' || abbrev === 'AST') apg = val ?? apg;
            if (name === 'fieldgoalpercentage' || name === 'fieldgoalpct' || abbrev === 'FG%') {
              fgPct = val ? (val.includes('%') ? val : `${val}%`) : fgPct;
            }
          });
        });

        // Safely check last game data from the athlete overview/stats payload
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