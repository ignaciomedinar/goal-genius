import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getCurrentWeekPredictions } from '@/lib/database';

export async function GET() {
  try {
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    
    // Test your tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'marts' 
      AND table_name IN ('fact_match_results', 'dim_leagues', 'dim_countries', 'dim_teams')
      ORDER BY table_name;
    `);
    
    // Test a simple query from your main table
    const sampleData = await pool.query(`
      SELECT COUNT(*) as total_matches,
             COUNT(CASE WHEN goals_home IS NOT NULL THEN 1 END) as completed_matches
      FROM marts.fact_match_results 
      LIMIT 1;
    `);

    return NextResponse.json({
      success: true,
      connection: {
        timestamp: result.rows[0].current_time,
        database_version: result.rows[0].db_version
      },
      tables: tablesCheck.rows,
      sample_data: sampleData.rows[0],
      message: 'Database connection successful!'
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      message: 'Database connection failed'
    }, { status: 500 });
  }
}