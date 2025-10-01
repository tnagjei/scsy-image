import { getDb } from "../config/db";
import { EffectResult } from "../type/type";

// 通用数据库查询错误处理辅助函数
async function handleDbQuery<T>(operation: string, queryFn: () => Promise<T>): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.error(`${operation}失败:`, error);
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    throw new Error(`${operation}失败，请稍后重试`);
  }
}

export async function create(effectResult: EffectResult) {
  try {
    if (!effectResult || typeof effectResult !== 'object') {
      throw new Error('效果结果对象不能为空');
    }

    if (!effectResult.user_id || !effectResult.effect_id) {
      throw new Error('效果结果基本信息不完整 (user_id, effect_id 为必填项)');
    }

    const db = getDb();
    const res = await db.query(
      `INSERT INTO effect_result (result_id, original_id, user_id, effect_id, effect_name, prompt, url, original_url, storage_type, running_time, credit, request_params, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        effectResult.result_id,
        effectResult.original_id,
        effectResult.user_id,
        effectResult.effect_id,
        effectResult.effect_name,
        effectResult.prompt,
        effectResult.url,
        effectResult.original_url,
        effectResult.storage_type,
        effectResult.running_time,
        effectResult.credit,
        effectResult.request_params,
        effectResult.status,
        effectResult.created_at,
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error('创建效果结果失败:', error);
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    throw new Error('保存效果结果失败，请稍后重试');
  }
}

export async function getByResultIdAndUserId(resultId: string, userId: string) {
  return handleDbQuery('查询效果结果', async () => {
    if (!resultId || !userId) {
      throw new Error('resultId 和 userId 参数不能为空');
    }

    const db = getDb();
    const res = await db.query(
      `SELECT * FROM effect_result WHERE result_id = $1 AND user_id = $2`,
      [resultId, userId]
    );
    return res.rows[0] || null;
  });
}

export async function pageListByUserId(
  userId: string,
  page: number,
  pageSize: number
) {
  const db = await getDb();
  const res = await db.query(
    `SELECT original_id, user_id, effect_name, url, running_time, credit, status, created_at FROM effect_result WHERE user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
    [userId, pageSize, (page - 1) * pageSize]
  );
  return res.rows;
}

export async function update(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  r2Url: string
) {
  const db = await getDb();
  if (r2Url !== "") {
    const res = await db.query(
      `UPDATE effect_result SET status = $1, running_time = $2, updated_at = $3, url = $4 WHERE original_id = $5`,
      [status, runningTime, updatedAt, r2Url, originalId]
    );
    return res.rows[0];
  } else {
    const res = await db.query(
      `UPDATE effect_result SET status = $1, running_time = $2, updated_at = $3 WHERE original_id = $4`,
      [status, runningTime, updatedAt, originalId]
    );
    return res.rows[0];
  }
}

export async function getByOriginalId(originalId: string) {
  const db = await getDb();
  const res = await db.query(
    `SELECT * FROM effect_result WHERE original_id = $1`,
    [originalId]
  );
  return res.rows[0];
}


export async function countByUserId(userId: string) {
  const db = await getDb();
  const res = await db.query(`SELECT COUNT(*) FROM effect_result WHERE user_id = $1`, [userId]);
  return res.rows[0].count;
}