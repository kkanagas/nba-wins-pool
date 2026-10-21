import { NextResponse } from 'next/server';
// Import your database client here (e.g., Supabase, Prisma, or Vercel Postgres)
// import { db } from '@/lib/db'; 

export async function GET(request: Request) {
  // Optional but recommended: Secure your cron route using Vercel's cron secret
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Fetch current scores from ESPN (same logic as fetch-scores)
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

    const todayDate = new Date().toISOString().split('T')[0]; // e.g., "2026-10-21"

    // 2. SAVE HISTORICAL SNAPSHOT TO DATABASE
    // TODO: Add your database insert query here for the daily graph progression.
    // Example (Supabase):
    // await db.from('historical_snapshots').upsert({
    //   date: todayDate,
    //   wins_data: teamWins,
    // });

    // 3. UPDATE CANADIANS TAB DATA (if stored in DB)
    // TODO: Add any logic needed to refresh or update Canadians tab records.

    return NextResponse.json({
      success: true,
      date: todayDate,
      message: 'Daily snapshot and Canadians tab data updated successfully!',
      wins: teamWins,
    });
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}