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
        // Query ESPN's athlete endpoint
        const res = await fetch(
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();
        
        // Let's safely inspect the categories/splits structure returned by ESPN
        // ESPN typically wraps stats in: data.splits (array) -> categories (array) -> stats (array)
        const splits = data?.splits || data?.stats?.splits || [];
        const regularSplit = splits.find((s: any) => s.type === 'regular' || s.name?.toLowerCase().includes('regular')) || splits[0];
        const categories = regularSplit?.categories || data?.categories || [];

        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        categories.forEach((cat: any) => {
          const statsArray = cat?.stats || [];
          statsArray.forEach((stat: any) => {
            const name = (stat?.name || stat?.abbreviation || stat?.label || '').toLowerCase();
            const val = stat?.displayValue || stat?.value;

            if (val !== undefined && val !== null) {
              if (['pts', 'points', 'pointspergame'].includes(name)) pts = String(val);
              if (['reb', 'rebounds', 'reboundspergame'].includes(name)) reb = String(val);
              if (['ast', 'assists', 'assistspergame'].includes(name)) ast = String(val);
              if (['fgpct', 'fieldgoalpercentage', 'fg%'].includes(name)) fgPct = String(val);
            }
          });
        });

        // Also check if lastGame data exists inside the profile response
        const lastGame = data?.lastGame || data?.events?.[0] || {};
        const lastPts = lastGame?.points ?? lastGame?.statValue ?? '-';
        const lastReb = lastGame?.rebounds ?? '-';
        const lastAst = lastGame?.assists ?? '-';
        const opponent = lastGame?.opponent?.abbreviation || lastGame?.vsTeamAbbr || 'N/A';
        const dateStr = lastGame?.gameDate
          ? new Date(lastGame.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        return {
          ...player,
          seasonStats: { pts, reb, ast, fgPct },
          lastGame: { 
            pts: String(lastPts), 
            reb: String(lastReb), 
            ast: String(lastAst), 
            opponent, 
            date: dateStr 
          },
        };
      } catch (err) {
        console.error(`Error fetching stats for player ${player.id}:`, err);
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