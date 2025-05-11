import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { insertUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // 1. 获取当前认证的用户
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 2. 从用户对象中获取用户信息
    const { id, primaryEmail, displayName, profileImageUrl } = user;

    if (!id || !primaryEmail) {
      return NextResponse.json({ error: '用户信息不完整' }, { status: 400 });
    }

    // 3. 将用户信息保存到Neon数据库
    const result = await insertUser({
      id,
      email: primaryEmail,
      name: displayName || null,
      image: profileImageUrl || null,
    });

    // 4. 返回成功响应
    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error('用户注册错误:', error);
    return NextResponse.json({ error: '注册过程中出现错误' }, { status: 500 });
  }
}
