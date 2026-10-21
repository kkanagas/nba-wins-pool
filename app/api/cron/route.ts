// app/api/cron/route.ts
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const TEAM_NAME_MAP: Record<string, string[]> = {
  'Detroit': ['Detroit', 'Pistons', 'Detroit Pistons'],
  'Toronto': ['Toronto', 'Raptors', 'Toronto Raptors'],
  'Indiana': ['Indiana', 'Pacers', 'Indiana Pacers'],
  'Orlando': ['Orlando', 'Magic', 'Orlando Magic'],
  'Memphis': ['Memphis', 'Grizzlies', 'Memphis Grizzlies'],
  'LA Clippers': ['LA Clippers', 'Clippers', 'Los Angeles Clippers'],
  'Oklahoma City': ['Oklahoma City', 'Thunder', 'Oklahoma City Thunder'],
  'LA Lakers': ['LA Lakers', 'Lakers', 'Los Angeles Lakers'],
  'Denver': ['Denver', 'Nuggets', 'Denver Nuggets'],
  'Dallas': ['Dallas', 'Mavericks', 'Dallas Mavericks'],
  'Golden State': ['Golden State', 'Warriors', 'Golden State Warriors'],
  'Sacramento': ['Sacramento', 'Kings', 'Sacramento Kings'],
  'San Antonio': ['San Antonio', 'Spurs', 'San Antonio Spurs'],
  'Boston': ['Boston', 'Celtics', 'Boston Celtics'],
  'Cleveland': ['Cleveland', 'Cavaliers', 'Cleveland Cavaliers'],
  'Utah': ['Utah', 'Jazz', 'Utah Jazz'],
  'Washington': ['Washington', 'Wizards', 'Washington Wizards'],
  'Brooklyn': ['Brooklyn', 'Nets', 'Brooklyn Nets'],
  'New York': ['New York', 'Knicks', 'New York Knicks'],
  'Houston': ['Houston', 'Rockets', 'Houston Rockets'],
  'Miami': ['Miami', 'Heat', 'Miami Heat'],
  'Atlanta': ['Atlanta', 'Hawks', 'Atlanta Hawks'],
  'Charlotte': ['Charlotte', 'Hornets', 'Charlotte Hornets'],
  'Milwaukee': ['Milwaukee', 'Bucks', 'Milwaukee Bucks'],
  'Philadelphia': ['Philadelphia', '76ers', 'Philadelphia 76ers'],
  'Minnesota': ['Minnesota', 'Timberwolves', 'Minnesota Timberwolves'],
  'Portland': ['Portland', 'Trail Blazers', 'Blazers', 'Portland Trail Blazers'],
  'Phoenix': ['Phoenix', 'Suns', 'Phoenix Suns'],
  'New Orleans': ['New Orleans', 'Pelicans', 'New Orleans Pelicans'],
  'Chicago': ['Chicago', 'Bulls', 'Chicago Bulls'],
};

const DEFAULT_ROSTERS = [
  { draftOrder: 1, owner: 'Diriye', teamNames: ['Oklahoma City', 'LA Lakers', 'Denver', 'Dallas', 'Golden State', 'Sacramento'] },
  { draftOrder: 2, owner: 'Jack', teamNames: ['San Antonio', 'Boston', 'Cleveland', 'Utah', 'Washington', 'Brooklyn'] },
  { draftOrder: 3, owner: 'James', teamNames: ['New York', 'Houston', 'Miami', 'Atlanta', 'Charlotte', 'Milwaukee'] },
  { draftOrder: 4, owner: 'Jash', teamNames: ['Philadelphia', 'Minnesota', 'Portland', 'Phoenix', 'New Orleans', 'Chicago'] },
  { draftOrder: 5, owner: 'Karthik', teamNames: ['Detroit', 'Toronto', 'Indiana', 'Orlando', 'Memphis', 'LA Clippers'] },
];

const getTeamStat = (teamName: string, statObj: Record<string, number>): number => {
  if (statObj[teamName] !== undefined) return statObj[teamName];
  const aliases = TEAM_NAME_MAP[teamName] || [];
  for (const alias of aliases) {
    if (statObj[alias] !== undefined) return statObj[alias];
  }
  return 0;
};

export async function GET(request: Request) {
  try {
    // Fetch official NBA standings
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
        const teamName = entry?.team?.name;
        const location = entry?.team?.location;
        const displayName = entry?.team?.displayName;
        const abbrev = entry?.team?.abbreviation;

        const stats = entry?.stats || [];
        const wins = stats.find((s: any) => s.name === 'wins')?.value ?? 0;
        const losses = stats.find((s: any) => s.name === 'losses')?.value ?? 0;

        [teamName, location, displayName, abbrev].forEach((name) => {
          if (name) {
            teamWins[name] = wins;
            teamLosses[name] = losses;
          }
        });
      });
    });

    // Guard: Don't record a snapshot if wins data is empty
    if (Object.keys(teamWins).length === 0) {
      return NextResponse.json({ success: false, error: 'Empty wins data from ESPN standings' }, { status: 500 });
    }

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const snapshot: Record<string, any> = { date: todayStr };

    DEFAULT_ROSTERS.forEach((roster) => {
      const ownerWins = roster.teamNames.reduce((acc, name) => acc + getTeamStat(name, teamWins), 0);
      const ownerLosses = roster.teamNames.reduce((acc, name) => acc + getTeamStat(name, teamLosses), 0);
      snapshot[roster.owner] = ownerWins;
      snapshot[`${roster.owner}_losses`] = ownerLosses;
    });

    // Save snapshot to Vercel KV history
    await kv.hset('nba_wins_history', { [todayStr]: snapshot });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      snapshot,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}