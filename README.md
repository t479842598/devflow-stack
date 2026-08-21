# DevFlow Stack

> **技术选型与项目管理全流程工作台** —— 从选型到交付的一站式解决方案。

覆盖 **技术选型 → 需求管理 → 设计计划 → 前端样式 → 后端框架 → 环境与联调 → 交付管理** 七大模块，内置 **AI 规划助手**（每一步生成针对性建议 + 一键复制 AI 提示词）。

---

## 📁 仓库结构

```
devflow-stack/
├── backend/          # NestJS + Prisma + MySQL + Redis（REST API）
├── frontend/         # Vue 3 + Vite + TypeScript + Pinia（Web 工作台）
├── desktop/          # Tauri 2.0 + Rust（macOS/Windows 桌面客户端）
├── scripts/          # 跨端共享脚本（版本号同步等）
└── prototype-single-file.html   # 单文件 HTML 原型（可独立运行，已部署到资料库）
```

## 🏗️ 架构概览

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Desktop   │    │   Frontend  │    │  Prototype  │
│   (Tauri)   │    │   (Vue 3)   │    │   (HTML)    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └────────┬─────────┘                  │ (demo 数据)
                ▼                            ▼
         ┌──────────────────┐         │    资料库服务
         │   Backend API    │         │  (在线数据表)
         │  (NestJS Prisma) │         │
         └────────┬─────────┘         └──────────────┘
                  ▼
         ┌──────────────────┐
         │  MySQL + Redis   │
         └──────────────────┘
```

---

## 🚀 快速开始

### 前置条件

- Node.js 22.x+
- Rust 工具链（仅 desktop 需要）：`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- MySQL 8.0+（本地或 Docker 均可）
- Git

### 1. 克隆仓库

```bash
git clone https://github.com/t479842598/devflow-stack.git
cd devflow-stack
```

### 2. 启动后端

```bash
cd backend
npm install

# 复制环境变量
cp .env.example .env

# 修改 .env 中的 DATABASE_URL（如使用 Docker 启动 MySQL）
# 默认配置已指向 localhost:3306

# 生成 Prisma 客户端 + 迁移数据库
npx prisma generate
npx prisma migrate dev --name init

# 写入示例数据（可选）
node prisma/seed.js

# 启动开发服务器
npm run start:dev
```

后端默认运行在 `http://localhost:3000`，Swagger 文档：`http://localhost:3000/api`

### 3. 启动 Web 前端

```bash
cd frontend
npm install

# 配置代理（可选，默认已指向 http://localhost:3000）
cp .env.example .env

npm run dev
```

前端默认运行在 `http://localhost:5173`，开发代理已配置 `/api → http://localhost:3000`。

### 4. 启动 Desktop 桌面端

```bash
cd desktop
npm install

# 首次运行：生成开发用的图标（需要 @tauri-apps/cli）
npx tauri icon public/icon.png    # 如已有图标，替换 public/icon.png 后运行

# 浏览器预览模式
npm run dev

# 桌面模式（Windows/macOS）
npm run tauri dev

# 构建产物
npm run tauri build
# 产物路径：
#   macOS    → src-tauri/target/release/bundle/macos/devflow.app
#   Windows  → src-tauri/target/release/bundle/msi/devflow_0.1.0_x64_en-US.msi
```

---

## 🐙 Docker 一键启动（推荐）

```bash
# 启动 MySQL + Redis
cd backend
docker-compose up -d mysql redis

# 而后正常启动 backend / frontend / desktop
```

**完整容器化**（MySQL + Redis + API + Web）：
```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

---

## 📋 核心功能

### 🛠️ 技术选型中心
- 7 大场景环境：管理系统、Agent 开发、微信/支付宝/抖音小程序、HBuilderX 跨端、Vue 项目
- 可视化对比（开发效率/性能/维护成本/后端匹配四维雷达分）
- AI 推荐：按场景生成前后端技术组合建议
- 一键标记「最终选型」，自动同步至后续所有模块

### 📋 需求管理
- P0/P1/P2 优先级 + 状态流转（待排期→设计中→开发中→联调中→已完成）
- AI 需求拆解：手动补充到子任务 → 自动关联主需求
- 今天要处理：自动汇聚逾期需求 + 一键跟进

### 📐 设计计划
- 阶段管理（需求分析→原型设计→UI定稿→开发实现→联调测试→交付上线）
- 内联 SVG 甘特图排期
- AI 生成设计文档大纲 + 自动排期建议

### 🎨 前端样式
- UI 组件库 / 设计规范 / 页面样式 / 图标库 / 主题变量 五大类资源
- AI 按选型推荐组件库（如 Vue3 → Element Plus / Naive UI）
- 状态跟踪（待选用 / 使用中 / 已弃用）

### ⚙️ 后端框架
- 架构分层、接口定义、框架配置管理
- AI 生成接口清单（RESTful 模板 + 按场景的 API 建议）
- 状态跟踪（规划中 / 研发中 / 已完成）

### 🔧 环境与联调
- 六环节追踪：开发环境搭建 → 测试环境部署 → 前后端联调 → 代码评审 → 预发验证 → 生产发布
- 逾期自动标注，今天要处理区置顶提醒
- 一键生成环境完成清单

### 🚀 交付管理
- 测试用例 / 缺陷跟踪 / 部署发布 / 上线交付 / 运维交接 五类事项
- 环境分级（开发/测试/预发/生产）+ 状态跟踪
- AI 上线检查清单（基于发布窗口、环境状态自动提示风险）

---

## 🤖 AI 规划助手

每个模块内置「AI 规划助手」入口：

- **一句话总结**：基于你当前的模块上下文生成针对性建议
- **展开为计划**：修改选 / 拆解 / 待办物料
- **复制 AI 提示词**：一键把当前项目上下文打包，去外部 AI（DeepSeek / ChatGPT / 通义千问）做深度规划

### AI 提示词模板示例

```markdown
## 项目上下文
- 名称：DevFlow Stack
- 场景：管理系统
- 规模：中型
- 当前阶段：后端框架开发
- AI 场景多角色角色描述（见 docs/ai-prompt-context.md）

## 当前任务
为 nest.js 后端补充鉴权模块，使用 passport-jwt + redis 实现 token 黑名单，预期验收标准：接口返回 401 能正确携带新的 access_token 并重试刷新。

## 需求约束
- Nest 版本 10.0 及以上
- Prisma 6 及以上
- Redis 6 及以上
- 使用 Nest 拦截器统一处理 401 错误响应

## 建议参考
- Nest JWT 官方实现：https://docs.nestjs.com/security/authentication
```

📄 完整提示词模板：`docs/ai-prompt-context.md`

---

## 🧪 数据模型

### 核心业务表（7 张）

| 表名 | 说明 |
|------|------|
| `projects` | 项目总表（关联合其他 6 张表） |
| `options` | 技术选型方案（四维评分 + AI 推荐标记） |
| `requirements` | 需求管理（优先级 + 状态 + AI 拆解） |
| `designs` | 设计计划（甘特图排期 + 文档大纲） |
| `frontend_styles` | 前端样式资源 |
| `backend_frameworks` | 后端框架 + 接口定义 |
| `envs` + `deliverables` | 环境联调 + 交付管理 |

### AI 数据流

```
项目信息 + 选型结果 + 规模
    ↓
AI 场景知识库（7 种场景的推荐库）
    ↓
方案对比建议 + 接口建议 + 架构建议
```

完整 Schema 变迁见 `backend/prisma/schema.prisma`。

---

## 🔧 开发脚本

### 后端

```bash
cd backend
npm run start:dev          # 开发模式（热重载）
npm run start:prod         # 生产模式
npm run build              # 编译 TypeScript
npm run lint               # ESLint 检查
npm run test               # 单元测试
npm run prisma:generate    # 生成 Prisma 客户端
npm run prisma:migrate     # 执行数据库迁移
npm run prisma:seed        # 写入示例数据
```

### 前端

```bash
cd frontend
npm run dev                # 开发模式（Vite HMR）
npm run build              # 构建静态资源
npm run preview            # 预览构建产物
npm run typecheck          # TypeScript 类型检查
npm run lint               # ESLint 检查
```

### Desktop

```bash
cd desktop
npm run dev                # 浏览器预览
npm run tauri:dev          # Tauri 开发模式（系统托盘/原生菜单）
npm run tauri:build        # 打包产物
npm run tauri:build:debug  # 打包 Debug 产物（体积小，调试友好）
```

---

## 📦 版本管理

这个项目使用 `scripts/sync-version.mjs` 统一同步三端版本号：

```bash
node scripts/sync-version.mjs 0.10.0
```

自动更新：
- `frontend/package.json`
- `backend/package.json`
- `desktop/package.json`
- `desktop/src-tauri/tauri.conf.json`
- `desktop/src-tauri/Cargo.toml`
- `CHANGELOG.md`

---

## 📖 相关文档

- `docs/AI-PROMPT-CONTEXT.md` — AI 提示词上下文模板
- `docs/Migration-Plan.md` — 从原型到全栈的迁移路线图（如存在）
- `backend/README.md` — 后端详细说明
- `frontend/README.md` — 前端架构说明
- `desktop/README.md` — 桌面端打包与配置

---

## 📋 TODO

- [ ] 测试覆盖率提升到 80%
- [ ] Desktop 签名 / 公证（macOS 需要 Apple Developer 证书）
- [ ] CI/CD Pipeline（GitHub Actions）
- [ ] 移动端适配（HBuilderX 跨端）
- [ ] 多租户支持（按组织架构隔离项目）

---

## 📄 许可证

MIT License — 详见 `LICENSE`

---

## 👨‍💻 作者

**t479842598** — 青岛飞拓网络科技有限公司

> 基于 3+ 年企业级管理系统开发经验沉淀，覆盖设计到交付全流程的最佳实践。
