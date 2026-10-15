import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const history = await kv.get('nba_league_history') || [];
    return NextResponse.json(history);
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

    const existingHistory: any[] = (await kv.get('nba_league_history')) || [];

    const alreadyExists = existingHistory.some((entry) => entry.date === snapshot.date);
    if (!alreadyExists) {
      existingHistory.push(snapshot);
      await kv.set('nba_league_history', existingHistory);
    }

    return NextResponse.json({ success: true, history: existingHistory });
  } catch (error) {
    console.error('Error saving history snapshot:', error);
    return NextResponse.json({ success: false, error: 'Failed to write snapshot' }, { status: 500 });
  }
}