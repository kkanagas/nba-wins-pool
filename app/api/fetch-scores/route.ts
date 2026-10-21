// app/api/fetch-scores/route.ts
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

        if (isCompleted) {
          competitors.forEach((competitor: any) => {
            const teamName = competitor?.team?.name; // e.g., "Pistons"
            const location = competitor?.team?.location; // e.g., "Detroit"
            const displayName = competitor?.team?.displayName; // e.g., "Detroit Pistons"
            const winner = competitor?.winner; // boolean

            // Register wins/losses under all possible name variations to match page.tsx maps
            [teamName, location, displayName].forEach((name) => {
              if (name) {
                if (teamWins[name] === undefined) teamWins[name] = 0;
                if (teamLosses[name] === undefined) teamLosses[name] = 0;

                if (winner === true) {
                  teamWins[name] += 1;
                } else if (winner === false) {
                  teamLosses[name] += 1;
                }
              }
            });
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
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