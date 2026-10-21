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
        // Fetch from ESPN's core stats endpoint for the athlete
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();
        
        // Safely traverse categories / splits
        const categories = data?.categories || data?.splits?.[0]?.categories || [];
        
        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        categories.forEach((cat: any) => {
          const stats = cat?.stats || [];
          stats.forEach((stat: any) => {
            const name = (stat?.name || stat?.abbreviation || '').toLowerCase();
            const val = stat?.displayValue || stat?.value;
            
            if (val !== undefined && val !== null) {
              if (name === 'pts' || name === 'points' || name === 'pointspergame') pts = String(val);
              if (name === 'reb' || name === 'rebounds' || name === 'reboundspergame') reb = String(val);
              if (name === 'ast' || name === 'assists' || name === 'assistspergame') ast = String(val);
              if (name === 'fgpct' || name === 'fieldgoalpercentage') fgPct = String(val);
            }
          });
        });

        // Also check statistics summary array if present
        if (data?.statistics) {
          data.statistics.forEach((statGroup: any) => {
            statGroup?.stats?.forEach((s: any) => {
              const name = (s?.name || s?.abbreviation || '').toLowerCase();
              const val = s?.displayValue || s?.value;
              if (val !== undefined) {
                if (name === 'pts' || name === 'points') pts = String(val);
                if (name === 'reb' || name === 'rebounds') reb = String(val);
                if (name === 'ast' || name === 'assists') ast = String(val);
                if (name === 'fgpct' || name === 'fieldgoalpercentage') fgPct = String(val);
              }
            });
          });
        }

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