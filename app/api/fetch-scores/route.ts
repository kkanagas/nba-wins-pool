import { NextResponse } from 'next/server';

const REGULAR_SEASON_START = new Date('2026-10-20T00:00:00Z');

export async function GET() {
  try {
    const today = new Date();

    // Guard: Force 0 wins/losses before regular season tips off on Oct 20, 2026
    if (today < REGULAR_SEASON_START) {
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        source: 'preseason-guard',
        wins: {},
        losses: {},
      });
    }

    // Explicitly query regular season standings (seasontype=2)
    const response = await fetch(
      'https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?seasontype=2',
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`ESPN API responded with status ${response.status}`);
    }

    const data = await response.json();
    const teamWins: Record<string, number> = {};
    const teamLosses: Record<string, number> = {};

    if (data?.children) {
      data.children.forEach((conference: any) => {
        const entries = conference?.standings?.entries || [];
        entries.forEach((entry: any) => {
          const teamName = entry?.team?.name;
          const stats = entry?.stats || [];
          
          const winsStat = stats.find((s: any) => s.name === 'wins' || s.type === 'wins');
          const lossesStat = stats.find((s: any) => s.name === 'losses' || s.type === 'losses');
          
          const wins = winsStat ? parseInt(winsStat.value, 10) : 0;
          const losses = lossesStat ? parseInt(lossesStat.value, 10) : 0;

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
      source: 'espn-api',
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