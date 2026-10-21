// app/api/fetch-scores/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://site.api.espn.com/apis/v2/sports/basketball/nba/standings',
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`ESPN API responded with status ${response.status}`);
    }

    const data = await response.json();
    const teamWins: Record<string, number> = {};
    const teamLosses: Record<string, number> = {};

    const children = data?.children || [];
    children.forEach((conference: any) => {
      const entries = conference?.standings?.entries || [];
      entries.forEach((entry: any) => {
        const teamName = entry?.team?.name;         // e.g. "Celtics"
        const location = entry?.team?.location;     // e.g. "Boston"
        const displayName = entry?.team?.displayName; // e.g. "Boston Celtics"
        const abbrev = entry?.team?.abbreviation;   // e.g. "BOS"

        const stats = entry?.stats || [];
        const wins = stats.find((s: any) => s.name === 'wins')?.value ?? 0;
        const losses = stats.find((s: any) => s.name === 'losses')?.value ?? 0;

        // Map all potential naming keys used in your rosters and aliases
        [teamName, location, displayName, abbrev].forEach((name) => {
          if (name) {
            teamWins[name] = wins;
            teamLosses[name] = losses;
          }
        });
      });
    });

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