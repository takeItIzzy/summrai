import { Pool } from 'pg';

// 创建连接池
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 测试连接
pool.on('error', err => {
  console.error('数据库连接错误:', err);
});

// 执行查询的辅助函数
export async function query(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('查询执行错误:', error);
    throw error;
  }
}

// 插入用户数据
export async function insertUser(user: {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const { id, email, name, image } = user;

  const text = `
    INSERT INTO users (id, email, name, image)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) 
    DO UPDATE SET 
      name = $3,
      image = $4,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  const values = [id, email, name, image];

  return query(text, values);
}

// 删除用户数据
export async function deleteUser(id: string) {
  const text = `
    DELETE FROM users
    WHERE id = $1
    RETURNING id
  `;

  const values = [id];

  return query(text, values);
}
