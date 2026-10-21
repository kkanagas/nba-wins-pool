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

    // Map to standardize date strings and filter out incomplete ISO entries
    const formattedMap = new Map<string, any>();

    rawData.forEach((entry) => {
      if (!entry || !entry.date) return;

      let dateKey = entry.date;
      // Convert "2026-10-21" to "Oct 21" if an unformatted ISO string exists
      if (dateKey.includes('-')) {
        const [year, month, day] = dateKey.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      }

      // Keep the latest entry for each formatted date
      const existing = formattedMap.get(dateKey) || {};
      formattedMap.set(dateKey, { ...existing, ...entry, date: dateKey });
    });

    const cleanHistory = Array.from(formattedMap.values());

    return NextResponse.json(cleanHistory);
  } catch (error) {
    console.error('Failed to fetch history', error);
    return NextResponse.json([], { status: 500 });
  }
}