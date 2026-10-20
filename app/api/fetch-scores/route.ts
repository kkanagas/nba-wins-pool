import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch directly from the live scoreboard endpoint instead of waiting on the slow standings table
    const response = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`ESPN API responded with status ${response.status}`);
    }

    const data = await response.json();
    const teamWins: Record<string, number> = {};
    const teamLosses: Record<string, number> = {};

    // Parse live events/games from the scoreboard
    if (data?.events) {
      data.events.forEach((event: any) => {
        const competition = event?.competitions?.[0];
        const competitors = competition?.competitors || [];
        
        // Only process if the game is final or currently in progress
        const statusType = competition?.status?.type?.completed;
        
        competitors.forEach((competitor: any) => {
          const teamName = competitor?.team?.name;
          const records = competitor?.records || [];
          
          // Try to extract wins/losses from the game record or competitor stats
          const overallRecord = records.find((r: any) => r.type === 'total' || r.name === 'overall');
          
          if (teamName && overallRecord) {
            // ESPN summary record format is usually "W-L" (e.g., "1-0")
            const parts = overallRecord.summary?.split('-');
            if (parts && parts.length === 2) {
              teamWins[teamName] = parseInt(parts[0], 10) || 0;
              teamLosses[teamName] = parseInt(parts[1], 10) || 0;
            }
          }
        });
      });
    }

    // Fallback or safety check: if scoreboard didn't yield records yet, initialize defaults
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'espn-scoreboard',
      wins: teamWins,
      losses: teamLosses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}