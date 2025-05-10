# SummRai Web 应用

基于 Next.js 15 + TypeScript + Tailwind CSS + NextAuth.js 的 Web 应用程序。

## 功能

- 响应式用户界面
- 用户认证 (NextAuth.js)
- 适应暗黑模式的设计

## 开发指南

### 安装依赖

在根目录运行：

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 环境变量

创建 `.env.local` 文件，并设置以下环境变量：

```
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 目录结构

```
web/
├── app/                  # Next.js App Router
│   ├── api/              # API 路由
│   │   └── auth/         # NextAuth.js API
│   └── auth/             # 认证相关页面
├── components/           # React 组件
├── public/               # 静态资源
└── types/                # TypeScript 类型定义
```
