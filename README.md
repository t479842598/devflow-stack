# DevFlow Stack · 技术选型与项目管理全流程工作台

> 前端 Vue3 定案 · 后端 NestJS + Prisma · 桌面端 Tauri 2.0 · 三端同仓管理

DevFlow 是一站式技术选型与项目管理工作台，覆盖从技术选型到最终交付的全流程。每个项目走一条完整流水线：

**技术选型 → 需求管理 → 设计计划 → 前端样式 → 后端框架 → 环境与联调 → 交付管理**

每一步都内置「AI 规划助手」：基于规则引擎做技术选型推荐、需求拆解、排期生成、组件库推荐、接口规范与上线检查清单，并支持一键复制 AI 提示词进行深度规划。

---

## 📁 仓库结构

| 目录 | 说明 | 技术栈 |
|------|------|--------|
| `frontend/` | Web 工作台（浏览器访问） | Vue3 + Vite + TypeScript + Pinia |
| `backend/` | REST API 服务 | NestJS + Prisma + MySQL 8 + Redis 7 |
| `desktop/` | 桌面应用（macOS / Windows） | Tauri 2.0 + Rust + Vue3 |
| `scripts/` | 工具脚本（版本号同步等） | Node.js |
| `prototype-single-file.html` | 单文件原型（资料库已部署版） | HTML + localStorage |

## 🏗️ 架构总览

```
┌─────────────────────────────────────────────────┐
│  前端 (Vue3)                                     │
│  ├── frontend/  Web 端 (浏览器)                  │
│  └── desktop/   桌面端 (Tauri 2.0 壳)            │
└──────────────┬──────────────────────────────────┘
               │ HTTP /api/*
┌──────────────▼──────────────────────────────────┐
│  后端 (NestJS)                                   │
│  ├── Auth 模块      (JWT + RBAC)                 │
│  ├── Projects 模块  (项目主档)                    │
│  ├── CRUD 模块 ×6   (选型/需求/设计/前端/后端/交付)│
│  ├── Env 模块       (环境与联调)                  │
│  └── AI-Prompt 模块 (规划助手规则引擎)             │
└──────────────┬──────────────────────────────────┘
      ┌────────┴─────────┐
┌─────▼─────┐      ┌─────▼─────┐
│  MySQL 8  │      │  Redis 7  │
└───────────┘      └───────────┘
```

## 🚀 本地启动

### 后端（端口 3000）

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js          # 可选：示例数据
npm run start:dev
```

### Web 前端（端口 5173）

```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

### 桌面端（需 Rust 工具链）

```bash
cd desktop
npm install
npm run tauri dev            # 开发调试窗口
npm run tauri build          # 打包 macOS .dmg / Windows .msi
```

## 🐳 Docker 一键起后端

```bash
cd backend
docker compose up -d         # MySQL + Redis + NestJS
```

## 📦 发布流程（GitHub Actions 自动打包）

推一个 tag 即自动触发双 OS 打包并创建 Release：

```bash
node scripts/sync-version.mjs 1.0.0   # 同步三端版本号
git tag v1.0.0
git push origin main --tags
```

CI 会自动构建：
- **macOS**: `DevFlow_v1.0.0_macOS.dmg`（aarch64-apple-darwin）
- **Windows**: `DevFlow_v1.0.0_Windows.msi` / `.exe`

## 🧩 核心功能

| 模块 | 能力 |
|------|------|
| 技术选型中心 | 6 类场景 × 前端/后端框架对比（开发效率/性能/维护/匹配度四维打分）、AI 推荐引擎 |
| 需求管理 | 录入/拆解/优先级(P0/P1/P2)/状态跟踪，AI 拆解子任务 |
| 设计计划 | 设计文档大纲生成、阶段排期 + 内联甘特图 |
| 前端样式 | UI 组件库/设计规范/页面样式资源管理，按选型推荐 |
| 后端框架 | 架构分层建议、RESTful 接口清单生成 |
| 环境与联调 | 开发/测试/预发/生产环境管理、联调状态跟踪 |
| 交付管理 | 测试/部署/上线检查清单、交付状态跟踪 |

## 📄 License

MIT
