# SummRai Monorepo

这是一个使用 pnpm 的 monorepo 项目，包含两个包：

1. **Web** - Next.js 网页应用
2. **Chrome Extension** - Chrome 浏览器扩展

## 目录结构

```
summrai/
├── packages/
│   ├── web/              # Next.js 网页应用
│   └── chrome-extension/ # Chrome 浏览器扩展
└── pnpm-workspace.yaml   # pnpm 工作区配置
```

## 技术栈

### Web 应用

- Next.js 15
- TypeScript
- Tailwind CSS
- NextAuth.js (认证)

### Chrome 扩展

- TypeScript (待实现)

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 运行 Web 应用

```bash
pnpm --filter web dev
```

### 构建 Web 应用

```bash
pnpm --filter web build
```

## 更多信息

请参阅各包目录中的 README 文件获取更多详细信息。

## Stack Auth与Neon数据库集成

### Webhook集成

本项目使用Stack Auth的Webhook API来同步用户数据到Neon数据库。以下是实现过程:

1. **创建Webhook端点**:

   - 在Stack Auth Dashboard中创建Webhook端点，指向 `/api/webhooks/stack-auth`
   - 此实现不需要验证签名，因此不需要保存Webhook签名密钥

2. **环境变量设置**:

   ```
   # Stack Auth配置
   NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_client_key
   STACK_SECRET_SERVER_KEY=your_secret_server_key

   # 数据库配置
   DB_CONNECTION_STRING=postgresql://user:password@host:port/database
   ```

3. **事件处理**:

   - 用户创建/更新时: 将用户信息插入Neon数据库
   - 用户删除时: 从Neon数据库中删除用户记录

4. **简化的处理流程**:

   - 直接接收JSON负载，无需验证
   - 使用Zod验证事件格式符合预期结构
   - 针对不同事件类型执行相应数据库操作

5. **数据库架构**:
   - 用户表(users)包含: id, email, name, image, created_at, updated_at

### 依赖包

- zod: 用于验证和解析Webhook负载
- pg: PostgreSQL客户端，用于与Neon数据库交互

### 本地测试

如需本地测试Webhook，可以使用以下工具:

- [Webhook.site](https://webhook.site/)
- 直接使用API测试工具如Postman或Insomnia向你的API发送请求

由于不需要验证签名，本地测试变得更加简单，你可以直接向webhook端点发送符合格式的JSON数据。
