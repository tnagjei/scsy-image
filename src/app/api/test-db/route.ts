import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/backend/config/db';

export async function GET(request: NextRequest) {
  try {
    console.log('开始数据库连接测试...');

    // 测试数据库连接
    const db = getDb();
    console.log('数据库连接池创建成功');

    // 测试基础查询
    const testResult = await db.query('SELECT NOW() as current_time');
    console.log(`数据库查询成功，当前时间: ${testResult.rows[0].current_time}`);

    // 测试表是否存在
    const tables = ['users', 'effect', 'effect_result'];
    const tableResults = [];

    for (const table of tables) {
      const result = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        ) as exists
      `, [table]);

      tableResults.push({
        table,
        exists: result.rows[0].exists
      });
    }

    // 测试 effect 表的查询
    const effectResult = await db.query('SELECT COUNT(*) as count FROM effect');
    const effectCount = parseInt(effectResult.rows[0].count);

    return NextResponse.json({
      success: true,
      message: '数据库连接测试成功',
      data: {
        currentTime: testResult.rows[0].current_time,
        tables: tableResults,
        effectCount
      }
    });

  } catch (error) {
    console.error('数据库测试失败:', error);
    const err = error as Error;

    return NextResponse.json({
      success: false,
      message: err.message || '数据库连接失败',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}