import { NextResponse } from 'next/server';
import { z } from 'zod';
import { insertUser, deleteUser } from '@/lib/db';

// 定义用户相关事件的Schema
const SelectedTeamSchema = z.object({
  created_at_millis: z.number(),
  id: z.string(),
  display_name: z.string(),
  profile_image_url: z.string().nullish(),
});

const UserIDSchema = z.string().describe('用户的唯一标识符');

const UserCreatedEventPayloadSchema = z.object({
  id: UserIDSchema,
  primary_email_verified: z.boolean().describe('用户的主要邮箱是否已验证'),
  signed_up_at_millis: z.number().describe('用户注册时间（自纪元以来的毫秒数）'),
  has_password: z.boolean().describe('用户是否设置了密码'),
  primary_email: z.string().nullish().describe('主要邮箱'),
  display_name: z.string().nullish().describe('用户显示名称，不是唯一标识符'),
  selected_team: SelectedTeamSchema.nullish(),
  selected_team_id: z.string().nullish().describe('用户当前选择的团队ID'),
  profile_image_url: z.string().nullish().describe('用户的头像URL'),
  client_metadata: z.record(z.string(), z.any()).nullish().describe('客户端元数据'),
  server_metadata: z.record(z.string(), z.any()).nullish().describe('服务器端元数据'),
});

const UserUpdatedEventPayloadSchema = UserCreatedEventPayloadSchema;

const UserDeletedEventPayloadSchema = z.object({
  id: UserIDSchema,
});

// 定义Stack Auth事件的Schema
const StackAuthEventPayloadSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('user.created'),
    data: UserCreatedEventPayloadSchema,
  }),
  z.object({
    type: z.literal('user.updated'),
    data: UserUpdatedEventPayloadSchema,
  }),
  z.object({
    type: z.literal('user.deleted'),
    data: UserDeletedEventPayloadSchema,
  }),
]);

export async function POST(request: Request) {
  try {
    // 直接解析请求JSON
    const payload = await request.json();

    // 解析和验证事件负载
    const parsedPayload = StackAuthEventPayloadSchema.parse(payload);

    // 处理不同类型的事件
    if (parsedPayload.type === 'user.created' || parsedPayload.type === 'user.updated') {
      const data = parsedPayload.data;

      // 将用户数据插入Neon数据库
      if (data.id && data.primary_email) {
        try {
          await insertUser({
            id: data.id,
            email: data.primary_email,
            name: data.display_name || null,
            image: data.profile_image_url || null,
          });
          console.log(
            `用户${parsedPayload.type === 'user.created' ? '创建' : '更新'}成功:`,
            data.id
          );
        } catch (error) {
          console.error(`处理${parsedPayload.type}事件时出错:`, error);
          return NextResponse.json(
            { error: `数据库操作失败: ${(error as Error).message}` },
            { status: 500 }
          );
        }
      }
    } else if (parsedPayload.type === 'user.deleted') {
      // 处理用户删除
      try {
        const result = await deleteUser(parsedPayload.data.id);
        console.log('用户删除成功:', parsedPayload.data.id, result);
      } catch (error) {
        console.error('处理用户删除时出错:', error);
        return NextResponse.json(
          { error: `删除用户失败: ${(error as Error).message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook处理成功' });
  } catch (error) {
    console.error('处理Webhook请求失败:', error);
    return NextResponse.json(
      { error: `处理请求失败: ${(error as Error).message}` },
      { status: 400 }
    );
  }
}
