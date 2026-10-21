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
        // Fetch athlete stats without strict season query param to ensure current active data is returned
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();
        
        // Flexible split selection: grab the regular season split or default to the latest/first available
        const splits = data?.splits || data?.statistics?.splits || [];
        const regularSplit = splits.find((s: any) => s.type === 'regular' || s.name?.includes('Regular')) || splits[0] || {};
        const categories = regularSplit?.categories || data?.categories || [];

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

        // Parse last game info if available
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
          seasonStats: { 
            pts: ppg, 
            reb: rpg, 
            ast: apg, 
            fgPct: fgPct !== '-' && !fgPct.includes('%') ? `${fgPct}%` : fgPct 
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