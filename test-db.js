#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 用于验证数据库配置和连接是否正常工作
 */

// 简单的环境变量加载，不依赖外部包
function loadEnv() {
  try {
    const fs = require('fs');
    const path = require('path');

    // 尝试读取 .env 文件
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // 移除引号
          if (key && value) {
            process.env[key] = value;
          }
        }
      });
    }
  } catch (error) {
    console.log('注意：无法读取 .env 文件，将使用系统环境变量');
  }
}

// 加载环境变量
loadEnv();

const { getDb } = require('./dist/backend/config/db.js');

async function testDatabaseConnection() {
  console.log('开始数据库连接测试...\n');

  try {
    // 测试数据库连接
    console.log('1. 测试数据库连接...');
    const db = getDb();

    if (!db) {
      throw new Error('获取数据库连接失败');
    }
    console.log('✅ 数据库连接池创建成功');

    // 测试基础查询
    console.log('\n2. 测试基础查询...');
    const testResult = await db.query('SELECT NOW() as current_time');
    console.log(`✅ 数据库查询成功，当前时间: ${testResult.rows[0].current_time}`);

    // 测试表是否存在
    console.log('\n3. 测试关键表是否存在...');
    const tables = ['users', 'effect', 'effect_result'];

    for (const table of tables) {
      const result = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        ) as exists
      `, [table]);

      if (result.rows[0].exists) {
        console.log(`✅ 表 ${table} 存在`);
      } else {
        console.log(`❌ 表 ${table} 不存在`);
      }
    }

    // 测试 effect 表的查询
    console.log('\n4. 测试 effect 表查询...');
    const effectResult = await db.query('SELECT COUNT(*) as count FROM effect');
    console.log(`✅ effect 表记录数: ${effectResult.rows[0].count}`);

    console.log('\n🎉 所有测试通过！数据库连接正常');

  } catch (error) {
    console.error('\n❌ 数据库测试失败:', error.message);

    if (error.message.includes('POSTGRES_URL')) {
      console.log('\n💡 请检查以下配置:');
      console.log('1. 在 .env 文件中设置正确的 POSTGRES_URL');
      console.log('2. 确保数据库服务正在运行');
      console.log('3. 验证连接字符串格式是否正确');
      console.log('\n示例连接字符串格式:');
      console.log('postgresql://username:password@localhost:5432/database_name');
    }

    process.exit(1);
  }
}

// 运行测试
testDatabaseConnection()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('未处理的错误:', error);
    process.exit(1);
  });