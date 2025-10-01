import { Effect } from "@/backend/type/type";
import { getDb } from "../config/db";

export async function listByType(type: number): Promise<Effect[]> {
  try {
    // 参数验证
    if (typeof type !== 'number' || isNaN(type)) {
      console.error(`无效的类型参数: ${type}`);
      return [];
    }

    const db = getDb();
    if (!db) {
      console.warn('数据库连接不可用，返回空结果');
      return [];
    }

    const res = await db.query(`SELECT * FROM effect WHERE type = $1`, [type]);
    return res.rows;
  } catch (error) {
    console.error(`查询效果列表失败 (类型: ${type}):`, error);
    return [];
  }
}


export async function getById(id: number): Promise<Effect | null> {
  try {
    // 参数验证
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      console.error(`无效的ID参数: ${id}`);
      return null;
    }

    const db = getDb();
    if (!db) {
      console.warn('数据库连接不可用，返回空结果');
      return null;
    }

    const res = await db.query(`SELECT * FROM effect WHERE id = $1`, [id]);

    if (res.rows.length === 0) {
      console.warn(`未找到ID为 ${id} 的效果记录`);
      return null;
    }

    return res.rows[0];
  } catch (error) {
    console.error(`查询效果数据失败 (ID: ${id}):`, error);
    return null;
  }
}
