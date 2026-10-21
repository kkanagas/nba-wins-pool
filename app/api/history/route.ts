import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const hashData = await kv.hgetall('nba_wins_history');

    if (!hashData || typeof hashData !== 'object') {
      return NextResponse.json([]);
    }

    const historyArray = Object.entries(hashData).map(([date, val]) => {
      const snapshot = typeof val === 'string' ? JSON.parse(val) : val;
      return {
        date,
        ...(typeof snapshot === 'object' && snapshot !== null ? snapshot : {}),
      };
    });

    historyArray.sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(historyArray);
  } catch (error) {
    console.error('Failed to fetch history hash', error);
    return NextResponse.json([], { status: 500 });
  }
}