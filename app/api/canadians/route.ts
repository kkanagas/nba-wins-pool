// app/api/canadians/route.ts
import { NextResponse } from 'next/server';
import { CANADIAN_PLAYERS } from '@/data/canadian-players';

export async function GET() {
  const apiKey = process.env.BALLDONTLIE_API_KEY;

  if (!apiKey) {
    console.error('Missing BALLDONTLIE_API_KEY environment variable');
    return NextResponse.json(
      { error: 'BALLDONTLIE_API_KEY environment variable is not configured' },
      { status: 500 }
    );
  }

  const headers = { Authorization: apiKey };

  try {
    const playerStatsPromises = CANADIAN_PLAYERS.map(async (player) => {
      const emptyResult = {
        ...player,
        seasonStats: { pts: '-', reb: '-', ast: '-', fgPct: '-' },
        lastGame: { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' },
      };

      try {
        // 1. Fetch Season Averages
        const seasonAvgRes = await fetch(
          `https://api.balldontlie.io/v1/season_averages?season=2026&player_ids[]=${player.id}`,
          { headers, cache: 'no-store' }
        );

        let seasonStats = { pts: '-', reb: '-', ast: '-', fgPct: '-' };

        if (seasonAvgRes.ok) {
          const avgData = await seasonAvgRes.json();
          if (Array.isArray(avgData.data) && avgData.data.length > 0) {
            const avg = avgData.data[0];
            seasonStats = {
              pts: avg.pts != null ? Number(avg.pts).toFixed(1) : '-',
              reb: avg.reb != null ? Number(avg.reb).toFixed(1) : '-',
              ast: avg.ast != null ? Number(avg.ast).toFixed(1) : '-',
              fgPct: avg.fg_pct != null ? `${(avg.fg_pct * 100).toFixed(1)}%` : '-',
            };
          }
        }

        // 2. Fetch Most Recent Game Box Score
        const statsRes = await fetch(
          `https://api.balldontlie.io/v1/stats?player_ids[]=${player.id}&seasons[]=2026&per_page=1`,
          { headers, cache: 'no-store' }
        );

        let lastGame = { pts: '-', reb: '-', ast: '-', opponent: 'N/A', date: 'N/A' };

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (Array.isArray(statsData.data) && statsData.data.length > 0) {
            const latest = statsData.data[0];

            const opponent =
              latest.game?.home_team_id === latest.team?.id
                ? latest.game?.visitor_team_abbr || 'N/A'
                : latest.game?.home_team_abbr || 'N/A';

            const formattedDate = latest.game?.date
              ? new Date(latest.game.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC',
                })
              : 'N/A';

            lastGame = {
              pts: latest.pts != null ? String(latest.pts) : '-',
              reb: latest.reb != null ? String(latest.reb) : '-',
              ast: latest.ast != null ? String(latest.ast) : '-',
              opponent,
              date: formattedDate,
            };
          }
        }

        if (seasonStats.pts === '-' && lastGame.pts !== '-') {
          seasonStats = {
            pts: lastGame.pts,
            reb: lastGame.reb,
            ast: lastGame.ast,
            fgPct: '-',
          };
        }

        return {
          ...player,
          seasonStats,
          lastGame,
        };
      } catch (err) {
        console.error(`Error fetching stats for player ID ${player.id}:`, err);
        return emptyResult;
      }
    });

    const results = await Promise.all(playerStatsPromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Fatal error in Canadians route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Canadian player stats from balldontlie' },
      { status: 500 }
    );
  }
}