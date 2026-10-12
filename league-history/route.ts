import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'league-history.json');
    const draftPath = path.join(process.cwd(), 'data', 'draft-history.json');
    const seasonsPath = path.join(process.cwd(), 'data', 'past-seasons.json');

    let leagueHistory = {};
    let draftHistory = [];
    let pastSeasons = {};

    if (fs.existsSync(historyPath)) {
      const content = fs.readFileSync(historyPath, 'utf8').trim();
      if (content) leagueHistory = JSON.parse(content);
    }

    if (fs.existsSync(draftPath)) {
      const content = fs.readFileSync(draftPath, 'utf8').trim();
      if (content) draftHistory = JSON.parse(content);
    }

    if (fs.existsSync(seasonsPath)) {
      const content = fs.readFileSync(seasonsPath, 'utf8').trim();
      if (content) pastSeasons = JSON.parse(content);
    }

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