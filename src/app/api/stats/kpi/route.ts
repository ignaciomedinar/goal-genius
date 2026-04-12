import { NextResponse } from 'next/server';
import { getOverallKpiStats } from '@/lib/database';

export async function GET() {
  try {
    const stats = await getOverallKpiStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('API Error - KPI stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KPI stats', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
