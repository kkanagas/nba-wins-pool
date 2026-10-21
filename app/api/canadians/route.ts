// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  try {
    // Fetch recent scoreboard / game summaries to extract active player stats
    const today = new Date();
    const dateStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('');

    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateStr}`,
      { cache: 'no-store' }
    );

    const playerStatsMap = new Map<number, any>();

    if (res.ok) {
      const data = await res.json();
      const events = data?.events || [];

      // Loop through games to check if any box scores are available
      for (const event of events) {
        const competition = event?.competitions?.[0];
        const eventId = event?.id;
        if (!eventId) continue;

        // Fetch detailed box score for each completed/active game
        try {
          const summaryRes = await fetch(
            `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`,
            { cache: 'no-store' }
          );
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            const boxscore = summaryData?.boxscore;
            if (boxscore?.players) {
              boxscore.players.forEach((teamStat: any) => {
                teamStat?.statistics?.forEach((statCategory: any) => {
                  statCategory?.athletes?.forEach((athleteObj: any) => {
                    const athleteId = Number(athleteObj?.athlete?.id);
                    const stats = athleteObj?.stats || [];
                    // ESPN basketball box score stat order typically: MIN, PTS, REB, AST, etc., or mapped by label
                    if (athleteId && stats.length > 0) {
                      playerStatsMap.set(athleteId, {
                        pts: stats[1] ?? '-',
                        reb: stats[2] ?? '-',
                        ast: stats[3] ?? '-',
                        fgPct: stats[4] ?? '-',
                        opponent: competition?.competitors?.find((c: any) => c.homeAway !== teamStat.homeAway)?.team?.abbreviation || 'N/A',
                        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      });
                    }
                  });
                });
              });
            }
          }
        } catch (e) {
          // Skip individual game summary error and continue
        }
      }
    }

    const results = CANADIAN_PLAYERS.map((player) => {
      const liveStats = playerStatsMap.get(player.id);
      if (liveStats) {
        return {
          ...player,
          seasonStats: { pts: liveStats.pts, reb: liveStats.reb, ast: liveStats.ast, fgPct: liveStats.fgPct },
          lastGame: { pts: liveStats.pts, reb: liveStats.reb, ast: liveStats.ast, opponent: liveStats.opponent, date: liveStats.date },
        };
      }

      return {
        ...player,
        seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' },
        lastGame: { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' },
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Fatal error in Canadians route:', error);
    return NextResponse.json({ error: 'Failed to fetch Canadian player stats' }, { status: 500 });
  }
}