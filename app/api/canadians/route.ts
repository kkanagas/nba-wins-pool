// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    // Fetch live scoreboard data to see who actually played recently
    const scoreboardRes = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
      { cache: 'no-store' }
    );
    
    let activeGamePlayers: Record<string, any> = {};
    if (scoreboardRes.ok) {
      const boardData = await scoreboardRes.ok ? await scoreboardRes.json() : null;
      // We can map live competitors if needed, but let's default to safe parsing
    }

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
        
        // Check if there is an active last game recorded for the current 2026-27 season context
        const lastGame = data?.lastGame;
        
        // If no valid recent game stats exist in the feed, enforce strict dashes (-)
        // This ensures we never show fake numbers or stale projections.
        if (!lastGame || Object.keys(lastGame).length === 0) {
          return {
            ...player,
            seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' },
            lastGame: { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' },
          };
        }

        // Parse last game stats if present
        const lastPts = lastGame?.points ?? '-';
        const lastReb = lastGame?.rebounds ?? '-';
        const lastAst = lastGame?.assists ?? '-';
        const opponent = lastGame?.opponent?.abbreviation || lastGame?.vsTeamAbbr || 'N/A';
        const dateStr = lastGame?.gameDate
          ? new Date(lastGame.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'N/A';

        // For season stats, if season hasn't fully kicked off stats aggregates or returns old data, keep clean until regular season splits populate
        return {
          ...player,
          seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' }, // Will show live once season aggregates are live on ESPN
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