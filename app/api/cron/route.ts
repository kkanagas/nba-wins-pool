import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const ROSTERS = [
  { owner: 'Diriye', teamNames: ['Oklahoma City', 'LA Lakers', 'Denver', 'Dallas', 'Golden State', 'Sacramento'] },
  { owner: 'Jack', teamNames: ['San Antonio', 'Boston', 'Cleveland', 'Utah', 'Washington', 'Brooklyn'] },
  { owner: 'James', teamNames: ['New York', 'Houston', 'Miami', 'Atlanta', 'Charlotte', 'Milwaukee'] },
  { owner: 'Jash', teamNames: ['Philadelphia', 'Minnesota', 'Portland', 'Phoenix', 'New Orleans', 'Chicago'] },
  { owner: 'Karthik', teamNames: ['Detroit', 'Toronto', 'Indiana', 'Orlando', 'Memphis', 'LA Clippers'] },
];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Fetch NBA Standings from ESPN to get accurate cumulative wins/losses
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

    // Parse cumulative standings from ESPN
    if (data?.children) {
      data.children.forEach((conference: any) => {
        const standingsEntries = conference?.standings?.entries || [];
        standingsEntries.forEach((entry: any) => {
          const teamName = entry?.team?.name;
          const stats = entry?.stats || [];
          const winsStat = stats.find((s: any) => s.name === 'wins' || s.type === 'wins');
          const lossesStat = stats.find((s: any) => s.name === 'losses' || s.type === 'losses');

          if (teamName) {
            teamWins[teamName] = winsStat?.value ?? 0;
            teamLosses[teamName] = lossesStat?.value ?? 0;
          }
        });
      });
    }

    const todayDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    const snapshot: Record<string, any> = { date: todayDateStr };
    ROSTERS.forEach((roster) => {
      const wins = roster.teamNames.reduce((sum, team) => sum + (teamWins[team] || 0), 0);
      const losses = roster.teamNames.reduce((sum, team) => sum + (teamLosses[team] || 0), 0);
      snapshot[roster.owner] = wins;
      snapshot[`${roster.owner}_losses`] = losses;
    });

    await kv.hset('nba_wins_history', {
      [todayDateStr]: JSON.stringify(snapshot),
    });

    return NextResponse.json({
      success: true,
      date: todayDateStr,
      message: 'Daily snapshot updated successfully in Vercel KV!',
      snapshot,
    });
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}