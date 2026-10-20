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
        const isCompleted = competition?.status?.type?.completed;

        // Only process games that have actually gone final
        if (isCompleted) {
          competitors.forEach((competitor: any) => {
            const teamName = competitor?.team?.name; // e.g., "Pistons", "Celtics"
            const winner = competitor?.winner; // boolean true/false

            if (teamName) {
              // Initialize if not present
              if (teamWins[teamName] === undefined) teamWins[teamName] = 0;
              if (teamLosses[teamName] === undefined) teamLosses[teamName] = 0;

              if (winner === true) {
                teamWins[teamName] += 1;
              } else if (winner === false) {
                teamLosses[teamName] += 1;
              }
            }
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'espn-live-status-parser',
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