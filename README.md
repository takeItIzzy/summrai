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
