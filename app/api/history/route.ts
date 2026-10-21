import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Read from 'nba_wins_history' (the same key used by your cron/snapshots)
    const history = await kv.get('nba_wins_history') || [];
    
    // If stored as an object/hash from hset, convert it to an array of snapshot objects for Recharts
    let historyArray = [];
    if (Array.isArray(history)) {
      historyArray = history;
    } else if (typeof history === 'object' && history !== null) {
      historyArray = Object.entries(history).map(([date, data]) => {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        return { date, ...parsedData };
      });
    }

    return NextResponse.json(historyArray);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { snapshot } = body;

    if (!snapshot || !snapshot.date) {
      return NextResponse.json({ success: false, error: 'Invalid snapshot' }, { status: 400 });
    }

    // Fetch existing history
    const existing: any = await kv.get('nba_wins_history') || [];
    let existingHistory: any[] = [];

    if (Array.isArray(existing)) {
      existingHistory = existing;
    } else if (typeof existing === 'object' && existing !== null) {
      existingHistory = Object.entries(existing).map(([date, data]) => {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        return { date, ...parsedData };
      });
    }

    // Check if this date already exists
    const alreadyExists = existingHistory.some((entry) => entry.date === snapshot.date);
    if (!alreadyExists) {
      existingHistory.push(snapshot);
      // Save back as a clean array to Vercel KV
      await kv.set('nba_wins_history', existingHistory);
    }

    return NextResponse.json({ success: true, history: existingHistory });
  } catch (error) {
    console.error('Error saving history snapshot:', error);
    return NextResponse.json({ success: false, error: 'Failed to write snapshot' }, { status: 500 });
  }
}