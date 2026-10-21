import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Fetch directly from the key holding your real data
    const history = await kv.get('nba_league_history');

    if (!history) {
      return NextResponse.json([]);
    }

    // Handle if it's stored as a JSON string or parsed array
    const data = typeof history === 'string' ? JSON.parse(history) : history;

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Failed to fetch history', error);
    return NextResponse.json([], { status: 500 });
  }
}