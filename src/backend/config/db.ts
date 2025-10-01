import { Pool } from "pg";

// 链接池，所有的连接都维护在这个连接池里面
let globalPool: Pool | null;

// 创建一个安全的数据库查询函数
export async function safeDbQuery<T>(queryFn: (db: Pool) => Promise<T>, fallback?: T): Promise<T | null> {
  const db = getDb();
  if (!db) {
    console.warn('数据库连接不可用，返回默认值');
    return fallback ?? null;
  }

  try {
    return await queryFn(db);
  } catch (error) {
    console.error('数据库查询失败:', error);
    return fallback ?? null;
  }
}

export function getDb(): Pool | null {
  if (!globalPool) {
    const connectionString = process.env.POSTGRES_URL;

    if (!connectionString || connectionString.trim() === '') {
      console.warn('POSTGRES_URL 环境变量未设置，数据库功能将被禁用');
      globalPool = null;
    } else {
      try {
        globalPool = new Pool({
          connectionString,
          max: 20, // 最大连接数
          idleTimeoutMillis: 30000, // 空闲超时时间
          connectionTimeoutMillis: 2000, // 连接超时时间
        });
      } catch (error) {
        const err = error as Error;
        console.warn('数据库连接池创建失败，数据库功能将被禁用:', err.message);
        globalPool = null;
      }
    }
  }

  return globalPool;
}