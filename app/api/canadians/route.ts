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
          `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/stats`,
          { cache: 'no-store' }
        );

        if (!res.ok) return emptyResult;

        const data = await res.json();
        
        // Categories live directly on data.categories based on our log schema inspection
        const categories = data?.categories || [];
        
        let pts = '-';
        let reb = '-';
        let ast = '-';
        let fgPct = '-';

        categories.forEach((cat: any) => {
          const labels = cat?.labels || [];
          // Stats can be in 'stats' array or nested under display values
          const statsValues = cat?.stats || cat?.totals || [];

          // Sometimes stats are formatted as an array of values mapping 1:1 to labels
          labels.forEach((label: string, index: number) => {
            const val = statsValues[index];
            if (val !== undefined && val !== null) {
              const upperLabel = label.toUpperCase();
              if (upperLabel === 'PTS') pts = String(val);
              if (upperLabel === 'REB') reb = String(val);
              if (upperLabel === 'AST') ast = String(val);
              if (upperLabel === 'FG%') fgPct = String(val);
            }
          });

          // Alternatively, if stats is an array of objects with name/displayValue properties
          if (Array.isArray(statsValues)) {
            statsValues.forEach((statItem: any) => {
              if (statItem && typeof statItem === 'object') {
                const name = (statItem.name || statItem.abbreviation || '').toUpperCase();
                const displayVal = statItem.displayValue || statItem.value;
                if (displayVal !== undefined) {
                  if (name === 'PTS' || name === 'POINTS') pts = String(displayVal);
                  if (name === 'REB' || name === 'REBOUNDS') reb = String(displayVal);
                  if (name === 'AST' || name === 'ASSISTS') ast = String(displayVal);
                  if (name === 'FG%' || name === 'FIELDGOALPERCENTAGE') fgPct = String(displayVal);
                }
              }
            });
          }
        });

        // Parse last game details if available in the response feed
        const lastGame = data?.lastGame || data?.events?.[0] || {};
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
          lastGame: { 
            pts: String(lastPts), 
            reb: String(lastReb), 
            ast: String(lastAst), 
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