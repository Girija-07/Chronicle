import { NextResponse } from 'next/server';
import { getMockStats } from '@/lib/mockData';

export async function GET() {
  try {
    const stats = getMockStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
