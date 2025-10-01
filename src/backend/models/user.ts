import { getDb } from "../config/db";
import { User } from "../type/type";
import { QueryResultRow } from "pg";

export async function insertUser(user: User) {
  try {
    // 参数验证
    if (!user || typeof user !== 'object') {
      throw new Error('用户对象不能为空');
    }

    if (!user.uuid || !user.email || !user.nickname || !user.avatar_url) {
      throw new Error('用户基本信息不完整 (uuid, email, nickname, avatar_url 为必填项)');
    }

    const db = getDb();
    const res = await db.query(
      `INSERT INTO users
            (uuid, email, created_at, nickname, avatar_url, locale, signin_type, signin_ip, signin_provider, signin_openid, update_time)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
      [
        user.uuid,
        user.email,
        user.created_at || "",
        user.nickname,
        user.avatar_url,
        user.locale || "",
        user.signin_type || "",
        user.signin_ip || "",
        user.signin_provider || "",
        user.signin_openid || "",
        new Date(),
      ]
    );
    return res;
  } catch (error) {
    console.error('插入用户数据失败:', error);
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    throw new Error('用户注册失败，请稍后重试');
  }
}

export async function getByEmail(email: string): Promise<User | undefined> {
  try {
    // 参数验证
    if (!email || typeof email !== 'string') {
      console.error(`无效的邮箱参数: ${email}`);
      return undefined;
    }

    const db = getDb();
    const res = await db.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [
      email,
    ]);

    if (res.rowCount === 0) {
      return undefined;
    }

    const { rows } = res;
    return formatUser(rows[0]);
  } catch (error) {
    console.error(`查询用户数据失败 (邮箱: ${email}):`, error);
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    return undefined;
  }
}

export async function getByUuidAndEmail(uuid: string, email: string) {
  try {
    // 参数验证
    if (!uuid || !email || typeof uuid !== 'string' || typeof email !== 'string') {
      console.error(`无效的UUID或邮箱参数: uuid=${uuid}, email=${email}`);
      return undefined;
    }

    const db = getDb();
    const res = await db.query(
      `SELECT * FROM users WHERE uuid = $1 AND email = $2 LIMIT 1`,
      [uuid, email]
    );

    if (res.rowCount === 0) {
      return undefined;
    }

    return formatUser(res.rows[0]);
  } catch (error) {
    console.error(`查询用户数据失败 (UUID: ${uuid}, 邮箱: ${email}):`, error);
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    return undefined;
  }
}

export function formatUser(row: QueryResultRow): User {
  const user: User = {
    uuid: row.uuid,
    email: row.email,
    created_at: row.created_at,
    nickname: row.nickname,
    avatar_url: row.avatar_url,
    locale: row.locale,
    signin_type: row.signin_type,
    signin_ip: row.signin_ip,
  };

  return user;
}
