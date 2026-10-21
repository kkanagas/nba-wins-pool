import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const history = await kv.get('nba_league_history');

    if (!history) {
      return NextResponse.json([]);
    }

    const rawData: any[] = typeof history === 'string' ? JSON.parse(history) : history;

    if (!Array.isArray(rawData)) {
      return NextResponse.json([]);
    }

    // Filter out ISO-formatted keys like "2026-10-21" and retain only short date keys ("Oct 20", "Oct 21")
    const cleanHistory = rawData.filter((entry) => {
      if (!entry || !entry.date) return false;
      // Exclude strings formatted as YYYY-MM-DD
      return !/^\d{4}-\d{2}-\d{2}$/.test(entry.date);
    });

    return NextResponse.json(cleanHistory);
  } catch (error) {
    console.error('Failed to fetch history', error);
    return NextResponse.json([], { status: 500 });
  }
}