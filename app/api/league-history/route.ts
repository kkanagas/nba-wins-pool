import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CURRENT_ROSTERS_2026 = [
  { owner: 'Diriye', teams: ['Oklahoma City', 'LA Lakers', 'Denver', 'Dallas', 'Golden State', 'Sacramento'] },
  { owner: 'Jack', teams: ['San Antonio', 'Boston', 'Cleveland', 'Utah', 'Washington', 'Brooklyn'] },
  { owner: 'James', teams: ['New York', 'Houston', 'Miami', 'Atlanta', 'Charlotte', 'Milwaukee'] },
  { owner: 'Jash', teams: ['Philadelphia', 'Minnesota', 'Portland', 'Phoenix', 'New Orleans', 'Chicago'] },
  { owner: 'Karthik', teams: ['Detroit', 'Toronto', 'Indiana', 'Orlando', 'Memphis', 'LA Clippers'] },
];

export async function GET() {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'league-history.json');
    const draftPath = path.join(process.cwd(), 'data', 'draft-history.json');
    const seasonsPath = path.join(process.cwd(), 'data', 'past-seasons.json');

    let leagueHistory = {};
    let draftHistory: any[] = [];
    let pastSeasons = {};

    if (fs.existsSync(historyPath)) {
      try {
        const content = fs.readFileSync(historyPath, 'utf8').trim();
        if (content) leagueHistory = JSON.parse(content);
      } catch (e) {
        console.error('Error parsing league-history.json', e);
      }
    }

    if (fs.existsSync(draftPath)) {
      try {
        const content = fs.readFileSync(draftPath, 'utf8').trim();
        if (content) draftHistory = JSON.parse(content);
      } catch (e) {
        console.error('Error parsing draft-history.json', e);
      }
    }

    if (fs.existsSync(seasonsPath)) {
      try {
        const content = fs.readFileSync(seasonsPath, 'utf8').trim();
        if (content) pastSeasons = JSON.parse(content);
      } catch (e) {
        console.error('Error parsing past-seasons.json', e);
      }
    }

    // Map 2026-27 picks by team name for easy lookup
    const teamToOwner2026: Record<string, string> = {};
    CURRENT_ROSTERS_2026.forEach((roster) => {
      roster.teams.forEach((teamName) => {
        teamToOwner2026[teamName] = roster.owner;
      });
    });

    const owners = ['Diriye', 'Jack', 'James', 'Jash', 'Karthik'];
    
    // Inject 2026-27 into draftHistory items and re-calculate counts dynamically
    draftHistory = (draftHistory || []).map((item) => {
      const seasons = { ...(item.seasons || {}) };
      
      // Automatically attach 2026-27 owner based on official rosters if present
      if (teamToOwner2026[item.team]) {
        seasons['2026-27'] = teamToOwner2026[item.team];
      }

      const counts: Record<string, number> = { Diriye: 0, Jack: 0, James: 0, Jash: 0, Karthik: 0 };
      Object.values(seasons).forEach((ownerName: any) => {
        if (owners.includes(ownerName)) {
          counts[ownerName] = (counts[ownerName] || 0) + 1;
        }
      });

      return {
        ...item,
        seasons,
        counts,
      };
    });

    return NextResponse.json({
      success: true,
      leagueHistory,
      draftHistory,
      pastSeasons,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}