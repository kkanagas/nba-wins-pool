import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    const owners = ['Diriye', 'Jack', 'James', 'Jash', 'Karthik'];
    draftHistory = (draftHistory || []).map((item) => {
      const counts: Record<string, number> = { Diriye: 0, Jack: 0, James: 0, Jash: 0, Karthik: 0 };
      if (item.seasons) {
        Object.values(item.seasons).forEach((ownerName: any) => {
          if (owners.includes(ownerName)) {
            counts[ownerName] = (counts[ownerName] || 0) + 1;
          }
        });
      }
      return {
        ...item,
        counts: item.counts || counts,
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