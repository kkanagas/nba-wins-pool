import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

    if (data?.events) {
      data.events.forEach((event: any) => {
        const competition = event?.competitions?.[0];
        const competitors = competition?.competitors || [];
        
        competitors.forEach((competitor: any) => {
          const teamName = competitor?.team?.name;
          const records = competitor?.records || [];
          
          let wins = 0;
          let losses = 0;

          // Method 1: Parse from records summary string (e.g. "1-0")
          for (const record of records) {
            if (record.summary && typeof record.summary === 'string' && record.summary.includes('-')) {
              const parts = record.summary.split('-');
              if (parts.length === 2) {
                const parsedWins = parseInt(parts[0], 10);
                const parsedLosses = parseInt(parts[1], 10);
                if (!isNaN(parsedWins) && !isNaN(parsedLosses)) {
                  wins = parsedWins;
                  losses = parsedLosses;
                }
              }
            }
          }

          // Method 2: Fallback check if records array uses 'wins' and 'losses' objects explicitly
          if (wins === 0 && losses === 0 && Array.isArray(records)) {
            const wObj = records.find((r: any) => r.name === 'Wins' || r.type === 'wins');
            const lObj = records.find((r: any) => r.name === 'Losses' || r.type === 'losses');
            if (wObj) wins = parseInt(wObj.value, 10) || 0;
            if (lObj) losses = parseInt(lObj.value, 10) || 0;
          }

          if (teamName) {
            teamWins[teamName] = wins;
            teamLosses[teamName] = losses;
          }
        });
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'espn-scoreboard-robust',
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