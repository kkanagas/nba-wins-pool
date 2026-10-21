// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      try {
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/overview`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error(`ESPN API returned ${res.status}`);
        }

        const data = await res.json();
        
        // Target the current season regular season statistics block
        const splits = data?.statistics?.splits || [];
        // Find the split that represents regular season or current year
        const currentSplit = splits.find((s: any) => s.season?.year === 2027 || s.type === 'regular') || splits[0];
        const categories = currentSplit?.categories || [];

        let ppg = '-';
        let rpg = '-';
        let apg = '-';
        let fgPct = '-';

        // Only parse if we are looking at active current stats, otherwise leave as '-'
        categories.forEach((cat: any) => {
          cat?.stats?.forEach((stat: any) => {
            const name = stat?.name?.toLowerCase() || '';
            const abbrev = stat?.abbreviation?.toUpperCase() || '';
            const val = stat?.displayValue;

            if (name === 'avgpoints' || abbrev === 'PTS') ppg = val ?? ppg;
            if (name === 'avgrebounds' || abbrev === 'REB') rpg = val ?? rpg;
            if (name === 'avgassists' || abbrev === 'AST') apg = val ?? apg;
            if (name === 'fieldgoalpct' || abbrev === 'FG%') fgPct = val ? (val.includes('%') ? val : `${val}%`) : fgPct;
          });
        });

        // Last game info
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