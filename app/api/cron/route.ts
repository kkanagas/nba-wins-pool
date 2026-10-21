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
            const teamName = competitor?.team?.name;
            const winner = competitor?.winner;

            if (teamName) {
              if (teamWins[teamName] === undefined) teamWins[teamName] = 0;
              if (teamLosses[teamName] === undefined) teamLosses[teamName] = 0;

              if (winner === true) teamWins[teamName] += 1;
              else if (winner === false) teamLosses[teamName] += 1;
            }
          });
        }
      });
    }

    const todayDate = new Date().toISOString().split('T')[0]; // "2026-10-21"

    // Map raw team stats to pool owners
    const snapshot: Record<string, any> = {};
    ROSTERS.forEach((roster) => {
      const wins = roster.teamNames.reduce((sum, team) => sum + (teamWins[team] || 0), 0);
      const losses = roster.teamNames.reduce((sum, team) => sum + (teamLosses[team] || 0), 0);
      snapshot[roster.owner] = wins;
      snapshot[`${roster.owner}_losses`] = losses;
    });

    // Save owner snapshot to Redis hash
    await kv.hset('nba_wins_history', {
      [todayDate]: JSON.stringify(snapshot),
    });

    return NextResponse.json({
      success: true,
      date: todayDate,
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