import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const hashData = await kv.hgetall('nba_wins_history');

    if (!hashData || typeof hashData !== 'object') {
      return NextResponse.json([]);
    }

    const historyArray = Object.entries(hashData).map(([rawDate, val]) => {
      const snapshot = typeof val === 'string' ? JSON.parse(val) : val;

      // Convert "YYYY-MM-DD" into "Oct 21" format for frontend compatibility
      let dateLabel = rawDate;
      if (rawDate.includes('-')) {
        const [year, month, day] = rawDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      }

      return {
        date: dateLabel,
        rawDate,
        ...(typeof snapshot === 'object' && snapshot !== null ? snapshot : {}),
      };
    });

    // Sort chronologically by raw ISO date string
    historyArray.sort((a, b) => (a.rawDate || a.date).localeCompare(b.rawDate || b.date));

    return NextResponse.json(historyArray);
  } catch (error) {
    console.error('Failed to fetch history hash', error);
    return NextResponse.json([], { status: 500 });
  }
}